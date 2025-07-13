import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { Input } from '@/components/form/input'
import { Header } from '@/components/Listing/Header'

// Options for dropdown
const expertiseOptions = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'ux-design', label: 'UX Design' },
  { value: 'marketing', label: 'Digital Marketing' },
  { value: 'business-strategy', label: 'Business Strategy' },
  { value: 'financial-consulting', label: 'Financial Consulting' },
  { value: 'legal-consulting', label: 'Legal Consulting' },
  { value: 'hr-consulting', label: 'HR Consulting' },
  { value: 'it-consulting', label: 'IT Consulting' },
]

const experienceOptions = [
  { value: '0-1', label: 'Less than 1 year' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: 'More than 10 years' },
]

export default function ConsultantApplicationScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    expertise: '',
    experience: '',
    resume: '',
    portfolioUrl: '',
    additionalInfo: '',
  })

  const [errors, setErrors] = useState({
    expertise: '',
    experience: '',
    resume: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user updates field
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      expertise: '',
      experience: '',
      resume: '',
    }

    let isValid = true

    if (!formData.expertise) {
      newErrors.expertise = 'Area of expertise is required'
      isValid = false
    }

    if (!formData.experience) {
      newErrors.experience = 'Years of experience is required'
      isValid = false
    }

    if (!formData.resume) {
      newErrors.resume = 'Resume/CV is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success modal
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = () => {
    // Handle file upload logic
    console.log('File upload pressed')
    // For demo purposes, set a dummy file name
    updateField('resume', 'resume.pdf')
  }

  const handleBackToAccount = () => {
    setShowSuccessModal(false)
    navigation.navigate('AccountSettings')
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-4`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
          Professional Information
        </Text>

        <Input
          label="Area of Expertise"
          placeholder="e.g Web Development, UX Design..."
          type="select"
          options={expertiseOptions}
          selectedValue={formData.expertise}
          onSelect={(value) => updateField('expertise', value)}
          error={errors.expertise}
          required
        />

        <Input
          label="Years of Experience"
          placeholder="Select experience"
          type="select"
          options={experienceOptions}
          selectedValue={formData.experience}
          onSelect={(value) => updateField('experience', value)}
          error={errors.experience}
          required
        />

        <Input
          label="Upload Resume/CV"
          type="file"
          value={formData.resume}
          onRightIconPress={handleFileUpload}
          error={errors.resume}
          required
        />

        <Input
          label="Portfolio URL"
          placeholder="Enter listing title"
          value={formData.portfolioUrl}
          onChangeText={(text) => updateField('portfolioUrl', text)}
        />

        <Input
          label="Additional Information"
          placeholder="Anything else you'd like us to know about your application"
          value={formData.additionalInfo}
          onChangeText={(text) => updateField('additionalInfo', text)}
          multiline
          numberOfLines={6}
          inputStyle="h-32 text-top"
        />

        <View style={tw`h-24`} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={tw`absolute bottom-0 left-0 right-0 flex-row p-4 bg-white`}>
        <TouchableOpacity
          style={tw`flex-1 border border-gray-300 rounded-md py-4 mr-2 items-center`}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}>
          <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            tw`flex-1 rounded-md py-4 ml-2 items-center`,
            {
              backgroundColor: isSubmitting
                ? '#60A5FA'
                : colors.primary.DEFAULT,
            },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={tw`text-white font-medium`}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View
          style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center p-4`}>
          <View
            style={tw`bg-white rounded-lg p-6 w-full max-w-sm items-center`}>
            <View
              style={[
                tw`w-20 h-20 rounded-full items-center justify-center mb-4`,
                { backgroundColor: colors.primary.DEFAULT },
              ]}>
              <Feather name="check" size={36} color="white" />
            </View>

            {/* Decorative elements */}
            <View
              style={tw`absolute top-12 left-12 w-2 h-2 rounded-full bg-red-500`}
            />
            <View
              style={tw`absolute top-16 right-16 w-2 h-2 rounded-full bg-yellow-500`}
            />
            <View
              style={tw`absolute bottom-24 left-20 w-2 h-2 rounded-full bg-orange-500`}
            />
            <View
              style={tw`absolute top-24 right-12 w-3 h-3 transform rotate-45 bg-blue-500`}
            />
            <View
              style={tw`absolute bottom-20 right-16 w-3 h-3 transform rotate-45 bg-purple-500`}
            />

            <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>
              Application Submitted!
            </Text>
            <Text style={tw`text-gray-600 text-center mb-6`}>
              You've successfully submitted your application. Our team will
              review and will verify your account in 1-3 working days.
            </Text>

            <TouchableOpacity
              style={[
                tw`rounded-md py-3 px-4 w-full items-center`,
                { backgroundColor: colors.primary.DEFAULT },
              ]}
              onPress={handleBackToAccount}>
              <Text style={tw`text-white font-medium`}>
                Back to Account Setting
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
