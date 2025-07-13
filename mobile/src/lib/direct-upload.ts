import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL
  ? `${process.env.EXPO_PUBLIC_API_URL}/api`
  : 'http://localhost:1337/api';

/**
 * Direct implementation of file upload to Strapi that works with React Native
 * This simpler implementation matches the Postman flow exactly
 * 
 * @param file Object with uri, name, and type from DocumentPicker
 * @param fieldName Field name for the form data (default: 'files')
 * @param folder Optional folder path
 * @param token Optional explicit token
 * @returns The uploaded file data from Strapi
 */
export async function directUploadToStrapi(
  file: { uri: string; name: string; type: string },
  fieldName: string = 'files',
  folder: string = '',
  token?: string
): Promise<any> {
  // Get token if not provided
  if (!token) {
    token = await AsyncStorage.getItem('authToken');
  }
  
  console.log('Direct upload with file:', {
    uri: file.uri,
    name: file.name,
    type: file.type,
    folder
  });

  // Step 1: Fetch the file content as a binary blob
  console.log('Fetching file from URI...');
  const fileResponse = await fetch(file.uri);
  const blob = await fileResponse.blob();
  console.log('Successfully converted to blob');

  // Step 2: Create FormData with exact structure Strapi expects
  const formData = new FormData();
  
  // Add the file with the field name 'files' (critical!)
  formData.append(fieldName, blob, file.name);
  
  // Add optional reference fields if needed
  if (folder) {
    formData.append('ref', `api::${folder}.${folder}`);
    formData.append('field', folder);
  }
  
  // Step 3: Send with proper headers (exactly like Postman)
  console.log(`Uploading to ${API_BASE_URL}/upload via direct approach`);
  
  const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      // Let fetch set the content type with boundary
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: formData
  });
  
  // Parse the response
  const responseData = await uploadResponse.json();
  
  // Check for errors in response
  if (!uploadResponse.ok) {
    console.error('Upload failed:', responseData);
    throw new Error(responseData.error?.message || 'Upload failed');
  }
  
  // Return the first file if it's an array
  return Array.isArray(responseData) ? responseData[0] : responseData;
}

/**
 * Helper function to extract the file ID from an uploaded file
 * @param file The file data returned from directUploadToStrapi
 * @returns The file ID as a number
 */
export function getUploadedFileId(file: any): number {
  if (!file) return 0;
  return file?.id;
}
