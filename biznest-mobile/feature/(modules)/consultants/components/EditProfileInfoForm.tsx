import { View, Text } from 'react-native';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  EditProfileFormData,
  EditProfileInfoSchema,
} from '../types/edit-profile-info.types';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/input';
import DropDown from '@/components/ui/drop-down';
import Button from '@/components/ui/button';
import { router, useLocalSearchParams } from 'expo-router';
import { useCreateConsultRequest } from '../hooks/useConsultant';
import useSession from '@/store/session';

const EditProfileInfoForm = () => {
  const { user } = useSession();
  const { consultant } = useLocalSearchParams();
  const { mutateAsync } = useCreateConsultRequest();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(EditProfileInfoSchema),
    defaultValues: {
      project_scope: '',
      budget: '',
      timeline: '',
    },
  });
  const onSubmit: SubmitHandler<EditProfileFormData> = async (data) => {
    mutateAsync({
      budget: data?.budget,
      projectScope: data?.project_scope,
      consultant: consultant?.toString(),
      consultantStatus: 'Pending',
      request_user: user?.documentId?.toString() || '',
      timeline: data?.timeline,
    });
  };
  return (
    <View className="gap-3 py-3">
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">Project Scope</Text>
        <Controller
          control={control}
          name="project_scope"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Describe what you need help with..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              error={errors.project_scope?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">Budget</Text>
        <Controller
          control={control}
          name="budget"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="eg. $1,000 - $5,000"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.budget?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">Timeline</Text>
        <Controller
          control={control}
          name="timeline"
          render={({ field: { onChange, onBlur, value } }) => (
            <DropDown
              onChange={onChange}
              value={value}
              placeholder="Timeline"
              data={[
                {
                  label: 'Urgent (within 1 week)',
                  value: 'Urgent (within 1 week)',
                },
              ]}
            />
          )}
        />
      </View>
      <View className="gap-2 bg-bd_tech_secondary px-3 py-2">
        <Text className="font-roboto500 text-sm text-primary">
          What happens next?
        </Text>
        <Text className="font-roboto400 text-sm text-primary">
          After submitting your request, the consultant will review your project
          details and respond within 48 hours. You'll be notified when they
          accept, or request more information.
        </Text>
      </View>
      <View className="mt-4 flex-row gap-2">
        <Button
          title="Cancel"
          onPress={() => router.back}
          className="flex-1 justify-center"
          variant="outline"
        />
        <Button
          title="Submit Request"
          onPress={handleSubmit(onSubmit)}
          className="flex-1 justify-center"
        />
      </View>
    </View>
  );
};

export default EditProfileInfoForm;
