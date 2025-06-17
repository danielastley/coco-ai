import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import { Send } from 'lucide-react-native';
import colors from '@/constants/colors';

type ChatInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
};

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      Keyboard.dismiss();
    }
  };
  
  return (
    <View style={[
      styles.container, 
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      <TextInput
        style={[
          styles.input, 
          isDark ? styles.inputDark : styles.inputLight
        ]}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        placeholderTextColor={isDark ? colors.darkLightText : colors.lightText}
        multiline
        maxLength={1000}
        returnKeyType="default"
        blurOnSubmit={false}
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={[
          styles.sendButton,
          message.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
          isLoading && styles.sendButtonLoading
        ]} 
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Send size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Add shadow to make it stand out above keyboard
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  containerLight: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
  },
  containerDark: {
    backgroundColor: colors.darkBackground,
    borderTopColor: colors.darkBorder,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 120,
    borderWidth: 1,
  },
  inputLight: {
    backgroundColor: '#fff',
    color: colors.text,
    borderColor: colors.border,
  },
  inputDark: {
    backgroundColor: '#2A2C34',
    color: colors.darkText,
    borderColor: colors.darkBorder,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: colors.lightText,
  },
  sendButtonLoading: {
    backgroundColor: colors.secondary,
  },
});