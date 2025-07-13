// src/services/listingApi.ts
import api from '@/lib/api'
import { Listing, ListingCreateInput } from '@/types/listing'

const map = (raw: any): Listing => {
  // Map users_permissions_user to user if it exists
  const { users_permissions_user, ...rest } = raw.attributes || raw
  return {
    ...rest,
    id: raw.id,
    user: users_permissions_user?.id
      ? { id: users_permissions_user?.id }
      : undefined,
  } as Listing
}

export const listingApi = {
  /* ---------------------------------------------------------------- get all */
  async getAll(filters?: { status?: string; category?: string }) {
    const params: Record<string, any> = {
      'pagination[pageSize]': 100,
      'populate[users_permissions_user]': true,
      'populate[image]': true,
    }
    if (filters?.status) params['filters[status][$eq]'] = filters.status
    if (filters?.category) params['filters[category][$eq]'] = filters.category

    const { data } = await api.get<{ data: any[] }>('/listings', { params })
    return (data.data || []).map(map)
  },

  /* -------------------------------------------------------------- get mine */
  async getMine(userId: number) {
    const { data } = await api.get<{ data: any[] }>('/listings', {
      params: {
        'pagination[pageSize]': 100,
        'populate[users_permissions_user]': true,
        'populate[image]': true,
        'filters[users_permissions_user][id][$eq]': userId,
      },
    })
    return (data.data || []).map(map)
  },

  /* -------------------------------------------------------------- get by id */
  async getById(id: string | number) {
    const { data } = await api.get<{ data: any }>(`/listings/${id}`, {
      params: {
        'populate[users_permissions_user]': true,
        'populate[image]': true,
      },
    })
    console.log('Fetched data:', data)

    if (!data.data) throw new Error(`Listing ${id} not found`)
    return map(data.data)
  },

  /* ---------------------------------------------------------- toggle fav  */
  async toggleFavorite(isFavorite: boolean) {
    await api.patch(`/listings`, { data: { isFavorite } })
  },

  /* ---------------------------------------------------------------- create */
  async create(payload: ListingCreateInput) {
    // pass the relation as an id
    const body = {
      data: {
        ...payload,
        image: payload.image,
        users_permissions_user: payload.user?.id,
      },
    }
    const { data } = await api.post<{ data: any }>('/listings', body)
    return map(data.data)
  },

  /* ---------------------------------------------------------------- update */
  async update(id: number, attrs: Partial<ListingCreateInput>) {
    const { data } = await api.patch<{ data: any }>(`/listings/${id}`, {
      data: attrs,
    })
    return map(data.data)
  },

  /* ---------------------------------------------------------------- delete */
  async remove(id: number) {
    await api.delete(`/listings/${id}`)
  },
}
