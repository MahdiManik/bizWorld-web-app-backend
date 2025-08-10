import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/button';
import { router } from 'expo-router';
import { useGetMe } from '@/feature/(auth)/hooks/useAuth';
import { openPDF } from '@/lib/pdfPreview';

const CompanyInfo = () => {
  const { data } = useGetMe();

  const user = data?.data;
  const company = user?.company;
  const profile = user?.user_profile;

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header title="Company Info" showBackButton />
        <ScrollView className="flex-1 px-4">
          <View className="mt-4 gap-4 rounded-lg border-[0.5px] border-stroke-border p-4">
            <View className="flex-row items-center gap-4">
              <View className="flex-1 flex-row items-center justify-between">
                <View className="flex flex-row items-center gap-4">
                  <Image
                    source={{
                      uri: profile?.image?.url,
                    }}
                    className="h-20 w-20 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="gap-1">
                    <Text className="text-sm font-semibold text-title">
                      {company?.name}
                    </Text>
                    <Text className="text-description mt-1 text-xs">
                      Industry: {company?.industry}
                    </Text>
                    <View className="mt-1 self-start rounded-md border-none bg-[#E8F8F2] px-2 py-1">
                      <Text className="text-sm text-[#167F60]">{company?.companyStatus === true ? 'Active' : 'Inactive'}</Text>
                    </View>
                  </View>
                </View>

                {/* Edit Button */}
                <Button
                  title=""
                  onPress={() =>
                    router.push(
                      '/account-settings/company-info/edit-company-info'
                    )
                  }
                  icon={<AntDesign name="edit" size={24} color="black" />}
                  variant="text"
                />
              </View>
            </View>
            <View className="border border-[#094F811A]" />
            <View className="flex-row">
              <Text className="flex-1 font-roboto600 text-sm text-title">
                Company Size
              </Text>
              <Text className="flex-1 font-roboto400 text-sm text-description-text">
                {company?.companySize} Members
              </Text>
            </View>
            <View className="flex-row">
              <Text className="flex-1 font-roboto600 text-sm text-title">
                Revenue
              </Text>
              <Text className="flex-1 font-roboto400 text-sm text-description-text">
                {company?.revenue}/year
              </Text>
            </View>
            <View className="flex-row">
              <Text className="flex-1 font-roboto600 text-sm text-title">
                Location
              </Text>
              <Text className="flex-1 font-roboto400 text-sm text-description-text">
                {company?.location}
              </Text>
            </View>
            <View className="mb-4 border border-[#094F811A]" />

            <View>
              <Text className="mb-2 font-roboto600 text-sm text-title">
                Document
              </Text>
              <View className="flex-row items-center justify-between rounded-lg border border-[#094F81] bg-white px-4 py-3">
                <View className="gap-2">
                  <Text className="font-roboto500 text-sm text-black">
                    {company?.document?.name}
                  </Text>
                  <Text className="mr-2 text-xs text-placeholder">{company?.document?.size} KB</Text>
                </View>

                <TouchableOpacity onPress={() => openPDF(company?.document?.url)}>
                  <Ionicons name="eye-outline" size={22} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4 border border-[#094F811A]" />

            <View className="gap-2">
              <Text className="mb-2 font-roboto600 text-sm text-title">
                Description
              </Text>
              <Text className="text-justify font-roboto400 text-sm text-description-text">
                {company?.description}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CompanyInfo;
