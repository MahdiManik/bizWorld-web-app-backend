// /* eslint-disable no-unused-vars */
// import { create } from 'zustand'
// import { Listing, ListingAttributes } from 'types/listing'
// import { listingService } from '@/services/listing.service'

// type ListingState = {
//   currentListing: ListingAttributes | null
//   loading: boolean
//   error: string | null
//   setLoading: (loading: boolean) => void
//   setError: (error: string | null) => void
//   setCurrentListing: (listing: ListingAttributes | null) => void
//   clearListing: () => void
//   fetchListingById: (id: string) => Promise<Listing | null | undefined>
//   createListing: (
//     companyId: string,
//     listingData: any
//   ) => Promise<Listing | undefined>
//   updateListing: (
//     listingId: string,
//     listingData: any
//   ) => Promise<Listing | undefined>
// }

// const useListingStore = create<ListingState>((set) => ({
//   currentListing: null,
//   loading: false,
//   error: null,

//   setLoading: (loading) => set({ loading }),
//   setError: (error) => set({ error }),
//   setCurrentListing: (currentListing) => set({ currentListing }),

//   clearListing: () => {
//     set({
//       currentListing: null,
//       error: null,
//       loading: false,
//     })
//   },

//   fetchListingById: async (id) => {
//     try {
//       console.log('[useListingStore] Starting fetchListingById for ID:', id)

//       // Set loading state
//       set({ loading: true, error: null })

//       // Make API call through the service
//       const listing = await listingService.getListingById(id)

//       // Check if listing exists in the API response
//       if (!listing) {
//         console.warn('[useListingStore] API returned empty listing for ID:', id)
//         set({
//           currentListing: null,
//           loading: false,
//           error: 'Listing not found',
//         })
//         return null
//       }

//       console.log('[useListingStore] Listing fetched successfully:', listing)

//       // Extract the attributes if this is a Listing type with attributes
//       if (listing && 'attributes' in listing) {
//         set({ currentListing: listing.attributes, loading: false })
//       } else {
//         // Assume this is already a ListingAttributes object
//         set({ currentListing: listing, loading: false })
//       }
//       return listing
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : 'Failed to fetch listing'
//       console.error('[useListingStore] Error fetching listing:', error)
//       set({ error: errorMessage, loading: false, currentListing: null })
//       return null
//     }
//   },

//   createListing: async (companyId: string, data: any) => {
//     console.log('[useListingStore] createListing called with:', {
//       companyId,
//       data,
//     })
//     console.log('[useListingStore] companyId type:', typeof companyId)

//     if (!companyId) {
//       console.error('[useListingStore] Missing companyId!')
//       set({ error: 'Missing company ID', loading: false })
//       return undefined
//     }

//     set({ loading: true, error: null })
//     try {
//       console.log(
//         '[useListingStore] Calling listing service with companyId:',
//         companyId
//       )
//       const result = await listingService.createListing(Number(companyId), data)
//       console.log('[useListingStore] API result:', result)

//       // Handle Strapi response format
//       if (result && result.id) {
//         // Extract the attributes from the Strapi result
//         const listingData = {
//           ...result?.attributes,
//           id: Number(result.id),
//         }

//         set({ currentListing: listingData, loading: false })

//         // Upload documents if any
//         if (data.documents && data.documents.length > 0) {
//           console.log(
//             '[useListingStore] Uploading documents for listing:',
//             result.id
//           )
//           try {
//             for (const doc of data.documents) {
//               await listingService.uploadListingDocument(
//                 Number(result.id),
//                 doc.file,
//                 doc.type || 'DOCUMENT'
//               )
//             }
//             console.log('[useListingStore] All documents uploaded successfully')
//           } catch (docError) {
//             console.error(
//               '[useListingStore] Error uploading documents:',
//               docError
//             )
//             // Don't fail the whole operation if document upload fails
//           }
//         }
//       } else {
//         console.error('[useListingStore] Unexpected result structure:', result)
//         set({
//           currentListing: null,
//           loading: false,
//           error: 'Invalid listing data structure',
//         })
//       }
//       return result
//     } catch (error: any) {
//       console.error('[useListingStore] Error creating listing:', error)
//       set({
//         error: error?.message || 'Failed to create listing',
//         loading: false,
//       })
//       return undefined
//     }
//   },

//   updateListing: async (listingId: string, data: any) => {
//     console.log('[useListingStore] updateListing called with:', {
//       listingId,
//       data,
//     })

//     if (!listingId) {
//       console.error('[useListingStore] Missing listingId!')
//       set({ error: 'Missing listing ID', loading: false })
//       return undefined
//     }

//     set({ loading: true, error: null })
//     try {
//       console.log(
//         '[useListingStore] Calling listing service updateListing with listingId:',
//         listingId
//       )
//       const result = await listingService.updateListing(Number(listingId), data)
//       console.log('[useListingStore] Update API result:', result)

//       // Extract the attributes from the Listing result
//       if (result && 'attributes' in result) {
//         set({ currentListing: result.attributes, loading: false })
//       } else {
//         console.error('[useListingStore] Unexpected result structure:', result)
//         set({
//           currentListing: null,
//           loading: false,
//           error: 'Invalid listing data structure',
//         })
//       }
//       return result
//     } catch (error: any) {
//       console.error('[useListingStore] Error updating listing:', error)
//       set({
//         error: error?.message || 'Failed to update listing',
//         loading: false,
//       })
//       return undefined
//     }
//   },
// }))

// export default useListingStore
