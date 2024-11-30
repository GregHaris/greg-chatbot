import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Message } from 'ai'

type MessageListProps = {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
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
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`px-4 py-2 rounded-lg max-w-[85%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-foreground'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <Avatar className="ml-2">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

