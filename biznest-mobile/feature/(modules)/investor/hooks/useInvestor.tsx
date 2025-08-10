import { interestListingService } from '@/services/interestListingService';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

// export const useInvestorUsers = (userId: number) => {
//   return useQuery({
//     queryKey: ['interest', userId],
//     queryFn: () => interestListingService.getInterest(userId),
//     select: (res) => res.data,
//     enabled: !!userId,
//   });
// };

export const useInvestorUsers = ({
  userId,
  page_size = 10,
}: {
  userId: number;
  page_size?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ['interest', userId, page_size],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await interestListingService.getInterest(
        userId,
        pageParam,
        page_size
      );
      console.log('Fetched page:', pageParam, res);
      return res;
    },
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.data.meta.pagination;
      if (page < pageCount) {
        return page + 1;
      }
      return undefined;
    },
    enabled: !!userId,
    initialPageParam: 1,
  });
};

export const useUpdateInterestStatus = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      remark,
    }: {
      id: number | string;
      status: 'Approved' | 'Pending' | 'Rejected';
      remark: string;
    }) => interestListingService.updateStatus(id, status, remark),

    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Status updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['interest', userId] });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: 'Failed to update status' });
    },
  });
};
