import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditCompanyInfoFormData } from '@/feature/(modules)/account-settings/company-info/types/edit-company-info.types';
import { userOnboardingService } from '@/services/userOnboadingService';
import { fileUpload } from '@/lib/fileUpload';
import { useRouter } from 'expo-router';

type EditCompanyInfoParams = {
    id: number | string;
    data: EditCompanyInfoFormData;
    documentFile?: any;
};

export const useEditCompanyInfo = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data, documentFile }: EditCompanyInfoParams) => {
            if (documentFile) {
                const uploaded = await fileUpload(documentFile);
                data.document = uploaded.id;
            }

            const res = await userOnboardingService.updateCompany(id, data);
            return res.data;

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['me'],
            });

            router.push('/account-settings/company-info');
        }
    });
};
