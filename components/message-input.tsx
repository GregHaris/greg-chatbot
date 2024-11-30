import { useState, useRef, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from 'lucide-react'

type MessageInputProps = {
  input: string
  handleInputChange: (value: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export default function MessageInput({ input, handleInputChange, handleSubmit, isLoading }: MessageInputProps) {
  const [rows, setRows] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      const textareaLineHeight = 24
      const minRows = 1
      const maxRows = 5

      const previousRows = textareaRef.current.rows
      textareaRef.current.rows = minRows

      const currentRows = Math.floor(textareaRef.current.scrollHeight / textareaLineHeight)

      if (currentRows === previousRows) {
        textareaRef.current.rows = currentRows
      }

      if (currentRows >= maxRows) {
        textareaRef.current.rows = maxRows
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight
      }

      setRows(currentRows < maxRows ? currentRows : maxRows)
    }
  }, [input])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e.target.value)
  }

  return (
    <div className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <form 
        onSubmit={handleSubmit}
        className="relative max-w-4xl mx-auto flex items-center"
      >
        <Textarea
          ref={textareaRef}
          rows={rows}
          placeholder="Message Greg's Chatbot..."
          value={input}
          onChange={handleTextareaChange}
          className="resize-none pr-12 py-3 rounded-full border-muted-foreground/20 bg-background focus-visible:ring-1 focus-visible:ring-offset-1"
          style={{ maxHeight: '120px' }}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      <div className="text-xs text-center mt-2 text-muted-foreground">
        Greg's Chatbot can make mistakes. Consider checking important information.
      </div>
    </div>
  )
}

