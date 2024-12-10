import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy } from 'react-icons/fi';

import { copyToClipboard } from '@/utils/copyToClipboard';

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
        <span className="bg-gray-300 text-cyan-800 p-1 text-sm rounded">
          {children}
        </span>
      ) : (
        <>
          <div className="relative group">
            <div className="absolute top-0 left-0 text-white text-xs px-2 py-1 rounded-bl">
              {language}
            </div>
            <SyntaxHighlighter
              PreTag="div"
              language={language}
              style={nightOwl}
              customStyle={{
                lineHeight: '1.5',
                fontSize: '1rem',
                borderRadius: '10px',
                padding: '40px',
              }}
              showLineNumbers={language !== 'bash' && !!language}
              lineNumberStyle={{
                borderRight: '1px solid #ccc',
                paddingRight: '1em',
                marginRight: '1em',
                color: '#999',
              }}
            >
              {codeText}
            </SyntaxHighlighter>
            <button
              className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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