// Lightweight zero-dependency LaTeX Syntax Tokenizer & Styler for Wabi-Sabi Portfolio

export type LatexTokenType =
  | 'comment'
  | 'keyword'
  | 'environment'
  | 'macro'
  | 'math'
  | 'bracket'
  | 'argument'
  | 'plain';

export interface LatexToken {
  type: LatexTokenType;
  text: string;
}

const LATEX_KEYWORDS = new Set([
  '\\begin',
  '\\end',
  '\\documentclass',
  '\\usepackage',
  '\\section',
  '\\subsection',
  '\\subsubsection',
  '\\textbf',
  '\\textit',
  '\\href',
  '\\item',
  '\\resumeItem',
  '\\resumeSubheading',
  '\\resumeProjectHeading',
]);

const TOKEN_CLASS_MAP: Record<LatexTokenType, string> = {
  comment: 'text-[#8E877C] dark:text-[#7A828E] italic',
  keyword: 'text-[#B84E3A] dark:text-[#E07A5F] font-semibold',
  environment: 'text-[#3B6E52] dark:text-[#52B788] font-medium',
  macro: 'text-[#C4883A] dark:text-[#E9C46A]',
  math: 'text-[#4A7C9B] dark:text-[#7EB0D5] font-mono',
  bracket: 'text-[#6E6458] dark:text-[#A0AEC0]',
  argument: 'text-[#2D2A26] dark:text-[#E2E8F0]',
  plain: 'text-[#2D2A26] dark:text-[#D5D9E0]',
};

export function tokenizeLatexLine(line: string): LatexToken[] {
  const tokens: LatexToken[] = [];
  let i = 0;
  const len = line.length;

  while (i < len) {
    const char = line[i];

    // Comment (% to end of line)
    if (char === '%') {
      tokens.push({
        type: 'comment',
        text: line.slice(i),
      });
      break;
    }

    // Inline math $...$
    if (char === '$') {
      let nextDollar = line.indexOf('$', i + 1);
      if (nextDollar === -1) {
        tokens.push({ type: 'math', text: line.slice(i) });
        break;
      } else {
        tokens.push({ type: 'math', text: line.slice(i, nextDollar + 1) });
        i = nextDollar + 1;
        continue;
      }
    }

    // LaTeX Command \command
    if (char === '\\') {
      let j = i + 1;
      // Handle special single-char commands like \\, \%, \$, etc.
      if (j < len && !/[a-zA-Z]/.test(line[j])) {
        tokens.push({ type: 'macro', text: line.slice(i, j + 1) });
        i = j + 1;
        continue;
      }
      while (j < len && /[a-zA-Z*]/.test(line[j])) {
        j++;
      }
      const command = line.slice(i, j);
      tokens.push({
        type: LATEX_KEYWORDS.has(command) ? 'keyword' : 'macro',
        text: command,
      });
      i = j;
      continue;
    }

    // Curly / Square Brackets
    if (char === '{' || char === '}' || char === '[' || char === ']') {
      tokens.push({ type: 'bracket', text: char });
      i++;
      continue;
    }

    // Plain text chunk
    let j = i;
    while (j < len && line[j] !== '%' && line[j] !== '$' && line[j] !== '\\' && line[j] !== '{' && line[j] !== '}' && line[j] !== '[' && line[j] !== ']') {
      j++;
    }
    tokens.push({ type: 'plain', text: line.slice(i, j) });
    i = j;
  }

  return tokens;
}

export function getTokenClassName(type: LatexTokenType): string {
  return TOKEN_CLASS_MAP[type] || TOKEN_CLASS_MAP.plain;
}
