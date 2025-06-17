import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  useColorScheme,
  Alert,
} from 'react-native';
import colors from '@/constants/colors';

type ServerFormProps = {
  serverUrl: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (url: string) => void;
  onTest: () => void;
};

export default function ServerForm({ 
  serverUrl, 
  isConnected, 
  isLoading, 
  error, 
  onSubmit, 
  onTest 
}: ServerFormProps) {
  const [url, setUrl] = useState(serverUrl);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  useEffect(() => {
    setUrl(serverUrl);
  }, [serverUrl]);
  
  const handleSubmit = () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a server URL');
      return;
    }
    
    // Add http:// prefix if missing
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `http://${formattedUrl}`;
    }
    
    onSubmit(formattedUrl);
  };
  
  return (
    <View style={styles.container}>
      <Text style={[
        styles.label,
        isDark ? styles.labelDark : styles.labelLight
      ]}>
        LM Studio Server URL
      </Text>
      
      <TextInput
        style={[
          styles.input,
          isDark ? styles.inputDark : styles.inputLight
        ]}
        value={url}
        onChangeText={setUrl}
        placeholder="http://127.0.0.1:1234"
        placeholderTextColor={isDark ? colors.darkLightText : colors.lightText}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            !url.trim() && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={!url.trim() || isLoading}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.button,
            styles.testButton,
            !url.trim() && styles.disabledButton
          ]}
          onPress={onTest}
          disabled={!url.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Test Connection</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : isConnected ? (
        <Text style={styles.successText}>Connected successfully!</Text>
      ) : null}
      
      <Text style={[
        styles.helpText,
        isDark ? styles.helpTextDark : styles.helpTextLight
      ]}>
        Enter the URL of your LM Studio server. Make sure LM Studio is running and the API server is enabled.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelLight: {
    color: colors.text,
  },
  labelDark: {
    color: colors.darkText,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  inputLight: {
    backgroundColor: '#fff',
    borderColor: colors.border,
    color: colors.text,
  },
  inputDark: {
    backgroundColor: '#2A2C34',
    borderColor: colors.darkBorder,
    color: colors.darkText,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  testButton: {
    backgroundColor: colors.secondary,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  successText: {
    color: colors.success,
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
  },
  helpTextLight: {
    color: colors.lightText,
  },
  helpTextDark: {
    color: colors.darkLightText,
  },
});