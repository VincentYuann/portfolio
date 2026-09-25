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
  } catch (initialErr) {
    // If relative endpoint fails (e.g. direct static run without proxy), attempt direct localhost:8000
    if (primaryEndpoint.startsWith('/api')) {
      try {
        response = await fetch('http://127.0.0.1:8000/api/v1/chat', {
          method: 'POST',
          headers,
          body: formData,
        });
      } catch {
        throw new Error(
          'Could not reach AI Agent microservice at http://127.0.0.1:8000. Please verify the FastAPI backend is running.'
        );
      }
    } else {
      throw new Error(
        `Failed to reach AI Agent microservice: ${(initialErr as Error).message}`
      );
    }
  }

  if (!response.ok) {
    let errorDetail = `Microservice returned HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  const data: ChatResponse = await response.json();
  return data;
}
