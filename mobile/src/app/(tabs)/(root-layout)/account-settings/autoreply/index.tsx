import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from '@/lib/tailwind'
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native'
import { Feather } from '@expo/vector-icons'

// Service types for the toggles
type Service = {
  id: string
  name: string
  rate: string
  enabled: boolean
}

export default function AutoReply() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [autoMessage, setAutoMessage] = useState(
    "Thank you for your inquiry! I'm currently unavailable but will review your message and get back to you within 24 hours. For urgent matters, please call my office at (555) 123-4567."
  )
  const [isServicesExpanded, setIsServicesExpanded] = useState(false)
  const [includeServices, setIncludeServices] = useState(false)
  
  // Available services
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Business Strategy Consultation', rate: '150/hour', enabled: true },
    { id: '2', name: 'Marketing Plan Development', rate: '150/hour', enabled: false },
    { id: '3', name: 'Financial Analysis & Planning', rate: '200/hour', enabled: false }
  ])
  
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)
  const toggleServices = () => setIsServicesExpanded(prev => !prev)
  const toggleIncludeServices = () => setIncludeServices(prev => !prev)
  
  const toggleServiceEnabled = (serviceId: string) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, enabled: !service.enabled } 
          : service
      )
    )
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`} edges={['bottom']}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex-1 px-4 py-6`}>
        {/* Header */}
        <Text style={tw`text-2xl font-bold text-gray-800`}>Auto Reply</Text>
        <Text style={tw`text-gray-500 mt-1 mb-6`}>
          Configure automatic responses for client inquiries
        </Text>
        
        {/* Enable Auto Reply Toggle */}
        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-800 font-medium text-base`}>Enable auto reply</Text>
            <Switch
              trackColor={{ false: '#E5E7EB', true: '#E6F0F8' }}
              thumbColor={isEnabled ? '#002C69' : '#9CA3AF'}
              ios_backgroundColor="#E5E7EB"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={tw`transform scale-90`}
            />
          </View>
        </View>
        
        {/* Auto Message Input */}
        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100`}>
          <Text style={tw`text-gray-800 font-medium mb-2`}>Auto Message</Text>
          <TextInput
            style={tw`border border-gray-200 rounded-md p-3 text-gray-700 min-h-40`}
            multiline
            textAlignVertical="top"
            value={autoMessage}
            onChangeText={setAutoMessage}
          />
        </View>
        
        {/* Include Services Dropdown */}
        <TouchableOpacity 
          style={tw`bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100`}
          onPress={toggleServices}
        >
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-800 font-medium`}>Include Services</Text>
            <Feather 
              name={isServicesExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#374151" 
            />
          </View>
          
          {isServicesExpanded && (
            <View style={tw`mt-4 border-t border-gray-100 pt-4`}>
              {/* Include services in auto-reply toggle */}
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <Text style={tw`text-gray-700`}>Include services in auto-reply</Text>
                <Switch
                  trackColor={{ false: '#E5E7EB', true: '#E6F0F8' }}
                  thumbColor={includeServices ? '#002C69' : '#9CA3AF'}
                  ios_backgroundColor="#E5E7EB"
                  onValueChange={toggleIncludeServices}
                  value={includeServices}
                  style={tw`transform scale-90`}
                />
              </View>
              
              {includeServices && (
                <View>
                  <Text style={tw`text-gray-700 mb-2`}>Select services to include:</Text>
                  
                  {/* Service toggles */}
                  {services.map((service) => (
                    <View key={service.id} style={tw`flex-row items-center justify-between py-2 border-b border-gray-100`}>
                      <View>
                        <Text style={tw`text-gray-800 font-medium`}>{service.name}</Text>
                        <Text style={tw`text-gray-500 text-xs`}>\${service.rate}</Text>
                      </View>
                      <Switch
                        trackColor={{ false: '#E5E7EB', true: '#E6F0F8' }}
                        thumbColor={service.enabled ? '#002C69' : '#9CA3AF'}
                        ios_backgroundColor="#E5E7EB"
                        onValueChange={() => toggleServiceEnabled(service.id)}
                        value={service.enabled}
                        style={tw`transform scale-90`}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Bottom buttons - fixed at bottom */}
      <View style={tw`px-4 py-4 border-t border-gray-100 bg-white flex-row`}>
        <TouchableOpacity style={tw`flex-1 border border-gray-300 rounded-lg py-3 mr-2 items-center justify-center`}>
          <Text style={tw`text-gray-800 font-medium`}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-1 bg-blue-900 rounded-lg py-3 items-center justify-center`}>
          <Text style={tw`text-white font-medium`}>Save Setting</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
