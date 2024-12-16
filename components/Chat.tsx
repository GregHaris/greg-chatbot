'use client';

import { AlertCircle, Trash2, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { Message as SDKMessage } from '@ai-sdk/ui-utils';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useTheme } from '@components/ThemeProvider';

import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { Alert, AlertDescription, AlertTitle } from '@ui/Alert';
import { Button } from '@ui/Button';
import { Message } from '@/types/Message';
import { Welcome } from './Welcome';

const mapMessages = (sdkMessages: SDKMessage[]): Message[] => {
  return sdkMessages.map((msg) => ({
    id: msg.id,
    role: msg.role === 'data' || msg.role === 'system' ? 'assistant' : msg.role,
    content: msg.content,
  }));
};

export default function Chat() {
  const [localError, setLocalError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const {
    messages: sdkMessages,
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
          console.error('Failed to save interaction:', error);
        }
      }
    },
  });

  const messages = mapMessages(sdkMessages);

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
    setIsMenuOpen(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b relative">
        <h1 className="text-xl md:text-2xl font-bold">Greg&apos;s Chatbot</h1>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-4">
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
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 w-48 py-2 bg-background border rounded-lg shadow-lg md:hidden z-50">
            <button
              onClick={handleClearChat}
              className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
            <button
              onClick={toggleTheme}
              className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4 mr-2" />
              ) : (
                <Moon className="h-4 w-4 mr-2" />
              )}
              Toggle theme
            </button>
          </div>
        )}
      </header>
      <main className="flex-1 overflow-hidden flex flex-col">
        {(error || localError) && (
          <Alert variant="destructive" className="m-2 md:m-4">
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
