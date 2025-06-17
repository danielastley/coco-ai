import { useSettingsStore } from '../store/settingsStore';

export async function sendMessageToLLM(content: string): Promise<string> {
  const { settings } = useSettingsStore.getState();
  
  if (!settings.serverUrl || !settings.apiKey) {
    throw new Error('Server URL and API Key are required');
  }

  try {
    const response = await fetch(`${settings.serverUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: 'user',
            content: content,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from model';
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw error;
  }
} 