import api from '@/lib/axios';
import {
  ConsultantsListResponse,
  CreateConsultantData,
  SuggestConsultantsResponse,
  UpdateConsultantData,
} from '@/feature/(modules)/consultants/types/consultant';
import { 
  ConsultantServicesResponse,
  CreateServiceData,
  UpdateServiceData
} from '@/feature/(modules)/account-settings/services/types/service';

export const consultantService = {
  getConsultantsList: async (
    params: string
  ): Promise<ConsultantsListResponse> => {
    const response = await api.get(`/consultant-links${params}`);
    if (!response.data) {
      return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
    }

    if (!Array.isArray(response.data.data)) {
      return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
    }

    return response?.data;
  },
  getSuggestConsultants: async (
    params: string
  ): Promise<SuggestConsultantsResponse> => {
    const response = await api.get(`/users/available-consultants${params}`);
    return response?.data;
  },
  createConsultRequest: (createData: CreateConsultantData) => {
    return api.post(`/consultant-links`, { data: createData });
  },
  updateConsultRequest: (id: string, updateData: UpdateConsultantData) => {
    return api.put(`/consultant-links/${id}`, { data: updateData });
  },
  deleteConsultRequest: (id: string) => {
    return api.delete(`/consultant-links/${id}`);
  },
  getConsultantServices: async (params: string): Promise<ConsultantServicesResponse> => {
    const response = await api.get(`/services${params}`);
    return response?.data;
  },
  createConsultService: (create: CreateServiceData) => {
    return api.post('/services', { data: create });
  },
  updateConsultService: (id: string, update: UpdateServiceData) => {
    return api.put(`services/${id}`, { data: update });
  },
};
