export interface DebugClientPayload {
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: number;
}

export function debugClientLog(payload: DebugClientPayload): void {
  if (typeof window === "undefined") return;

  void fetch("/api/debug/client-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      timestamp: payload.timestamp ?? Date.now(),
    }),
  }).catch(() => {
    // Best-effort debug logging only
  });
}
