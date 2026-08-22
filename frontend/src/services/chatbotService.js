import api from './api';

const chatbotService = {
  sendMessage: async (message, sessionId = null, context = {}) => {
    const response = await api.post('/chatbot/message', { message, sessionId, context });
    return response.data;
  },

  // Send message with an image attachment (multipart/form-data)
  sendMessageWithImage: async (message, imageFile, sessionId = null, context = {}) => {
    const formData = new FormData();
    formData.append('message', message || '');
    formData.append('image', imageFile);
    if (sessionId) formData.append('sessionId', sessionId);
    if (context) formData.append('context', JSON.stringify(context));

    const response = await api.post('/chatbot/message-with-image', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },

  getChatHistory: async (limit = 50) => {
    const response = await api.get(`/chatbot/history?limit=${limit}`);
    return response.data;
  },

  clearChatHistory: async () => {
    const response = await api.delete('/chatbot/history');
    return response.data;
  },

  getFAQs: async () => {
    const response = await api.get('/chatbot/faqs');
    return response.data;
  },

  getSuggestions: async (context) => {
    const response = await api.get(`/chatbot/suggestions?context=${encodeURIComponent(context)}`);
    return response.data;
  },
};

export default chatbotService;