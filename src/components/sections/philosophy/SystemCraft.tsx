import React, { useState } from 'react';
import { CODE_SNIPPETS } from '../../../data/codeSnippets';
import { Copy, Check, Terminal, Play, Code2 } from 'lucide-react';
import { BambooArt } from '../../common/BambooArt';
import { CornerBrackets } from '../../common/CornerBrackets';

export const SystemCraft: React.FC = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState(CODE_SNIPPETS[0].id);
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[] | null>(null);

  const snippet = CODE_SNIPPETS.find((s) => s.id === selectedSnippetId) || CODE_SNIPPETS[0];


  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    setSimulating(true);
    setSimulationLogs(['Initializing runtime sandbox...', 'Loading local tensors & token bounds...']);

    setTimeout(() => {
      if (snippet.id === 'agent-pipeline') {
        setSimulationLogs([
          '✓ Context memory pruned: 4,096 -> 1,820 tokens (strategy: wabi_prune)',
          '✓ Tool registry loaded: 14 tools verified',
          '✓ Inference streamed: 412 tokens at 58 tok/s, latency: 17.2ms',
          '✓ State snapshot committed to local SQLite vault',
        ]);
      } else if (snippet.id === 'sensory-stream') {
        setSimulationLogs([
          '✓ Audio sample rate: 48,000 Hz, channels: 2 (binaural)',
          '✓ Environmental input: lux=340.0, co2_ppm=415, acoustic_db=32.4',
          '✓ Pentatonic frequency: 275.0 Hz modulated by daylight curve',
          '✓ Output buffer dispatched to WebGL ambient shader',
        ]);
      } else {
        setSimulationLogs([
          '✓ Extension vector enabled on postgres:16',
          '✓ HNSW index constructed (m=16, ef_construction=64)',
          '✓ Row-level security validated for anonymous ingress',
          '✓ Query plan execution: index scan cost=0.04..1.22 ms',
        ]);
      }
      setSimulating(false);
    }, 900);
  };

  return (
    <section id="system-craft" className="relative w-full max-w-7xl mx-auto px-6 py-12 lg:py-16 overflow-hidden">
      {/* Organic Blended Bamboo Art Backdrop (referenced from frontendDesign/code.html) */}
      <div className="absolute right-4 top-8 pointer-events-none select-none opacity-25 dark:opacity-15 hidden lg:block -z-0">
        <BambooArt className="w-44 h-60" sway={true} opacity={0.65} />
      </div>

      {/* Section Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-terracotta font-serif text-sm">02 //</span>
            <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
              SYSTEM JOINERY & CODE CRAFT
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-light-ink dark:text-dark-ink">
            Algorithmic Integrity{' '}
            <span className="font-serif font-normal text-light-ink-muted dark:text-dark-ink-muted text-2xl ml-2">
              技術の真髄
            </span>
          </h2>
        </div>
        <p className="font-sans text-sm text-light-ink-muted dark:text-dark-ink-muted max-w-md leading-relaxed">
          Examining the internal structure: clean contracts, deterministic state recovery, and lightweight memory
          management across the full stack.
        </p>
      </div>

      {/* Code Window Container */}
      <div className="interactive-card relative w-full bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-akari dark:shadow-night-glow overflow-hidden classical-card-frame">
        <CornerBrackets size="md" />
        {/* Window Bar / Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between border-b border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted px-4 py-2 gap-2">
          {/* File Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CODE_SNIPPETS.map((item) => {
              const active = item.id === selectedSnippetId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedSnippetId(item.id);
                    setSimulationLogs(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all ${
                    active
                      ? 'bg-light-surface dark:bg-dark-surface text-terracotta font-medium border border-light-border dark:border-dark-border shadow-xs'
                      : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{item.filename}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Copy & Simulate */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-sans font-medium bg-terracotta hover:bg-terracotta-hover text-white shadow-xs transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{simulating ? 'Executing...' : 'Simulate'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink border border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface transition-all"
              title="Copy code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-bamboo" />
                  <span className="text-bamboo font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Snippet Description Banner */}
        <div className="px-5 py-2.5 bg-light-surface-muted/60 dark:bg-dark-surface-muted/60 border-b border-light-border/60 dark:border-dark-border/60 flex items-center justify-between text-xs">
          <span className="font-sans text-light-ink-muted dark:text-dark-ink-muted">
            {snippet.description}
          </span>
          <span className="font-mono text-[11px] text-terracotta uppercase">
            {snippet.language}
          </span>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 sm:p-6 overflow-x-auto bg-[#F7F2EA] dark:bg-[#16171B] font-mono text-xs sm:text-[13px] leading-relaxed text-light-ink dark:text-dark-ink">
          <pre className="table w-full">
            {snippet.code.split('\n').map((line, idx) => (
              <div key={idx} className="table-row hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <span className="table-cell pr-5 select-none text-light-ink-subtle dark:text-dark-ink-subtle opacity-50 text-right w-8">
                  {idx + 1}
                </span>
                <span className="table-cell whitespace-pre">
                  {/* Subtle syntax highlighting keywords */}
                  {line.startsWith('//') || line.startsWith('#') || line.startsWith('--') ? (
                    <span className="text-light-ink-subtle dark:text-dark-ink-subtle italic opacity-75">{line}</span>
                  ) : line.includes('export') || line.includes('import') || line.includes('class') || line.includes('async') || line.includes('CREATE') ? (
                    <span>
                      <span className="text-terracotta font-medium">{line.split(' ')[0]} </span>
                      {line.substring(line.indexOf(' ') + 1)}
                    </span>
                  ) : (
                    line
                  )}
                </span>
              </div>
            ))}
          </pre>
        </div>

        {/* Simulated Execution Drawer (if triggered) */}
        {simulationLogs && (
          <div className="border-t border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2.5 text-xs font-sans font-semibold text-light-ink dark:text-dark-ink">
              <Terminal className="w-3.5 h-3.5 text-terracotta" />
              <span>Sandbox Runtime Execution Output</span>
            </div>
            <div className="space-y-1 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted bg-light-surface dark:bg-dark-surface p-3 rounded border border-light-border/60 dark:border-dark-border/60">
              {simulationLogs.map((log, i) => {
                const isCheck = log.startsWith('✓');
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-terracotta text-[10px]">▶</span>
                    {isCheck ? (
                      <span>
                        <span className="text-bamboo dark:text-[#87A889] font-bold">✓ </span>
                        <span className="text-light-ink dark:text-dark-ink">{log.slice(2)}</span>
                      </span>
                    ) : (
                      <span className="text-light-ink-muted dark:text-dark-ink-muted">{log}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
