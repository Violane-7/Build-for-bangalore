import { useState, useRef, useEffect } from "react";
import "./HealthChat.css";

const OPENROUTER_API_KEY = "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";

const SYSTEM_PROMPT = `You are a helpful health assistant. Provide clear, concise medical information and guidance. 
Keep responses brief and actionable. Always recommend consulting a doctor for serious concerns.
Do not use emojis. Be professional but warm.`;

export default function HealthChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Models confirmed working with this key (tested via curl)
    const models = [
      "google/gemma-3-4b-it:free",
      "google/gemma-3-12b-it:free",
      "stepfun/step-3.5-flash:free",
      "z-ai/glm-4.5-air:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "mistralai/mistral-small-3.1-24b-instruct:free",
    ];

    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: input.trim() },
    ];

    let lastError = null;

    for (const model of models) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "PranexusAI Health Chat",
          },
          body: JSON.stringify({
            model,
            messages: chatMessages,
            max_tokens: 800,
          }),
        });

        const data = await response.json();
        console.log(`API Response (${model}):`, data);

        if (data.error) {
          // If rate-limited, try next model immediately
          console.warn(`Model ${model} failed: ${data.error.message}`);
          lastError = data.error.message;
          continue;
        }

        // Extract text from either content or reasoning field
        const msg = data.choices?.[0]?.message;
        const text =
          msg?.content ||
          msg?.reasoning ||
          msg?.reasoning_details?.[0]?.text ||
          null;

        if (text) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              content: text,
            },
          ]);
          setIsLoading(false);
          return; // success
        }

        lastError = "Empty response from model";
      } catch (error) {
        console.warn(`Model ${model} error:`, error.message);
        lastError = error.message;
      }
    }

    // All models failed
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: `Sorry, all AI models are temporarily rate-limited. Please wait a minute and try again.`,
      },
    ]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-left">
          <h1>Health Assistant</h1>
          <span className="status">Online</span>
        </div>
        {messages.length > 0 && (
          <button className="clear-btn" onClick={clearChat}>
            Clear
          </button>
        )}
      </header>

      <main className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <h2>How can I help you today?</h2>
            <p>Ask me anything about your health, symptoms, medications, or wellness.</p>
            <div className="suggestions">
              {[
                "I have a persistent headache",
                "What's a healthy sleep schedule?",
                "Side effects of ibuprofen",
                "Tips for managing stress",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <footer className="chat-input-area">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={isLoading}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <p className="disclaimer">
          This is not medical advice. Consult a healthcare professional for diagnosis.
        </p>
      </footer>
    </div>
  );
}
