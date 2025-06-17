import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';
import ServerForm from '../../components/ServerForm';

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <ScrollView style={styles.container}>
      <ServerForm
        settings={settings}
        onSave={updateSettings}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
}); 