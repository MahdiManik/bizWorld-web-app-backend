import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from '@/lib/tailwind';
import { colors } from '@/constants/colors';
import { Input } from '@/components/form/input';

type AddNewServiceScreenProps = {
  navigation: any;
  route: {
    params?: {
      service?: any;
      isEdit?: boolean;
    };
  };
};

const durationOptions = [
  { value: '30min', label: '30 minutes' },
  { value: '1hour', label: '1 hour' },
  { value: '1.5hour', label: '1.5 hours' },
  { value: '2hour', label: '2 hours' },
  { value: '3hour', label: '3 hours' },
  { value: 'custom', label: 'Custom' },
];

const categoryOptions = [
  { value: 'business', label: 'Business Strategy' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' },
  { value: 'legal', label: 'Legal' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'operations', label: 'Operations' },
  { value: 'other', label: 'Other' },
];

export default function AddNewServiceScreen({ navigation, route }: AddNewServiceScreenProps) {
  const isEdit = route.params?.isEdit || false;
  const existingService = route.params?.service;

  const [formData, setFormData] = useState({
    title: existingService?.title || '',
    description: existingService?.description || '',
    hourlyRate: existingService?.hourlyRate?.toString() || '',
    duration: existingService?.duration || '1hour',
    category: existingService?.category || 'technology',
    tags: existingService?.tags || [],
    thumbnail: existingService?.thumbnail || '',
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    hourlyRate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user updates field
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      hourlyRate: '',
    };

    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = 'Service title is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.hourlyRate.trim()) {
      newErrors.hourlyRate = 'Hourly rate is required';
      isValid = false;
    } else if (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = 'Please enter a valid hourly rate';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = () => {
    // Handle file upload logic
    console.log('File upload pressed');
    // For demo purposes, set a dummy file name
    updateField('thumbnail', 'service-thumbnail.jpg');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would submit the service data to your backend
      console.log('Submitting service:', formData);

      Alert.alert(
        'Success!',
        `Service ${isEdit ? 'updated' : 'created'} successfully.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to ${isEdit ? 'update' : 'create'} service. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`bg-[${colors.primary.DEFAULT}] p-4 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-lg font-medium ml-2`}>
          {isEdit ? 'Edit Service' : 'Add New Service'}
        </Text>
        <TouchableOpacity style={tw`ml-auto`}>
          <Feather name="bell" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1 p-4`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-6`}>Create Service</Text>

        <Input
          label="Service Title"
          placeholder="Enter service title"
          value={formData.title}
          onChangeText={(text) => updateField('title', text)}
          error={errors.title}
          required
        />

        <Input
          label="Description"
          placeholder="Describe what this service includes..."
          value={formData.description}
          onChangeText={(text) => updateField('description', text)}
          multiline
          numberOfLines={6}
          inputStyle="h-32 text-top"
          error={errors.description}
          required
        />

        <Input
          label="Hourly Rate ($)"
          placeholder="e.g. 150"
          value={formData.hourlyRate}
          onChangeText={(text) => updateField('hourlyRate', text)}
          keyboardType="numeric"
          error={errors.hourlyRate}
          required
        />

        <Input
          label="Session Duration"
          type="select"
          options={durationOptions}
          selectedValue={formData.duration}
          onSelect={(value) => updateField('duration', value)}
        />

        <Input
          label="Categories"
          type="select"
          options={categoryOptions}
          selectedValue={formData.category}
          onSelect={(value) => updateField('category', value)}
        />

        {/* Tags Section */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-800 font-medium mb-2`}>Tags</Text>
          <Text style={tw`text-gray-500 text-sm mb-3`}>
            Add tags to help clients find your service
          </Text>
          
          {/* Existing Tags */}
          <View style={tw`flex-row flex-wrap mb-3`}>
            {formData.tags.map((tag: string, index: number) => (
              <View key={index} style={tw`bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center`}>
                <Text style={tw`text-gray-700 mr-1`}>{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <Feather name="x" size={14} color={colors.gray[500]} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add New Tag */}
          <View style={tw`flex-row items-center`}>
            <View style={tw`flex-1 mr-2`}>
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={handleAddTag}
                containerStyle="mb-0"
              />
            </View>
            <TouchableOpacity
              style={tw`bg-[${colors.primary.DEFAULT}] rounded-md px-4 py-3`}
              onPress={handleAddTag}
            >
              <Feather name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Input
          label="Thumbnail / Cover Image"
          type="file"
          value={formData.thumbnail}
          onRightIconPress={handleFileUpload}
        />

        <View style={tw`h-24`} />
      </ScrollView>

      {/* Submit Button */}
      <View style={tw`absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200`}>
        <TouchableOpacity
          style={[
            tw`bg-[${colors.primary.DEFAULT}] rounded-md py-4 items-center`,
            isSubmitting && tw`bg-blue-400`
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={tw`text-white font-medium text-lg`}>
              {isEdit ? 'Update service' : 'Create service'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}