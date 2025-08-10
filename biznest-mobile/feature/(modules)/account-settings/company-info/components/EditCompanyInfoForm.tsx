import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/input';
import FileInput from '@/components/ui/file-input';
import Button from '@/components/ui/button';
import { router } from 'expo-router';
import RadioButton from '@/components/ui/radio-button';
import {
  editCompanyInfoSchema,
  EditCompanyInfoFormData,
} from '../types/edit-company-info.types';
import { useEditCompanyInfo } from '../hooks/useEditCompanyInfo';
import { fileUpload } from '@/lib/fileUpload';
import { useEditPersonalInfo } from '../../personal-info/hooks/useEditPersonalInfo';

import { useImagePicker } from '../../personal-info/hooks/useImagePicker';

import { Company, UserProfile } from '@/types/user';
import { useUserId } from '@/feature/(auth)/hooks/useAuth';

const EditCompanyInfoForm = ({
  company,
  profile,
}: {
  company: Company;
  profile: UserProfile;
}) => {
  const { mutateAsync } = useEditCompanyInfo();
  const { mutateAsync: editPersonalInfo } = useEditPersonalInfo();
  const { selectedImage, selectedImageId, pickImage } = useImagePicker();
  const userId = useUserId();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditCompanyInfoFormData>({
    resolver: zodResolver(editCompanyInfoSchema),
    defaultValues: {
      name: company?.name || '',
      companyStatus: company?.companyStatus === true ? 'active' : 'closing',
      location: company?.location || '',
      description: company?.description || '',
      document:
        company?.document?.id && company?.document?.url
          ? {
              uri: company?.document?.url,
              name: company?.document?.name,
              type: company?.document?.mimeType,
            }
          : null,
    },
  });

  const onSubmit = async (data: EditCompanyInfoFormData) => {
    let documentId = company?.document?.id || null;

    if (
      data.document &&
      data.document.uri &&
      data.document.uri !== company?.document?.url
    ) {
      const { uri, file } = data.document;
      const uploadPayload = {
        uri,
        file,
      };

      const uploaded = await fileUpload(uploadPayload);
      documentId = uploaded;
    }

    const payload: EditCompanyInfoFormData = {
      ...data,
      companyStatus: data.companyStatus === 'active',
      document: documentId,
    };

    if (selectedImageId) {
      await editPersonalInfo({
        id: profile?.documentId,
        userId: Number(userId), // ✅ add this line
        data: {
          image: selectedImageId,
        },
      });
    }

    await mutateAsync({
      data: {
        ...payload,
      },
      id: company?.documentId || '',
    });
  };

  return (
    <View className="my-10">
      <View className="gap-4 rounded-lg border-[0.5px] border-stroke-border bg-white p-4">
        <View className="flex-col items-center">
          <TouchableOpacity onPress={pickImage} className="relative">
            <View className="h-20 w-20 overflow-hidden rounded-full shadow-lg">
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage.uri }
                    : profile?.image?.url
                      ? { uri: profile.image.url }
                      : require('@/assets/images/consultants.png')
                }
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
            <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary">
              <MaterialIcons name="edit" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Company Name *
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter company name"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors?.name?.message}
              />
            )}
          />
        </View>
        <View className="gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Company Status
          </Text>
          <Controller
            control={control}
            name="companyStatus"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-4">
                <RadioButton
                  value={value === 'active'}
                  onPress={() => onChange('active')}
                  label="Active"
                />
                <RadioButton
                  value={value === 'closing'}
                  onPress={() => onChange('closing')}
                  label="Closing"
                />
              </View>
            )}
          />
          {errors.companyStatus && (
            <Text className="text-red-500 font-roboto400 text-xs">
              {errors.companyStatus.message?.toString()}
            </Text>
          )}
        </View>
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">Location *</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter location"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors?.location?.message?.toString()}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="document"
          render={({ field: { onChange, value } }) => (
            <FileInput
              label="Upload Document"
              placeholder="Select a file to upload"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter company description"
                className="bg-white"
                multiline
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </View>
      </View>
      <View className="my-4 flex-row gap-2">
        <Button
          title="Cancel"
          onPress={() => router.back()}
          className="flex-1 justify-center"
          variant="outline"
          fullWidth
        />
        <Button
          title="Save"
          onPress={handleSubmit(onSubmit)}
          className="flex-1 justify-center"
          fullWidth
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
};

export default EditCompanyInfoForm;
