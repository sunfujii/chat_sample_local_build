"use client";

import { useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const GAS_WEB_APP_URL = "https://script.google.com/macros/s/****************/exec";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // --- GASにPOSTしてレスポンスを取得 ---
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // POSTリクエストを送信
      const res = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        //TODO:GASのCORS対策のため一時対応
        //headers: { "Content-Type": "application/json" },
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        // GAS側のエラー応答も text で読む
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `HTTP ${res.status}`);
      }

      // ✅ ボディは一度だけ読む
      const bodyText = await res.text();

      // JSONで返ってきた場合にも対応
      let replyText = bodyText;
      try {
        const parsed = JSON.parse(bodyText);
        if (parsed && typeof parsed === "object") {
          replyText = parsed.reply ?? parsed.response ?? JSON.stringify(parsed);
        }
      } catch {
        // JSONでなければそのまま使う
      }

      // GASのレスポンスを表示
      const botMsg: Message = { sender: "bot", text: replyText };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const botMsg: Message = {
        sender: "bot",
        text: `⚠️ エラーが発生しました: ${err.message}`,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>GAS連携チャット</h2>

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
        {loading && (
          <div style={{ fontStyle: "italic", color: "#555" }}>
            GASから応答を待っています...
          </div>
        )}
      </div>

      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="質問を入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button} disabled={loading}>
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
    wordBreak: "break-word",
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
