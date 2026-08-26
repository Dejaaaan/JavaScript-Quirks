import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import { Copy, Check } from 'lucide-react';

export type SupportedLanguage =
  | 'javascript'
  | 'js'
  | 'typescript'
  | 'ts'
  | 'python'
  | 'py'
  | 'java'
  | 'rust'
  | 'rs'
  | 'go'
  | 'golang'
  | 'json'
  | 'bash'
  | 'text';

interface CodeBlockProps {
  code: string;
  language?: SupportedLanguage | string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  className?: string;
  filename?: string;
  activeLine?: number;
  maxHeight?: string;
}

const normalizeLanguage = (lang: string): string => {
  const normalized = lang.toLowerCase().trim();
  switch (normalized) {
    case 'js':
    case 'javascript':
    case 'ecmascript':
      return 'javascript';
    case 'ts':
    case 'typescript':
      return 'typescript';
    case 'py':
    case 'python':
      return 'python';
    case 'java':
      return 'java';
    case 'rs':
    case 'rust':
      return 'rust';
    case 'go':
    case 'golang':
      return 'go';
    case 'json':
      return 'json';
    case 'sh':
    case 'bash':
    case 'shell':
      return 'bash';
    default:
      return 'javascript';
  }
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  showLineNumbers = false,
  showCopyButton = true,
  className = '',
  filename,
  activeLine,
  maxHeight,
}) => {
  const [copied, setCopied] = useState(false);

  const cleanCode = code.trim();
  const normalizedLang = useMemo(() => normalizeLanguage(language), [language]);
  const grammar = useMemo(() => Prism.languages[normalizedLang] || Prism.languages.javascript, [normalizedLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = useMemo(() => cleanCode.split('\n'), [cleanCode]);

  const highlightedFull = useMemo(() => {
    if (showLineNumbers) return null;
    return Prism.highlight(cleanCode, grammar, normalizedLang);
  }, [cleanCode, grammar, normalizedLang, showLineNumbers]);

  const highlightedLines = useMemo(() => {
    if (!showLineNumbers) return [];
    return lines.map((line) => Prism.highlight(line || ' ', grammar, normalizedLang));
  }, [lines, grammar, normalizedLang, showLineNumbers]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-[#18181B] border border-[#27272A] shadow-md ${className}`}>
      {(filename || (showCopyButton && lines.length > 1)) && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#121214] border-b border-[#27272A] text-xs">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/90 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/90 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/90 inline-block"></span>
            </span>
            {filename && <span className="font-mono text-[#D4D4D8] text-[11px] ml-1">{filename}</span>}
            <span className="font-mono text-[10px] uppercase font-bold text-[#E4E4E7] px-2 py-0.5 rounded bg-[#27272A]">
              {normalizedLang}
            </span>
          </div>

          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[11px] text-[#D4D4D8] hover:text-[#FFFFFF] px-2.5 py-1 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] transition cursor-pointer"
              title="Kopirajte kod"
              aria-label="Copy code to clipboard"
            >
              {copied ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Kopirano' : 'Kopiraj'}</span>
            </button>
          )}
        </div>
      )}

      {showCopyButton && !filename && lines.length <= 1 && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-lg text-[#D4D4D8] hover:text-[#FFFFFF] bg-[#27272A] hover:bg-[#3F3F46] transition cursor-pointer"
          title="Kopirajte kod"
          aria-label="Copy code to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}

      <div
        className="p-4 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed text-[#F4F4F5]"
        style={{ maxHeight: maxHeight || undefined }}
      >
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((_, idx) => {
                const lineNum = idx + 1;
                const isActive = activeLine === lineNum;
                const highlightedLineHtml = highlightedLines[idx] || '';

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isActive ? 'bg-[#3F3F46]/60 border-l-2 border-[#F59E0B]' : 'hover:bg-[#27272A]/40'
                    }`}
                  >
                    <td className="w-9 pr-3 text-right select-none text-[#A1A1AA] font-mono text-xs align-top py-0.5">
                      {lineNum}
                    </td>
                    <td className="py-0.5 font-mono whitespace-pre text-[#F4F4F5]">
                      <span dangerouslySetInnerHTML={{ __html: highlightedLineHtml }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <pre className="m-0 p-0 font-mono whitespace-pre overflow-x-auto text-[#F4F4F5]">
            <code
              className={`language-${normalizedLang}`}
              dangerouslySetInnerHTML={{
                __html: highlightedFull || '',
              }}
            />
          </pre>
        )}
      </div>
    </div>
  );
};

export const InlineCode: React.FC<{ code: string; language?: string; className?: string }> = ({
  code,
  language = 'javascript',
  className = '',
}) => {
  const normalizedLang = useMemo(() => normalizeLanguage(language), [language]);
  const grammar = useMemo(() => Prism.languages[normalizedLang] || Prism.languages.javascript, [normalizedLang]);
  const highlightedHtml = useMemo(() => Prism.highlight(code, grammar, normalizedLang), [code, grammar, normalizedLang]);

  return (
    <code
      className={`font-mono text-xs px-1.5 py-0.5 rounded bg-[#18181B] text-[#F4F4F5] border border-[#27272A] inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
};
