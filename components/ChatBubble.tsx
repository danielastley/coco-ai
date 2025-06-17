import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Message } from '@/types';
import { formatTimestamp } from '@/utils/formatters';
import colors from '@/constants/colors';

type ChatBubbleProps = {
  message: Message;
};

export default function ChatBubble({ message }: ChatBubbleProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const isUser = message.role === 'user';
  
  const bubbleStyle = [
    styles.bubble,
    isUser 
      ? isDark ? styles.userBubbleDark : styles.userBubble
      : isDark ? styles.assistantBubbleDark : styles.assistantBubble,
  ];
  
  const textStyle = [
    styles.text,
    isDark ? styles.textDark : styles.textLight,
  ];
  
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message.content}</Text>
        <Text style={[styles.timestamp, isDark ? styles.timestampDark : styles.timestampLight]}>
          {formatTimestamp(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
    width: '100%',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    padding: 12,
    maxWidth: '80%',
    minWidth: 60,
  },
  userBubble: {
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.assistantBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userBubbleDark: {
    backgroundColor: colors.darkUserBubble,
    borderBottomRightRadius: 4,
  },
  assistantBubbleDark: {
    backgroundColor: colors.darkAssistantBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  textLight: {
    color: colors.text,
  },
  textDark: {
    color: colors.darkText,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampLight: {
    color: colors.lightText,
  },
  timestampDark: {
    color: colors.darkLightText,
  },
});