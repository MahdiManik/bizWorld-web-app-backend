import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import tw from '@/lib/tailwind'

export interface ChatUser {
  id: string
  name: string
  status: string
  isOnline: boolean
  avatar?: string
  initials?: string
  hasCustomAvatar: boolean
}

interface ChatUserListProps {
  users: ChatUser[]
  onSelectUser?: (user: ChatUser) => void
}

export function ChatUserList({ users, onSelectUser }: ChatUserListProps) {
  return (
    <View style={tw`px-4 py-2`}>
      {users.map((user) => (
        <TouchableOpacity
          key={user.id}
          style={tw`flex-row items-center py-3 border-b border-gray-100`}
          onPress={() => onSelectUser && onSelectUser(user)}>
          <View style={tw`relative`}>
            {user.hasCustomAvatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={tw`w-14 h-14 rounded-full`}
              />
            ) : (
              <View
                style={tw`w-14 h-14 rounded-full bg-blue-500 items-center justify-center`}>
                <Text style={tw`text-white text-xl font-bold`}>
                  {user.initials}
                </Text>
              </View>
            )}
            {user.isOnline && (
              <View
                style={tw`absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white`}
              />
            )}
          </View>
          <View style={tw`ml-4`}>
            <Text style={tw`font-semibold text-base`}>{user.name}</Text>
            <Text style={tw`text-gray-500`}>{user.status}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}
