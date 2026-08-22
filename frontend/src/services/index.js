// Central export point for all services
export { default as authService } from './authService';
export { default as cropService } from './cropService';
export { default as soilService } from './soilService';
export { default as weatherService } from './weatherService';
export { default as irrigationService } from './irrigationService';
export { default as diseaseService } from './diseaseService';
export { default as fertilizerService } from './fertilizerService';
export { default as waterService } from './waterService';
export { default as yieldService } from './yieldService';
export { default as chatbotService } from './chatbotService';

// Re-export API instance for direct use if needed
export { default as api } from './api';