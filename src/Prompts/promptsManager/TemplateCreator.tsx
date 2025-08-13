import React, { useState, useEffect } from 'react';
import  type { Template } from '../../services/templateService';
import templateService from '../../services/templateService';

interface TemplateCreatorProps {
  onClose?: () => void;
  templateToEdit?: Template | null;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({ onClose, templateToEdit }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (templateToEdit) {
      setName(templateToEdit.name);
      setContent(templateToEdit.content);
    }
  }, [templateToEdit]);

  const handleSave = async () => {
    const newTemplate: Template = { name, content };    
    if (!templateToEdit?.id != true) {
      await templateService.updateTemplate(templateToEdit.id, newTemplate);
    } else {
      console.log(newTemplate)
      await templateService.createTemplate(newTemplate);
    }

    if (onClose) onClose();
  };

  return (
    <div>
      <h2>{templateToEdit ? 'Edit Template' : 'Create Template'}</h2>      
      <div className="mt-4">
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Template Name
          </label>
          <input
            type="text"
            placeholder="Enter template name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-sm font-medium text-blue-700 mb-1">
            Template Body
          </label>
          <textarea
            placeholder="Write your prompt using placeholders like {inputname}"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-md px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Template
          </button>
         
        </div>
    </div>
  );
};

export default TemplateCreator;
