import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { consultantService } from '@/services/consultantServices';
import {
  ConsultantServicesResponse,
  CreateServiceData,
  UpdateServiceData,
} from '../types/service';
import useSession from '@/store/session';

// Get Consultant Services Query
export const useGetConsultantServices = () => {
  const { user } = useSession();
  return useQuery<ConsultantServicesResponse>({
    queryKey: ['consult-service', user?.documentId],
    queryFn: () => {
      const params = `?populate=*&filters[consultant][documentId][$eq]=${user?.documentId}`;
      return consultantService.getConsultantServices(params);
    },
    enabled: !!user?.documentId,
  });
};

// Create Consultant Service Mutation
export const useCreateConsultantService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceData) =>
      consultantService.createConsultService(data),
    onSuccess: () => {
      // Invalidate and refetch services list
      queryClient.invalidateQueries({
        queryKey: ['consult-service'],
      });
    },
  });
};

// Update Consultant Service Mutation
export const useUpdateConsultantService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceData }) =>
      consultantService.updateConsultService(id, data),
    onSuccess: () => {
      // Invalidate and refetch services list
      queryClient.invalidateQueries({
        queryKey: ['consult-service'],
      });
    },
  });
};
