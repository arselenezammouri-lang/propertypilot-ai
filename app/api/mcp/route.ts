/**
 * PropertyPilot MCP Server API — Model Context Protocol endpoint
 * Handles: initialize, tools/list, tools/call
 * Auth: Bearer token (API key from user settings)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MCP_TOOLS } from "@/lib/mcp/tools";
import { executeTool } from "@/lib/mcp/executor";
import type { MCPToolCall } from "@/lib/mcp/executor";

export const dynamic = "force-dynamic";

interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

function mcpResponse(id: string | number, result: unknown) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    result,
  });
}

function mcpError(id: string | number, code: number, message: string) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: { code, message },
  });
}

async function authenticateBearer(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  if (!token) return null;

  // Validate API key against database
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_api_keys")
    .select("user_id")
    .eq("api_key_encrypted", token)
    .single();

  return data?.user_id ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateBearer(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized — provide Bearer token in Authorization header" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as MCPRequest;

    if (body.jsonrpc !== "2.0") {
      return mcpError(body.id ?? 0, -32600, "Invalid JSON-RPC version");
    }

    switch (body.method) {
      case "initialize":
        return mcpResponse(body.id, {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "propertypilot-mcp",
            version: "1.0.0",
          },
        });

      case "tools/list":
        return mcpResponse(body.id, {
          tools: MCP_TOOLS.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
          })),
        });

      case "tools/call": {
        const params = body.params as { name: string; arguments: Record<string, unknown> } | undefined;
        if (!params?.name) {
          return mcpError(body.id, -32602, "Missing tool name");
        }

        const toolCall: MCPToolCall = {
          name: params.name,
          arguments: params.arguments ?? {},
        };

        const result = await executeTool(userId, toolCall);
        return mcpResponse(body.id, result);
      }

      default:
        return mcpError(body.id, -32601, `Method not found: ${body.method}`);
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// SSE endpoint for MCP streaming (GET)
export async function GET() {
  return NextResponse.json({
    name: "propertypilot-mcp",
    version: "1.0.0",
    description: "PropertyPilot AI MCP Server — Access CRM, listings, leads, analytics via AI assistants",
    tools: MCP_TOOLS.length,
    auth: "Bearer token",
    endpoint: "/api/mcp",
  });
}
