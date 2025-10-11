import { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

export default function Chatbot({ packedItems, tripSummary, aiRecommendations, onUpdateRecommendations }) {
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // State
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecommendations, setCurrentRecommendations] = useState(aiRecommendations);
  const [hasAskedInitialQuestion, setHasAskedInitialQuestion] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync with parent recommendations
  useEffect(() => {
    setCurrentRecommendations(aiRecommendations);
  }, [aiRecommendations]);

  // Ask initial question once when component loads
  useEffect(() => {
    if (hasAskedInitialQuestion || !aiRecommendations) return;

    setHasAskedInitialQuestion(true);
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/chatbot/generate-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packedItems,
        tripSummary,
        chatbotHistory: "",
        aiRecommendations,
      }),
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          addMessage("chatbot", data.question);
        } else {
          addMessage("chatbot", "Hi! I'm here to help refine your packing list.");
        }
      })
      .catch(error => {
        console.error("Initial question error:", error);
        addMessage("chatbot", "Hi! I'm here to help refine your packing list.");
      })
      .finally(() => setIsLoading(false));
  }, [hasAskedInitialQuestion, aiRecommendations, packedItems, tripSummary]);

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, message: text }]);
  };

  const getChatHistory = (messagesList) => {
    return messagesList
      .map(m => `${m.sender === "user" ? "User" : "Chatbot"}: ${m.message}`)
      .join("\n");
  };

  const handleSendMessage = async () => {
    const userMessage = inputRef.current.value.trim();
    if (!userMessage || isLoading) return;

    // Add user message and clear input
    addMessage("user", userMessage);
    inputRef.current.value = "";
    setIsLoading(true);

    // Build chat history
    const updatedMessages = [...messages, { sender: "user", message: userMessage }];
    const chatHistory = getChatHistory(updatedMessages);

    try {
      // Step 1: Refine recommendations based on user's response
      const refinedResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chatbot/refined-recommendation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packedItems,
            tripSummary,
            chatbotHistory: chatHistory,
            aiRecommendations: currentRecommendations,
          }),
          credentials: "include",
        }
      );

      const refinedData = await refinedResponse.json();
      let latestRecommendations = currentRecommendations;

      if (refinedData.success && refinedData.refinedRecommendations) {
        latestRecommendations = refinedData.refinedRecommendations;
        setCurrentRecommendations(latestRecommendations);
        onUpdateRecommendations(latestRecommendations);
      }

      // Step 2: Generate next chatbot question
      const questionResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chatbot/generate-question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packedItems,
            tripSummary,
            chatbotHistory: chatHistory,
            aiRecommendations: latestRecommendations,
          }),
          credentials: "include",
        }
      );

      const questionData = await questionResponse.json();

      if (questionData.success) {
        addMessage("chatbot", questionData.question);
      } else {
        addMessage("chatbot", "Sorry, I encountered an error. Please try again.");
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage("chatbot", "Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
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
              className={message.sender === "chatbot" ? "chatbot-msg" : "user-msg"}
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
