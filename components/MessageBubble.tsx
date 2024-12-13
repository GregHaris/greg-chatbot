import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useRef } from 'react';

import { ActionButtons } from './ActionButtons';
import { Button } from './ui/Button';
import { CodeBlock } from './CodeBlock';
import { Message } from '@/types/Message';
import { Textarea } from './ui/TextArea';

type MessageBubbleProps = {
  message: Message;
  onEdit: (newContent: string) => void;
  onDelete: () => void;
  onRegenerate: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
};

export const MessageBubble = ({
  message,
  onEdit,
  onDelete,
  onRegenerate,
  isEditing,
  setIsEditing,
}: MessageBubbleProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editedContent, setEditedContent] = useState(message.content);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmitEdit = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  const isSubmitDisabled = editedContent === message.content;

  return (
    <div
      className={`relative px-4 py-2 rounded-lg w-full group ${
        message.role === 'user'
          ? 'text-foreground bg-accent'
          : 'bg-muted/50 text-foreground'
      } ${isEditing ? 'bg-transparent' : ''}`}
    >
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={editedContent}
            onChange={handleTextareaChange}
            className="w-full p-2 text-foreground bg-background border rounded resize-none"
            rows={10}
          />
          <div className="flex justify-end space-x-2 text-black">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
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
          {message.role === 'user' ? (
            <pre className="document-font whitespace-pre-wrap pb-6">
              {message.content}
            </pre>
          ) : (
            <Markdown
              className="leading-8 pb-6"
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <div>{children}</div>,
                code({ children, className }) {
                  return (
                    <CodeBlock className={className}>{children}</CodeBlock>
                  );
                },
              }}
            >
              {message.content}
            </Markdown>
          )}
          <div
            className={`absolute bottom-2 ${
              message.role === 'user' ? 'left-2' : 'right-2'
            }`}
          >
            <ActionButtons
              message={message}
              onEdit={() => setIsEditing(true)}
              onDelete={onDelete}
              onRegenerate={onRegenerate}
            />
          </div>
        </>
      )}
    </div>
  );
};
