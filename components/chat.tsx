'use client'

import { useChat } from 'ai/react'
import MessageList from './message-list'
import MessageInput from './message-input'
import { ThemeToggle } from './theme-toggle'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat()
  const [localError, setLocalError] = useState<string | null>(null)

  const handleLocalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError(null)
    try {
      await handleSubmit(e)
    } catch (err) {
      setLocalError('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Greg's Chatbot</h1>
        <ThemeToggle />
      </header>
      <main className="flex-1 overflow-hidden flex flex-col">
        {(error || localError) && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || localError}
            </AlertDescription>
          </Alert>
        )}
        <MessageList messages={messages} />
        <MessageInput 
          input={input}
          handleInputChange={(value: string) => handleInputChange({ target: { value } } as any)}
          handleSubmit={handleLocalSubmit}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}

