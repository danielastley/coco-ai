import { create } from 'zustand';
import { Settings } from '../types';
import { saveSettings, loadSettings } from '../utils/storage';

interface SettingsState {
  settings: Settings;
  
  // Actions
  updateSettings: (settings: Settings) => Promise<void>;
  loadSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  serverUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-3.5-turbo',
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,

  updateSettings: async (newSettings: Settings) => {
    await saveSettings(newSettings);
    set({ settings: newSettings });
  },

  loadSettings: async () => {
    try {
      const settings = await loadSettings();
      set({ settings: { ...defaultSettings, ...settings } });
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ settings: defaultSettings });
    }
  },
})); 