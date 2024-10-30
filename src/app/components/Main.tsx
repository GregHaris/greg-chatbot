'use client'
import Chat from "./Chat"
import Button from "./Button"
import Headings from "./Headings"
import { useState, useEffect } from 'react';
import SearchBar from "./SearchBar"

const Main = () => {
  // State to manage the input value
  const [inputValue, setInputValue] = useState('');
  // State to manage chat messages
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  // Function to handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  // Function to handle button click
  const handleSend = () => {
    if (inputValue.trim() === '') return;
    // Add the input value to the chat messages
    setChatMessages([...chatMessages, inputValue]);
    // Clear the input field
    setInputValue('');
  };

  return (
    <>
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
      <div className="chat-container">
        <Chat>
          {/* Render chat messages */}
          {chatMessages.map((message, index) => (
            <div key={index} className="chat-message">
              {message}
            </div>
          ))}
        </Chat>
      </div>
      <div className="searchBar-container">
        <SearchBar>
          <textarea
            className="search-input"
            placeholder="Enter your text"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button textContent="Send" handleClick={handleSend} />
        </SearchBar>
      </div>
    </>
  );
}

export default Main