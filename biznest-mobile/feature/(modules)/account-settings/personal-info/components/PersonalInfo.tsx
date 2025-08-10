import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import Button from '@/components/ui/button';
import { router } from 'expo-router';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetMe } from '@/feature/(auth)/hooks/useAuth';
import { openPDF } from '@/lib/pdfPreview';

const PersonalInfo = () => {
  const { data } = useGetMe();

  const user = data?.data;
  const profile = user?.user_profile;

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header title="Personal Info" showBackButton />
        <ScrollView className="flex-1 px-4">
          <View className="mt-4 flex-1 rounded-lg border-[0.5px] border-stroke-border p-4">
            <View className="mb-6 flex-row items-center gap-4">
              <View className="flex-1 flex-row items-center justify-between">
                <View className="flex flex-1 flex-row items-start gap-6">
                  <Image
                    source={{
                      uri: profile?.image?.url,
                    }}
                    className="h-24 w-24 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="gap-1">
                    <Text className="text-xl font-semibold text-title">
                      {user?.fullName}
                    </Text>
                    <Text className="text-description text-base">
                      industry: {profile?.industrySpecialization}
                    </Text>
                    <Text className="text-description rounded-md border border-stroke-border bg-[#0000000D] py-1 text-center text-base">
                      {profile?.professionalHeadline}
                    </Text>
                  </View>
                </View>

                {/* Edit Button */}
                <Button
                  title=""
                  onPress={() =>
                    router.push(
                      '/account-settings/personal-info/edit-personal-info'
                    )
                  }
                  icon={<AntDesign name="edit" size={24} color="black" />}
                  variant="text"
                />
              </View>
            </View>

            {/* Contact Information */}
            <View className="mb-6 space-y-4">
              {/* Email */}
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="#666"
                  style={{ marginRight: 12 }}
                />
                <Text className="text-base text-link">{user?.email}</Text>
              </View>

              {/* Phone */}
              <View className="flex-row items-center">
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#666"
                  style={{ marginRight: 12 }}
                />
                <Text className="text-base text-link">
                  {profile?.phonePrefix}
                  {profile?.phone}
                </Text>
              </View>
            </View>

            <View className="mb-4 border border-[#094F811A]" />

            {/* Introduction */}
            <View className="mb-6">
              <Text className="mb-2 font-roboto600 text-sm text-title">
                Introduction
              </Text>
              <Text className="font-roboto400 text-sm text-description-text">
                {profile?.introduction}
              </Text>
            </View>

            <View className="mb-4 border border-[#094F811A]" />

            {/* Expertise Areas */}
            <View className="mb-6">
              <Text className="mb-2 font-roboto600 text-sm text-title">
                Areas of Expertise
              </Text>
              <View className="pl-2">
                {!!profile?.areasOfExpertise?.length &&
                  profile?.areasOfExpertise?.map((item: any, index: any) => (
                    <View key={index} className="flex-row items-center py-1">
                      <Text className="mr-2 text-sm">•</Text>
                      <Text className="font-roboto400 text-sm text-description-text">
                        {item}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>

            <View className="mb-4 border border-[#094F811A]" />

            {/* Portfolio Link */}
            <View className="mb-6">
              <Text className="mb-2 font-roboto600 text-sm text-title">
                Portfolio Link
              </Text>
              <Text className="text-base text-link underline">
                {profile?.portfolioLink}
              </Text>
            </View>

            <View className="mb-4 border border-[#094F811A]" />

            {/* Document Section */}
            <View>
              <Text className="mb-2 font-roboto600 text-sm text-title">
                Document
              </Text>
              <View className="flex-1 flex-row items-center justify-between rounded-lg border border-[#094F81] bg-white px-4 py-3">
                <View className="gap-2">
                  <Text className="font-roboto500 text-sm text-black">
                    {profile?.document?.name}
                  </Text>
                  <Text className="mr-2 text-xs text-description-text">
                    {profile?.document?.size} KB
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => openPDF(profile?.document?.url)}
                >
                  <Ionicons name="eye-outline" size={22} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default PersonalInfo;
