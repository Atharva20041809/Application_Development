import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const text = input.trim();

    if (!text || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await window.grok.chat(text);

      if (!result.success) {
        throw new Error(result.error);
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: result.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: `Error: ${error.message}`,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">X</div>
          <span>Grok Chat</span>
        </div>

        <button className="new-chat-btn" onClick={clearChat}>
          + New Chat
        </button>

        <div className="sidebar-section">
          <p className="section-title">Recent Chats</p>

          <div className="chat-item">
            <span>💬</span>
            <span>Current conversation</span>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-option">
            ⚙️
            <span>Settings</span>
          </div>
        </div>
      </aside>

      {/* Chat */}
      <main className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div>
            <h1>Grok</h1>

            <p>
              <span className="online-dot"></span>
              AI Assistant
            </p>
          </div>

          <button className="clear-btn" onClick={clearChat}>
            Clear
          </button>
        </header>

        {/* Messages */}
        <div className="messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">X</div>

              <h2>How can I help you?</h2>

              <p>
                Ask Grok anything.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-row ${message.role}`}
            >
              {message.role === "assistant" && (
                <div className="avatar ai-avatar">
                  X
                </div>
              )}

              <div className="message-content">
                <div className="message-name">
                  {message.role === "user" ? "You" : "Grok"}
                </div>

                <div className="message-bubble">
                  {message.content}
                </div>
              </div>

              {message.role === "user" && (
                <div className="avatar user-avatar">
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="avatar ai-avatar">
                X
              </div>

              <div className="message-content">
                <div className="message-name">
                  Grok
                </div>

                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Grok..."
              rows={1}
              disabled={loading}
            />

            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || loading}
            >
              ↑
            </button>
          </div>

          <p className="input-hint">
            Enter to send · Shift + Enter for new line
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;