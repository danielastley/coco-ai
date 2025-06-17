import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, ServerSettings } from '@/types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'llm-chat-conversations',
  SERVER_SETTINGS: 'llm-chat-server-settings',
};

export const saveConversations = async (conversations: Conversation[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
};

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

export const saveServerSettings = async (settings: ServerSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SERVER_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving server settings:', error);
  }
};

export const getServerSettings = async (): Promise<ServerSettings | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting server settings:', error);
    return null;
  }
};