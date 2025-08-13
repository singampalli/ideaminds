import React, { useState, useEffect, useRef } from "react";
import { Trash2, Copy, Save, FolderOpen, Eraser, Wand2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import LocalAIService from "../../services/LocalAIService";

const STORAGE_KEY = "online-notepad.v1";

export default function OnlineNotepad() {
  const [text, setText] = useState("");
  const [showToneModal, setShowToneModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const skipAutoSave = useRef(false);

  const tones = ["Witty", "Empathetic", "Formal", "Casual", "Inspiring"];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setText(saved);
  }, []);

  useEffect(() => {
    if (skipAutoSave.current) {
      skipAutoSave.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, text);
  }, [text]);

  const handleToneRephrase = async (tone: string) => {
    try {
      setShowToneModal(false);
      setIsLoading(true);
      const prompt = `Rephrase the following in a "${tone}" tone. Preserve the original structure and headings. Do not include any introduction, explanation, or formatting. Output must begin directly with the rephrased content."${text}"`;
      const response = await LocalAIService.generateContentFromPrompt(prompt);
      setText(response);
      toast.success(`Rephrased in ${tone} tone`);
    } catch (error) {
      console.error("Tone rephrasing failed:", error);
      toast.error("Failed to rephrase. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearBoard = () => {
    if (confirm("Clear the board?")) {
      skipAutoSave.current = true;
      setText("");
      toast("Board cleared");
    }
  };

  const handleDeleteNotes = () => {
    if (confirm("Delete all saved notes?")) {
      setText("");
      localStorage.removeItem(STORAGE_KEY);
      toast("Notes deleted");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, text);
    toast.success("Notes saved");
  };

  const handleOpen = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setText(saved);
      toast.success("Notes loaded");
    } else {
      toast("No saved notes found");
    }
  };

  return (
    <div className="relative flex flex-col h-full p-4" id="NotePad">
      <Toaster position="bottom-right" />

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Innovation Dock
        </h1>
      </div>

      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your idea or story here..."
        className="flex-1 p-4 rounded border border-gray-300 dark:border-gray-700
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   resize-none focus:outline-none focus:ring focus:ring-blue-300
                   font-mono text-sm min-h-[200px] sm:min-h-[300px]"
      />

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 text-xs text-gray-500 gap-2">
        <span>Autosaved locally.</span>
        <div className="flex flex-wrap gap-2">
          <IconButton
            icon={<Eraser size={18} className="text-gray-500" />}
            title="Clear Board"
            onClick={handleClearBoard}
            hover="hover:bg-gray-200 dark:hover:bg-gray-800"
          />
          <IconButton
            icon={<Trash2 size={18} className="text-red-500" />}
            title="Delete Notes"
            onClick={handleDeleteNotes}
            hover="hover:bg-red-100 dark:hover:bg-red-900"
          />
          <IconButton
            icon={<Copy size={18} className="text-blue-500" />}
            title="Copy Notes"
            onClick={handleCopy}
            hover="hover:bg-blue-100 dark:hover:bg-blue-900"
          />
          <IconButton
            icon={<Save size={18} className="text-green-500" />}
            title="Save Notes"
            onClick={handleSave}
            hover="hover:bg-green-100 dark:hover:bg-green-900"
          />
          <IconButton
            icon={<FolderOpen size={18} className="text-yellow-500" />}
            title="Open Saved Notes"
            onClick={handleOpen}
            hover="hover:bg-yellow-100 dark:hover:bg-yellow-900"
          />
          <IconButton
            icon={<Wand2 size={18} className="text-purple-500" />}
            title="Rephrase with Tone"
            onClick={() => setShowToneModal(true)}
            hover="hover:bg-purple-100 dark:hover:bg-purple-900"
          />
        </div>
      </div>

      {/* Tone Modal */}
      {showToneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Select Tone
            </h2>
            <select
              disabled={isLoading}
              onChange={(e) => {
                const selectedTone = e.target.value;
                if (selectedTone !== "") handleToneRephrase(selectedTone);
              }}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <option value="">Select tone to rephrase text</option>
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowToneModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔧 Reusable Icon Button
type IconButtonProps = {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  hover?: string;
};

function IconButton({ icon, title, onClick, hover = "" }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded transition ${hover}`}
      title={title}
      aria-label={title}
    >
      {icon}
    </button>
  );
}