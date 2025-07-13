import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { InvestorCard, Investor } from '@/components/Investors/InvestorCard'
import { RejectModal } from '@/components/Investors/RejectModal'
import { SearchInput } from '@/components/Listing/SearchInput'

type TabType = 'All' | 'Pending' | 'Accepted' | 'Rejected'

// Mock data
const mockInvestors: Investor[] = [
  {
    id: '1',
    name: 'Anonymous Investor',
    location: 'Canada',
    avatar: 'https://via.placeholder.com/40',
    status: 'Interested',
    interests: ['Technology', 'Healthcare'],
    interestedIn: 'Tech Startup for Sale',
  },
  {
    id: '2',
    name: 'Anonymous Investor',
    location: 'Canada',
    avatar: 'https://via.placeholder.com/40',
    status: 'Approved',
    interests: ['Technology', 'Healthcare'],
    interestedIn: 'Tech Startup for Sale',
    connectedDate: '4/25/2025',
    lastActivity: '5/8/2025',
  },
  {
    id: '3',
    name: 'Anonymous Investor',
    location: 'Canada',
    avatar: 'https://via.placeholder.com/40',
    status: 'Rejected',
    interests: ['Technology', 'Healthcare'],
    interestedIn: 'Tech Startup for Sale',
    rejectedDate: '5/10/2025',
    rejectionReason:
      "After reviewing your interest, we've determined this opportunity may not be the right fit at this time.",
  },
]

export default function InvestorsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(
    null
  )
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const getFilteredInvestors = () => {
    switch (activeTab) {
      case 'Pending':
        return mockInvestors.filter(
          (investor) => investor.status === 'Interested'
        )
      case 'Accepted':
        return mockInvestors.filter(
          (investor) => investor.status === 'Approved'
        )
      case 'Rejected':
        return mockInvestors.filter(
          (investor) => investor.status === 'Rejected'
        )
      default:
        return mockInvestors
    }
  }

  const handleAccept = (investor: Investor) => {
    console.log(`Accepted investor: ${investor.id}`)
  }

  const handleDecline = (investor: Investor) => {
    setSelectedInvestor(investor)
    setShowRejectModal(true)
  }

  const handleReject = (reason: string) => {
    if (selectedInvestor) {
      console.log(
        `Rejected investor: ${selectedInvestor.id}, reason: ${reason}`
      )
      setShowRejectModal(false)
      setSelectedInvestor(null)
    }
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row border-b border-gray-200`}>
        {(['All', 'Pending', 'Accepted', 'Rejected'] as TabType[]).map(
          (tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                tw`flex-1 py-3 items-center`,
                activeTab === tab && {
                  borderBottomWidth: 2,
                  borderBottomColor: colors.primary.DEFAULT,
                },
              ]}
              onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  tw`font-medium`,
                  {
                    color:
                      activeTab === tab
                        ? colors.primary.DEFAULT
                        : colors.gray[500],
                  },
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={tw`px-4`}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search investors..."
          onFilterPress={() => console.log('Filter pressed')}
        />
      </View>

      <FlatList
        data={getFilteredInvestors()}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <InvestorCard
            investor={item}
            onAccept={() => handleAccept(item)}
            onDecline={() => handleDecline(item)}
            onViewProfile={() => console.log(`View profile: ${item.id}`)}
            onMessage={() => console.log(`Message: ${item.id}`)}
          />
        )}
        contentContainerStyle={tw`pb-20`}
      />

      <RejectModal
        visible={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
      />
    </SafeAreaView>
  )
}
