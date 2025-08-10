import api from '@/lib/axios';
import { Me } from '@/types/user';

export const userService = {
  getMe: (): Promise<{ data: Me }> => {
    return api.get('/users/me', {
      params: {
        populate: {
          user_profile: {
            populate: ['image', 'document'],
          },
          company: {
            populate: ['document'],
          },
        },
      },
    });
  },

  updateUserById: (
    id: number | string,
    data: { email?: string; fullName?: string }
  ) => {
    return api.put(`/users/${id}`, { ...data });
  },

  updateInvestorUserStatus: (id: string, investerStatus: string) => {
    return api.put(`/users/${id}`, {
      investerStatus,
    });
  },
  updateConsultantStatus: ({
    id,
    consultantStatus,
  }: {
    id: string;
    consultantStatus: string;
  }) => {
    return api.put(`/users/${id}`, {
      consultantStatus,
    });
  },
};
