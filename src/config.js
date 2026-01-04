// API configuration
// In production, the API runs on the same host as the frontend (both in same container)
// In development, the API runs on localhost:8005

const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8005'
  : window.location.origin.replace(':3005', ':8005');

export const API_ENDPOINTS = {
  videos: `${API_BASE_URL}/api/videos`,
  updateVideo: (id) => `${API_BASE_URL}/api/videos/${id}`,
};
