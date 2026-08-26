import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

/**
 * Render an inline code element with refined mono typography and amber styling.
 */
function renderCodeBadge(codeText: string, key: string | number) {
  return (
    <code
      key={key}
      className="font-mono text-[0.86em] font-bold text-[#B45309] dark:text-[#FCD34D] bg-[#F5F4EE] dark:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] px-1.5 py-0.5 mx-0.5 rounded-md inline-block align-baseline leading-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] tracking-tight hover:border-[#B45309]/40 dark:hover:border-[#FCD34D]/40 transition-colors"
    >
      {codeText}
    </code>
  );
}

/**
 * Parses inline backticks (`...`) within a given text string into Code badges and text fragments.
 */
function parseInlineCode(text: string, baseKey: string | number): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let i = 0;
  let textBuffer = '';
  let subKey = 0;

  const flushText = () => {
    if (textBuffer) {
      result.push(<React.Fragment key={`${baseKey}-txt-${subKey++}`}>{textBuffer}</React.Fragment>);
      textBuffer = '';
    }
  };

  while (i < text.length) {
    if (text[i] === '`') {
      const closeIdx = text.indexOf('`', i + 1);
      if (closeIdx !== -1) {
        flushText();
        const codeContent = text.slice(i + 1, closeIdx);
        result.push(renderCodeBadge(codeContent, `${baseKey}-code-${subKey++}`));
        i = closeIdx + 1;
        continue;
      }
    }
    textBuffer += text[i];
    i++;
  }
  flushText();

  return result;
}

/**
 * Parses inline backticks (`code`), bold (**text**), and nested combinations (e.g. bold enclosing code).
 */
function renderInlineFormatting(segment: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let textBuffer = '';
  let tokenKey = 0;

  const flushText = () => {
    if (textBuffer) {
      nodes.push(...parseInlineCode(textBuffer, `plain-${tokenKey++}`));
      textBuffer = '';
    }
  };

  while (i < segment.length) {
    // Check if inline code block starts first
    if (segment[i] === '`') {
      const closeCode = segment.indexOf('`', i + 1);
      if (closeCode !== -1) {
        flushText();
        const codeContent = segment.slice(i + 1, closeCode);
        nodes.push(renderCodeBadge(codeContent, `code-${tokenKey++}`));
        i = closeCode + 1;
        continue;
      }
    }

    // Check if bold marker (**...**) starts
    if (segment.startsWith('**', i)) {
      const closeBold = segment.indexOf('**', i + 2);
      if (closeBold !== -1) {
        flushText();
        const boldInner = segment.slice(i + 2, closeBold);
        // Recursively evaluate any inline code inside the bold segment
        const innerNodes = parseInlineCode(boldInner, `bold-inner-${tokenKey}`);
        nodes.push(
          <strong key={`bold-${tokenKey++}`} className="font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
            {innerNodes}
          </strong>
        );
        i = closeBold + 2;
        continue;
      }
    }

    textBuffer += segment[i];
    i++;
  }
  flushText();

  return nodes;
}

/**
 * Component that parses inline backticks (`code`), bold (**text**), and newlines (`\n`)
 * to render beautifully structured typography, bullet points, and highlighted code badges.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  className = '',
  as: Component = 'span'
}) => {
  if (!text) return null;

  // Split by newlines to preserve structural line spacing
  const lines = text.split('\n');

  if (lines.length === 1) {
    return <Component className={className}>{renderInlineFormatting(text)}</Component>;
  }

  return (
    <Component className={`space-y-1.5 ${className}`}>
      {lines.map((line, lIdx) => {
        // If line is empty, treat as paragraph spacing
        if (!line.trim()) {
          return <span key={lIdx} className="block h-2" />;
        }
        return (
          <span key={lIdx} className="block">
            {renderInlineFormatting(line)}
          </span>
        );
      })}
    </Component>
  );
};
