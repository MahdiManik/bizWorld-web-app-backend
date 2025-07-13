import { SearchInput } from '@/components/Listing/SearchInput'
import { PremiumChatInfo } from '@/components/Chat/PremiumChatInfo'
import { ChatUserList, ChatUser } from '@/components/Chat/ChatUserList'
import { ChatConversation } from '@/components/Chat/ChatConversation'
import { useChatContext } from '@/contexts/ChatContext'
import tw from '@/lib/tailwind'
import React, { useState, useMemo } from 'react'
import { ScrollView } from 'react-native'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native'
import { mockUserProfile } from 'data/profileData'

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const { selectedUser, setSelectedUser } = useChatContext()

  // Transform mockUserProfile data into chat user list format
  const chatUsers = useMemo(
    () => [
      {
        id: '1',
        name: 'Athalia Putri',
        status: 'Last seen yesterday',
        isOnline: false,
        avatar:
          mockUserProfile.find((p) => p.firstName === 'Mei')?.profileImage ||
          '',
        hasCustomAvatar: true,
      },
      {
        id: '2',
        name: 'Erlan Sadewa',
        status: 'Online',
        isOnline: true,
        avatar:
          mockUserProfile.find((p) => p.firstName === 'John')?.profileImage ||
          '',
        hasCustomAvatar: true,
      },
      {
        id: '3',
        name: 'Midala Huera',
        status: 'Last seen 3 hours ago',
        isOnline: false,
        avatar:
          mockUserProfile.find((p) => p.firstName === 'Carlos')?.profileImage ||
          '',
        hasCustomAvatar: true,
      },
      {
        id: '4',
        name: 'Nafisa Gitari',
        status: 'Online',
        isOnline: true,
        avatar:
          mockUserProfile.find((p) => p.firstName === 'Aisha')?.profileImage ||
          '',
        hasCustomAvatar: true,
      },
      {
        id: '5',
        name: 'Raki Devon',
        status: 'Online',
        isOnline: true,
        initials: 'RD',
        hasCustomAvatar: false,
      },
      {
        id: '6',
        name: 'Salsabila Akira',
        status: 'Last seen 30 minutes ago',
        isOnline: false,
        initials: 'SA',
        hasCustomAvatar: false,
      },
    ],
    []
  )

  return (
    <View style={tw`flex-1 bg-white`}>
      {!selectedUser ? (
        // Show user list when no user is selected
        <ScrollView>
          <View style={tw`flex-1 bg-white`}>
            <View style={tw``}>
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search listings..."
                onFilterPress={() => setShowFilterModal(true)}
              />
            </View>
            {mockUserProfile[0].subscriptionType !== 'premium' ? (
              <PremiumChatInfo />
            ) : (
              <View></View>
            )}
            {/* Chat Users List - Matching the image */}
            <ChatUserList
              users={chatUsers}
              onSelectUser={(user) => {
                console.log('Selected user:', user.name)
                setSelectedUser(user)
              }}
            />
          </View>
        </ScrollView>
      ) : (
        // Show conversation when a user is selected - handled by _layout.tsx now
        <ChatConversation 
          user={selectedUser} 
          onBack={() => setSelectedUser(null)}
        />
      )}
    </View>
  )
}
