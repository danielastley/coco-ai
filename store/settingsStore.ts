import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServerSettings } from '@/types';
import { llmClient } from '@/api/llmClient';

interface SettingsState {
  serverUrl: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  setServerUrl: (url: string) => void;
  testConnection: () => Promise<boolean>;
  resetError: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      serverUrl: '',
      isConnected: false,
      isLoading: false,
      error: null,
      
      setServerUrl: (url: string) => {
        set({ serverUrl: url });
        llmClient.setServerUrl(url);
      },
      
      testConnection: async () => {
        set({ isLoading: true, error: null });
        try {
          const url = get().serverUrl;
          if (!url) {
            set({ error: 'Please enter a server URL', isLoading: false, isConnected: false });
            return false;
          }
          
          llmClient.setServerUrl(url);
          const isConnected = await llmClient.testConnection();
          set({ isConnected, isLoading: false });
          
          if (!isConnected) {
            set({ error: 'Could not connect to server' });
          }
          
          return isConnected;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false,
            isConnected: false
          });
          return false;
        }
      },
      
      resetError: () => set({ error: null }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);