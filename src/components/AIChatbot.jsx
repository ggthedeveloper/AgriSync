import { useState, useEffect, useRef } from "react";
import { TR } from "../data/translations";
import { S } from "../utils/storage";
import { I } from "./Icons";

export function AIChatbot({ lang = "en", th = {} }) {
  const L = TR[lang] || TR.en;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = S.get("chatbot_messages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgEndRef = useRef(null);

  const scrollToBottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    S.set("chatbot_messages", JSON.stringify(messages));
  }, [messages]);

  const faqResponses = {
    crop: L.advisorDesc || "Based on your location and soil, here are recommended crops: Paddy, Cotton, Groundnut suitable for your region.",
    disease: "Watch for signs of leaf spots, wilting. Use fungicides if mold appears. Ensure proper drainage.",
    irrigation: "Water your crops 2-3 times per week. Adjust based on rainfall. Use drip irrigation for efficiency.",
    fertilizer: "Apply NPK in 1:0.5:0.5 ratio. Use urea for nitrogen, superphosphate for phosphorus, potash for potassium.",
    market: "Current MSP: Paddy ₹2100/q, Cotton ₹5500/bale. Check mandis for best rates in your district.",
    weather: "Check daily weather forecasts. Heavy rain alerts available. Plan spraying on dry days.",
  };

  const generateResponse = (text) => {
    text = text.toLowerCase();
    if (
      text.includes("crop") ||
      text.includes("plant") ||
      text.includes("grow")
    ) {
      return faqResponses.crop;
    } else if (
      text.includes("disease") ||
      text.includes("pest") ||
      text.includes("fungus")
    ) {
      return faqResponses.disease;
    } else if (
      text.includes("water") ||
      text.includes("irrigat") ||
      text.includes("rain")
    ) {
      return faqResponses.irrigation;
    } else if (
      text.includes("fertilizer") ||
      text.includes("nitrogen") ||
      text.includes("npk")
    ) {
      return faqResponses.fertilizer;
    } else if (
      text.includes("price") ||
      text.includes("mandi") ||
      text.includes("market")
    ) {
      return faqResponses.market;
    } else if (text.includes("weather") || text.includes("rain")) {
      return faqResponses.weather;
    } else {
      return "I can help with crops, diseases, irrigation, fertilizers, market prices, and weather. What would you like to know?";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botResponse = {
        role: "bot",
        text: generateResponse(input),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);
    }, 600);
  };

  const clearChat = () => {
    setMessages([]);
    S.set("chatbot_messages", "[]");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: open ? "0" : "160px",
        right: open ? "0" : "20px",
        zIndex: 999,
        width: open ? "min(380px, 100vw)" : "auto",
        fontFamily: "inherit",
      }}
    >
      {/* Chat Window */}
      <div
        style={{
          width: open ? "100%" : "0",
          height: open ? "600px" : "0",
          background: th.bg || "#fff",
          borderRadius: "16px 16px 0 0",
          boxShadow: open ? "0 -4px 20px rgba(0,0,0,0.15)" : "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "all 0.3s",
          border: `1px solid ${th.br || "#ddd"}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: th.ac || "#10b981",
            color: "#fff",
            padding: "16px",
            fontSize: "16px",
            fontWeight: "600",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>🤖 {L.chatbot}</span>
          <button
            onClick={clearChat}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Clear
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: th.f9 || "#f9fafb",
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: th.sub || "#999",
                fontSize: "14px",
                marginTop: "20px",
              }}
            >
              <p>{L.chatbotWelcome}</p>
              <p style={{ fontSize: "12px", marginTop: "8px" }}>
                {L.chatbotHint}
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px",
                  borderRadius: "8px",
                  background:
                    msg.role === "user"
                      ? th.ac || "#10b981"
                      : th.border || "#e5e7eb",
                  color: msg.role === "user" ? "#fff" : th.txt || "#000",
                  fontSize: "13px",
                  lineHeight: "1.4",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: "4px", padding: "8px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: th.ac || "#10b981",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: th.ac || "#10b981",
                  animation: "pulse 1.5s infinite 0.2s",
                }}
              />
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: th.ac || "#10b981",
                  animation: "pulse 1.5s infinite 0.4s",
                }}
              />
            </div>
          )}
          <div ref={msgEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "12px",
            borderTop: `1px solid ${th.br || "#ddd"}`,
            display: "flex",
            gap: "8px",
            background: th.bg || "#fff",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={L.chatbotHint || "Ask..."}
            style={{
              flex: 1,
              padding: "10px 12px",
              border: `1px solid ${th.br || "#ddd"}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "inherit",
              background: th.f9 || "#f9fafb",
              color: th.txt || "#000",
              outline: "none",
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              padding: "10px 12px",
              background: th.ac || "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "wait" : "pointer",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: th.ac || "#10b981",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(16,185,129,0.4)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? "✕" : "💬"}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
