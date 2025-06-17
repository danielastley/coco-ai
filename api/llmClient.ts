import { Message, LLMResponse } from '@/types';

export class LLMClient {
  private serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  setServerUrl(url: string) {
    this.serverUrl = url;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/v1/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }

  async sendMessage(messages: Message[]): Promise<Message | null> {
    try {
      // Format messages for the API
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${this.serverUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'local-model', // This is typically ignored by LM Studio
          messages: formattedMessages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LLMResponse = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: Date.now(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const llmClient = new LLMClient('');