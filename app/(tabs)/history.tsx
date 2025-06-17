import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useChatStore } from '@/store/chatStore';
import ConversationItem from '@/components/ConversationItem';
import EmptyState from '@/components/EmptyState';

export default function HistoryScreen() {
  const router = useRouter();
  const { 
    conversations, 
    loadConversation, 
    deleteConversation,
    currentConversationId,
  } = useChatStore();
  
  const handleConversationPress = (id: string) => {
    loadConversation(id);
    router.push('/');
  };
  
  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => deleteConversation(id),
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Conversation History' }} />
      
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              onPress={handleConversationPress}
              onDelete={handleDelete}
              isActive={item.id === currentConversationId}
            />
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        <EmptyState type="history" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
  },
});