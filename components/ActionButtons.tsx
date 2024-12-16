import { useState } from 'react';
import { FiCopy, FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';

import { Button } from '@ui/Button';
import { copyToClipboard } from '@utils/copyToClipboard';
import { Message } from '@/types/Message';

type ActionButtonsProps = {
  message: Message;
  onEdit: () => void;
  onDelete: () => void;
  onRegenerate: () => void;
};

export const ActionButtons = ({
  message,
  onEdit,
  onDelete,
  onRegenerate,
}: ActionButtonsProps) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  const handleCopy = () => {
    copyToClipboard(
      message.content,
      () => {
        setCopyButtonText('Copied');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      },
      (error) => console.error('Failed to copy message:', error),
    );
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-8 w-8 p-0"
        title={copyButtonText}
      >
        <FiCopy className="h-4 w-4" />
      </Button>
      {message.role === 'user' && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0"
            title="Edit"
          >
            <FiEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0"
            title="Delete"
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </>
      )}
      {message.role === 'assistant' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRegenerate}
          className="h-8 w-8 p-0"
          title="Regenerate"
        >
          <FiRefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
