import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PartialEditPersonalInfoFormData } from '@/feature/(modules)/account-settings/personal-info/types/edit-personal-info.types';
import { userOnboardingService } from '@/services/userOnboadingService';
import { userService } from '@/services/userServices';
import { fileUpload } from '@/lib/fileUpload';
import { useRouter } from 'expo-router';

export interface EditPersonalInfoParams {
  id: number | string;
  userId: number | string;
  data: PartialEditPersonalInfoFormData;
  imageFile?: any;
  documentFile?: any;
}

export const useEditPersonalInfo = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userId,
      data,
      imageFile,
      documentFile,
    }: EditPersonalInfoParams) => {
      if (imageFile) {
        const uploaded = await fileUpload(imageFile);
        data.image = uploaded.id;
      }

      if (documentFile) {
        const uploaded = await fileUpload(documentFile);
        data.document = uploaded.id;
      }

      const { fullName, email, ...profileData } = data;

      if (fullName || email) {
        await userService.updateUserById(Number(userId), { fullName, email });
      }
      
      const res = await userOnboardingService.updateUserProfile(
        id,
        profileData
      );
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });

      router.push('/account-settings/personal-info');
    },
  });
};
