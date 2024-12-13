import { useState } from 'react'

import { Message } from '@/types/Message';
import { MessageAvatar } from './MessageAvatar';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from './ui/ScrollArea';

type MessageListProps = {
  messages: Message[];
  onRegenerate: (messageId: string, newContent?: string) => void;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  setMessages: (messages: Message[]) => void;
  append: (message: Message) => void;
};

const MessageList = ({
  messages,
  onRegenerate,
  onDelete,
  onEdit,
}: MessageListProps) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const handleEdit = (messageId: string, newContent: string) => {
    onEdit(messageId, newContent);
    setEditingMessageId(null);
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className="flex items-start mb-2">
              <MessageAvatar role={message.role} />
              <MessageBubble
                message={message}
                onEdit={(newContent) => handleEdit(message.id, newContent)}
                onDelete={() => onDelete(message.id)}
                onRegenerate={() => onRegenerate(message.id)}
                isEditing={editingMessageId === message.id}
                setIsEditing={(isEditing) =>
                  setEditingMessageId(isEditing ? message.id : null)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
