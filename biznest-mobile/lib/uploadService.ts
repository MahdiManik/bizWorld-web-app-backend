import api from './axios';

export interface MediaFile {
  uri: string;
  name: string;
  type: string;
}

export async function uploadMediaToStrapi(file: MediaFile) {
  try {
    const formData = new FormData();

    const response = await fetch(file.uri);
    const blob = await response.blob();

    // ✅ Detect fallback extension based on MIME type
    const mimeType = file.type || blob.type || 'application/octet-stream';
    let ext = 'bin';
    if (mimeType === 'image/jpeg') ext = 'jpg';
    else if (mimeType === 'image/png') ext = 'png';
    else if (mimeType === 'application/pdf') ext = 'pdf';
    else if (mimeType.includes('/')) ext = mimeType.split('/')[1];

    // ✅ Safe filename if not provided
    const safeFileName = file.name || `upload-${Date.now()}.${ext}`;

    // ✅ Create File object for web compatibility
    const fileObj = new File([blob], safeFileName, {
      type: mimeType,
    });

    formData.append('files', fileObj);

    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const responseData = res.data?.data || res.data;
    return Array.isArray(responseData) ? responseData[0] : responseData;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
}
