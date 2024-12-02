'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { signOut } from 'next-auth/react';
import { AlertCircle, Trash2 } from 'lucide-react';

import MessageInput from './message-input';
import MessageList from './message-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { Welcome } from './welcome';

export default function Chat() {
  const [localError, setLocalError] = useState<string | null>(null);

  // Initialize chat with stored messages or empty array
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat({
    initialMessages:
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('chatMessages') || '[]')
        : [],
  });

  // Save messages to localStorage whenever they change
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

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Greg&apos;s Chatbot</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Chat</span>
          </Button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Sign Out
          </Button>
        </div>
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
          <MessageList messages={messages} />
        )}
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleLocalSubmit}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
