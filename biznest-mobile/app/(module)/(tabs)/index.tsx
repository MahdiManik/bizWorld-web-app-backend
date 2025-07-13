// app/(tabs)/index.tsx - Home Screen (same as before)
import Button from "@/components/ui/button";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F7]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex flex-row justify-between items-center px-5 py-4">
          <View className="flex flex-row items-center">
            <FontAwesome name="user-circle" size={40} color="#8E8E93" />
            <View className="ml-3">
              <Text className="text-lg font-roboto600">Hi, John Smith</Text>
              <Text className="text-sm text-gray-500">
                What would you like to consult today?
              </Text>
            </View>
          </View>
          <Ionicons name="notifications" size={28} color="#007AFF" />
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white mx-5 my-4 px-4 py-2 rounded-xl">
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search..."
            placeholderTextColor="#8E8E93"
          />
          <Ionicons name="filter" size={20} color="#8E8E93" />
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mx-5 my-4">
          <View className="flex-1 bg-white rounded-xl p-4 mr-2">
            <Text className="text-gray-500 text-sm">Active Listings</Text>
            <Text className="text-2xl font-bold mt-1">4</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 ml-2">
            <Text className="text-gray-500 text-sm">Investor Inquiries</Text>
            <Text className="text-2xl font-bold mt-1">24</Text>
          </View>
        </View>

        {/* Your Listings Section */}
        <View className="px-5 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold">Your Listings</Text>
            <TouchableOpacity>
              <Text className="text-[#007AFF]">View All</Text>
            </TouchableOpacity>
          </View>

          {/* Listing Card */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <View className="bg-[#007AFF]/10 self-start rounded-full px-3 py-1 mb-3">
              <Text className="text-[#007AFF] text-sm">E-commerce</Text>
            </View>
            <View className="h-48 bg-gray-200 rounded-lg mb-3" />
            <Text className="text-lg font-semibold mb-2">
              Shopify store selling Shilajit in a unique ready-to-drink shots
              package.
            </Text>
            <Text className="text-[#007AFF] font-medium mb-1">
              Asking Price - $750,000
            </Text>
            <Text className="text-gray-500">Small Business</Text>
          </View>
        </View>

        {/* Explore Nearby */}
        <View className="px-5 py-4">
          <Text className="text-xl font-semibold mb-4">
            Explore Nearby Listings
          </Text>
          <Button
            title="Apply"
            icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            onPress={() => console.log("Apply pressed")}
            fullWidth
          />
          <View className="h-48 bg-gray-200 rounded-lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
