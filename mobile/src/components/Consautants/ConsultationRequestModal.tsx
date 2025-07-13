import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import tw from '@/lib/tailwind'
import { UserProfile } from '@/../data/profileData'
import ActionButton from '../ActionButton'
import { colors } from '@/constants/colors'

interface ConsultationRequestModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (message: string) => void
  modalType: 'accept' | 'reject'
  currentRequest: UserProfile | null
}

export const ConsultationRequestModal: React.FC<
  ConsultationRequestModalProps
> = ({ visible, onClose, onConfirm, modalType, currentRequest }) => {
  const [message, setMessage] = useState('')

  const handleConfirm = () => {
    onConfirm(message)
    setMessage('')
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={tw`bg-white w-5/6 rounded-lg overflow-hidden`}>
          <View style={tw`p-4 border-b border-gray-200`}>
            <Text style={tw`text-lg font-bold text-center`}>
              {modalType === 'accept' ? 'Accept Request' : 'Reject Request'}
            </Text>
          </View>

          {currentRequest && (
            <View style={tw`p-4`}>
              <View
                style={[
                  tw`flex-row items-center mb-4 p-2 rounded-lg`,
                  { backgroundColor: colors.secondary[200] },
                ]}>
                <Image
                  source={{ uri: currentRequest.profileImage }}
                  style={tw`w-12 h-12 rounded-full`}
                />
                <View style={tw`ml-3`}>
                  <Text style={tw`font-bold`}>
                    {currentRequest.firstName} {currentRequest.lastName}
                  </Text>
                  <Text style={tw`text-gray-600 text-xs`}>
                    {currentRequest.professionalHeadline}
                  </Text>
                  <Text style={tw`text-gray-500 text-xs`}>
                    {currentRequest.industrySpecialization}
                  </Text>
                </View>
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-sm font-semibold mb-2`}>
                  {modalType === 'accept'
                    ? 'Add a message to confirm your acceptance:'
                    : 'Please provide a reason for rejection:'}
                </Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-md p-3 text-sm h-24`}
                  multiline
                  placeholder={
                    modalType === 'accept'
                      ? 'I would be happy to help with your...'
                      : 'Unfortunately, I cannot take on this...'
                  }
                  placeholderTextColor="#9CA3AF"
                  value={message}
                  onChangeText={setMessage}
                />
              </View>

              <View style={tw`flex-row justify-between mt-2`}>
                <ActionButton
                  label="Cancel"
                  variant="reject"
                  onPress={onClose}
                />
                {modalType === 'accept' ? (
                  <ActionButton
                    label="Accept Request"
                    variant="accept"
                    onPress={handleConfirm}
                  />
                ) : (
                  <ActionButton
                    label="Reject Request"
                    variant="rejection"
                    onPress={handleConfirm}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}
