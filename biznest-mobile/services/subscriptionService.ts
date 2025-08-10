import api from '@/lib/axios';

export const userSubscriptionService = {
  getByUserProfileId: async (userProfileId: string | number) => {
    const response = await api.get(
      `/user-subscriptions?filters[userProfile][id][$eq]=${userProfileId}&populate=userProfile&populate=subscription`
    );
    return response.data;
  },
};
