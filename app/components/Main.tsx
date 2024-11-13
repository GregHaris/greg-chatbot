'use client';
import Chat from './ui/Chat';
import Button from './ui/Button';
import Headings from './ui/Headings';
import ReactMarkdown from 'react-markdown';
import SearchBar from './SearchBar';
import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';

interface ChatMessage {
  prompt: string;
  response: string;
}

interface AppState {
  inputValue: string;
  chatMessages: ChatMessage[];
  isChatVisible: boolean;
  isHeadersVisible: boolean;
}

const Main: React.FC = () => {
  // Initialize state with an empty string
  const [state, setState] = useState<AppState>({
    inputValue: '',
    chatMessages: [],
    isChatVisible: false,
    isHeadersVisible: true,
  });

  // Initialize state from localStorage on the client side
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const localValue = localStorage.getItem('appState');
      if (localValue !== null) {
        setState(JSON.parse(localValue));
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('appState', JSON.stringify(state));
    }
  }, [state]);

  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat();

  // Update state with chat messages from useChat
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      chatMessages: messages.map((message) => ({
        prompt: message.role === 'user' ? message.content : '',
        response: message.role === 'assistant' ? message.content : '',
      })),
      isChatVisible: messages.length > 0,
      isHeadersVisible: messages.length === 0,
    }));
  }, [messages]);

  const handleClearChat = () => {
    // Clear the chat messages state
    setState((prevState) => ({
      ...prevState,
      chatMessages: [],
      isChatVisible: false,
      isHeadersVisible: true,
    }));

    // Remove chat history from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('appState');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action (newline)
      handleSubmit(event); // Pass the event object to handleSubmit
    }
  };

  // Wrapper function to call handleSubmit with input value
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent the default form submission
    handleSubmit(event); // Pass the event object to handleSubmit
  };

  // Function to check if the input is empty
  const isInputEmpty = (input: string) => input.trim() === '';

  return (
    <>
      {state.isHeadersVisible && (
        <div>
          <Headings>
            <div>
              <h1>Hi, Welcome.</h1>
            </div>
            <div>
              <h3>How can I help you today?</h3>
            </div>
          </Headings>
        </div>
      )}
      {state.isChatVisible && (
        <div className="chat-container">
          <Chat>
            {/* Map over the chat messages to render each one */}
            {state.chatMessages.map((message, index) => (
              <div key={index} className="chatConversations">
                <div className="chat-prompt">{message.prompt}</div>
                <div className="chat-response">
                  <ReactMarkdown>{message.response}</ReactMarkdown>
                </div>
              </div>
            ))}
            <Button textContent="Clear Chat" handleClick={handleClearChat} />
          </Chat>
        </div>
      )}
      <div className="searchBar-container">
        <SearchBar>
          <textarea
            className="search-input"
            placeholder="Enter your text"
            value={input}
            // Use the handleInputChange function
            onChange={handleInputChange}
            // Use the handleKeyDown function
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button
            textContent="Send"
            handleClick={handleButtonClick}
            // Pass the disabled state to the Button component
            disabled={isLoading || isInputEmpty(input)}
          />
        </SearchBar>
      </div>
    </>
  );
};

export default Main;
