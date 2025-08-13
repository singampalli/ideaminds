import axios from 'axios';

const BASE_URL = 'http://localhost:8888/templates';

// ✅ Exported Template interface for use in other files
export interface Template {
  id?: string;
  name: string;
  content: string;
  // Add more fields if needed
}

const templateService = {
  getAllTemplates: async (): Promise<Template[]> => {
    const response = await axios.get<Template[]>(BASE_URL);
    return response.data;
  },

  getTemplateById: async (id: string): Promise<Template> => {
    const response = await axios.get<Template>(`${BASE_URL}/${id}`);
    return response.data;
  },

  createTemplate: async (template: Template): Promise<Template> => {
    const response = await axios.post<Template>(BASE_URL, template);
    return response.data;
  },

  updateTemplate: async (id: string, updatedTemplate: Template): Promise<Template> => {
    const response = await axios.put<Template>(`${BASE_URL}/${id}`, updatedTemplate);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(`${BASE_URL}/${id}`);
    return response.data;
  },
  executeGeneration: async (
    imageFile: File,
    generatorId: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("generatorId", generatorId);

    const response = await axios.post(`http://localhost:3001/executeGeneration`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

};

export default templateService;
