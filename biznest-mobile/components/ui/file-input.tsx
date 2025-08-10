import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

interface FileInputProps {
  label?: string;
  placeholder?: string;
  value?: DocumentPicker.DocumentPickerAsset | string | null;
  onChange?: (file: DocumentPicker.DocumentPickerAsset | string | null) => void;
  disabled?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  label = 'Upload Document',
  placeholder = 'No file selected',
  value,
  onChange,
  disabled = false,
}) => {
  const handlePickDocument = async () => {
    if (disabled || !onChange) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const removeDocument = () => {
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
          return pathname.split('/').pop() || 'Document';
        } catch {
          return 'Document';
        }
      }
      return value;
    }
    return value.name;
  };

  const getFileSize = () => {
    if (!value || typeof value === 'string') return null;
    return value.size;
  };

  return (
    <View className="gap-2">
      <Text className="font-roboto400 text-sm text-title">{label}</Text>
      <View
        className={`flex-row items-center gap-2 rounded-2xl border-2 border-border-10 ${disabled ? 'opacity-50' : ''}`}
      >
        <TouchableOpacity
          className="rounded-l-2xl bg-secondary px-3 py-4"
          onPress={handlePickDocument}
          disabled={disabled}
        >
          <Text className="font-roboto500 text-sm text-title">Choose File</Text>
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
                  Remote file
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={removeDocument}
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

export default FileInput;