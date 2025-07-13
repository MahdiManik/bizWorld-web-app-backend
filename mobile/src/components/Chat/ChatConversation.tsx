import React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import tw from '@/lib/tailwind'
import { ChatUser } from './ChatUserList'
import { Ionicons } from '@expo/vector-icons'

interface Message {
  id: string
  text: string
  timestamp: string
  isFromMe: boolean
}

interface ChatConversationProps {
  user: ChatUser
  onBack: () => void
}

export function ChatConversation({ user, onBack }: ChatConversationProps) {
  // Mock messages for the selected user
  const messages: Message[] = [
    {
      id: '1',
      text: 'Hello! Thank you for your interest in MediHealth Solutions.',
      timestamp: '10:30 AM',
      isFromMe: false,
    },
    {
      id: '2',
      text: 'How can I help you today?',
      timestamp: '10:31 AM',
      isFromMe: false,
    },
    {
      id: '3',
      text: "Hi Sarah, I'm interested in learning more",
      timestamp: '10:35 AM',
      isFromMe: true,
    },
  ]

  return (
    <View style={tw`flex-1 bg-white`}>

        {/* Chat messages */}
        <ScrollView style={tw`flex-1 p-4 pt-2`} contentContainerStyle={tw`pb-4`}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                tw`mb-4 max-w-[80%] flex-1`,
                message.isFromMe ? tw`ml-auto` : tw`mr-auto`,
              ]}>
              <View
                style={[
                  tw`p-4 rounded-2xl flex-1`,
                  message.isFromMe
                    ? tw`bg-blue-500 rounded-br-none`
                    : tw`bg-gray-100 rounded-bl-none border border-gray-200`,
                ]}>
                <Text
                  style={[message.isFromMe ? tw`text-white` : tw`text-black`]}>
                  {message.text}
                </Text>
              </View>
              <Text
                style={[
                  tw`text-xs mt-1 text-gray-500`,
                  message.isFromMe ? tw`text-right` : tw`text-left`,
                ]}>
                {message.timestamp}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Message input */}
        <View
          style={tw`flex-row items-center px-4 py-2 border-t border-gray-200 bg-white`}>
          <TouchableOpacity style={tw`mr-3`}>
            <Ionicons name="add" size={24} color="#3b82f6" />
          </TouchableOpacity>

          <TextInput
            style={tw`flex-1 rounded-full px-4 py-2 mr-3`}
            placeholder="Type a message..."
          />

          <TouchableOpacity
            style={tw`bg-blue-500 w-10 h-10 rounded-full items-center justify-center`}>
            <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
    </View>
  )
}
