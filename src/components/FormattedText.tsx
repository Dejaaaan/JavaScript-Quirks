import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

/**
 * Component that parses inline backticks (`code`) and bold (**text**)
 * to render beautifully highlighted code badges and accented typography.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  className = '',
  as: Component = 'span'
}) => {
  if (!text) return null;

  // Split by code blocks (`...`)
  const codeParts = text.split(/(`[^`]+`)/g);

  const renderedContent = codeParts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={index}
          className="font-mono text-[0.86em] font-bold text-[#B45309] dark:text-[#FCD34D] bg-[#F5F4EE] dark:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] px-1.5 py-0.5 mx-0.5 rounded-md inline-block align-baseline leading-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] tracking-tight hover:border-[#B45309]/40 dark:hover:border-[#FCD34D]/40 transition-colors"
        >
          {codeContent}
        </code>
      );
    }

    // Process bold text (**...**) within non-code parts
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={index}>
        {boldParts.map((bPart, bIndex) => {
          if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length > 4) {
            const boldContent = bPart.slice(2, -2);
            return (
              <strong key={bIndex} className="font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                {boldContent}
              </strong>
            );
          }
          return bPart;
        })}
      </React.Fragment>
    );
  });

  return <Component className={className}>{renderedContent}</Component>;
};
