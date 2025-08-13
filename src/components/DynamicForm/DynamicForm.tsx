import React, { useEffect, useState } from "react";

interface DynamicFormProps {
  text: string;
  onSubmit: (data: Record<string, string>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ text, onSubmit }) => {
  const [fields, setFields] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const infoRecords: Record<string, string> = {};
  const [info, setInfo] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const rawLabels: string[] = [];
    let matches = [...text.matchAll(/{(.*?)}/g)].map((m) => m[1]);
    const labels: string[] = [];

    matches.forEach((entry) => {
      const [rawLabel, rawInfo] = entry.split("|");
      rawLabels.push(rawLabel);
      if (rawLabel.toLowerCase() != "attached image" && rawLabel.toLowerCase() != "attached_image") {
        console.log("Raw Label:", rawLabel.toLowerCase());
        const formattedLabel = rawLabel
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        labels.push(formattedLabel);
        infoRecords[formattedLabel] = rawInfo;
      }
    });
    matches = labels;
    console.log(rawLabels);
    setFields(matches);
    setInfo(infoRecords);

    const initialData = Object.fromEntries(matches.map((field) => [field, ""]));
    setFormData(initialData);
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-[70%]  p-6 ">
      {fields.map((field) => (
        <div key={field} className="mb-4">
          <label
            htmlFor={field}
            className="block text-gray-700 font-semibold mb-2"
          >
            {field} ({info[field]})
          </label>
          <input
            type="text"
            name={field}
            id={field}
            value={formData[field]}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${
              errors[field] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-[30%] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
