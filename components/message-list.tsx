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
  padding: '20px',
};

const CodeBlock = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const codeText = String(children).replace(/\n$/, '');
  const [buttonText, setButtonText] = useState('Copy code');

  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        setButtonText('Copied');
        setTimeout(() => setButtonText('Copy code'), 2000); // Reset after 2 seconds
      })
      .catch((error) => {
        console.error('Failed to copy code:', error);
      });
  };

  return (
    <div className="relative group">
      <SyntaxHighlighter
        PreTag="div"
        language={language}
        style={nightOwl}
        customStyle={customStyle}
        showInlineLineNumbers
      >
        {codeText}
      </SyntaxHighlighter>
      <button
        className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded"
        onClick={handleCopy}
        title={buttonText}
      >
        <FiCopy />
      </button>
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

export default function MessageList({ messages }: MessageListProps) {
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
