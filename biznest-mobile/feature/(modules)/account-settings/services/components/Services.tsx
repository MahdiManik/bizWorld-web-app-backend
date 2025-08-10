import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { View, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ServiceCard from './ServiceCard';
import Button from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { useGetConsultantServices } from '../hooks/useService';
import { Service } from '../types/service';

const Services = () => {
  const router = useRouter();
  const { data } = useGetConsultantServices();
  console.log('data', data);
  const services = [
    {
      id: 1,
      title: 'Business Strategy Consultation',
      price: '$150 / hour',
      description:
        'Comprehensive business strategy review and planning for startups and small businesses.',
    },
    {
      id: 2,
      title: 'Marketing Plan Development',
      price: '$150 / hour',
      description:
        'Create effective marketing strategies tailored to your business goals and target audience.',
    },
    {
      id: 3,
      title: 'Financial Analysis & Planning',
      price: '$200 / hour',
      description:
        'Detailed financial analysis and future planning to optimize your business finances.',
    },
  ];

  const handleServicePress = (serviceId: number) => {
    console.log('Service pressed:', serviceId);
    // Handle service card press
  };

  const handleAddNewService = () => {
    console.log('Add new service pressed');
    router.push('/(module)/(a-root)/account-settings/services/add-service');
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <ServiceCard serviceData={item} />
  );

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header title="Services" showBackButton />

        <View className="flex-1 p-4">
          <FlatList
            data={data?.data}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
          {/* Add New Service Button */}
          <View className="mb-2">
            <Button
              title="Add New Service"
              icon={<AntDesign name="plus" size={20} color="white" />}
              onPress={handleAddNewService}
              fullWidth
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Services;
