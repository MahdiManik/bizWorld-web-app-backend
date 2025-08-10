import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { fileUpload } from '@/lib/fileUpload';

export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<{ uri: string } | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const res = await fileUpload(result?.assets?.[0]);
      setSelectedImage({ uri: result?.assets?.[0].uri });
      setSelectedImageId(res);
    }
  };

  return { selectedImage, selectedImageId, pickImage, setSelectedImage };
};
