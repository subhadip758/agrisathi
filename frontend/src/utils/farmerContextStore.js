/**
 * Central Farmer Active Input Store
 * Tracks inputs entered by farmers across Soil, Irrigation, Yield, Disease, and Market sections
 * and automatically syncs them to the Chatbot context.
 */

const STORAGE_KEY = 'agrisathi_farmer_active_context';

export const saveFarmerSectionInput = (sectionName, inputData) => {
  try {
    const existing = getFarmerActiveContext();
    const updated = {
      ...existing,
      [sectionName]: {
        ...inputData,
        updatedAt: new Date().toISOString()
      },
      lastUpdatedSection: sectionName,
      lastUpdatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom window event so floating chatbot & components update live
    window.dispatchEvent(new CustomEvent('agrisathi_farmer_context_updated', { detail: updated }));
  } catch (err) {
    console.warn('Failed to save farmer context:', err);
  }
};

export const getFarmerActiveContext = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
};

export const clearFarmerActiveContext = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
};
