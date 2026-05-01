import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// AES-256-GCM encryption for portal credentials
const ENCRYPTION_KEY = process.env.PORTAL_ENCRYPTION_KEY || process.env.SESSION_SECRET || "propertypilot-default-key-change-me!!";

function encrypt(text: string): string {
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return iv.toString("hex") + ":" + authTag + ":" + encrypted;
}

function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted format");
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(parts[2], "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Schemas
const connectSchema = z.object({
  portal_id: z.string().min(1),
  credentials: z.record(z.string()),
});

const disconnectSchema = z.object({
  connection_id: z.string().uuid(),
});

// GET — list user's portal connections
export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const { data, error } = await supabase
    .from("portal_connections")
    .select("id, portal_id, status, leads_count, listings_count, last_sync_at, last_error, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
  }

  return NextResponse.json({ connections: data || [] });
}

// POST — connect a new portal
export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();
  const parsed = connectSchema.parse(body);

  // Check if already connected
  const { data: existing } = await supabase
    .from("portal_connections")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("portal_id", parsed.portal_id)
    .maybeSingle();

  if (existing && existing.status === "connected") {
    return NextResponse.json({ error: "Portal already connected" }, { status: 409 });
  }

  // Encrypt credentials
  const encryptedCredentials = encrypt(JSON.stringify(parsed.credentials));

  // Test connection (placeholder — when adapters have real APIs, call authenticate())
  let status: "connected" | "pending" | "error" = "pending";
  let lastError: string | null = null;

  try {
    // Validate credentials have required fields per portal type
    const portalRequirements: Record<string, string[]> = {
      immoscout24: ["clientId", "clientSecret"],
      immowelt: ["clientId", "clientSecret"],
      immobiliare_it: ["agencyId", "feedUsername", "feedPassword"],
      idealista: ["clientId", "clientSecret", "country"],
      idealista_pt: ["clientId", "clientSecret"],
      seloger: ["apiKey", "agencyId"],
      rightmove: ["branchId", "apiKey"],
      zoopla: ["apiKey", "branchId"],
    };

    const required = portalRequirements[parsed.portal_id] || [];
    const missing = required.filter((f) => !parsed.credentials[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // For now, set to connected (in production, call adapter.authenticate())
    status = "connected";
  } catch (err) {
    status = "error";
    lastError = err instanceof Error ? err.message : "Connection test failed";
  }

  if (existing) {
    // Update existing disconnected connection
    const { error: updateError } = await supabase
      .from("portal_connections")
      .update({
        credentials: encryptedCredentials,
        status,
        last_error: lastError,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update connection" }, { status: 500 });
    }

    return NextResponse.json({ success: true, status, connection_id: existing.id });
  }

  // Create new connection
  const { data: newConn, error: insertError } = await supabase
    .from("portal_connections")
    .insert({
      user_id: user.id,
      portal_id: parsed.portal_id,
      credentials: encryptedCredentials,
      status,
      last_error: lastError,
      leads_count: 0,
      listings_count: 0,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json({ error: "Failed to create connection" }, { status: 500 });
  }

  return NextResponse.json({ success: true, status, connection_id: newConn.id });
}

// DELETE — disconnect a portal
export async function DELETE(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();
  const parsed = disconnectSchema.parse(body);

  const { error } = await supabase
    .from("portal_connections")
    .update({
      status: "disconnected",
      credentials: null,
      last_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.connection_id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// PATCH — manual sync trigger
export async function PATCH(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();
  const connectionId = body.connection_id;
  if (!connectionId) {
    return NextResponse.json({ error: "connection_id required" }, { status: 400 });
  }

  // Verify ownership
  const { data: conn } = await supabase
    .from("portal_connections")
    .select("*")
    .eq("id", connectionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!conn) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  if (conn.status !== "connected") {
    return NextResponse.json({ error: "Portal not connected" }, { status: 400 });
  }

  // Update last_sync_at (in production, would call adapter.pollLeads())
  await supabase
    .from("portal_connections")
    .update({ last_sync_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", connectionId);

  return NextResponse.json({ success: true, message: "Sync triggered", last_sync_at: new Date().toISOString() });
}
