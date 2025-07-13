import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { Input } from '@/components/form/input'

type RequestConsultantScreenProps = {
  navigation: any
  route: {
    params: {
      consultantName?: string
      consultantId?: string
    }
  }
}

const timelineOptions = [
  { value: 'urgent', label: 'Urgent (within 1 week)' },
  { value: 'normal', label: 'Normal (1-2 weeks)' },
  { value: 'flexible', label: 'Flexible (2-4 weeks)' },
  { value: 'long-term', label: 'Long-term project (1+ months)' },
]

export default function RequestConsultantScreen({
  navigation,
  route,
}: RequestConsultantScreenProps) {
  const consultantName = route.params?.consultantName || 'Jane Smith'
  const consultantId = route.params?.consultantId || '1'

  const [formData, setFormData] = useState({
    projectScope: '',
    budget: '',
    timeline: 'urgent',
  })

  const [errors, setErrors] = useState({
    projectScope: '',
    budget: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      projectScope: '',
      budget: '',
    }

    let isValid = true

    if (!formData.projectScope.trim()) {
      newErrors.projectScope = 'Project scope is required'
      isValid = false
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const router = useRouter()

  const handleSubmitRequest = async () => {
    router.push('/(tabs)/(root-layout)/consultants')
    // if (!validateForm()) {
    //   return
    // }

    // setIsSubmitting(true)

    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 1500))

    //   console.log('Submitting consultation request:', {
    //     consultantId,
    //     ...formData,
    //   })

    //   Alert.alert(
    //     'Request Submitted!',
    //     `Your consultation request has been sent to ${consultantName}. They will review and respond within 48 hours.`,
    //     [
    //       {
    //         text: 'OK',
    //         onPress: () => {
    //           // Navigate to the consultants page instead of going back
    //         },
    //       },
    //     ]
    //   )
    // } catch (error) {
    //   console.error('Error submitting request:', error)
    //   Alert.alert('Error', 'Failed to submit your request. Please try again.')
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  const handleCancel = () => {
    // Navigate to consultants page instead of just going back
    router.push('/(tabs)/(root-layout)/consultants')
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white p-0 m-0`} edges={['bottom']}>
      <ScrollView style={tw`flex-1 mt-0`} contentContainerStyle={tw`px-1`}>
        <Text style={tw`text-base font-bold text-gray-800 mb-1 mt-0`}>
          Request Consultation with {consultantName}
        </Text>

        <Input
          label="Project Scope"
          placeholder="Describe what you need help with..."
          value={formData.projectScope}
          onChangeText={(text) => updateField('projectScope', text)}
          multiline
          numberOfLines={6}
          inputStyle="h-32 align-top"
          error={errors.projectScope}
          containerStyle="mb-2"
        />

        <Input
          label="Budget"
          placeholder="eg. $1,000 - $5,000"
          value={formData.budget}
          onChangeText={(text) => updateField('budget', text)}
          error={errors.budget}
          containerStyle="mb-2"
        />

        <Input
          label="Timeline"
          type="select"
          options={timelineOptions}
          selectedValue={formData.timeline}
          onSelect={(value) => updateField('timeline', value)}
          containerStyle="mb-2"
        />

        <View style={tw`bg-blue-50 rounded-md p-1.5 mb-2`}>
          <Text style={tw`text-primary font-semibold mb-1 text-sm`}>
            What happens next?
          </Text>
          <Text style={tw`text-gray-700 text-xs leading-4`}>
            After submitting your request, the consultant will review your
            project details and respond within 48 hours. You'll be notified when
            they accept, reject, or request more information.
          </Text>
        </View>

        <View style={tw`h-14`} />
      </ScrollView>

      <View style={tw`absolute bottom-0 left-0 right-0 flex-row p-1 bg-white`}>
        <TouchableOpacity
          style={tw`flex-1 border border-gray-300 rounded-md py-3 mr-1 items-center`}
          onPress={handleCancel}
          disabled={isSubmitting}>
          <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            tw`flex-1 rounded-md py-3 ml-1 items-center`,
            { backgroundColor: colors.primary.DEFAULT },
            isSubmitting && tw`bg-blue-400`,
          ]}
          onPress={handleSubmitRequest}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={tw`text-white font-medium`}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
