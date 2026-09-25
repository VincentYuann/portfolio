import { useEffect, useRef, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast } from 'sonner';

interface UseSpeechToTextOptions {
  isAdmin?: boolean;
  value: string;
  onChange: (value: string) => void;
  onListeningChange?: (isListening: boolean) => void;
}

export interface UseSpeechToTextReturn {
  isListening: boolean;
  isSupported: boolean;
  isMicrophoneAvailable: boolean;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  toggleListening: () => Promise<void>;
}

export function useSpeechToText({
  isAdmin = false,
  value,
  onChange,
  onListeningChange,
}: UseSpeechToTextOptions): UseSpeechToTextReturn {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Keep a fresh reference to current input value
  const valueRef = useRef<string>(value);
  valueRef.current = value;

  // Store the existing text snapshot when recording starts so speech appends naturally
  const baseTextRef = useRef<string>('');
  const isListeningRef = useRef<boolean>(listening);
  isListeningRef.current = listening;

  // Track listening state changes
  useEffect(() => {
    onListeningChange?.(listening);
    if (!listening) {
      baseTextRef.current = '';
      resetTranscript();
    }
  }, [listening, onListeningChange, resetTranscript]);

  // When speech transcript updates, merge with initial base text snapshot and emit to onChange
  useEffect(() => {
    if (!isAdmin || !listening || !transcript) return;

    const base = baseTextRef.current.trim();
    const spoken = transcript.trim();

    if (!spoken) return;

    const combined = base ? `${base} ${spoken}` : spoken;
    onChange(combined);
  }, [isAdmin, listening, transcript, onChange]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isListeningRef.current) {
        SpeechRecognition.stopListening().catch(() => {});
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!isAdmin) return;

    if (!browserSupportsSpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isMicrophoneAvailable === false) {
      toast.error('Microphone access is blocked. Please enable microphone permissions in your browser.');
      return;
    }

    baseTextRef.current = valueRef.current;
    resetTranscript();

    try {
      await SpeechRecognition.startListening({
        continuous: true,
        language: 'en-US',
      });
      toast.info('Microphone active. Speak to dictate...');
    } catch (err) {
      console.warn('SpeechRecognition failed to start:', err);
      toast.error('Failed to access microphone. Please check permissions.');
    }
  }, [isAdmin, browserSupportsSpeechRecognition, isMicrophoneAvailable, resetTranscript]);

  const stopListening = useCallback(async () => {
    try {
      await SpeechRecognition.stopListening();
    } catch (err) {
      console.warn('SpeechRecognition failed to stop:', err);
    } finally {
      baseTextRef.current = '';
      resetTranscript();
    }
  }, [resetTranscript]);

  const toggleListening = useCallback(async () => {
    if (listening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [listening, startListening, stopListening]);

  return {
    isListening: listening,
    isSupported: browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    toggleListening,
  };
}
