import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'

type RejectModalProps = {
  visible: boolean
  onClose: () => void
  onReject: (reason: string) => void
}

export const RejectModal = ({
  visible,
  onClose,
  onReject,
}: RejectModalProps) => {
  const [reason, setReason] = useState('')

  const handleReject = () => {
    onReject(reason)
    setReason('')
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View
        style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center px-4`}>
        <View style={tw`bg-white rounded-lg p-6 w-full max-w-sm`}>
          <View style={tw`items-center mb-4`}>
            <View
              style={tw`w-16 h-16 rounded-lg bg-red-100 items-center justify-center mb-4`}>
              <Feather name="user-x" size={32} color="#DC2626" />
            </View>

            <Text style={tw`text-xl font-bold text-center mb-2`}>
              Reject Investor Request
            </Text>
            <Text style={tw`text-gray-600 text-center`}>
              Are you sure you want to reject this request? Please provide a
              reason for rejection.
            </Text>
          </View>

          <TextInput
            style={tw`border border-blue-200 bg-blue-50 rounded-md p-3 mb-4`}
            placeholder="Enter reason for rejection"
            multiline
            numberOfLines={3}
            value={reason}
            onChangeText={setReason}
          />

          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`flex-1 border border-gray-300 rounded-md py-3 mr-2 items-center`}
              onPress={onClose}>
              <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-1 bg-red-600 rounded-md py-3 ml-2 items-center`}
              onPress={handleReject}>
              <Text style={tw`text-white font-medium`}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
