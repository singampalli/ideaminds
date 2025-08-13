import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import personaService from "../../services/personaService";
import LocalAIService from "../../services/LocalAIService";
import OnlineNotepad from "../../components/OnlineNotepad/OnlineNotepad";
import { generatePersonaPrompt } from "../../Utils/promptUtil";

interface Persona {
  id: string;
  name: string;
  [key: string]: any;
}

interface ChatMessage {
  sender: "user" | "ai" | "system";
  text: string; // Markdown content
}

const IdeaMinds: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Persona | null>(null);
  const [considerIdea, setConsiderIdea] = useState(true);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const data = await personaService.getAllPersonas();
        setPersonas(data);
      } catch (err) {
        console.error("Error loading personas:", err);
      }
    };
    fetchPersonas();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerson) {
      setError("Please select a persona.");
      return;
    }
    if (!message.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: message }]);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const prompt = generatePersonaPrompt(
        selectedPerson,
        message,
        localStorage.getItem("online-notepad.v1"),
        considerIdea
      );
      const response = await LocalAIService.generateContentFromPrompt(prompt);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `${selectedPerson.name}: ${response}`,
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: `⚠️ ${selectedPerson.name}: Failed to generate response.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg: ChatMessage, index: number) => {
    const prefix =
      msg.sender === "user" ? "🧠 You: " : msg.sender === "ai" ? "🤖 " : "";

    const safeHtml = DOMPurify.sanitize(marked.parse(`${prefix}${msg.text}`));

    return (
      <div
        key={index}
        className={`mb-2 text-sm ${
          msg.sender === "user"
            ? "text-blue-700"
            : msg.sender === "ai"
            ? "text-gray-700"
            : "text-red-500"
        }`}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Column */}
      {considerIdea && (
        <div className="w-full md:w-2/3 bg-gray-100 p-4">
          <div className="h-full border border-gray-300 rounded-lg p-4">
            <OnlineNotepad />
          </div>
        </div>
      )}

      {/* Right Column */}
      <div
  className={`flex flex-col p-4 space-y-4 ${
    considerIdea ? "w-full md:w-1/3" : "w-full"
  }`}
>
  {/* Persona Dropdown */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Choose Persona
    </label>
    <select
      value={selectedPerson?.id || ""}
      onChange={(e) => {
        const persona = personas.find((p) => p.id === e.target.value) || null;
        setSelectedPerson(persona);
      }}
      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
    >
      <option value="">Select persona</option>
      {personas.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  </div>

  {/* Chat Window */}
  <div className="flex flex-col flex-1 border border-gray-300 rounded-lg bg-white">
    <div
      ref={chatRef}
      className="flex-1 p-4 overflow-y-auto scroll-smooth max-h-[40vh] sm:max-h-[50vh]"
    >
      {chatMessages.map(renderMessage)}
      {loading && (
        <div className="text-sm text-gray-500 italic">🤖 Thinking...</div>
      )}
    </div>

    {/* Input Box */}
    <div className="border-t border-gray-200 p-3">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <form className="space-y-3" onSubmit={handleSend}>
        {/* Row 1: Checkbox */}
        <div className="flex flex-wrap items-center gap-3">
          
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={considerIdea}
              onChange={(e) => setConsiderIdea(e.target.checked)}
              className="sr-only"
            />
            <div className="w-10 h-5 bg-blue-700 rounded-full shadow-inner flex items-center px-1">
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                  considerIdea ? "translate-x-5" : ""
                }`}
              />
            </div>
            <span className="ml-2 text-sm text-blue-700">
              {considerIdea ? "Using Innovation Dock" : "Direct Persona"}
            </span>
          </label>
        </div>

        {/* Row 2: Textbox and Send Button */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
    </div>
  );
};

export default IdeaMinds;
