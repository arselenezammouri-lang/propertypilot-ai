/**
 * Anthropic Claude API Client (backup AI + advanced reasoning)
 */
import { logger } from '@/lib/utils/safe-logger';

export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicResponse {
  content: string;
  model: string;
  usage: { input_tokens: number; output_tokens: number };
}

function getApiKey(): string | null {
  return process.env.ANTHROPIC_API_KEY || null;
}

export async function createCompletion(
  messages: AnthropicMessage[],
  options: { model?: string; maxTokens?: number; temperature?: number; system?: string } = {}
): Promise<AnthropicResponse | null> {
  const apiKey = getApiKey();
  if (!apiKey) { logger.warn('Anthropic API not configured'); return null; }

  const model = options.model ?? 'claude-sonnet-4-20250514';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: options.maxTokens ?? 2048,
        temperature: options.temperature ?? 0.7,
        ...(options.system ? { system: options.system } : {}),
        messages,
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return {
      content: data.content?.[0]?.text ?? '',
      model: data.model,
      usage: data.usage,
    };
  } catch (err) {
    logger.error('Anthropic API error', err);
    return null;
  }
}
