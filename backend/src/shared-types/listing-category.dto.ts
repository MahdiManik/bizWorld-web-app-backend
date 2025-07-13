export interface CreateCategoryDto {
  name: string
}

export interface UpdateCategoryDto {
  name: string
}

export interface CategoryResponseDto {
  id: string
  name: string
  listingCount?: number
}

export interface CategoryWithListingsDto extends CategoryResponseDto {
  listings: {
    id: string
    title: string
    askingPrice: string
    image?: string
    location: string
    status: string
    company: {
      id: string
      name: string
    }
    owner: {
      id: string
      name: string
      email: string
    }
    financialMetric: {
      ebitda: string
      revenueYoYChange: string
      ebitdaYoYChange: string
      profitMarginYoYChange: string
    }
  }[]
}
