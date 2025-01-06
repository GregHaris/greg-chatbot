import { FiCopy } from 'react-icons/fi';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useState } from 'react';

import { copyToClipboard } from '@utils/copyToClipboard';

type CodeBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'bash';
  const codeText = String(children).replace(/\n$/, '');
  const [buttonText, setButtonText] = useState('Copy code');

  const handleCopy = () => {
    copyToClipboard(
      codeText,
      () => {
        setButtonText('Copied');
        setTimeout(() => setButtonText('Copy code'), 6000);
      },
      (error) => console.error('Failed to copy code:', error),
    );
  };

  const isInline = typeof children === 'string' && !children.includes('\n');

  return (
    <div className="inline">
      {isInline ? (
        <span className="bg-gray-300 text-cyan-800 p-1 text-sm rounded overflow-wrap-break-word hyphens-auto">
          {children}
        </span>
      ) : (
        <>
          <div className="relative group overflow-wrap-break-word hyphens-auto">
            <div className="absolute top-0 left-0 text-white text-xs px-2 py-1 rounded-bl">
              {language}
            </div>
            <SyntaxHighlighter
              PreTag="div"
              language={language}
              style={nightOwl}
              wrapLines={true}
              wrapLongLines={true}
              customStyle={{
                lineHeight: '1.5',
                fontSize: '0.875rem',
                borderRadius: '10px',
                padding: '30px 10px',
              }}
              lineProps={{ style: { flexWrap: 'wrap' } }}
              showInlineLineNumbers={false}
              showLineNumbers={language !== 'bash' && !!language}
              lineNumberStyle={{
                paddingRight: '0.5em',
                marginRight: '0.5em',
                color: '#999',
              }}
            >
              {codeText}
            </SyntaxHighlighter>
            <button
              className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded opacity-100 transition-opacity duration-300"
              onClick={handleCopy}
              title={buttonText}
            >
              <FiCopy />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
