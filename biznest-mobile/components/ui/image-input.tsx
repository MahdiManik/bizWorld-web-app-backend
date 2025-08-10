import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

type ImageAsset = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
};

interface ImageInputProps {
  label?: string;
  placeholder?: string;
  value?: ImageAsset | string | null;
  onChange?: (image: ImageAsset | string | null) => void;
  disabled?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  label = 'Upload Image',
  placeholder = 'No image selected',
  value,
  onChange,
  disabled = false,
}) => {
  const handlePickImage = async () => {
    if (disabled || !onChange) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageAsset: ImageAsset = {
          uri: asset.uri,
          name: asset.fileName || 'image.jpg',
          size: asset.fileSize,
          mimeType: asset.mimeType,
        };
        onChange(imageAsset);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const removeImage = () => {
    if (disabled || !onChange) return;
    onChange(null);
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getDisplayName = () => {
    if (!value) return '';
    if (typeof value === 'string') {
      // If it's a URL, extract filename
      if (value.startsWith('http')) {
        try {
          const url = new URL(value);
          const pathname = url.pathname;
          return pathname.split('/').pop() || 'Image';
        } catch {
          return 'Image';
        }
      }
      return value;
    }
    return value.name || 'Selected Image';
  };

  const getFileSize = () => {
    if (!value || typeof value === 'string') return null;
    return value.size;
  };

  const getImageUri = () => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    return value.uri;
  };

  return (
    <View className="gap-2">
      <Text className="font-roboto400 text-sm text-title">{label}</Text>
      <View
        className={`flex-row items-center gap-2 rounded-2xl border-2 border-border-10 ${disabled ? 'opacity-50' : ''}`}
      >
        <TouchableOpacity
          className="rounded-l-2xl bg-secondary px-3 py-4"
          onPress={handlePickImage}
          disabled={disabled}
        >
          <Text className="font-roboto500 text-sm text-title">Choose Image</Text>
        </TouchableOpacity>
        <TextInput
          editable={false}
          value={getDisplayName()}
          placeholder={placeholder}
          className="flex-1 px-3 py-4 font-roboto400 text-sm text-title"
        />
      </View>

      {value && (
        <View className="bg-background rounded-2xl border border-border-10 p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              {/* Image Preview */}
              <View className="w-12 h-12 rounded-lg overflow-hidden bg-border-10">
                <Image
                  source={{ uri: getImageUri()! }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              
              <View className="flex-1">
                <Text
                  className="font-roboto500 text-sm text-title"
                  numberOfLines={1}
                >
                  {getDisplayName()}
                </Text>
                {getFileSize() && (
                  <Text className="text-subtitle font-roboto400 text-xs">
                    {formatFileSize(getFileSize()!)}
                  </Text>
                )}
                {typeof value === 'string' && value.startsWith('http') && (
                  <Text className="text-subtitle font-roboto400 text-xs">
                    Remote image
                  </Text>
                )}
              </View>
            </View>
            
            <TouchableOpacity
              onPress={removeImage}
              className="bg-error/10 ml-2 rounded-full p-2"
              disabled={disabled}
            >
              <Ionicons name="close" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ImageInput;