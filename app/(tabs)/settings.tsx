import React from 'react';
import { View, StyleSheet, Text, ScrollView, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import ServerForm from '@/components/ServerForm';
import colors from '@/constants/colors';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { 
    serverUrl, 
    isConnected, 
    isLoading, 
    error,
    setServerUrl,
    testConnection,
  } = useSettingsStore();
  
  const handleSubmit = (url: string) => {
    setServerUrl(url);
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ title: 'Settings' }} />
      
      <View style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight
      ]}>
        <ServerForm
          serverUrl={serverUrl}
          isConnected={isConnected}
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmit}
          onTest={testConnection}
        />
      </View>
      
      <View style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight
      ]}>
        <Text style={[
          styles.sectionTitle,
          isDark ? styles.textDark : styles.textLight
        ]}>
          About
        </Text>
        <Text style={[
          styles.paragraph,
          isDark ? styles.textDark : styles.textLight
        ]}>
          This app connects to a locally hosted LLM using LM Studio. Make sure LM Studio is running on your computer with the API server enabled.
        </Text>
        <Text style={[
          styles.paragraph,
          isDark ? styles.textDark : styles.textLight
        ]}>
          To use this app:
        </Text>
        <Text style={[
          styles.listItem,
          isDark ? styles.textDark : styles.textLight
        ]}>
          1. Open LM Studio on your computer
        </Text>
        <Text style={[
          styles.listItem,
          isDark ? styles.textDark : styles.textLight
        ]}>
          2. Load a model in LM Studio
        </Text>
        <Text style={[
          styles.listItem,
          isDark ? styles.textDark : styles.textLight
        ]}>
          3. Enable the API server in LM Studio (Local Server tab)
        </Text>
        <Text style={[
          styles.listItem,
          isDark ? styles.textDark : styles.textLight
        ]}>
          4. Enter the server URL in the settings above (e.g., http://192.168.1.100:1234)
        </Text>
        <Text style={[
          styles.listItem,
          isDark ? styles.textDark : styles.textLight
        ]}>
          5. Test the connection and start chatting!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardLight: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1E2533',
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listItem: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingLeft: 24,
  },
  textLight: {
    color: colors.text,
  },
  textDark: {
    color: colors.darkText,
  },
});