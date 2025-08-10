import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import Input from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';

const Chat = () => {
  const renderListingItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="flex-row gap-3">
      <Image
        source={require('@/assets/images/consultants.png')}
        alt="consultants"
        className="relative h-12 w-12 object-cover"
        resizeMode="cover"
      />
      <View className="gap-2">
        <Text className="font-roboto600 text-sm text-neutral-active">
          {item.name}
        </Text>
        <Text className="font-roboto400 text-xs text-neutral-disable">
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const mockListings: any = [];
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-white"
      >
        <Header
          title="Inbox"
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />
        <View className="p-4">
          <View className="flex flex-row items-center gap-4">
            <Input
              leftIcon={<Ionicons name="search" size={20} color="#8E8E93" />}
              className="border-0 bg-lightgray"
              placeholder="Search .."
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="filter" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          {mockListings.length === 0 ? (
            <View className="items-center justify-center px-8 py-16">
              <Image
                source={require('@/assets/images/chat-empty.png')}
                className="mb-8 h-48 w-48"
                resizeMode="contain"
              />
              <Text className="mb-2 text-center font-roboto600 text-lg text-neutral-active">
                Go premium to unlock startup access and start chatting with
                sellers.
              </Text>
              <Text className="mb-8 text-center font-roboto400 text-sm text-neutral-disable">
                A Premium account is required to chat with sellers.
              </Text>
              <TouchableOpacity className="w-full rounded-lg bg-primary px-6 py-4">
                <Text className="text-center font-roboto600 text-base text-white">
                  Upgrade Now
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={mockListings}
              renderItem={renderListingItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 16,
                paddingBottom: 100,
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Chat;
