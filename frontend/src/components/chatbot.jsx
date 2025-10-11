import { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

export default function Chatbot({ packedItems, tripSummary, aiRecommendations }) {
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const addMessage = (sender, text) => {
    const message = {
      sender: sender,
      message: text,
    };
    setMessages((prev) => [...prev, message]);
  };

  const getChatHistory = (includedMessages) => {
    return includedMessages
      .map((m) => `${m.sender === "user" ? "User" : "Chatbot"}: ${m.message}`)
      .join("\n");
  };

  const handleSendMessage = async () => {
    const userMessage = inputRef.current.value.trim();

    // Validation: Check if message is not empty
    if (!userMessage) return;

    addMessage("user", userMessage);
    inputRef.current.value = "";
    setIsLoading(true);

    // Build chat history including current message
    const updatedMessages = [...messages, { sender: "user", message: userMessage }];
    const chatHistory = getChatHistory(updatedMessages);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chatbot/generate-question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packedItems,
            tripSummary,
            chatHistory,
            aiRecommendations,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        addMessage("chatbot", data.question);
      } else {
        addMessage("chatbot", "Sorry, I encountered an error. Please try again.");
      }
    } catch (error) {
      console.error(error);
      addMessage("chatbot", "Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const refineRecommendations = async () => {
    const chatHistory = getChatHistory(messages);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chatbot/refined-recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packedItems,
            tripSummary,
            chatHistory,
            aiRecommendations,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        return data.refinedRecommendations;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <h2>🤖 Packing Assistant</h2>
        <p className="chatbot-subtitle">
          Ask me anything about your packing list!
        </p>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-empty-state-icon">💬</div>
            <p>Start a conversation!</p>
            <p>I'm here to help you refine your packing list.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <p
              key={index}
              className={
                message.sender === "chatbot" ? "chatbot-msg" : "user-msg"
              }
            >
              {message.message}
            </p>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="chat-loading">
            <div className="chat-loading-dots">
              <span className="chat-loading-dot"></span>
              <span className="chat-loading-dot"></span>
              <span className="chat-loading-dot"></span>
            </div>
            <span className="chat-loading-text">Thinking...</span>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-wrapper">
        <div className="chat-input">
          <input
            type="text"
            name="message-input"
            ref={inputRef}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            className="chat-send-btn"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send ✈️"}
          </button>
        </div>
      </div>
    </div>
  );
}
