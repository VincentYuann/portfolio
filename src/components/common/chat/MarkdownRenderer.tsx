import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = memo(({ content }) => {
  return (
    <div className="markdown-content select-text selection:bg-terracotta/20 selection:text-terracotta dark:selection:bg-terracotta/30 dark:selection:text-ochre">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p({ children }) {
            return (
              <p className="leading-relaxed font-sans text-xs sm:text-[13px] text-light-ink dark:text-dark-ink mb-2.5 last:mb-0">
                {children}
              </p>
            );
          },
          strong({ children }) {
            return (
              <strong className="font-bold text-light-ink dark:text-white">
                {children}
              </strong>
            );
          },
          em({ children }) {
            return <em className="italic font-serif">{children}</em>;
          },
          ul({ children }) {
            return (
              <ul className="my-2 space-y-1.5 list-disc pl-4 text-xs sm:text-[13px] text-light-ink dark:text-dark-ink">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="my-2 space-y-1.5 list-decimal pl-4 text-xs sm:text-[13px] text-light-ink dark:text-dark-ink">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="leading-relaxed pl-0.5">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-2.5 border-l border-terracotta/40 bg-terracotta/5 dark:bg-terracotta/10 px-3.5 py-1.5 text-xs sm:text-[13px] text-light-ink dark:text-dark-ink italic rounded-r-md">
                {children}
              </blockquote>
            );
          },
          hr() {
            return <hr className="my-3 border-light-border dark:border-dark-border" />;
          },
          h1({ children }) {
            return (
              <h1 className="font-serif font-bold text-sm sm:text-base text-terracotta my-2 pb-1 border-b border-light-border dark:border-dark-border">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="font-serif font-bold text-xs sm:text-sm text-terracotta my-2">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="font-serif font-semibold text-xs text-light-ink dark:text-dark-ink my-1.5">
                {children}
              </h3>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta underline hover:text-terracotta-hover underline-offset-2 transition-colors font-medium"
              >
                {children}
              </a>
            );
          },
          code({ inline, className, children }: any) {
            if (inline) {
              return (
                <code className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-terracotta/10 text-terracotta dark:text-ochre border border-terracotta/20 select-text">
                  {children}
                </code>
              );
            }
            const codeString = String(children).replace(/\n$/, '');
            const language = className?.replace('language-', '') || 'code';
            return (
              <div className="relative my-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-raised overflow-hidden group/code select-text shadow-2xs">
                <div className="flex items-center justify-between px-3 py-1 bg-black/5 dark:bg-white/5 border-b border-light-border/40 dark:border-dark-border/40 text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle select-none">
                  <span>{language}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(codeString);
                      toast.success('Code copied to clipboard');
                    }}
                    className="hover:text-terracotta transition-colors flex items-center gap-1 cursor-pointer py-0.5 px-1"
                    title="Copy code"
                    aria-label="Copy code block"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 overflow-x-auto text-[11px] font-mono leading-relaxed text-light-ink dark:text-dark-ink select-text">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
          table({ children }) {
            return (
              <div className="my-2.5 overflow-x-auto rounded-lg border border-light-border dark:border-dark-border">
                <table className="min-w-full divide-y divide-light-border dark:divide-dark-border text-xs">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="px-3 py-1.5 bg-light-surface-raised dark:bg-dark-surface-raised font-serif font-semibold text-terracotta text-left">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3 py-1.5 border-t border-light-border/40 dark:border-dark-border/40 text-light-ink dark:text-dark-ink">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';
