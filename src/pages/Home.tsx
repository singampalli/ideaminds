import { useEffect, useState } from "react";
import type { Template } from "../services/templateService";
import templateService from "../services/templateService";
import LocalAIService from "../services/LocalAIService";
import DynamicForm from "../components/DynamicForm/DynamicForm";

// Collapsible Step Component
function CollapsibleStep({
  step,
  currentStep,
  title,
  children,
  onToggle,
}: {
  step: number;
  currentStep: number;
  title: string;
  children: React.ReactNode;
  onToggle: () => void;
}) {
  const isOpen = currentStep === step;
  return (
    <div className="w-full p-4">
      <div
        className="flex items-center justify-between bg-gray-100 p-4 cursor-pointer border-b"
        onClick={onToggle}
      >
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <span className="text-gray-600">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div className="p-4 border border-t-0">{children}</div>}
    </div>
  );
}

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [selectedGenerator, setSelectedGenerator] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatorResponse, setGeneratorResponse] = useState<string | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    templateService.getAllTemplates().then(setTemplates);
  }, []);

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGenerator.trim() || !imageFile) {
      setError("Both fields are required.");
      return;
    }
    setError(null);
    const template = templates.find((t) => t.id === selectedGenerator) || null;
    setSelectedTemplate(template);
    setCurrentStep(2);
  };

  const createMultiModelPrompt = async (data: Record<string, string>) => {
    if (!selectedTemplate?.content) return;
    let text = selectedTemplate.content;

    const promptData: Record<string, string> = {};
    for (const key in data) {
      promptData[key.toLowerCase().replace(/\s+/g, "_")] = data[key];
    }

    const matches = [...text.matchAll(/{(.*?)}/g)].map((m) => m[1]);
    matches.forEach((match) => {
      const key = match.toLowerCase().split("|")[0];
      if (promptData[key]) {
        text = text.replace(`{${match}}`, promptData[key]);
      }
    });

    try {
      setLoading(true);
      setGeneratorResponse(null);
      setCurrentStep(3);
      const response = await LocalAIService.generateContentFromPrompt(
        text,
        imageFile
      );
      setGeneratorResponse(response);
    } catch (error) {
      console.error("Failed to generate image variation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray">
      {/* Step 1: Upload & Select */}
      <CollapsibleStep
        step={1}
        currentStep={currentStep}
        title="Step 1: Upload Image & Choose Generator"
        onToggle={() => setCurrentStep(currentStep === 1 ? 0 : 1)}
      >
        {error && <div className="text-red-500 font-bold mb-4">{error}</div>}
        <form onSubmit={handleSubmitStep1} className="space-y-4 text-left">
          <div>
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="generatorSelect"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Choose Generator
            </label>
            <select
              id="generatorSelect"
              value={selectedGenerator}
              onChange={(e) => setSelectedGenerator(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Generator</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Next
          </button>
        </form>
      </CollapsibleStep>
      {/* Step 2: Fill Template Form */}
      {selectedTemplate && (
        <CollapsibleStep
          step={2}
          currentStep={currentStep}
          title={`Step 2: Fill in Details for "${selectedTemplate.name}"`}
          onToggle={() => setCurrentStep(currentStep === 2 ? 0 : 2)}
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {imageFile && (
              <div className="w-[200px] flex justify-center">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Uploaded"
                  width="200"
                  className="max-w-full h-auto rounded shadow-md border"
                />
              </div>
            )}
            <div className="flex-1 bg-white shadow-md rounded p-4">
              <DynamicForm
                text={selectedTemplate.content}
                onSubmit={createMultiModelPrompt}
              />
            </div>
          </div>
        </CollapsibleStep>
      )}
      {/* Step 3: View Results */}
      {(generatorResponse || loading) && (
        <CollapsibleStep
          step={3}
          currentStep={currentStep}
          title="Step 3: Generated Output"
          onToggle={() => setCurrentStep(currentStep === 3 ? 0 : 3)}
        >
          <div className="w-full bg-white p-4 rounded shadow text-sm text-gray-800 whitespace-pre-line overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 font-medium">
                  Generating...
                </span>
              </div>
            ) : (
              generatorResponse
            )}
          </div>
        </CollapsibleStep>
      )}
      
    </div>
  );
}
