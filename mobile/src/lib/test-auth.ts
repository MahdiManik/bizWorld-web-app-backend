import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL
  ? `${process.env.EXPO_PUBLIC_API_URL}/api`
  : 'http://localhost:1337/api';

/**
 * Test function to verify token retrieval and authentication with Strapi
 * Use this to debug 401 Unauthorized errors
 */
export async function testAuthToken() {
  // Step 1: Retrieve the token from AsyncStorage
  console.log('=== AUTH TOKEN TEST ===');
  let token = null;
  try {
    token = await AsyncStorage.getItem('authToken');
    console.log('Token from AsyncStorage:', token ? `${token.substring(0, 15)}...` : 'NOT FOUND');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return { success: false, error: 'Failed to retrieve token from storage' };
  }

  if (!token) {
    return { success: false, error: 'No authentication token found' };
  }

  // Step 2: Test a simple authenticated GET request
  try {
    // Make request with explicit token in header
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Auth test successful!');
    console.log('User ID:', response.data?.id);
    return { success: true, data: response.data };
  } catch (error) {
    // Type guard for axios error
    if (axios.isAxiosError(error)) {
      console.error('Auth test failed:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
    // Generic error handling
    console.error('Auth test failed with unexpected error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Checks if the token is valid and returns the user ID
 * This is useful for components that need to verify authentication before proceeding
 */
export async function verifyTokenAndGetUserId() {
  try {
    const result = await testAuthToken();
    if (result.success) {
      return result.data?.id;
    }
    return null;
  } catch (error) {
    console.error('Token verification failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}
