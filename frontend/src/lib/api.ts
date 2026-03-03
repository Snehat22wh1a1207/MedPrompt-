import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const documentsAPI = {
  analyze: (formData: FormData) =>
    api.post('/documents/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  history: () => api.get('/documents/history'),
  getDocument: (id: string) => api.get(`/documents/${id}`),
  downloadFile: (id: string) =>
    api.get(`/documents/${id}/download`, { responseType: 'blob' }),
};

export const adminAPI = {
  listUsers: () => api.get('/admin/users'),
  searchByMedId: (medid: string) => api.get(`/admin/users/search?medid=${medid}`),
  getUserDocuments: (medid: string) => api.get(`/admin/users/${medid}/documents`),
  downloadFile: (docId: string) =>
    api.get(`/admin/documents/${docId}/download`, { responseType: 'blob' }),
};
