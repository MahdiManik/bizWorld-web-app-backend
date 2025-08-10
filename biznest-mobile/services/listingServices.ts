import { CreateInvestListing } from '@/feature/(modules)/listing/types/apply-investor';
import { CreateListing } from '@/feature/(modules)/listing/types/create-listing';
import { InterestListingResponse } from '@/feature/(modules)/listing/types/interest-listing';
import { ListingResponse } from '@/feature/(modules)/listing/types/listing';
import { ListingDetailResponse } from '@/feature/(modules)/listing/types/listing-detail';
import api from '@/lib/axios';

export const listingService = {
  getListing: async (params: string): Promise<ListingResponse> => {
    const response = await api.get<ListingResponse>(`/listings/${params}`);
    return response.data;
  },
  getMyInterestListing: async (
    params: string
  ): Promise<InterestListingResponse> => {
    const response = await api.get(`/interest-listings/${params}`);
    return response.data;
  },
  likeAndUnLikeListing: async (id: string, likedUser: string[]) => {
    return api.put(`/listings/${id}`, {
      data: {
        likedUser: likedUser,
      },
    });
  },
  getListingDetail: async (id: string): Promise<ListingDetailResponse> => {
    const response = await api.get(
      `listings/${id}?populate[image][populate]=*&populate[document][populate]&populate[businessOwner][populate]=*&populate[revenueBreakDown][populate]=*&populate[likedUser][populate]=*&populate[interest_listings][populate]=*`
    );
    return response.data;
  },
  
  createInterestListing: async (create: CreateInvestListing) => {
    return api.post(`/interest-listings`, { data: create });
  },

  createListing: async (create: CreateListing) => {
    return api.post('/listings', { data: create });
  },
  editListing: async (id: string, edit: CreateListing) => {
    return api.put(`/listings/${id}`, { data: edit });
  },
};
