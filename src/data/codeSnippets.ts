export interface CodeSnippet {
  id: string;
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'agent-pipeline',
    filename: 'agent_pipeline.ts',
    language: 'typescript',
    description: 'Autonomous multi-agent orchestration loop with bounded backoff & deterministic state rollbacks',
    code: `// Autonomous Agent Orchestration Pipeline
// Governed by intentional latency bounds (Ma) and deterministic state recovery

import { AgentSession, ToolRegistry, TelemetryEvent } from '@yuann/core';

export async function* runContemplativePipeline(
  session: AgentSession,
  registry: ToolRegistry
): AsyncGenerator<TelemetryEvent> {
  const { context, telemetry, modelClient } = session;

  while (!session.isComplete) {
    // 1. Evaluate attention context & prune token excess
    const prunedPrompt = context.compactTokens({ maxTokens: 4096, strategy: 'wabi_prune' });
    yield { type: 'PHASE_START', stage: 'INFERENCE', timestamp: Date.now() };

    // 2. Stream generation with exponential jitter backoff
    const stream = await modelClient.streamCompletion(prunedPrompt, {
      temperature: 0.2, // restrained, deterministic output
      stopSequences: ['<|im_end|>', 'Observation:'],
    });

    for await (const chunk of stream) {
      if (chunk.toolCall) {
        yield { type: 'TOOL_INVOKE', tool: chunk.toolCall.name };
        const result = await registry.execute(chunk.toolCall);
        context.appendObservation(result);
        break;
      }
      yield { type: 'TOKEN_DELTA', token: chunk.text };
    }
  }
}`,
  },
  {
    id: 'sensory-stream',
    filename: 'sensory_stream.py',
    language: 'python',
    description: 'PyTorch real-time sensor processing and harmonic ambient audio synthesis',
    code: `# Real-Time Sensory Stream & Harmonic Synthesis
# Translating environmental fluctuations into serene soundscapes

import torch
import torch.nn as nn
from dataclasses import dataclass

@dataclass
class EnvironmentalTelemetry:
    lux: float        # ambient sunlight
    co2_ppm: float    # room air freshness
    acoustic_db: float # ambient sound floor

class HarmonicAmbianceSynthesizer(nn.Module):
    def __init__(self, sample_rate: int = 48000):
        super().__init__()
        self.sample_rate = sample_rate
        # Pentatonic scale frequency anchors (Hz)
        self.register_buffer(
            "scale",
            torch.tensor([220.0, 247.5, 275.0, 330.0, 371.25, 440.0])
        )
        self.envelope_gen = nn.GRU(input_size=3, hidden_size=16, batch_first=True)

    def forward(self, telemetry: torch.Tensor, duration_sec: float = 2.0):
        # Generate smooth bell harmonics modulated by sunlight (lux) and quietude
        t = torch.linspace(0, duration_sec, int(self.sample_rate * duration_sec))
        base_freq = self.scale[torch.clamp((telemetry[:, 0] / 200).long(), 0, 5)]
        
        # Organic decay envelope simulating temple bell resonance
        decay = torch.exp(-t * (1.2 + telemetry[:, 1] * 0.001))
        harmonic_1 = torch.sin(2 * torch.pi * base_freq.unsqueeze(1) * t)
        harmonic_2 = 0.3 * torch.sin(2 * torch.pi * (base_freq * 2.76).unsqueeze(1) * t)
        
        return (harmonic_1 + harmonic_2) * decay`,
  },
  {
    id: 'wabi-schema',
    filename: 'wabi_schema.sql',
    language: 'sql',
    description: 'PostgreSQL schema with pgvector embeddings, row-level security, and audit partitioning',
    code: `-- PostgreSQL Schema: Sovereign Vector Index & Telemetry Log
-- Built with strict row-level security & temporal partitioning

CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.project_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536), -- semantic index
    created_at TIMESTAMPTZ DEFAULT clock_timestamp(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Fast HNSW cosine similarity search with restrained probe depth
CREATE INDEX IF NOT EXISTS idx_memories_hnsw 
ON public.project_memories 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Temporal telemetry audit log with row-level security
CREATE TABLE IF NOT EXISTS public.system_audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(64) NOT NULL,
    actor_id UUID REFERENCES auth.users(id),
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

ALTER TABLE public.system_audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on telemetry"
ON public.system_audit_events FOR SELECT
TO authenticated
USING (true);`,
  },
];
