import axios from 'axios';

const BASE_URL = 'http://localhost:8888/personas';

// ✅ Exported Persona interface for use in other files
export interface Persona {
  id?: string;
  name: string;
  role?: string;
  tone?: string;
  context?: string;
  domain_expertise?: string[];
  communication_style?: string;
  values?: string[];
  decision_triggers?: string[];
  constraints?: string[];
  example_phrases?: string[];
}

const personaService = {
  // 🔹 GET all personas
  getAllPersonas: async (): Promise<Persona[]> => {
    const response = await axios.get<Persona[]>(BASE_URL);
    return response.data;
  },

  // 🔹 GET persona by ID
  getPersonaById: async (id: string): Promise<Persona> => {
    const response = await axios.get<Persona>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // 🔹 POST create new persona
  createPersona: async (persona: Persona): Promise<Persona> => {
    const response = await axios.post<Persona>(BASE_URL, persona);
    return response.data;
  },

  // 🔹 PUT update persona
  updatePersona: async (id: string, updatedPersona: Persona): Promise<Persona> => {
    const response = await axios.put<Persona>(`${BASE_URL}/${id}`, updatedPersona);
    return response.data;
  },

  // 🔹 DELETE persona
  deletePersona: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(`${BASE_URL}/${id}`);
    return response.data;
  }
};

export default personaService;