import { useState } from 'react'
import './App.css'

import Groq from 'groq-sdk';


const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});





function App() {
  let [message,setmessage] = useState('');
  let [chatHistory,setchatHistory] = useState([]);
  let [loading,setloading] = useState(false);

  async function askGroq(){
    setloading(true)
    setchatHistory((prev) => [
      ...prev,
      { role: 'user', content: message }
    ])
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'openai/gpt-oss-20b',
    });
    setchatHistory((prev) => [
      ...prev,
      chatCompletion.choices[0].message
    ])
    setloading(false)
    console.log(chatCompletion.choices[0].message)
  }

  return (
  <>
    <div className="chat-container">

      <h1>Groq Chat</h1>

      <div className="chat-box">

        {chatHistory.length === 0 && !loading && (
          <div className="welcome">
            <h2>How can I help you?</h2>
            <p>Ask me anything...</p>
          </div>
        )}

        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`message ${chat.role}`}
          >
            <div className="message-role">
              {chat.role === "user" ? "You" : "Groq"}
            </div>

            <div className="message-content">
              {chat.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="message-role">
              Groq
            </div>

            <div className="loading-container">
              <div className="spinner"></div>
              <span>Thinking...</span>
            </div>
          </div>
        )}

      </div>

      <div className="input-container">

        <input
          id="input"
          placeholder="Ask Groq..."
          disabled={loading}
          value={message}
          onChange={(e) => setmessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim()) {
              askGroq();
              setmessage("");
            }
          }}
        />

        <button
          disabled={loading || !message.trim()}
          onClick={() => {
            askGroq();
            setmessage("");
          }}
        >
          Send
        </button>

      </div>

    </div>
  </>
)

  
}

export default App
