import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { testAuthToken } from '@/lib/test-auth';

/**
 * Debug component that helps diagnose authentication issues
 * with Strapi backend
 */
export default function AuthDebug() {
  const [token, setToken] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load token on component mount
  useEffect(() => {
    loadToken();
  }, []);

  // Get token from AsyncStorage
  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      setToken(storedToken);
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  };

  // Test token validity
  const runAuthTest = async () => {
    setIsLoading(true);
    try {
      const result = await testAuthToken();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format token for display
  const formatToken = (token: string | null) => {
    if (!token) return 'No token found';
    if (token.length <= 15) return token;
    return `${token.substring(0, 15)}...${token.substring(token.length - 5)}`;
  };

  // Format JSON for display
  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Authentication Debugger</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stored Token</Text>
        <Text style={styles.tokenText}>{formatToken(token)}</Text>
        <Text style={styles.label}>Token Length: {token?.length || 0} characters</Text>
        <Text style={styles.label}>
          Token Format: {token?.startsWith('eyJ') ? 'Looks like JWT' : 'Unknown format'}
        </Text>
        <Button title="Reload Token" onPress={loadToken} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Authentication Test</Text>
        <Button 
          title={isLoading ? "Testing..." : "Test Token with Strapi"}
          onPress={runAuthTest}
          disabled={isLoading || !token}
        />
        
        {testResult && (
          <View style={styles.resultContainer}>
            <Text style={[
              styles.resultStatus,
              testResult.success ? styles.success : styles.failure
            ]}>
              Status: {testResult.success ? 'SUCCESS' : 'FAILED'}
            </Text>
            
            {testResult.success ? (
              <>
                <Text style={styles.label}>User ID: {testResult.data?.id}</Text>
                <Text style={styles.label}>Username: {testResult.data?.username}</Text>
                <Text style={styles.label}>Email: {testResult.data?.email}</Text>
              </>
            ) : (
              <>
                <Text style={styles.label}>Error: {testResult.error}</Text>
                {testResult.status && (
                  <Text style={styles.label}>Status: {testResult.status}</Text>
                )}
                {testResult.details && (
                  <View style={styles.jsonContainer}>
                    <Text style={styles.jsonLabel}>Response Details:</Text>
                    <Text style={styles.json}>{formatJson(testResult.details)}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Troubleshooting Tips</Text>
        <Text style={styles.tip}>1. Token should be a valid JWT (starting with 'eyJ')</Text>
        <Text style={styles.tip}>2. API should respond with 200 status and user data</Text>
        <Text style={styles.tip}>3. 401 errors mean token is invalid or expired</Text>
        <Text style={styles.tip}>4. Try logging out and back in to refresh token</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tokenText: {
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  resultContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  success: {
    color: 'green',
  },
  failure: {
    color: 'red',
  },
  jsonContainer: {
    marginTop: 8,
  },
  jsonLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  json: {
    fontFamily: 'monospace',
    fontSize: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  tip: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  }
});
