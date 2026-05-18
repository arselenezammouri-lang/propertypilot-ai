/**
 * MCP Tool Executor — Handles tool calls by routing to appropriate handlers
 */

import { createClient } from "@/lib/supabase/server";

export interface MCPToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface MCPToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export async function executeTool(
  userId: string,
  tool: MCPToolCall
): Promise<MCPToolResult> {
  const supabase = await createClient();

  try {
    switch (tool.name) {
      case "list_listings": {
        const args = tool.arguments;
        let query = supabase
          .from("saved_listings")
          .select("id, title, property_data, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(Number(args.limit) || 20);

        const { data } = await query;
        return text(JSON.stringify(data ?? [], null, 2));
      }

      case "get_listing": {
        const { data } = await supabase
          .from("saved_listings")
          .select("*")
          .eq("id", tool.arguments.listing_id as string)
          .eq("user_id", userId)
          .single();

        if (!data) return error("Listing not found");
        return text(JSON.stringify(data, null, 2));
      }

      case "list_leads": {
        const args = tool.arguments;
        let query = supabase
          .from("leads")
          .select("id, name, email, phone, status, score, source, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(Number(args.limit) || 20);

        if (args.status) query = query.eq("status", args.status as string);
        if (args.min_score) query = query.gte("score", Number(args.min_score));

        const { data } = await query;
        return text(JSON.stringify(data ?? [], null, 2));
      }

      case "get_lead": {
        const { data } = await supabase
          .from("leads")
          .select("*")
          .eq("id", tool.arguments.lead_id as string)
          .eq("user_id", userId)
          .single();

        if (!data) return error("Lead not found");
        return text(JSON.stringify(data, null, 2));
      }

      case "get_analytics": {
        const { count: listingsCount } = await supabase
          .from("saved_listings")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId);

        const { count: leadsCount } = await supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId);

        return text(JSON.stringify({
          listings_count: listingsCount ?? 0,
          leads_count: leadsCount ?? 0,
          period: tool.arguments.period || "30d",
        }, null, 2));
      }

      case "list_automations": {
        const args = tool.arguments;
        let query = supabase
          .from("automation_runs")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(Number(args.limit) || 20);

        if (args.status) query = query.eq("status", args.status as string);

        const { data } = await query;
        return text(JSON.stringify(data ?? [], null, 2));
      }

      default:
        return error(`Unknown tool: ${tool.name}`);
    }
  } catch (err) {
    return error(err instanceof Error ? err.message : "Tool execution failed");
  }
}

function text(content: string): MCPToolResult {
  return { content: [{ type: "text", text: content }] };
}

function error(message: string): MCPToolResult {
  return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
}
