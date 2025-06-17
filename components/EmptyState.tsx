import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import colors from '@/constants/colors';

type EmptyStateProps = {
  type: 'chat' | 'history';
};

export default function EmptyState({ type }: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const messages = {
    chat: {
      title: 'Start a new conversation',
      description: 'Send a message to start chatting with your local LLM.',
    },
    history: {
      title: 'No conversations yet',
      description: 'Your chat history will appear here once you start a conversation.',
    },
  };
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer,
        isDark ? styles.iconContainerDark : styles.iconContainerLight
      ]}>
        <MessageSquare size={40} color={isDark ? colors.darkLightText : colors.lightText} />
      </View>
      <Text style={[
        styles.title,
        isDark ? styles.titleDark : styles.titleLight
      ]}>
        {messages[type].title}
      </Text>
      <Text style={[
        styles.description,
        isDark ? styles.descriptionDark : styles.descriptionLight
      ]}>
        {messages[type].description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainerLight: {
    backgroundColor: '#F0F0F0',
  },
  iconContainerDark: {
    backgroundColor: '#2A2C34',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleLight: {
    color: colors.text,
  },
  titleDark: {
    color: colors.darkText,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
  },
  descriptionLight: {
    color: colors.lightText,
  },
  descriptionDark: {
    color: colors.darkLightText,
  },
});