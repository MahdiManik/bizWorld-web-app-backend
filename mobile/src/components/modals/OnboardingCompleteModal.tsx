import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

type OnboardingCompleteModalProps = {
  visible: boolean
  onClose: () => void
  onBackToSignIn: () => void
}

export const OnboardingCompleteModal = ({
  visible,
  onClose,
  onBackToSignIn,
}: OnboardingCompleteModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View
        style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center px-6`}>
        <View style={tw`bg-white rounded-2xl p-6 w-full max-w-sm relative`}>
          {/* Decorative Elements */}
          <View style={tw`absolute top-12 left-8`}>
            <View style={tw`w-3 h-3 bg-orange-500 rounded-full`} />
          </View>

          <View style={tw`absolute top-6 left-16`}>
            <View
              style={tw`w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gray-800`}
            />
          </View>

          <View style={tw`absolute top-16 left-4`}>
            <Text style={tw`text-red-500 text-lg`}>★</Text>
          </View>

          <View style={tw`absolute top-8 right-8`}>
            <Text style={tw`text-yellow-400 text-lg`}>★</Text>
          </View>

          <View style={tw`absolute top-20 right-6`}>
            <View style={tw`w-3 h-3 bg-amber-800 rounded-full`} />
          </View>

          <View style={tw`absolute top-24 right-12`}>
            <View
              style={[
                tw`w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent`,
                { borderBottomColor: colors.primary.DEFAULT },
              ]}
            />
          </View>

          <View style={tw`absolute bottom-32 left-6`}>
            <View
              style={[
                tw`w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent`,
                { borderBottomColor: colors.primary.DEFAULT },
              ]}
            />
          </View>

          <View style={tw`absolute bottom-28 left-12`}>
            <View
              style={[
                tw`w-2 h-2 rounded-full`,
                { backgroundColor: colors.primary.DEFAULT },
              ]}
            />
          </View>

          {/* Main Content */}
          <View style={tw`items-center mt-4`}>
            {/* Success Circle with Checkmark */}
            <View
              style={[
                tw`w-24 h-24 rounded-full items-center justify-center mb-6`,
                { backgroundColor: '#002B6B' }
              ]}>
              <Feather name="check" size={32} color="white" />
            </View>

            {/* Title */}
            <Text style={tw`text-2xl font-bold text-gray-800 mb-4 text-center`}>
              Onboarding Complete!
            </Text>

            {/* Description */}
            <Text style={tw`text-gray-600 text-center leading-6 mb-8 px-2`}>
              Thank you for completing your registration.{'\n'}
              Your account is pending admin approval.{'\n'}
              We'll notify you once it's activated.
            </Text>

            {/* Back to Sign In Button */}
            <TouchableOpacity
              style={[
                tw`rounded-lg py-4 px-8 w-full`,
                { backgroundColor: '#002B6B' }
              ]}
              onPress={onBackToSignIn}
              activeOpacity={0.8}>
              <Text style={tw`text-white font-semibold text-lg text-center`}>
                Back to Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default OnboardingCompleteModal
