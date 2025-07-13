/* eslint-disable no-unused-vars */
// -----------------------------------------------------------------------------
// React Context

import { listingApi } from '@/services/listing.service'
import { Listing, ListingCreateInput } from '@/types/listing'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'

// -----------------------------------------------------------------------------
interface ListingState {
  listings: Listing[]
  myListings: Listing[]
  current?: Listing | null
  loading: boolean
  error?: string | null
}

type Action =
  | { type: 'SET_LISTINGS'; payload: Listing[] }
  | { type: 'SET_MY_LISTINGS'; payload: Listing[] }
  | { type: 'SET_CURRENT'; payload: Listing | null }
  | { type: 'LOADING'; payload: boolean }
  | { type: 'ERROR'; payload: string | null }

const initialState: ListingState = {
  listings: [],
  myListings: [],
  current: null,
  loading: false,
  error: null,
}

function reducer(state: ListingState, action: Action): ListingState {
  switch (action.type) {
    case 'SET_LISTINGS':
      return { ...state, listings: action.payload }
    case 'SET_MY_LISTINGS':
      return { ...state, myListings: action.payload }
    case 'SET_CURRENT':
      console.log('Setting current listing', action.payload)
      return { ...state, current: action.payload }
    case 'LOADING':
      return { ...state, loading: action.payload }
    case 'ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

interface ListingContextValue extends ListingState {
  fetchListings: (filters?: {
    status?: string
    category?: string
  }) => Promise<void>
  fetchMyListings: (userId: number) => Promise<void>
  fetchListingById: (id: string | number) => Promise<void>
  createListing: (input: ListingCreateInput) => Promise<Listing>
  updateListing: (
    id: number,
    attrs: Partial<ListingCreateInput>
  ) => Promise<Listing>
  deleteListing: (id: number) => Promise<void>
  toggleFavorite: (id: number, fav: boolean) => Promise<void>
}

const ListingContext = createContext<ListingContextValue | undefined>(undefined)

export function ListingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const withLoading = useCallback(async (fn: () => Promise<any>) => {
    try {
      dispatch({ type: 'LOADING', payload: true })
      await fn()
      dispatch({ type: 'ERROR', payload: null })
    } catch (err: any) {
      dispatch({ type: 'ERROR', payload: err.message || 'Unknown error' })
    } finally {
      dispatch({ type: 'LOADING', payload: false })
    }
  }, [])

  const fetchListings = useCallback(
    async (filters?: { status?: string; category?: string }) =>
      withLoading(async () => {
        const data = await listingApi.getAll(filters)
        dispatch({ type: 'SET_LISTINGS', payload: data })
      }),
    [withLoading]
  )

  const fetchMyListings = useCallback(
    async (userId: number) =>
      withLoading(async () => {
        const data = await listingApi.getMine(userId)
        dispatch({ type: 'SET_MY_LISTINGS', payload: data })
      }),
    [withLoading]
  )

  const fetchListingById = useCallback(
    async (id: string | number) =>
      withLoading(async () => {
        const data = await listingApi.getById(id)
        console.log('Fetched listing for ID', id, data)
        dispatch({ type: 'SET_CURRENT', payload: data })
      }),
    [withLoading]
  )

  const createListing = useCallback(
    async (input: ListingCreateInput) => {
      const created = await listingApi.create(input)
      // Optimistically update
      dispatch({ type: 'SET_LISTINGS', payload: [created, ...state.listings] })
      return created
    },
    [state.listings]
  )

  const updateListing = useCallback(
    async (id: number, attrs: Partial<ListingCreateInput>) => {
      const updated = await listingApi.update(id, attrs)
      dispatch({
        type: 'SET_LISTINGS',
        payload: state.listings.map((l) => (l.id === id ? updated : l)),
      })
      return updated
    },
    [state.listings]
  )

  const deleteListing = useCallback(
    async (id: number) => {
      await listingApi.remove(id)
      dispatch({
        type: 'SET_LISTINGS',
        payload: state.listings.filter((l) => l.id !== id),
      })
    },
    [state.listings]
  )

  const toggleFavorite = useCallback(
    async (id: number, fav: boolean) => {
      await listingApi.toggleFavorite(fav)
      dispatch({
        type: 'SET_LISTINGS',
        payload: state.listings.map((l) =>
          l.id === id ? { ...l, isFavorite: fav } : l
        ),
      })
    },
    [state.listings]
  )

  const value = useMemo<ListingContextValue>(
    () => ({
      ...state,
      fetchListings,
      fetchMyListings,
      fetchListingById,
      createListing,
      updateListing,
      deleteListing,
      toggleFavorite,
    }),
    [
      state,
      fetchListings,
      fetchMyListings,
      fetchListingById,
      createListing,
      updateListing,
      deleteListing,
      toggleFavorite,
    ]
  )

  return (
    <ListingContext.Provider value={value}>{children}</ListingContext.Provider>
  )
}

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------
export function useListings() {
  const ctx = useContext(ListingContext)
  if (!ctx) throw new Error('useListings must be used within ListingProvider')
  return ctx
}
