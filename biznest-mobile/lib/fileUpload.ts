import axios from 'axios';

export const fileUpload = async (file: any) => {
  console.log('Uploading file:', file);
  const api = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:1337/api';
  const formData = new FormData();
  formData.append('files', file.file);

  try {
    const response = await axios.post(`${api}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data[0].id;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};
