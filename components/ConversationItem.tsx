import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Conversation } from '../types';
import { formatDate } from '../utils/formatters';

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

export default function ConversationItem({ conversation, onPress }: ConversationItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {conversation.title || 'New Conversation'}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {conversation.messages[conversation.messages.length - 1]?.content || 'No messages yet'}
        </Text>
        <Text style={styles.date}>
          {formatDate(conversation.updatedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: '#C7C7CC',
  },
}); 