import tw from '@/lib/tailwind'
import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Input } from '@/components/form/input'

type Tag = {
  id: string
  name: string
}

export default function CreateService() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hourlyRate: '',
    sessionDuration: '1 hour',
    category: 'Technology',
  })

  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'Strategy' },
    { id: '2', name: 'consulting' },
  ])
  const [newTag, setNewTag] = useState('')

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    hourlyRate: '',
  })

  const sessionDurationOptions = [
    { value: '30min', label: '30 minutes' },
    { value: '1hour', label: '1 hour' },
    { value: '2hour', label: '2 hours' },
    { value: '3hour', label: '3 hours' },
    { value: '4hour', label: '4 hours' },
  ]

  const categoryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'business', label: 'Business' },
    { value: 'finance', label: 'Finance' },
    { value: 'legal', label: 'Legal' },
  ]

  const updateField = (field: keyof typeof formData, value: string) => {
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

  const removeTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  const addTag = () => {
    if (!newTag.trim()) return
    const newTagObj = { id: Date.now().toString(), name: newTag.trim() }
    setTags([...tags, newTagObj])
    setNewTag('')
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'We need camera roll permission to upload images'
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image')
      console.error('Image picker error:', error)
    }
  }

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      hourlyRate: '',
    }

    let isValid = true

    if (!formData.title.trim()) {
      newErrors.title = 'Service title is required'
      isValid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
      isValid = false
    }

    if (!formData.hourlyRate.trim()) {
      newErrors.hourlyRate = 'Hourly rate is required'
      isValid = false
    } else if (isNaN(Number(formData.hourlyRate))) {
      newErrors.hourlyRate = 'Hourly rate must be a number'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    router.push('(tabs)/(root-layout)/account-settings/services')
    // if (!validateForm()) {
    //   return
    // }

    // setIsSubmitting(true)

    // try {
    //   // Mock API call
    //   await new Promise((resolve) => setTimeout(resolve, 1500))

    //   console.log('Creating service:', {
    //     ...formData,
    //     tags: tags.map(t => t.name),
    //     imageUrl: selectedImage
    //   })

    //   Alert.alert(
    //     'Success',
    //     'Your service has been created successfully!',
    //     [{ text: 'OK', onPress: () => router.back() }]
    //   )
    // } catch (error) {
    //   console.error('Error creating service:', error)
    //   Alert.alert('Error', 'Failed to create service. Please try again.')
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  return (
    <SafeAreaView edges={['bottom']} style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 px-4`}>
        <Text style={tw`text-2xl font-bold text-gray-800 mt-2 mb-6`}>
          Create Service
        </Text>

        <Input
          label="Service Title"
          placeholder="Enter service title"
          value={formData.title}
          onChangeText={(text: string) => updateField('title', text)}
          error={errors.title}
          required={true}
        />

        <Input
          label="Description"
          placeholder="Describe what this service includes..."
          value={formData.description}
          onChangeText={(text: string) => updateField('description', text)}
          multiline
          numberOfLines={6}
          inputStyle="h-32 align-top"
          error={errors.description}
          required={true}
        />

        <Input
          label="Hourly Rate ($)"
          placeholder="e.g, 150"
          value={formData.hourlyRate}
          onChangeText={(text: string) => updateField('hourlyRate', text)}
          keyboardType="numeric"
          error={errors.hourlyRate}
          required={true}
        />

        <Input
          label="Session Duration"
          type="select"
          options={sessionDurationOptions}
          selectedValue={formData.sessionDuration}
          onSelect={(value: string) => updateField('sessionDuration', value)}
        />

        <Input
          label="Categories"
          type="select"
          options={categoryOptions}
          selectedValue={formData.category}
          onSelect={(value: string) => updateField('category', value)}
        />

        {/* Tags Input */}
        <View style={tw`mb-5`}>
          <Text style={tw`text-gray-700 font-medium mb-2`}>Tags</Text>
          <Text style={tw`text-xs text-gray-500 mb-2`}>
            Add tags to help clients find your service
          </Text>

          {/* Selected Tags */}
          <View style={tw`flex-row flex-wrap mb-2`}>
            {tags.map((tag) => (
              <View
                key={tag.id}
                style={tw`bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center`}>
                <Text style={tw`text-gray-800 mr-1`}>{tag.name}</Text>
                <TouchableOpacity onPress={() => removeTag(tag.id)}>
                  <Feather name="x" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add Tag Input */}
          <View style={tw`flex-row items-center`}>
            <TextInput
              style={tw`flex-1 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 mr-2`}
              placeholder="Add a tag"
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity
              style={tw`bg-gray-200 p-3 rounded-lg`}
              onPress={addTag}>
              <Feather name="plus" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thumbnail/Cover Image */}
        <View style={tw`mb-5`}>
          <Text style={tw`text-gray-700 font-medium mb-2`}>
            Thumbnail / Cover Image
          </Text>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              style={tw`bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 mr-2`}
              onPress={pickImage}>
              <Text style={tw`text-gray-700`}>Choose File</Text>
            </TouchableOpacity>
            <Text style={tw`text-gray-500 flex-1`}>
              {selectedImage ? 'Image selected' : 'No file chosen'}
            </Text>
          </View>
          {selectedImage && (
            <View style={tw`mt-3`}>
              <Image
                source={{ uri: selectedImage }}
                style={tw`h-40 w-full rounded-lg`}
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        <View style={tw`mb-10`} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={tw`px-4 py-4 border-t border-gray-200`}>
        <TouchableOpacity
          style={[
            tw`bg-blue-900 rounded-lg py-4 items-center justify-center`,
            isSubmitting && tw`opacity-70`,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={tw`text-white font-medium`}>Create service</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
