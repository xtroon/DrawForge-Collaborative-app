import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, Loader2 } from "lucide-react";

export type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
};

type AiChatDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  // Callback when user hits send (returns optional reply string from AI)
  onSendPrompt?: (prompt: string, history: ChatMessage[]) => Promise<{ reply?: string } | void> | void;
};

export default function AiChatDrawer({ isOpen, onClose, onSendPrompt }: AiChatDrawerProps) {
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hey! 🎨 I'm your DrawForge AI. I can draw diagrams from scratch, add details, change colors, remove shapes, or organize layouts so nothing overlaps. Tell me what you'd like to do!",
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputPrompt("");
    setIsLoading(true);

    try {
      let aiResponseText = "Done! Whiteboard updated. ✨";
      if (onSendPrompt) {
        const result = await onSendPrompt(text, nextHistory);
        if (result && result.reply) {
          aiResponseText = result.reply;
        }
      }

      // Add AI response message
      const aiReply: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: err?.response?.data?.message || err?.message || "Oops, something went wrong while updating the board. Please try again!",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Draw user login flowchart",
    "Add more detail & steps to it",
    "Make colors aesthetic & colorful",
    "Don't overlap & align neatly",
    "Add a database & cache layer",
    "Remove the database box",
  ];

  if (!isOpen) return null;

  return (
    <div
      data-ai-drawer
      className="fixed top-0 right-0 h-full w-[340px] sm:w-[400px] z-[60] flex flex-col bg-[#FFFDF6] border-l-2 border-[#2B2B2A] shadow-[-6px_0_0_rgba(43,43,42,0.15)] transition-all duration-300 ease-in-out"
      style={{
        fontFamily: "'Patrick Hand', cursive",
      }}
    >
      {/* ── header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#2B2B2A] bg-[#FFF8E7]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFC53D] border-2 border-[#2B2B2A] flex items-center justify-center shadow-[1px_1px_0_#2B2B2A]">
            <Sparkles size={16} className="text-[#2B2B2A]" />
          </div>
          <div>
            <h3 className="font-doodle text-xl font-bold leading-none text-[#2B2B2A]">
              DrawForge Copilot
            </h3>
            <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
              Ready to draw
            </span>
          </div>
        </div>

        {/* Close Button at Top-Right */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg border-2 border-[#2B2B2A] bg-white hover:bg-[#FF6B6B] hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0_#2B2B2A] active:translate-x-[1px] active:translate-y-[1px]"
          title="Close AI Assistant"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── CHAT BODY ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-xs text-[#8a8a86]">
              {msg.sender === "user" ? (
                <>
                  <span>You</span>
                  <User size={12} />
                </>
              ) : (
                <>
                  <Bot size={12} className="text-[#3b82f6]" />
                  <span>Copilot</span>
                </>
              )}
              <span>• {msg.time}</span>
            </div>

            <div
              className={`p-3 max-w-[85%] text-base leading-snug border-2 border-[#2B2B2A] ${
                msg.sender === "user"
                  ? "bg-[#FFC53D] text-[#2B2B2A] rounded-2xl rounded-tr-none shadow-[2px_2px_0_#2B2B2A]"
                  : "bg-white text-[#2B2B2A] rounded-2xl rounded-tl-none shadow-[2px_2px_0_#2B2B2A]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white border-2 border-[#2B2B2A] rounded-2xl rounded-tl-none shadow-[2px_2px_0_#2B2B2A] w-fit">
            <Loader2 size={18} className="animate-spin text-[#FF6B6B]" />
            <span className="text-sm font-semibold text-[#8a8a86]">
              Generating diagram shapes...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── QUICK SUGGESTION PILLS ── */}
      <div className="px-4 py-2 bg-[#FFFDF6] border-t border-[#2B2B2A]/10">
        <p className="text-xs text-[#8a8a86] mb-1.5 font-semibold">Quick Ideas:</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSend(promptText)}
              disabled={isLoading}
              className="text-xs shrink-0 px-2.5 py-1 bg-white hover:bg-[#FFC53D]/30 border border-[#2B2B2A]/30 rounded-full cursor-pointer transition-colors disabled:opacity-50"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* ── CHAT INPUT FOOTER ── */}
      <div className="p-3 bg-[#FFF8E7] border-t-2 border-[#2B2B2A]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Type prompt (e.g. Draw user login flow)..."
            disabled={isLoading}
            className="flex-1 bg-white border-2 border-[#2B2B2A] rounded-xl px-3 py-2 text-sm text-[#2B2B2A] placeholder:text-[#8a8a86] outline-none focus:ring-2 focus:ring-[#FFC53D] shadow-[2px_2px_0_#2B2B2A]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2.5 bg-[#FFC53D] border-2 border-[#2B2B2A] rounded-xl cursor-pointer shadow-[2px_2px_0_#2B2B2A] hover:bg-[#ffd166] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send prompt"
          >
            <Send size={16} className="text-[#2B2B2A]" />
          </button>
        </form>
      </div>
    </div>
  );
}
