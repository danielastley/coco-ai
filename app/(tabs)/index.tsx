import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useChatStore } from '@/store/chatStore';
import { useSettingsStore } from '@/store/settingsStore';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import EmptyState from '@/components/EmptyState';
import colors from '@/constants/colors';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const { 
    getCurrentConversation, 
    sendMessage, 
    createConversation,
    isLoading,
    error,
    clearError,
  } = useChatStore();
  
  const { serverUrl, isConnected } = useSettingsStore();
  
  const currentConversation = getCurrentConversation();
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);

  // Add keyboard listeners to get keyboard height
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);
  
  const handleSend = async (content: string) => {
    if (!serverUrl || !isConnected) {
      Alert.alert(
        'Server Not Configured',
        'Please configure your LM Studio server in Settings before sending messages.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => router.push('/settings') }
        ]
      );
      return;
    }
    
    await sendMessage(content);
  };
  
  const handleNewChat = () => {
    createConversation();
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Stack.Screen
        options={{
          title: currentConversation?.title || 'New Chat',
          headerRight: () => (
            <Plus
              size={24}
              color={isDark ? colors.darkText : colors.text}
              onPress={handleNewChat}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
      
      <View style={[
        styles.container,
        { paddingBottom: insets.bottom }
      ]}>
        {currentConversation && currentConversation.messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={currentConversation.messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={[
              styles.chatList,
              // Add extra padding at the bottom when keyboard is visible
              { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 60 : 0 }
            ]}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          />
        ) : (
          <EmptyState type="chat" />
        )}
        
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  chatList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
});