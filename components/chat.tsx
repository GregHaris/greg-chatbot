'use client';

import { AlertCircle, Trash2, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';

import MessageInput from './message-input';
import MessageList from './message-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { Welcome } from './welcome';


export default function Chat() {
  const [localError, setLocalError] = useState<string | null>(null);

  const router = useRouter()

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

  const handleLogout = () => {
  router.push('api/auth/logout')
}

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Greg&apos;s Chatbot</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          className="flex items-center mr-12"
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
