import { useMutation } from '@tanstack/react-query';
import { Step1FormData, Step2FormData } from '../types/user-onboarding.types';
import { userOnboardingService } from '@/services/userOnboadingService';
import { useRouter } from 'expo-router';
import { useUserId } from '../../hooks/useAuth';
import { fileUpload } from '@/lib/fileUpload';

type CreateData = {
    userProfile?: Step1FormData & {
        imageFile?: any;
        documentFile?: any;
    };
    company?: Step2FormData & {
        documentFile?: any;
    };
};

export const useOnboarding = () => {
    const router = useRouter();
    const userId = useUserId();
    console.log(userId);

    return useMutation({
        mutationFn: async (data: CreateData) => {
            const result: any = {};

            if (data.userProfile) {
                const { imageFile, documentFile, ...profileData } = data.userProfile;

                if (imageFile) {
                    const uploaded = await fileUpload(imageFile);
                    profileData.image = uploaded?.id;
                }

                if (documentFile) {
                    const uploaded = await fileUpload(documentFile);
                    profileData.document = uploaded.id;
                }

                const res = await userOnboardingService.createUserProfile({ ...profileData, user: String(userId) });
                result.userProfile = res.data;
            }

            if (data.company) {
                const { documentFile, ...companyData } = data.company;

                if (documentFile) {
                    const uploadedDoc = await fileUpload(documentFile);
                    companyData.document = uploadedDoc.id;
                }

                const res = await userOnboardingService.createCompany({ ...companyData, companyUser: String(userId) });
                result.company = res.data;
            }

            router.push('/(modal)/onboarding-success');
            return result;
        },
    });
};

