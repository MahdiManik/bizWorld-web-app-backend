import { View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Step1 from './Step1';
import Step2 from './Step2';
import cn from '@/lib/utils';
import {
  userOnboardingSchema,
  UserOnboardingFormData,
} from '../types/user-onboarding.types';
import { useOnboarding } from '../hooks/useOnboarding';
import { fileUpload } from '@/lib/fileUpload';
import Toast from 'react-native-toast-message';

const UserOnboardingForm = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<{ uri: string } | null>(
    null
  );
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [step1Data, setStep1Data] =
    useState<Partial<UserOnboardingFormData> | null>(null);

  const { mutate } = useOnboarding();

  const methods = useForm<UserOnboardingFormData>({
    resolver: zodResolver(userOnboardingSchema),
    mode: 'onChange',
    defaultValues: {
      image: null,
      professionalHeadline: '',
      industrySpecialization: '',
      areasOfExpertise: [],
      portfolioLink: '',
      phonePrefix: '+65',
      phone: '',
      document: null,
      name: '',
      industry: '',
      location: '',
      companyStatus: true,
      revenue: '',
      companyDocument: null,
      description: '',
      introduction: '',
      companySize: '',
    },
  });

  const { handleSubmit } = methods;

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
      methods.setValue('image', res);
    }
  };

  const onSubmit = async (step2Data: UserOnboardingFormData) => {
    if (!step1Data) return;

    let userDocumentId = null;
    if (step2Data.document && step2Data.document.uri) {
      const { uri, file } = step2Data.document;
      const uploadPayload = { uri, file };
      const uploaded = await fileUpload(uploadPayload);
      userDocumentId = uploaded;
    }

    let companyDocumentId = null;
    if (step2Data.companyDocument && step2Data.companyDocument.uri) {
      const { uri, file } = step2Data.companyDocument;
      const uploadPayload = { uri, file };
      const uploaded = await fileUpload(uploadPayload);
      companyDocumentId = uploaded;
    }

    mutate({
      userProfile: {
        image: selectedImageId,
        phonePrefix: step2Data.phonePrefix,
        professionalHeadline: step2Data.professionalHeadline || '',
        industrySpecialization: step2Data.industrySpecialization || '',
        areasOfExpertise: step2Data.areasOfExpertise || [],
        portfolioLink: step2Data.portfolioLink || '',
        introduction: step2Data.introduction,
        phone: step2Data.phone,
        document: userDocumentId,
      },
      company: {
        name: step2Data.name,
        industry: step2Data.industry,
        location: step2Data.location,
        companyStatus: step2Data.companyStatus,
        revenue: step2Data.revenue,
        document: companyDocumentId,
        companySize: step2Data.companySize,
        description: step2Data.description,
      },
    });
  };

  const nextStep = async () => {
    if (step === 1) {
      const values = methods.getValues();
      if (!values.image) {
        Toast.show({ type: 'error', text1: 'Image is required' });
        return;
      }
      if (!values.document) {
        Toast.show({ type: 'error', text1: 'Document is required' });
        return;
      }
      if (!values.introduction) {
        Toast.show({ type: 'error', text1: 'introduction is required' });
        return;
      }
      const requiredFields = [
        'professionalHeadline',
        'industrySpecialization',
        'areasOfExpertise',
        'portfolioLink',
        'phonePrefix',
        'phone',
      ] as const;

      const isValid = await methods.trigger(requiredFields);

      if (isValid) {
        // collect and store data
        setStep1Data(methods.getValues());
        setStep(2);
      } else {
        Toast.show({
          type: 'error',
          text1: 'All fields not filled',
        });
      }
    } else {
      console.log('clicking submit');
      handleSubmit(onSubmit)();
    }
  };

  return (
    <FormProvider {...methods}>
      <View className="gap-2">
        <View className="flex-col items-center gap-4">
          <View className="mb-2 flex-row gap-2">
            <View
              className={cn(
                'h-2 w-2 rounded-full',
                step === 1 ? 'bg-primary' : 'bg-[#B0B0B0]'
              )}
            />
            <View
              className={cn(
                'h-2 w-2 rounded-full',
                step === 2 ? 'bg-primary' : 'bg-[#B0B0B0]'
              )}
            />
          </View>

          <TouchableOpacity onPress={pickImage} className="relative">
            <View className="h-20 w-20 overflow-hidden rounded-full shadow-lg">
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage.uri }
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
        {step === 1 ? (
          <Step1 onNext={nextStep} />
        ) : (
          <Step2 onSubmit={nextStep} />
        )}
      </View>
    </FormProvider>
  );
};

export default UserOnboardingForm;
