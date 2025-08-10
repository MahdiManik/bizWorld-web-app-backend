import api from '@/lib/axios';

export const interestListingService = {
  getInterest: (userId: number, page: number = 1, pageSize: number = 10) => {
    return api.get('/interest-listings', {
      params: {
        filters: {
          interestedUsers: {
            id: {
              $eq: userId,
            },
          },
        },
        pagination: {
          page,
          pageSize,
        },
        populate: {
          interestedUsers: {
            populate: {
              user_profile: {
                populate: ['image'],
              },
              company: {
                populate: ['document'],
              },
            },
          },
          listing: {
            populate: ['image'],
          },
          businessOwner: {
            populate: {
              user_profile: {
                populate: ['image'],
              },
              company: {
                populate: ['document'],
              },
            },
          },
        },
      },
    });
  },

  updateStatus: (
    id: number | string,
    status: 'Approved' | 'Pending' | 'Rejected',
    remark: string
  ) => {
    return api.put(`/interest-listings/${id}`, {
      data: {
        investStatus: status,
        remark: remark,
      },
    });
  },
};
