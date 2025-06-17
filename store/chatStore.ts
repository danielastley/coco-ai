import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Message } from '@/types';
import { llmClient } from '@/api/llmClient';
import { generateConversationTitle } from '@/utils/formatters';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createConversation: () => string;
  loadConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  clearError: () => void;
  
  // Selectors
  getCurrentConversation: () => Conversation | null;
  getConversationById: (id: string) => Conversation | null;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isLoading: false,
      error: null,
      
      createConversation: () => {
        const id = Date.now().toString();
        const newConversation: Conversation = {
          id,
          title: 'New Conversation',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set(state => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }));
        
        return id;
      },
      
      loadConversation: (id: string) => {
        set({ currentConversationId: id });
      },
      
      sendMessage: async (content: string) => {
        set({ isLoading: true, error: null });
        
        let currentId = get().currentConversationId;
        if (!currentId) {
          currentId = get().createConversation();
        }
        
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content,
          timestamp: Date.now(),
        };
        
        // Update state with user message
        set(state => {
          const updatedConversations = state.conversations.map(conv => {
            if (conv.id === currentId) {
              // Update conversation title if this is the first message
              const isFirstMessage = conv.messages.length === 0;
              const title = isFirstMessage ? generateConversationTitle(content) : conv.title;
              
              return {
                ...conv,
                title,
                messages: [...conv.messages, userMessage],
                updatedAt: Date.now(),
              };
            }
            return conv;
          });
          
          return { conversations: updatedConversations };
        });
        
        try {
          // Get current conversation with the new user message
          const currentConversation = get().getConversationById(currentId!);
          if (!currentConversation) {
            throw new Error('Conversation not found');
          }
          
          // Send to LLM
          const assistantMessage = await llmClient.sendMessage(currentConversation.messages);
          
          if (assistantMessage) {
            // Update state with assistant response
            set(state => {
              const updatedConversations = state.conversations.map(conv => {
                if (conv.id === currentId) {
                  return {
                    ...conv,
                    messages: [...conv.messages, assistantMessage],
                    updatedAt: Date.now(),
                  };
                }
                return conv;
              });
              
              return { 
                conversations: updatedConversations,
                isLoading: false,
              };
            });
          } else {
            throw new Error('No response from assistant');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to get response',
            isLoading: false,
          });
        }
      },
      
      deleteConversation: (id: string) => {
        set(state => {
          const updatedConversations = state.conversations.filter(conv => conv.id !== id);
          
          // If we're deleting the current conversation, set current to null
          const currentId = state.currentConversationId === id ? null : state.currentConversationId;
          
          return {
            conversations: updatedConversations,
            currentConversationId: currentId,
          };
        });
      },
      
      clearError: () => set({ error: null }),
      
      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        if (!currentConversationId) return null;
        return conversations.find(conv => conv.id === currentConversationId) || null;
      },
      
      getConversationById: (id: string) => {
        return get().conversations.find(conv => conv.id === id) || null;
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);