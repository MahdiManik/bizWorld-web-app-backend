import { Step1FormData, Step2FormData } from '@/feature/(auth)/user-onboarding/types/user-onboarding.types';
import { EditCompanyInfoFormData } from '@/feature/(modules)/account-settings/company-info/types/edit-company-info.types';
import {  PartialEditPersonalInfoFormData } from '@/feature/(modules)/account-settings/personal-info/types/edit-personal-info.types';
import api from '@/lib/axios';

type UserProfileUpdatePayload = Omit<PartialEditPersonalInfoFormData, 'fullName' | 'email'>;

export const userOnboardingService = {
    // Get user profile by ID
    getUserProfile: (id: number | string) => {
        return api.get(`/user-profiles/${id}`);
    },
    createUserProfile: (data: Step1FormData) => {
        return api.post('/user-profiles', { data });
    },

    createCompany: (data: Step2FormData) => {
        return api.post('/companies', { data });
    },

    updateUserProfile: (id: number | string, data: UserProfileUpdatePayload) => {
        return api.put(`/user-profiles/${id}`, { data });
    },

    updateCompany: (id: number | string, data: EditCompanyInfoFormData) => {
        return api.put(`/companies/${id}`, { data });
    },
};
