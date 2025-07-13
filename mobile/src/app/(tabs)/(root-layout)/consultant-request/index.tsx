import ConsultantRequestCard from '@/components/Consautants/ConsultantRequstCard'
import { SearchInput } from '@/components/Listing/SearchInput'
import tw from '@/lib/tailwind'
import { mockUserProfile, UserProfile } from 'data/profileData'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native'

export default function DashboardScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [currentConsultant, setCurrentConsultant] =
    useState<UserProfile[]>(mockUserProfile)

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1 bg-white`}>
        <ScrollView style={tw`flex-1`}>
          <View style={tw`pb-8`}>
            <View style={tw`py-2`}>
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search listings..."
                onFilterPress={() => setShowFilterModal(true)}
              />
            </View>
            <Text style={tw`mb-2 px-2 text-base font-bold text-gray-600`}>
              {currentConsultant.length} Consultants Available
            </Text>
            <View>
              {currentConsultant.map((consultant) => (
                <View key={consultant.id} style={tw`mb-4`}>
                  <ConsultantRequestCard item={consultant} navigation={router} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
