import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import FileIcon from '@/assets/svgs/listing/FileIcon';
import Button from '@/components/ui/button';
import { AddListingFormData } from '../types/add-listing.types';
import * as DocumentPicker from 'expo-document-picker';
import PDFIcon from '@/assets/svgs/listing/PDFIcon';
import { Entypo, Feather } from '@expo/vector-icons';
interface AddListingStep3Props {
  onSubmit: () => void;
  onPrev: () => void;
}

const AddListingStep3: React.FC<AddListingStep3Props> = ({
  onSubmit,
  onPrev,
}) => {
  const { control } = useFormContext<AddListingFormData>();

  return (
    <View className="gap-4">
      <Text className="font-roboto600 text-xl text-title">
        Confidential Documents
      </Text>
      <Controller
        control={control}
        name="step3.documents"
        render={({ field: { onChange, value } }) =>
          !value?.length ? (
            <TouchableOpacity
              className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-stroke-dashed p-6"
              onPress={async () => {
                try {
                  const result = await DocumentPicker.getDocumentAsync({
                    type: '*/*',
                    copyToCacheDirectory: true,
                    multiple: true,
                  });

                  if (!result.canceled && result.assets[0]) {
                    onChange(result.assets);
                  }
                } catch (error) {
                  console.error('Error picking document:', error);
                }
              }}
            >
              <FileIcon />
              <Text className="font-roboto500 text-sm text-primary">
                Click here <Text className="text-black">to upload media</Text>
              </Text>
              <Text className="font-roboto400 text-xs text-black">
                (Max. File size: 25 MB)
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="rounded-md border border-dashed border-stroke-dashed p-4">
              <View className="flex flex-row items-center gap-2">
                {value?.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    className="relative rounded-lg bg-[#E6F5FF] p-2 pt-4"
                    onPress={() => {
                      const updatedFiles = value?.filter((_, i) => i !== index);
                      onChange(updatedFiles);
                    }}
                  >
                    <View className="absolute right-0 top-0">
                      <Entypo name="cross" size={14} color="black" />
                    </View>
                    <PDFIcon />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                className="mt-4 flex-row items-center gap-2"
                onPress={async () => {
                  try {
                    const result = await DocumentPicker.getDocumentAsync({
                      type: '*/*',
                      copyToCacheDirectory: true,
                      multiple: true,
                    });

                    if (!result.canceled && result.assets?.length) {
                      onChange([...(value || []), ...result.assets]);
                    }
                  } catch (error) {
                    console.error('Error picking document:', error);
                  }
                }}
              >
                <Feather name="upload" size={20} color="black" />
                <Text className="font-roboto400 text-sm text-primary">
                  Upload File
                </Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
      <View className="mb-20 flex flex-row justify-between">
        <Button title="Previous" onPress={onPrev} variant="outline" />
        <Button title="Submit" onPress={onSubmit} />
      </View>
    </View>
  );
};

export default AddListingStep3;
