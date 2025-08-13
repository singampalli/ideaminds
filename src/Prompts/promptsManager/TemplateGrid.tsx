import { useEffect, useState } from "react";
import templateService from "../../services/templateService";
import type { Template } from "../../services/templateService";
import TemplateCreator from "./TemplateCreator";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

interface TemplateGridProps {
  onEdit?: (template: Template) => void;
}

export default function TemplateGrid({ onEdit }: TemplateGridProps) {
  const charactersLimit = 100;
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);

  const handleEdit = (template: Template) => {
    setTemplateToEdit(template);
    setShowDialog(true);
  };

  useEffect(() => {
    templateService.getAllTemplates().then((templates) => {
      setTemplates(templates);
    });
  }, [showDialog]);

  const handleDelete = async (id: string) => {
    await templateService.deleteTemplate(id);
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-blue-600 text-lg font-semibold">Generators</h2>
        <button
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          title="Create New Template"
          onClick={() => {
            setShowDialog(true);
            setTemplateToEdit(null);
          }}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span className="text-sm">New</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded shadow-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Template Text</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{template.name}</td>
                <td className="px-4 py-2 border-b">
                  {template.content?.length > charactersLimit
                    ? template.content.slice(0, charactersLimit) + "..."
                    : template.content}
                </td>
                <td className="px-4 py-2 border-b">
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(template)}
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(template.id!)}
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="text-blue-600 font-semibold">
                {templateToEdit ? "Edit Template" : "Create New Template"}
              </h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <TemplateCreator
                templateToEdit={templateToEdit}
                onClose={() => {
                  setShowDialog(false);
                  setTemplateToEdit(null);
                }}
              />
            </div>
            <div className="px-4 py-3 border-t flex justify-end">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={() => {
                  setShowDialog(false);
                  setTemplateToEdit(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}