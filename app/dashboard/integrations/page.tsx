"use client";
import { useLocale } from "@/lib/i18n/locale-context";

import { useState } from "react";
import {
  Plug,
  Copy,
  CheckCircle2,
  Key,
  Code,
  Globe,
  Sparkles,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MCP_TOOLS_LIST = [
  { name: "list_listings", description: "List saved property listings" },
  { name: "get_listing", description: "Get listing details by ID" },
  { name: "list_leads", description: "List CRM leads with filters" },
  { name: "get_lead", description: "Get lead details by ID" },
  { name: "score_lead", description: "Calculate AI lead score" },
  { name: "generate_description", description: "AI property description" },
  { name: "run_compliance_check", description: "EU compliance check" },
  { name: "get_analytics", description: "Dashboard analytics" },
  { name: "list_automations", description: "List automation runs" },
  { name: "generate_cma", description: "Comparative Market Analysis" },
];

const MCP_CONFIG = `{
  "mcpServers": {
    "propertypilot": {
      "url": "https://propertypilot-ai.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`;

export default function MCPIntegrationsPage() {
  const { locale } = useLocale();
  const isIt = locale === "it";
  const [copied, setCopied] = useState(false);
  const [configCopied, setConfigCopied] = useState(false);

  const copyEndpoint = () => {
    navigator.clipboard.writeText("https://propertypilot-ai.vercel.app/api/mcp");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(MCP_CONFIG);
    setConfigCopied(true);
    setTimeout(() => setConfigCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          MCP Integrations
        </h1>
        <p className="text-muted-foreground mt-1">
          Connect PropertyPilot to AI assistants via Model Context Protocol
        </p>
      </div>

      {/* Endpoint Card */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> MCP Server Endpoint
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              JSON-RPC 2.0 over HTTPS with Bearer authentication
            </p>
          </div>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
            Active
          </Badge>
        </div>

        <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-4 py-3">
          <code className="text-sm font-mono flex-1 text-cyan-400">
            https://propertypilot-ai.vercel.app/api/mcp
          </code>
          <Button variant="ghost" size="sm" onClick={copyEndpoint}>
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Key */}
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Key className="w-4 h-4 text-amber-400" /> API Key
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate an API key in Settings to authenticate MCP requests.
          </p>
          <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-4 py-3">
            <code className="text-sm font-mono flex-1 text-muted-foreground">
              pp_api_••••••••••••••••
            </code>
            <Button variant="outline" size="sm" className="text-xs">
              Generate Key
            </Button>
          </div>
        </Card>

        {/* Quick Setup */}
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-violet-400" /> Quick Setup
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Add to your MCP client config (Claude Desktop, Cursor, etc.):
          </p>
          <div className="relative">
            <pre className="bg-muted/30 rounded-lg px-4 py-3 text-xs font-mono overflow-x-auto max-h-40">
              {MCP_CONFIG}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={copyConfig}
            >
              {configCopied ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Available Tools */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" /> Available Tools ({MCP_TOOLS_LIST.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MCP_TOOLS_LIST.map((tool) => (
            <Card key={tool.name} className="p-4 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Code className="w-4 h-4 text-cyan-400" />
                <code className="text-sm font-mono font-medium">{tool.name}</code>
              </div>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Supported Clients */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="font-semibold mb-4">Supported MCP Clients</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Claude Desktop", status: "Ready" },
            { name: "Cursor IDE", status: "Ready" },
            { name: "Windsurf", status: "Ready" },
            { name: "Custom Client", status: "JSON-RPC" },
          ].map((client) => (
            <div key={client.name} className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-sm font-medium">{client.name}</p>
              <Badge variant="outline" className="text-[10px] mt-1 text-emerald-400 border-emerald-500/30">
                {client.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
