import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance for backend API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api/v1',
  timeout: 120000, 
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    'localtunnel-bypass-https': 'true',
    'ngrok-skip-browser-warning': 'true'
  },
});

// Create axios instance for ML API
export const mlApi = axios.create({
  baseURL: process.env.REACT_APP_ML_API_URL || 'http://localhost:8000/api',
  timeout: 120000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle specific error codes
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;

        case 403:
          // Forbidden
          toast.error(data.message || 'You do not have permission to perform this action.');
          break;

        case 404:
          // Not found
          toast.error(data.message || 'Resource not found.');
          break;

        case 429:
          // Too many requests
          toast.error(data.message || 'Too many requests. Please try again later.');
          break;

        case 500:
          // Server error
          toast.error(data.message || 'Server error. Please try again later.');
          break;

        default:
          // Other errors
          if (data.message) {
            toast.error(data.message);
          }
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Network error. Please check your internet connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

// ML API request interceptor
mlApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ML API response interceptor
mlApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 500) {
        toast.error('ML service error. Please try again later.');
      } else if (data.message) {
        toast.error(data.message);
      }
    } else {
      toast.error('ML service is unavailable.');
    }

    return Promise.reject(error);
  }
);

// Helper function to handle file uploads
export const uploadFile = (endpoint, formData) => {
  return api.post(endpoint, formData, {
    timeout: 120000 // 2 minutes for file uploads
  });
};

// Helper function to download file
export const downloadFile = async (endpoint, filename) => {
  try {
    const response = await api.get(endpoint, {
      responseType: 'blob',
      timeout: 120000 // 2 minutes for downloads
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    toast.error('Failed to download file');
    throw error;
  }
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    return 'Network error. Please check your connection.';
  } else {
    return 'An unexpected error occurred';
  }
};

// Helper function to format API response
export const formatApiResponse = (response) => {
  if (response.data) {
    return response.data;
  }
  return response;
};

// Export configured axios instance
export default api;