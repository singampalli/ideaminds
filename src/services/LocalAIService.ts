import axios from "axios";

const BASE_URL = "http://localhost:8888/api/query";

interface ApiResponse {
  output?: string;
}

const LocalAIService = {
  generateContentFromPrompt: async (
    promptText: string,
    imageFile?: File | null
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("model", "llama3");
    formData.append("prompt", promptText);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post<ApiResponse>(BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.output ?? "";
    } catch (error: unknown) {
      console.error("LocalAIService Error:", error);
      throw error;
    }
  },
};

export default LocalAIService;