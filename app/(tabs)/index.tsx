import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useChatStore } from '../../store/chatStore';
import ChatBubble from '../../components/ChatBubble';
import ChatInput from '../../components/ChatInput';
import EmptyState from '../../components/EmptyState';
import { Message } from '../../types';

export default function ChatScreen() {
  const { messages, sendMessage, isLoading } = useChatStore();
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (inputText.trim() && !isLoading) {
      await sendMessage(inputText.trim());
      setInputText('');
    }
  };

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />
      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
  },
}); 