import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Conversation } from '@/types';
import { formatDate, truncateText } from '@/utils/formatters';
import colors from '@/constants/colors';

type ConversationItemProps = {
  conversation: Conversation;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
  isActive?: boolean;
};

export default function ConversationItem({ 
  conversation, 
  onPress, 
  onDelete,
  isActive = false,
}: ConversationItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const lastMessage = conversation.messages.length > 0 
    ? conversation.messages[conversation.messages.length - 1] 
    : null;
  
  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete(conversation.id);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
        isActive && (isDark ? styles.activeContainerDark : styles.activeContainerLight)
      ]}
      onPress={() => onPress(conversation.id)}
    >
      <View style={styles.content}>
        <Text 
          style={[
            styles.title,
            isDark ? styles.titleDark : styles.titleLight,
            isActive && styles.activeText
          ]}
          numberOfLines={1}
        >
          {conversation.title}
        </Text>
        
        {lastMessage && (
          <Text 
            style={[
              styles.preview,
              isDark ? styles.previewDark : styles.previewLight
            ]}
            numberOfLines={1}
          >
            {lastMessage.role === 'user' ? 'You: ' : 'AI: '}
            {truncateText(lastMessage.content, 40)}
          </Text>
        )}
        
        <Text 
          style={[
            styles.date,
            isDark ? styles.dateDark : styles.dateLight
          ]}
        >
          {formatDate(conversation.updatedAt)}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDelete}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Trash2 
          size={18} 
          color={isDark ? colors.darkLightText : colors.lightText} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  containerLight: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
  },
  containerDark: {
    backgroundColor: colors.darkBackground,
    borderBottomColor: colors.darkBorder,
  },
  activeContainerLight: {
    backgroundColor: '#E8F0FB',
  },
  activeContainerDark: {
    backgroundColor: '#2D3748',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleLight: {
    color: colors.text,
  },
  titleDark: {
    color: colors.darkText,
  },
  activeText: {
    color: colors.primary,
  },
  preview: {
    fontSize: 14,
    marginBottom: 4,
  },
  previewLight: {
    color: colors.lightText,
  },
  previewDark: {
    color: colors.darkLightText,
  },
  date: {
    fontSize: 12,
  },
  dateLight: {
    color: colors.lightText,
  },
  dateDark: {
    color: colors.darkLightText,
  },
  deleteButton: {
    padding: 8,
  },
});