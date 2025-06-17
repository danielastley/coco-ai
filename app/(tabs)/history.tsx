import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useChatStore } from '../../store/chatStore';
import ConversationItem from '../../components/ConversationItem';
import EmptyState from '../../components/EmptyState';

export default function HistoryScreen() {
  const { conversations, selectConversation } = useChatStore();

  if (conversations.length === 0) {
    return <EmptyState message="No conversations yet" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => selectConversation(item.id)}
          />
        )}
        style={styles.conversationList}
        contentContainerStyle={styles.conversationListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  conversationList: {
    flex: 1,
  },
  conversationListContent: {
    padding: 16,
  },
}); 