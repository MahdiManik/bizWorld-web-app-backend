import { AuthUser } from '@/contexts/AuthContext'
import { StrapiID } from './strapi.types'

export interface User {
  id: number
  fullName: string
}
export interface MonthlyFinancialInput {
  month: number
  year: number
  revenue: string
  ebitda: string
  profitMargin: string
}

export interface Image {
  id: number
  url: string
}

/** Input/response structure for a Listing */
export interface ListingCreateInput {
  id: StrapiID
  title: string
  askingPrice: string
  category: string
  status?: string
  country: string
  description?: string | null
  visibility?: 'Public' | 'Private'
  monthlyFinancials?: MonthlyFinancialInput[]
  equityOffered: string
  employees: string
  established: string
  marginYoY: string
  ebitdaYoY: string
  revenueYoY: string
  ebitda: string
  industry: string
  type: string
  profitMargin: string
  growthRate: string
  companyName: string
  isFavorite?: boolean
  document: Image | null
  image?: Image | null
  user?: AuthUser
}

/** Final mapped Listing returned from service */

export interface Listing extends ListingCreateInput {
  id: number
  user?: AuthUser
}
