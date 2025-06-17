import { create } from 'zustand';
import { Message, Conversation } from '../types';
import { sendMessageToLLM } from '../api/llmClient';
import { saveConversation, loadConversations, deleteConversation } from '../utils/storage';

interface ChatState {
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  createNewConversation: () => void;
  deleteConversation: (conversationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  conversations: [],
  currentConversationId: null,
  isLoading: false,

  sendMessage: async (content: string) => {
    const { messages, currentConversationId } = get();
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    set({ messages: newMessages, isLoading: true });

    try {
      const response = await sendMessageToLLM(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      set({ messages: updatedMessages });

      // Save conversation
      const conversation: Conversation = {
        id: currentConversationId || Date.now().toString(),
        title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        messages: updatedMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveConversation(conversation);
      
      if (!currentConversationId) {
        set({ currentConversationId: conversation.id });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the user message on error
      set({ messages });
    } finally {
      set({ isLoading: false });
    }
  },

  selectConversation: (conversationId: string) => {
    const { conversations } = get();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation) {
      set({ 
        messages: conversation.messages,
        currentConversationId: conversationId 
      });
    }
  },

  createNewConversation: () => {
    set({ 
      messages: [],
      currentConversationId: null 
    });
  },

  deleteConversation: async (conversationId: string) => {
    const { conversations, currentConversationId } = get();
    
    await deleteConversation(conversationId);
    
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    set({ conversations: updatedConversations });

    if (currentConversationId === conversationId) {
      set({ messages: [], currentConversationId: null });
    }
  },

  loadConversations: async () => {
    try {
      const conversations = await loadConversations();
      set({ conversations });
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  },
})); 