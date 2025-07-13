import React, { useState } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import ConsultationActionCard from '@/components/Consautants/ConsultationActions'
import { colors } from '@/constants/colors'
import { mockUserProfile, UserProfile } from '@/../data/profileData'

import { useRouter } from 'expo-router'
import { ConsultationRequestModal } from '@/components/Consautants/ConsultationRequestModal'

export default function ConsultScreen() {
  const router = useRouter()
  const [requests, setRequests] = useState(mockUserProfile)
  const [activeTab, setActiveTab] = useState<
    'all' | 'pending' | 'accepted' | 'rejected'
  >('all')

  const [modalVisible, setModalVisible] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<UserProfile | null>(null)
  const [modalType, setModalType] = useState<'accept' | 'reject'>('accept')

  const filteredRequests =
    activeTab === 'all'
      ? requests
      : requests.filter((req) => req.status === activeTab)

  const handleAction = (request: UserProfile, type: 'accept' | 'reject') => {
    setCurrentRequest(request)
    setModalType(type)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const handleConsultantRequest = () => {
    router.replace('consultant-request')
  }

  const confirmAction = (message: string) => {
    if (!currentRequest) return

    // Handle accept/reject logic here
    console.log(`${modalType}ing request`, { ...currentRequest, message })
    setModalVisible(false)
  }

  const renderTabBar = () => {
    const tabs = ['all', 'pending', 'accepted', 'rejected'] as const
    return (
      <View
        style={[
          tw`flex-row bg-white border-b pt-4`,
          { borderColor: colors.gray[700] },
        ]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              tw`flex-1 py-3 items-center`,
              activeTab === tab
                ? { borderBottomWidth: 2, borderColor: colors.primary.DEFAULT }
                : {},
            ]}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={tw`${activeTab === tab ? 'text-blue-800 font-bold' : 'text-gray-500'} capitalize`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  const renderRequestCard = ({ item }: { item: UserProfile }) => (
    <ConsultationActionCard onPress={() => handleAction(item, 'accept')} />
  )

  const renderEmptyList = () => (
    <View style={tw`flex-1 justify-center items-center py-10`}>
      <Ionicons name="medical-outline" size={50} color="#CCCCCC" />
      <Text style={tw`text-gray-400 mt-4 text-center`}>
        You have no consultation requests
      </Text>
    </View>
  )

  const renderActionModal = () => (
    <ConsultationRequestModal
      visible={modalVisible}
      onClose={closeModal}
      onConfirm={confirmAction}
      modalType={modalType}
      currentRequest={currentRequest}
    />
  )

  const renderHeader = () => (
    <ConsultationActionCard onPress={handleConsultantRequest} />
  )

  return (
    <View style={tw`flex-1 bg-white`}>
      {renderHeader()}
      {renderTabBar()}

      <FlatList<UserProfile>
        data={filteredRequests}
        renderItem={renderRequestCard}
        keyExtractor={(item: UserProfile) => item.id}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={tw`pb-4 ${filteredRequests.length === 0 ? 'flex-1' : ''}`}
      />

      {renderActionModal()}
    </View>
  )
}
