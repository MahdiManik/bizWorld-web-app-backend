import { consultantService } from '@/services/consultantServices';
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import useSession from '@/store/session';
import {
  CreateConsultantData,
  UpdateConsultantData,
} from '../types/consultant';
import { router } from 'expo-router';
import { userService } from '@/services/userServices';

interface getConsultantsListParams {
  type: 'request' | 'your-consultants' | 'send-request';
  tab?: string;
  search?: string;
  page_size?: number;
}

export const useGetConsultantsList = ({
  type,
  tab,
  search,
  page_size = 10,
}: getConsultantsListParams) => {
  const { user } = useSession();
  const documentId = user?.documentId || '';

  return useInfiniteQuery({
    queryKey: ['consultants-list', type, tab, search, documentId, page_size],
    queryFn: ({ pageParam = 1 }) => {
      let params =
        '?populate[consultant][populate][user_profile][populate]=*&populate[request_user][populate][user_profile][populate]=*&sort[0]=createdAt:desc';
      params += `&pagination[page]=${pageParam}&pagination[pageSize]=${page_size}`;

      if (type === 'your-consultants') {
        params += `&filters[request_user][documentId][$eq]=${documentId}&filters[consultantStatus][$eq]=Approved`;
      } else if (type === 'request') {
        params += `&filters[consultant][documentId][$eq]=${documentId}`;
      } else if (type === 'send-request') {
        params += `&filters[request_user][documentId][$eq]=${documentId}&filters[consultantStatus][$eq]=Pending`;
      }

      if (tab && tab !== 'all') {
        params += `&filters[consultantStatus][$eq]=${tab}`;
      }

      if (search) {
        params += `&filters[projectScope][$contains]=${search}`;
      }
      return consultantService.getConsultantsList(params);
    },
    getNextPageParam: (lastPage, allPages) => {
      const { pagination } = lastPage?.meta || {};
      if (pagination && pagination.page < pagination.pageCount) {
        return pagination.page + 1;
      }
      return undefined;
    },
    enabled: !!documentId,
    initialPageParam: 1,
  });
};

interface getSuggestConsultantsParams {
  search?: string;
}

export const useGetSuggestConsultants = ({
  search,
}: getSuggestConsultantsParams = {}) => {
  const { user } = useSession();
  const documentId = user?.documentId?.toString() || '';

  return useQuery({
    queryKey: ['suggest-consultants', search, documentId],
    queryFn: () => {
      let params = '?populate[user_profile][populate]=*';

      if (documentId) {
        params += `&excludeRequestUser=${documentId}`;
      }
      return consultantService.getSuggestConsultants(params);
    },
  });
};

export const useCreateConsultRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createData: CreateConsultantData) =>
      consultantService.createConsultRequest(createData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultants-list'],
      });
      queryClient.invalidateQueries({
        queryKey: ['suggest-consultants'],
      });
      router.back();
    },
  });
};

export const useUpdateConsultRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updateData,
    }: {
      id: string;
      updateData: UpdateConsultantData;
    }) => consultantService.updateConsultRequest(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultants-list'],
      });
    },
  });
};
export const useDeleteConsultRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      consultantService?.deleteConsultRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultants-list'],
      });
      queryClient.invalidateQueries({
        queryKey: ['suggest-consultants'],
      });
    },
  });
};
export const useUpdateConsultantStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: () =>
      userService.updateConsultantStatus({
        id: user?.id?.toString() || '',
        consultantStatus: 'PENDING',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
      router.replace('/(modal)/consultant-application-success');
    },
  });
};
