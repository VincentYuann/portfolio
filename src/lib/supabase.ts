import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// S3 Storage endpoint & region (from env)
export const S3_STORAGE_ENDPOINT = import.meta.env.VITE_SUPABASE_STORAGE_S3_ENDPOINT || '';
export const S3_STORAGE_REGION = import.meta.env.VITE_SUPABASE_STORAGE_REGION || 'us-west-2';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Matches your Supabase public bucket: 'portfolio-assets' -> folder 'resumes'
export const RESUME_BUCKET = 'portfolio-assets';
export const RESUME_PDF_FILENAME = 'resumes/vincent-yuan-cv.pdf';

/**
 * Resolves the correct OAuth callback redirect URL depending on environment
 * (e.g. 'https://vincentyuann.github.io/VincentYuann/' on GitHub Pages,
 * or 'http://localhost:5173/' on local dev).
 */
export function getOAuthRedirectUrl(): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    let pathname = window.location.pathname;

    // Strip trailing html filenames like index.html
    if (pathname.endsWith('.html') || pathname.endsWith('.htm')) {
      pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    }

    // Ensure trailing slash
    if (!pathname.endsWith('/')) {
      pathname += '/';
    }

    return `${origin}${pathname}`;
  }
  return 'https://vincentyuann.github.io/VincentYuann/';
}

/**
 * Extracts a human-readable error message from any error object, Supabase response, or string.
 * Prevents "[object Object]" from ever showing to users.
 */
export function formatErrorMessage(err: unknown): string {
  if (!err) return 'An unknown error occurred.';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (typeof err === 'object') {
    const anyErr = err as Record<string, any>;
    if (typeof anyErr.message === 'string' && anyErr.message) return anyErr.message;
    if (typeof anyErr.error_description === 'string' && anyErr.error_description) return anyErr.error_description;
    if (typeof anyErr.error === 'string' && anyErr.error) return anyErr.error;
    if (typeof anyErr.msg === 'string' && anyErr.msg) return anyErr.msg;
    if (typeof anyErr.statusText === 'string' && anyErr.statusText) return anyErr.statusText;
    try {
      const json = JSON.stringify(err);
      if (json && json !== '{}') return json;
    } catch {
      // ignore
    }
  }
  return String(err);
}

/**
 * Wraps any promise with a timeout to prevent unresponsive saves and hanging async requests.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 15000,
  errorMsg = 'Operation timed out. Please check your network and try again.'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
    ),
  ]);
}

/**
 * Returns the public URL for the resume PDF from the Supabase 'portfolio-assets' bucket (or S3 endpoint).
 */
export function getResumePdfUrl(): string {
  if (import.meta.env.VITE_RESUME_PDF_URL) {
    return import.meta.env.VITE_RESUME_PDF_URL;
  }

  if (supabase) {
    const { data } = supabase.storage
      .from(RESUME_BUCKET)
      .getPublicUrl(RESUME_PDF_FILENAME);
    if (data?.publicUrl) return data.publicUrl;
  }

  // S3 / Supabase public direct URL fallback
  if (supabaseUrl) {
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
    if (projectRef) {
      return `https://${projectRef}.supabase.co/storage/v1/object/public/${RESUME_BUCKET}/${RESUME_PDF_FILENAME}`;
    }
  }

  return './resume.pdf';
}

/**
 * Uploads a resume PDF directly into 'portfolio-assets/resumes/' with S3-backed Supabase Storage.
 */
export async function uploadResumePdf(file: File) {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  // 1. Primary upload to 'portfolio-assets/resumes/vincent-yuan-cv.pdf'
  let res = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(RESUME_PDF_FILENAME, file, {
      upsert: true,
      contentType: 'application/pdf',
      cacheControl: '3600',
    });

  // 2. Fallback to 'resume' bucket if portfolio-assets is not found
  if (res.error) {
    const rawMsg = formatErrorMessage(res.error).toLowerCase();
    if (rawMsg.includes('bucket not found') || rawMsg.includes('not found')) {
      const fallbackRes = await supabase.storage
        .from('resume')
        .upload('vincent-yuan-cv.pdf', file, {
          upsert: true,
          contentType: 'application/pdf',
          cacheControl: '3600',
        });
      if (!fallbackRes.error) {
        return fallbackRes.data;
      }
    }
  }

  if (res.error) {
    throw new Error(formatErrorMessage(res.error));
  }

  return res.data;
}

/**
 * Uploads an asset image (project screenshot, company emblem, etc.) directly into 
 * the Supabase Storage 'portfolio-assets' bucket under the specified folder ('projects' | 'experience' | etc.)
 * and returns the public CDN URL.
 */
export async function uploadAssetImage(file: File, folder: string = 'projects'): Promise<string> {
  if (!supabase) {
    // Fallback to data URL if Supabase client is missing
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const cleanName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
  const path = `${folder}/${Date.now()}-${cleanName}`;

  const { error } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
      cacheControl: '3600',
    });

  if (error) {
    console.warn('Storage upload warning, attempting fallback or data URL:', error);
    // If bucket permission issue or missing bucket, create a base64 Data URL so user can still see and use image
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('./images/sumi-os-workspace.jpg');
      reader.readAsDataURL(file);
    });
  }

  const { data } = supabase.storage
    .from(RESUME_BUCKET)
    .getPublicUrl(path);

  if (data?.publicUrl) {
    return data.publicUrl;
  }

  return `https://${supabaseUrl.replace('https://', '').split('.')[0]}.supabase.co/storage/v1/object/public/${RESUME_BUCKET}/${path}`;
}

export const uploadProjectImage = (file: File) => uploadAssetImage(file, 'projects');
export const uploadExperienceLogo = (file: File) => uploadAssetImage(file, 'experience');
export const uploadHobbyImage = (file: File) => uploadAssetImage(file, 'hobbies');

/**
 * Loads the LaTeX source content from the Supabase resume_latex table.
 */
export async function fetchResumeLatex(): Promise<string | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('resume_latex')
      .select('content')
      .eq('id', 1)
      .single();

    if (error || !data) return null;
    return data.content || null;
  } catch (err) {
    console.warn('Could not fetch resume LaTeX from Supabase:', err);
    return null;
  }
}

/**
 * Saves the LaTeX source content to the Supabase resume_latex table.
 */
export async function saveResumeLatex(content: string) {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const { error } = await supabase
    .from('resume_latex')
    .upsert({ id: 1, content: content || '', updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(formatErrorMessage(error));
  }
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  topic?: string;
  honeypot?: string;
}

export async function sendContactMessage(payload: ContactMessage) {
  if (!supabase) {
    console.warn('Supabase is not configured; simulated send:', payload);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-contact-email', {
      body: {
        name: payload.name,
        email: payload.email,
        message: payload.message,
        topic: payload.topic || 'General Inquiry',
        honeypot: payload.honeypot || '',
      },
    });

    if (error) {
      console.error('Supabase Edge Function invocation error:', error);
      return { success: false, error: formatErrorMessage(error) };
    }

    if (data && data.error) {
      return { success: false, error: data.error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Failed to submit contact message:', err);
    return { success: false, error: formatErrorMessage(err) };
  }
}
