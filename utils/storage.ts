import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Settings } from '../types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'conversations',
  SETTINGS: 'settings',
} as const;

export async function saveConversation(conversation: Conversation): Promise<void> {
  try {
    const existingConversations = await loadConversations();
    const updatedConversations = existingConversations.filter(c => c.id !== conversation.id);
    updatedConversations.unshift(conversation);
    
    await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updatedConversations));
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

export async function loadConversations(): Promise<Conversation[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!data) return [];
    
    const conversations = JSON.parse(data);
    return conversations.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
}

export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    const conversations = await loadConversations();
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updatedConversations));
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

export async function loadSettings(): Promise<Partial<Settings>> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return {};
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading settings:', error);
    return {};
  }
} 