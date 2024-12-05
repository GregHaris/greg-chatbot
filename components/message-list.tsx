import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Message } from 'ai';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({ messages }: MessageListProps) {
  const customStyle = {
    lineHeight: '1.5',
    fontSize: '1rem',
    borderRadius: '10px',
    padding: '20px',
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Code copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy code:', error);
      });
  };

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
            {message.role === 'assistant' && (
              <Avatar className="mr-2">
                <AvatarFallback>Greg</AvatarFallback>
              </Avatar>
            )}
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
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : 'text';
                    const codeText = String(children).replace(/\n$/, '');

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
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-700 text-white px-2 py-1 rounded"
                          onClick={() => handleCopy(codeText)}
                        >
                          Copy
                        </button>
                      </div>
                    );
                  },
                }}
              >
                {message.content}
              </Markdown>
            </div>
            {message.role === 'user' && (
              <Avatar className="ml-2">
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
