export interface CreateListingDto {
  title: string
  image?: string
  askingPrice: string
  location: string
  companyId: string
  ownerId?: string // Optional: Either provided directly or from authenticated user
  categoryIds: string[]
  ebitda: string
  revenueYoY: string
  ebitdaYoY: string
  marginYoY: string
  monthlyData: {
    month: number // 1-12
    year: number
    revenue: string
    ebitda: string
    profitMargin: string
  }[]
}

export type UpdateListingDto = Partial<CreateListingDto>

export interface ListingFilterDto {
  status?: string
  categoryId?: string
}
