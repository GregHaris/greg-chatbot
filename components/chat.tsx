'use client';

import { AlertCircle, Trash2, LogOut } from 'lucide-react';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import MessageInput from './message-input';
import MessageList from './message-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { Welcome } from './welcome';

export default function Chat() {
  const [localError, setLocalError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
    append,
    stop,
  } = useChat({
    initialMessages:
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('chatMessages') || '[]')
        : [],
    onFinish: async (message) => {
      if (user && user.sub) {
        try {
          await fetch('api/save-interaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              auth0Id: user.sub,
              message: input,
              response: message.content,
            }),
          });
        } catch (error) {
          console.error('failed to save interaction:', error);
        }
      }
    },
  });

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleLocalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    try {
      handleSubmit(e);
    } catch {
      setLocalError('Failed to send message. Please try again.');
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem('chatMessages');
    setMessages([]);
  };

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };

  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId),
      );
    },
    [setMessages],
  );

  const handleEditMessage = useCallback(
    (messageId: string, newContent: string) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, content: newContent } : msg,
        ),
      );
    },
    [setMessages],
  );

  const handleRegenerateMessage = useCallback(
    (messageId: string, newContent?: string) => {
      const messageIndex = messages.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1 && messageIndex > 0) {
        const userMessage = messages[messageIndex - 1];
        if (userMessage && userMessage.role === 'user') {
          setMessages((prevMessages) =>
            prevMessages.filter(
              (msg, index) => index < messageIndex - 1 || index > messageIndex,
            ),
          );
          append({
            role: 'user',
            content: newContent || userMessage.content,
            id: `${userMessage.id}-regenerate`,
          });
        }
      }
    },
    [messages, append, setMessages],
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Greg&apos;s Chatbot</h1>
        <div className="flex mr-14 gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex-1 overflow-hidden flex flex-col">
        {(error || localError) && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : localError}
            </AlertDescription>
          </Alert>
        )}
        {messages.length === 0 ? (
          <Welcome />
        ) : (
          <MessageList
            messages={messages}
            onRegenerate={handleRegenerateMessage}
            onDelete={handleDeleteMessage}
            onEdit={handleEditMessage}
            setMessages={setMessages}
            append={append}
          />
        )}
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleLocalSubmit}
          isLoading={isLoading}
          stop={stop}
        />
      </main>
    </div>
  );
}
