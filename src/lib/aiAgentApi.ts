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
 */
export async function sendToAiAgent({
  message,
  previousInteractionId,
  file,
}: SendMessageOptions): Promise<ChatResponse> {
  const formData = new FormData();
  formData.append('message', message.trim());

  if (previousInteractionId && previousInteractionId.trim()) {
    formData.append('previous_interaction_id', previousInteractionId.trim());
  }

  if (file) {
    formData.append('file', file);
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
    });
  } catch {
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

  const data: ChatResponse = await response.json();
  return data;
}
