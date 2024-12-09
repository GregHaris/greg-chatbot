import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Message } from 'ai';
import { useState, useEffect, useRef } from 'react';
import { FiCopy, FiRefreshCw, FiEdit, FiTrash2 } from 'react-icons/fi';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type MessageListProps = {
  messages: Message[];
  onRegenerate: (messageId: string, newContent?: string) => void;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  setMessages: (messages: Message[]) => void;
  append: (message: Message) => void;
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

export default function MessageList({
  messages,
  onRegenerate,
  onDelete,
  setMessages,
  append,
}: MessageListProps) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');

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
          setTimeout(() => {
            setButtonText('Copy code');
          }, 6000);
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

  const ActionButtons = ({ message }: { message: Message }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy');

    const handleCopy = () => {
      navigator.clipboard
        .writeText(message.content)
        .then(() => {
          setCopyButtonText('Copied');
          setTimeout(() => {
            setCopyButtonText('Copy');
          }, 2000);
        })
        .catch((error) => {
          console.error('Failed to copy message:', error);
        });
    };

    const handleEdit = () => {
      setEditingMessageId(message.id);
      setEditedContent(message.content);
      setOriginalContent(message.content);
    };

    const handleDelete = () => {
      onDelete(message.id);
    };

    const handleRegenerate = () => {
      onRegenerate(message.id);
    };

    return (
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8"
          title={copyButtonText}
        >
          <FiCopy className="h-4 w-4" />
        </Button>
        {message.role === 'user' && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8"
              title="Edit"
            >
              <FiEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8"
              title="Delete"
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </>
        )}
        {message.role === 'assistant' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRegenerate}
            className="h-8 w-8"
            title="Regenerate"
          >
            <FiRefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }, []);

    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setEditedContent(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleSubmitEdit = () => {
      // Find the index of the edited message
      const messageIndex = messages.findIndex((msg) => msg.id === message.id);
      if (messageIndex !== -1) {
        // Delete the edited message and all messages after it
        const newMessages = messages.slice(0, messageIndex);
        setMessages(newMessages);

        // Create a new chat and response based on the edited chat
        append({
          role: 'user',
          content: editedContent,
          id: `${message.id}-edited`,
        });
      }
      setEditingMessageId(null);
    };

    const isSubmitDisabled = editedContent === originalContent;

    return (
      <div
        className={`relative px-4 py-2 rounded-lg max-w-[85%] group ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/50 text-foreground'
        } ${editingMessageId === message.id ? 'bg-transparent' : ''}`}
      >
        {editingMessageId === message.id ? (
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={editedContent}
              onChange={handleTextareaChange}
              className="w-full p-2 text-foreground bg-background border rounded resize-none"
              rows={5}
            />
            <div className="flex justify-end space-x-2 text-black">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingMessageId(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitEdit}
                disabled={isSubmitDisabled}
              >
                Submit
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Markdown
              className="leading-8 pb-6"
              remarkPlugins={[remarkGfm]}
              components={{
                code({ children, className }) {
                  return (
                    <CodeBlock className={className}>{children}</CodeBlock>
                  );
                },
              }}
            >
              {message.content}
            </Markdown>
            <div
              className={`absolute bottom-2 ${message.role === 'user' ? 'left-2' : 'right-2'}`}
            >
              <ActionButtons message={message} />
            </div>
          </>
        )}
      </div>
    );
  };

  const MessageAvatar = ({ role }: { role: string }) => (
    <Avatar className={role === 'assistant' ? 'mr-2' : 'ml-2'}>
      <AvatarFallback>{role === 'assistant' ? 'Greg' : 'You'}</AvatarFallback>
    </Avatar>
  );

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start ${
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
