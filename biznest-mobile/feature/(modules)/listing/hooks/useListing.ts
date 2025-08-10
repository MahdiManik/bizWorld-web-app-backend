import { CreateInvestListing } from './../types/apply-investor';
import { listingService } from '@/services/listingServices';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { userService } from '@/services/userServices';
import useSession from '@/store/session';
import { CreateListing } from '../types/create-listing';
import { router } from 'expo-router';

interface getListingParams {
  type: 'browse' | 'my-listing';
  tab: string;
  search?: string;
  isDashboard?: boolean;
  page?: number;
  page_size?: number;
  listingStatus?: string;
}
export const useGetListing = ({
  tab,
  type,
  search,
  isDashboard,
  page_size = 10,
  listingStatus,
}: getListingParams) => {
  const { user } = useSession();
  const documentId = user?.documentId?.toString() || '';

  return useInfiniteQuery({
    queryKey: [
      'listing',
      type,
      tab,
      search,
      documentId,
      isDashboard,
      page_size,
      listingStatus,
    ],
    queryFn: ({ pageParam = 1 }) => {
      let params =
        type === 'browse'
          ? `?populate=*&filters[listingStatus][$eq]=APPROVED&filters[businessOwner][documentId][$ne]=${documentId}&sort[0]=createdAt:desc`
          : `?populate=*&filters[businessOwner][documentId][$eq]=${documentId}&sort[0]=createdAt:desc`;

      // Add pagination parameters
      if (isDashboard) {
        params += `&pagination[page]=${pageParam}&pagination[pageSize]=2`;
      } else {
        params += `&pagination[page]=${pageParam}&pagination[pageSize]=${page_size}`;
      }
      if (type === 'my-listing' && !!listingStatus && listingStatus !== 'all') {
        params += `&filters[listingStatus][$eq]=${listingStatus}`;
      }

      if (tab !== 'all') {
        params += `&filters[category][$eq]=${tab}`;
      }
      if (search) {
        params += `&filters[title][$contains]=${search}`;
      }

      return listingService.getListing(params);
    },
    getNextPageParam: (lastPage, allPages) => {
      const { pagination } = lastPage.meta;
      if (pagination.page < pagination.pageCount) {
        return pagination.page + 1;
      }
      return undefined;
    },
    enabled: !!documentId,
    initialPageParam: 1,
  });
};
export const useActiveListing = () => {
  return useQuery({
    queryKey: ['active-listing'],
    queryFn: () =>
      listingService?.getListing(
        '?populate=*&filters[listingStatus][$eq]=APPROVED'
      ),
  });
};

interface myInterestListing {
  tab: string;
  search?: string;
  page_size?: number;
}
export const useGetMyInterestListing = ({
  tab,
  search,
  page_size = 10,
}: myInterestListing) => {
  const { user } = useSession();
  const documentId = user?.documentId || user?.id || '';

  return useInfiniteQuery({
    queryKey: ['my-interest', tab, search, page_size],
    queryFn: ({ pageParam = 1 }) => {
      let params = `?populate[listing][populate]=*&populate[interestedUsers][populate]=*&filters[interestedUsers][documentId][$eq]=${documentId}&sort[0]=createdAt:desc`;
      params += `&pagination[page]=${pageParam}&pagination[pageSize]=${page_size}`;

      if (tab !== 'all') {
        params += `&filters[investStatus][$eq]=${tab}`;
      }

      if (search) {
        params += `&filters[listing][title][$contains]=${search}`;
      }

      return listingService.getMyInterestListing(params);
    },
    getNextPageParam: (lastPage, allPages) => {
      const { pagination } = lastPage.meta;
      if (pagination.page < pagination.pageCount) {
        return pagination.page + 1;
      }
      return undefined;
    },
    enabled: !!documentId,
    initialPageParam: 1,
  });
};

export const useGetFavouriteListing = ({
  search,
  page_size = 10,
}: {
  search?: string;
  page_size?: number;
}) => {
  const { user } = useSession();
  const documentId = user?.documentId || user?.id || '';

  return useInfiniteQuery({
    queryKey: ['favourite-listing', search, page_size],
    queryFn: ({ pageParam = 1 }) => {
      let params = `?populate=*&filters[likedUser][documentId][$eq]=${documentId}&sort[0]=createdAt:desc`;
      params += `&pagination[page]=${pageParam}&pagination[pageSize]=${page_size}`;

      if (search) {
        params += `&filters[title][$contains]=${search}`;
      }

      return listingService.getListing(params);
    },
    getNextPageParam: (lastPage, allPages) => {
      const { pagination } = lastPage.meta;
      if (pagination.page < pagination.pageCount) {
        return pagination.page + 1;
      }
      return undefined;
    },
    enabled: !!documentId,
    initialPageParam: 1,
  });
};
export const useLikeandUnlikeListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, likedUser }: { id: string; likedUser: string[] }) =>
      listingService.likeAndUnLikeListing(id, likedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listing'],
      });
      queryClient.invalidateQueries({
        queryKey: ['my-interest'],
      });
      queryClient.invalidateQueries({
        queryKey: ['favourite-listing'],
      });
      queryClient.invalidateQueries({
        queryKey: ['listing-detail'],
      });
    },
  });
};
export const useGetListingDetail = (id: string) => {
  return useQuery({
    queryKey: ['listing-detail', id],
    queryFn: () => listingService.getListingDetail(id),
    enabled: !!id,
  });
};
export const useCreateInvestorListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvestListing) =>
      listingService.createInterestListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listing'],
      });
      queryClient.invalidateQueries({
        queryKey: ['my-interest'],
      });
      queryClient.invalidateQueries({
        queryKey: ['listing-detail'],
      });
    },
  });
};

export const useUpdateInvestorStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      userService.updateInvestorUserStatus(id, 'PENDING'),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
  });
};
export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (create: CreateListing) => listingService.createListing(create),
    onSuccess: () => {
      router.push('/(modal)/listing-success');
      queryClient.invalidateQueries({
        queryKey: ['listing'],
      });
    },
  });
};
export const useEditListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, edit }: { id: string; edit: CreateListing }) =>
      listingService.editListing(id, edit),
    onSuccess: () => {
      router.replace('/listings');
      queryClient.invalidateQueries({
        queryKey: ['listing'],
      });
      queryClient.invalidateQueries({
        queryKey: ['listing-detail'],
      });
    },
  });
};
