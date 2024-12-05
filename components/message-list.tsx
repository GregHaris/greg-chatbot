import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Message } from 'ai';
import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

type MessageListProps = {
  messages: Message[];
};

const customStyle = {
  lineHeight: '1.5',
  fontSize: '1rem',
  borderRadius: '10px',
  padding: '40px',
};

const lineNumberStyle = {
  borderRight: '1px solid #ccc',
  paddingRight: '1em',
  marginRight: '1em',
  color: '#999',
};

export default function MessageList({ messages }: MessageListProps) {
  const CodeBlock = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'bash';
    const codeText = String(children).replace(/\n$/, '');
    const [buttonText, setButtonText] = useState('Copy code');

    const handleCopy = () => {
      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          setButtonText('Copied');
        })
        .catch((error) => {
          console.error('Failed to copy code:', error);
        });
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
                customStyle={
                  language === 'bash' || !language ? {} : customStyle
                }
                showLineNumbers={language !== 'bash' && !!language}
                lineNumberStyle={
                  language === 'bash' || !language ? {} : lineNumberStyle
                }
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

  const MessageBubble = ({ message }: { message: Message }) => (
    <div
      className={`px-4 py-2 rounded-lg max-w-[85%] ${
        message.role === 'user'
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted/50 text-foreground'
      }`}
    >
      <Markdown
        className={'leading-8'}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ children, className }) {
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
        }}
      >
        {message.content}
      </Markdown>
    </div>
  );

  const MessageAvatar = ({ role }: { role: string }) => (
    <Avatar className={role === 'assistant' ? 'mr-2' : 'ml-2'}>
      <AvatarFallback>{role === 'assistant' ? 'Greg' : 'You'}</AvatarFallback>
    </Avatar>
  );

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start mb-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && <MessageAvatar role="assistant" />}
            <MessageBubble message={message} />
            {message.role === 'user' && <MessageAvatar role="user" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
