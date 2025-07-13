import api from '@/lib/api'
import { getCurrentUserId } from '@/services/auth.service'
import {
  StrapiID,
  StrapiResponse,
  StrapiArrayResponse,
} from '@/types/strapi.types'
import { uploadFileToStrapi } from '@/lib/upload'
import { unwrap, unwrapFirst } from '@/lib/strapi-helpers'

/* ─── Front‑end Form shape ─────────────────────────────── */
interface CompanyFormData {
  id?: number
  name: string
  industry: string
  location: string
  size?: string
  status?: string
  revenue?: string
  description?: string
  companyDocument?: number | null // Strapi file ID or null
}

/* ─── Strapi API shape after unwrap() ───────────────────── */
// export interface Company {
//   id: number
//   name: string
//   industry: string
//   location: string
//   size?: string
//   status?: string
//   description?: string
//   portfolioLink?: string
//   logo?: any
// }

/* ─── Input payload shape for Strapi POST/PUT ───────────── */
type CompanyCreateInput = Omit<CompanyFormData, 'id' | 'logo'> & {
  users_permissions_user: StrapiID
  logo?: StrapiID
}

/* ======================================================== */
/*                     Service class                        */
/* ======================================================== */
class CompanyService {
  /* ------------ create ------------ */
  async createCompany(data: CompanyFormData): Promise<CompanyFormData> {
    const uid = await getCurrentUserId()
    if (!uid) throw new Error('No user ID, please log in again')

    const mapped: CompanyCreateInput = {
      name: data.name,
      industry: data.industry,
      location: data.location,
      size: data.size,
      status: data.status,
      description: data.description,
      users_permissions_user: uid as StrapiID,
    }

    if (data.companyDocument) {
      if (typeof data.companyDocument === 'number') {
        // Already uploaded - use existing file ID
        mapped.logo = data.companyDocument
      } else {
        // New file to upload
        const up = await uploadFileToStrapi(data.companyDocument, 'files')
        if (up?.id) {
          mapped.logo = up.id
        }
      }
    }

    const res = await api.post<StrapiResponse<CompanyFormData>>('/companies', {
      data: mapped,
    })
    const unwrapped = unwrap(res.data.data)
    if (!unwrapped) {
      throw new Error('Failed to create company - received null response')
    }
    return unwrapped
  }

  /* ------------ update ------------ */
  async updateCompany(
    id: StrapiID,
    data: Partial<CompanyFormData>
  ): Promise<CompanyFormData> {
    const mapped: Partial<CompanyCreateInput> = {}

    // map only provided fields
    if ('name' in data) mapped.name = data.name
    if ('industry' in data) mapped.industry = data.industry
    if ('location' in data) mapped.location = data.location
    if ('size' in data) mapped.size = data.size
    if ('status' in data) mapped.status = data.status
    if ('description' in data) mapped.description = data.description

    if (data.companyDocument) {
      if (typeof data.companyDocument === 'number') {
        // Already uploaded - use existing file ID
        mapped.logo = data.companyDocument
      } else {
        // New file to upload
        const up = await uploadFileToStrapi(
          data.companyDocument,
          'files',
          'company-logos'
        )
        if (up?.id) {
          mapped.logo = up.id
        }
      }
    }

    const res = await api.put<StrapiResponse<CompanyFormData>>(
      `/companies/${id}`,
      {
        data: mapped,
      }
    )
    const unwrapped = unwrap(res.data.data)
    if (!unwrapped) {
      throw new Error(`Failed to update company ${id} - received null response`)
    }
    return unwrapped
  }

  /* ------------ current user company ------------ */
  async getUserCompany(): Promise<CompanyFormData | null> {
    const uid = await getCurrentUserId()
    if (!uid) return null

    const res = await api.get<StrapiArrayResponse<CompanyFormData>>(
      `/companies?filters[users_permissions_user][id]=${uid}&populate=*`
    )
    return unwrapFirst(res.data.data)
  }

  /* ------------ save (create or update) ------------ */
  async saveCompany(data: CompanyFormData): Promise<CompanyFormData> {
    const existing = await this.getUserCompany()
    if (existing) {
      return this.updateCompany(existing?.id || 0, data)
    } else {
      return this.createCompany(data)
    }
  }
}

export const companyService = new CompanyService()
export type { CompanyFormData }
