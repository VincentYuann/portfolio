import { supabase } from './supabase';

/**
 * TypeScript mirror of FastAPI ChatResponse Pydantic model:
 * (C:\Users\litej\OneDrive\Desktop\PersonalProject\AI Agent\app\main.py)
 */
export interface ChatResponse {
  response: string;
  interaction_id?: string | null;
  user_type: 'Admin' | 'Logged-in User' | 'Guest' | string;
  user_email?: string | null;
  status: string;
  model?: string | null;
}

export interface SendMessageOptions {
  message: string;
  previousInteractionId?: string | null;
  file?: File | null;
  stream?: boolean;
  onDelta?: (text: string) => void;
  onToolStart?: (toolName: string) => void;
  signal?: AbortSignal;
}

/**
 * Resolves the candidate base URLs for the AI Agent microservice.
 */
export function getAiAgentEndpoint(): string {
  const customUrl = import.meta.env.VITE_AI_AGENT_API_URL;
  if (customUrl && typeof customUrl === 'string' && customUrl.trim()) {
    return `${customUrl.trim().replace(/\/$/, '')}/api/v1/chat`;
  }
  // Default to relative /api/v1/chat (handled by Vite dev proxy -> http://127.0.0.1:8000)
  return '/api/v1/chat';
}

/**
 * Sends a message and optional interaction_id to the FastAPI Gemini Agent microservice.
 * Supports both standard synchronous JSON requests and real-time SSE streaming.
 */
export async function sendToAiAgent({
  message,
  previousInteractionId,
  file,
  stream,
  onDelta,
  onToolStart,
  signal,
}: SendMessageOptions): Promise<ChatResponse> {
  const formData = new FormData();
  formData.append('message', message.trim());

  if (previousInteractionId && previousInteractionId.trim()) {
    formData.append('previous_interaction_id', previousInteractionId.trim());
  }

  if (file) {
    formData.append('file', file);
  }

  const wantsStream = Boolean(stream || onDelta);
  if (wantsStream) {
    formData.append('stream', 'true');
  }

  // Extract auth token if user is signed in with Supabase
  const headers: Record<string, string> = {};
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.access_token;
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    } catch {
      // Continue unauthenticated as guest
    }
  }

  const primaryEndpoint = getAiAgentEndpoint();

  let response: Response;
  try {
    response = await fetch(primaryEndpoint, {
      method: 'POST',
      headers,
      body: formData,
      signal,
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Request was cancelled.');
    }
    throw new Error(
      'Unable to connect to the AI companion. Please check your connection and try again.'
    );
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail =
          typeof errJson.detail === 'string'
            ? errJson.detail
            : Array.isArray(errJson.detail)
            ? errJson.detail.map((d: any) => d.msg || d).join(', ')
            : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore
    }

    if (errorDetail) {
      // Strip any raw HTTP status code prefixes if present
      const clean = errorDetail
        .replace(/^HTTP\s*\d+:\s*/i, '')
        .replace(/^\d{3}\s+[a-zA-Z\s]+:\s*/, '')
        .trim();
      throw new Error(clean || 'The AI service encountered an issue. Please try again.');
    }

    if (response.status === 403) {
      throw new Error('File uploads are restricted to administrators.');
    }
    if (response.status === 413) {
      throw new Error('The attached file exceeds the 50 MB size limit.');
    }
    if (response.status === 415) {
      throw new Error('The attached file type is not supported.');
    }
    if (response.status === 429) {
      throw new Error('Message limit reached. Please wait a moment and try again.');
    }
    throw new Error('The AI service is temporarily unavailable. Please try again shortly.');
  }

  // Handle real-time Server-Sent Events (SSE) streaming
  if (wantsStream && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedText = '';
    let finalInteractionId = previousInteractionId || null;
    let resolvedUserType = 'Guest';
    let resolvedUserEmail: string | null = null;
    let resolvedModel = 'gemini-3.5-flash-lite';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr) continue;
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'init') {
                if (event.user_type) resolvedUserType = event.user_type;
                if (event.model) resolvedModel = event.model;
                if (event.user_email) resolvedUserEmail = event.user_email;
              } else if (event.type === 'delta') {
                if (event.text) {
                  accumulatedText += event.text;
                  onDelta?.(event.text);
                }
              } else if (event.type === 'tool_start') {
                onToolStart?.(event.name);
              } else if (event.type === 'error') {
                throw new Error(event.detail || 'An error occurred during streaming.');
              } else if (event.type === 'done') {
                if (event.interaction_id) finalInteractionId = event.interaction_id;
                if (event.model) resolvedModel = event.model;
              }
            } catch (jsonErr: any) {
              // Re-throw genuine streaming error events from server
              if (jsonErr instanceof Error && jsonStr.includes('"type": "error"')) {
                throw jsonErr;
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (!accumulatedText.trim()) {
      throw new Error('Rate limit or quota reached. Please check your Gemini plan/billing or wait a moment.');
    }

    return {
      status: 'success',
      response: accumulatedText,
      interaction_id: finalInteractionId,
      user_type: resolvedUserType,
      user_email: resolvedUserEmail,
      model: resolvedModel,
    };
  }

  const data: ChatResponse = await response.json();
  return data;
}
