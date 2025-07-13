import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

export type InvestorStatus = 'Interested' | 'Approved' | 'Rejected'

export type Investor = {
  id: string
  name: string
  location: string
  avatar: string
  status: InvestorStatus
  interests: string[]
  interestedIn: string
  connectedDate?: string
  lastActivity?: string
  rejectedDate?: string
  rejectionReason?: string
}

type InvestorCardProps = {
  investor: Investor
  onAccept?: () => void
  onDecline?: () => void
  onViewProfile?: () => void
  onMessage?: () => void
}

export const InvestorCard = ({
  investor,
  onAccept,
  onDecline,
  onViewProfile,
  onMessage,
}: InvestorCardProps) => {
  return (
    <View style={tw`p-4 border-b border-gray-200`}>
      <View style={tw`flex-row items-center mb-2`}>
        <View
          style={tw`w-10 h-10 rounded-full bg-gray-300 items-center justify-center`}>
          <Text style={tw`text-white font-bold`}>S</Text>
        </View>
        <View style={tw`ml-3 flex-1`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-medium text-gray-800`}>{investor.name}</Text>
            <StatusBadge status={investor.status} />
          </View>
          <Text style={tw`text-gray-500 text-sm`}>{investor.location}</Text>
        </View>
      </View>

      <View style={tw`flex-row mb-2`}>
        {investor.interests.map((interest, index) => (
          <View key={index} style={tw`bg-blue-100 rounded-md px-2 py-1 mr-2`}>
            <Text style={tw`text-blue-700 text-xs`}>{interest}</Text>
          </View>
        ))}
      </View>

      <Text style={tw`text-gray-700 mb-2`}>
        Interested in :{' '}
        <Text style={tw`font-medium`}>{investor.interestedIn}</Text>
      </Text>

      {investor.status === 'Approved' &&
        investor.connectedDate &&
        investor.lastActivity && (
          <View style={tw`flex-row mb-3`}>
            <Text style={tw`text-gray-500 text-sm mr-4`}>
              Connected: {investor.connectedDate}
            </Text>
            <Text style={tw`text-gray-500 text-sm`}>
              Last activity: {investor.lastActivity}
            </Text>
          </View>
        )}

      {investor.status === 'Rejected' && investor.rejectedDate && (
        <View style={tw`mb-3`}>
          <Text style={tw`text-gray-500 text-sm`}>
            Rejected on: {investor.rejectedDate}
          </Text>

          {investor.rejectionReason && (
            <View style={tw`bg-blue-50 p-3 rounded-md mt-2`}>
              <Text style={tw`text-gray-700 font-medium mb-1`}>
                Reason for Decline
              </Text>
              <Text style={tw`text-gray-600`}>{investor.rejectionReason}</Text>
            </View>
          )}
        </View>
      )}

      <ActionButtons
        status={investor.status}
        onAccept={onAccept}
        onDecline={onDecline}
        onViewProfile={onViewProfile}
        onMessage={onMessage}
      />
    </View>
  )
}

const StatusBadge = ({ status }: { status: InvestorStatus }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Interested':
        return { bg: 'bg-orange-100', text: 'text-orange-600' }
      case 'Approved':
        return { bg: 'bg-green-100', text: 'text-green-600' }
      case 'Rejected':
        return { bg: 'bg-red-100', text: 'text-red-600' }
    }
  }

  const style = getStatusStyle()

  return (
    <View style={tw`${style.bg} px-2 py-1 rounded-md`}>
      <Text style={tw`${style.text} text-xs font-medium`}>{status}</Text>
    </View>
  )
}

const ActionButtons = ({
  status,
  onAccept,
  onDecline,
  onViewProfile,
  onMessage,
}: {
  status: InvestorStatus
  onAccept?: () => void
  onDecline?: () => void
  onViewProfile?: () => void
  onMessage?: () => void
}) => {
  if (status === 'Interested') {
    return (
      <View style={tw`flex-row mt-1`}>
        <TouchableOpacity
          style={tw`flex-1 border border-red-500 rounded-md py-3 mr-2 items-center`}
          onPress={onDecline}>
          <Text style={tw`text-red-500 font-medium`}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`flex-1 rounded-md py-3 ml-2 items-center`,
            { backgroundColor: colors.primary.DEFAULT },
          ]}
          onPress={onAccept}>
          <Text style={tw`text-white font-medium`}>Accept</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (status === 'Approved') {
    return (
      <View style={tw`flex-row mt-1`}>
        <TouchableOpacity
          style={tw`flex-1 border border-gray-300 rounded-md py-3 mr-2 items-center`}
          onPress={onViewProfile}>
          <Text style={[tw`font-medium`, { color: colors.primary.DEFAULT }]}>
            View Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`flex-1 rounded-md py-3 ml-2 items-center`,
            { backgroundColor: colors.primary.DEFAULT },
          ]}
          onPress={onMessage}>
          <Text style={tw`text-white font-medium`}>Message</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return null
}
