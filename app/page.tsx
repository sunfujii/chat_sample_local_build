"use client";

import { useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    // ユーザー発言
    const newMsg: Message = { sender: "user", text: input };
    const botMsg: Message = { sender: "bot", text: `>${input}` };

    setMessages((prev) => [...prev, newMsg, botMsg]);
    setInput("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>シンプルチャット（Next.js版）</h2>

      <div style={styles.chatArea}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background:
                msg.sender === "user" ? "#0078ff" : "#e0e0e0",
              color: msg.sender === "user" ? "#fff" : "#000",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="メッセージを入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          送信
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "sans-serif",
    background: "#f8f9fa",
  },
  header: {
    background: "#0078ff",
    color: "white",
    padding: "10px",
    textAlign: "center",
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    overflowY: "auto",
    gap: "8px",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "10px",
    maxWidth: "70%",
  },
  inputRow: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
    background: "white",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginRight: "8px",
  },
  button: {
    background: "#0078ff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
  },
};
