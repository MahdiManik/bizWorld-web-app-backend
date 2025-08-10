// hooks/useGetUserSubscription.ts

import { useQuery } from '@tanstack/react-query';
import { userSubscriptionService } from '@/services/subscriptionService';

export const useGetUserSubscription = (userProfileId: string | number) => {
  return useQuery({
    queryKey: ['user-subscription', userProfileId],
    queryFn: () => userSubscriptionService.getByUserProfileId(userProfileId),
    enabled: !!userProfileId,
  });
};
