/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'

import { useRouter } from 'expo-router'

import {
  Feather,
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Ionicons,
} from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { DetailItem } from '@/components/Listing/DetailItem'
import { CustomTabs } from '@/components/Listing/CustomTabs'
import { MobileRevenueChart } from '@/components/Listing/MobileRevenueChart'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import { useListings } from '@/contexts/ListingContext'
import { ListingCreateInput } from '@/types/listing'

// Format numbers as USD
const formatCurrency = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return 'N/A'
  const num =
    typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.-]+/g, ''))
      : value
  return isNaN(num)
    ? 'N/A'
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(num)
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'financials', label: 'Financials' },
  { id: 'documents', label: 'Documents' },
]

export default function ListingDetailScreen() {
  const router = useRouter()
  const [currentListing, setCurrentListing] = useState<ListingCreateInput>()
  const [activeTab, setActiveTab] = useState('overview')
  const { id } = useLocalSearchParams<{ id: string }>()

  console.log('id', id)

  const { current, loading, error, fetchListingById } = useListings()
  useEffect(() => {
    if (id) {
      fetchListingById(id)
    }
  }, [id])

  console.log('current listing', current)

  // Early guard: if we don't have a valid ID, show loading state
  if (!id) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={tw`mt-2 text-gray-500`}>Loading listing...</Text>
      </SafeAreaView>
    )
  }

  // Always run hooks
  const fallbackData = useMemo<ListingCreateInput>(
    () => ({
      id: 0,
      title: 'Listing Not Found',
      askingPrice: '0',
      category: '',
      country: 'Unknown',
      description: 'No description available',
      visibility: 'Public',
      monthlyFinancials: [],
      equityOffered: '0',
      employees: '0',
      established: '0',
      marginYoY: '0',
      ebitdaYoY: '0',
      revenueYoY: '0',
      ebitda: '0',
      industry: 'Unknown',
      type: 'Unknown',
      profitMargin: '0',
      growthRate: '0',
      companyName: 'Unknown',
      document: null,
      isFavorite: false,
      image: null,
      user: undefined,
    }),
    []
  )

  // Format revenue data for chart - moved to top level to avoid hooks rule violation
  const revenueHistory = useMemo(() => {
    if (!current || !current?.monthlyFinancials) return []

    return current.monthlyFinancials.map((m: any) => ({
      month: new Date(0, Number(m.month) - 1).toLocaleString('en-US', {
        month: 'short',
      }),
      annualRevenue: parseFloat(m.revenue),
      ebitda: parseFloat(m.ebitda),
      profitMargin: parseFloat(m.profitMargin.replace('%', '')),
    }))
  }, [current?.monthlyFinancials])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        console.log(
          '[ListingDetailScreen] Calling fetchListingById with ID:',
          id
        )

        if (!cancelled && !current) {
          console.log('[ListingDetailScreen] No result, using fallback data')
          setCurrentListing(fallbackData)
        }
      } catch (error: any) {
        console.log(
          '[ListingDetailScreen] Error fetching listing:',
          error?.message || String(error)
        )

        if (!cancelled) {
          setCurrentListing(fallbackData)
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [id, fallbackData, fetchListingById, setCurrentListing])

  // Place all conditional rendering AFTER hooks
  if (!id) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={tw`mt-2 text-gray-500`}>Loading listing ID...</Text>
      </SafeAreaView>
    )
  }

  if (error || !current) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-lg text-gray-600 mb-4`}>
          {error || 'Listing not found'}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`bg-primary py-2 rounded-lg`}>
          <Text style={tw`text-white`}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const annualRevenue = revenueHistory.reduce(
    (sum: number, d: any) => sum + d.annualRevenue,
    0
  )
  const businessMetrics = {
    annualRevenue: annualRevenue ? formatCurrency(annualRevenue) : 'N/A',
    revenueGrowth: current?.revenueYoY ?? 'N/A',
    ebitda: current?.ebitda ? formatCurrency(current?.ebitda) : 'N/A',
    ebitdaGrowth: current?.ebitdaYoY ?? 'N/A',
    profitMargin: current?.profitMargin ?? 'N/A',
    profitMarginGrowth: current?.marginYoY ?? 'N/A',
    description: current?.description || 'No description available',
    askingPrice: current?.askingPrice
      ? formatCurrency(current?.askingPrice)
      : 'N/A',
    equityOffered: current?.equityOffered
      ? `${current?.equityOffered}%`
      : 'N/A',
    established: current?.established ? `${current?.established}` : 'N/A',
    industry: current?.industry || 'N/A',
    location: current?.country || 'N/A',
    category: current?.category || 'N/A',
    employees: current?.employees || 'N/A',
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <Image
          source={current?.image?.url || ''}
          style={tw`w-full h-48 rounded-lg mb-4`}
          resizeMode="cover"
        />
        <View style={tw``}>
          <View style={tw`flex-row flex-wrap mb-4`}>
            <View
              style={tw`border px-3 py-1 rounded-full mr-2 mb-2 border-primary`}>
              <Text style={tw`text-primary`}>{businessMetrics.category}</Text>
            </View>
          </View>
          <Text style={tw`text-xl font-semibold mb-2`}>{current?.title}</Text>
          <View style={tw`flex-row items-center mb-4`}>
            <Feather name="map-pin" size={16} color="#4B5563" />
            <Text style={tw`ml-1 font-semibold text-gray-700`}>
              {businessMetrics.location}
            </Text>
          </View>
        </View>

        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}>
          {activeTab === 'overview' && (
            <View style={tw`py-2`}>
              <Text style={tw`text-lg font-semibold mb-2`}>
                Business Description
              </Text>
              <Text style={tw`mb-4`}>{businessMetrics.description}</Text>
              <DetailItem
                icon={<Feather name="user" size={20} color="#4B5563" />}
                label="Business Owner"
                value={current?.user?.fullName ?? 'N/A'}
              />
              <DetailItem
                icon={<Feather name="briefcase" size={20} color="#4B5563" />}
                label="Company Name"
                value={current?.companyName ?? 'N/A'}
              />
              <DetailItem
                icon={<Feather name="layers" size={20} color="#4B5563" />}
                label="Industry"
                value={businessMetrics.industry}
              />
              <DetailItem
                icon={<Feather name="tag" size={20} color="#4B5563" />}
                label="Type"
                value={current?.type}
              />
              <DetailItem
                icon={<Feather name="tag" size={20} color="#4B5563" />}
                label="Country"
                value={businessMetrics.location}
              />
              <DetailItem
                icon={<Feather name="calendar" size={20} color="#4B5563" />}
                label="Established"
                value={businessMetrics.established}
              />
              <DetailItem
                icon={<Feather name="users" size={20} color="#4B5563" />}
                label="Employees"
                value={businessMetrics.employees}
              />
              <Text style={tw`text-lg font-bold mt-6 mb-2`}>
                Investment Opportunity
              </Text>
              <DetailItem
                icon={<Feather name="dollar-sign" size={20} color="#4B5563" />}
                label="Asking Price:"
                value={formatCurrency(current.askingPrice) ?? 'N/A'}
              />
              <DetailItem
                icon={<Feather name="percent" size={20} color="#4B5563" />}
                label="Equity Offered:"
                value={businessMetrics.equityOffered}
              />
              <DetailItem
                icon={<Feather name="percent" size={20} color="#4B5563" />}
                label="Revenue (Annual):"
                value={businessMetrics.annualRevenue}
              />
              <DetailItem
                icon={<Feather name="percent" size={20} color="#4B5563" />}
                label="Profit Margin:"
                value={businessMetrics.profitMargin}
              />
              <DetailItem
                icon={<Feather name="percent" size={20} color="#4B5563" />}
                label="Growth Rate:"
                value={businessMetrics.revenueGrowth}
              />
            </View>
          )}

          {activeTab === 'financials' && (
            <View style={tw`py-2`}>
              <Text style={tw`text-lg font-bold mb-4`}>Financial Summary</Text>
              <MobileRevenueChart data={revenueHistory} height={200} />
              <DetailItem
                icon={
                  <FontAwesome5 name="dollar-sign" size={20} color="#4B5563" />
                }
                label="Annual Revenue"
                value={`${businessMetrics.annualRevenue} (${businessMetrics.revenueGrowth})`}
              />
              <DetailItem
                icon={
                  <MaterialIcons
                    name="work-outline"
                    size={20}
                    color="#4B5563"
                  />
                }
                label="EBITDA"
                value={`${businessMetrics.ebitda} (${businessMetrics.ebitdaGrowth})`}
              />
              <DetailItem
                icon={<Entypo name="sound" size={20} color="#4B5563" />}
                label="Profit Margin"
                value={`${businessMetrics.profitMargin} (${businessMetrics.profitMarginGrowth})`}
              />
            </View>
          )}

          {activeTab === 'documents' && (
            <View style={tw`items-center justify-center py-8`}>
              <Ionicons name="document-text-outline" size={72} color="#DDD" />
              <Text style={tw`mt-4 text-center text-lg font-semibold`}>
                Documents are locked
              </Text>
              <Text style={tw`mt-2 text-center mb-6`}>
                Express interest to gain access.
              </Text>
              <TouchableOpacity
                style={[
                  tw`flex-1 rounded-md py-2 w-full mt-8`,
                  { backgroundColor: colors.primary.DEFAULT },
                ]}
                onPress={() => {
                  console.log(
                    'Interest expressed in listing:',
                    current?.id || 'unknown'
                  )
                }}>
                <Text style={tw`text-white text-center text-base font-medium`}>
                  Interest
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </CustomTabs>
      </ScrollView>
    </SafeAreaView>
  )
}
