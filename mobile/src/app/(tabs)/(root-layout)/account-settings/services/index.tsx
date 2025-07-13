import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { useRouter } from 'expo-router'

type Service = {
  id: string
  title: string
  description: string
  hourlyRate: number
  duration: string
  category: string
  tags: string[]
  thumbnail?: string
}

// Mock data
const mockServices: Service[] = [
  {
    id: '1',
    title: 'Business Strategy Consultation',
    description:
      'Comprehensive business strategy review and planning for startups and small businesses.',
    hourlyRate: 150,
    duration: '1 hour',
    category: 'Business',
    tags: ['strategy', 'planning'],
  },
  {
    id: '2',
    title: 'Marketing Plan Development',
    description:
      'Create effective marketing strategies tailored to your business goals and target audience.',
    hourlyRate: 150,
    duration: '1 hour',
    category: 'Marketing',
    tags: ['marketing', 'strategy'],
  },
  {
    id: '3',
    title: 'Financial Analysis & Planning',
    description:
      'Detailed financial analysis and future planning to optimize your business finances.',
    hourlyRate: 200,
    duration: '1 hour',
    category: 'Finance',
    tags: ['finance', 'analysis'],
  },
]

export default function ServicesScreen({ navigation }: any) {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>(mockServices)

  const handleAddNewService = () => {
    router.push('/account-settings/services/create-service')
  }

  const handleServiceOptions = (serviceId: string) => {
    Alert.alert('Service Options', 'What would you like to do?', [
      { text: 'Edit', onPress: () => handleEditService(serviceId) },
      {
        text: 'Delete',
        onPress: () => handleDeleteService(serviceId),
        style: 'destructive',
      },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  const handleEditService = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    navigation.navigate('AddNewService', { service, isEdit: true })
  }

  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setServices((prev) => prev.filter((s) => s.id !== serviceId))
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 pt-4`}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onOptionsPress={() => handleServiceOptions(service.id)}
          />
        ))}

        {services.length === 0 && (
          <View style={tw`items-center justify-center py-20`}>
            <Feather name="briefcase" size={48} color={colors.gray[400]} />
            <Text style={tw`text-gray-500 text-lg mt-4`}>No services yet</Text>
            <Text style={tw`text-gray-400 text-center mt-2`}>
              Add your first service to start offering consultations
            </Text>
          </View>
        )}

        <View style={tw`h-20`} />
      </ScrollView>

      {/* Fixed Add New Service Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          padding: 16,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#002B72',
            borderRadius: 8,
            paddingVertical: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleAddNewService}>
          <Feather
            name="plus"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
            Add new service
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

type ServiceCardProps = {
  service: Service
  onOptionsPress: () => void
}

const ServiceCard = ({ service, onOptionsPress }: ServiceCardProps) => {
  return (
    <View style={tw`bg-white border border-gray-200 rounded-lg p-4 mb-4`}>
      <View style={tw`flex-row justify-between items-start mb-2`}>
        <Text style={tw`text-lg font-semibold text-gray-800 flex-1 mr-2`}>
          {service.title}
        </Text>
        <TouchableOpacity onPress={onOptionsPress}>
          <Feather name="more-vertical" size={20} color={colors.gray[500]} />
        </TouchableOpacity>
      </View>

      <Text
        style={tw`text-[${colors.primary.DEFAULT}] font-semibold text-lg mb-2`}>
        ${service.hourlyRate} / hour
      </Text>

      <Text style={tw`text-gray-600 leading-5`}>{service.description}</Text>
    </View>
  )
}
