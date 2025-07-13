import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MoreMenuModal() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  };

  const menuItems = [
    {
      title: "Consultants",
      icon: <Ionicons name="headset" size={24} color="#007AFF" />,
      onPress: () => {
        closeModal();
        // Navigate to consultants
        console.log("Navigate to Consultants");
      },
    },
    {
      title: "My Favorites",
      icon: <Ionicons name="heart" size={24} color="#007AFF" />,
      onPress: () => {
        closeModal();
        // Navigate to favorites
        console.log("Navigate to Favorites");
      },
    },
    {
      title: "Account Settings",
      icon: <FontAwesome name="user-circle-o" size={24} color="#007AFF" />,
      onPress: () => {
        closeModal();
        // Navigate to settings
        console.log("Navigate to Settings");
      },
    },
  ];

  return (
    <Pressable className="flex-1 justify-end" onPress={closeModal}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Pressable className="absolute inset-0 bg-black/50" />
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="absolute bottom-[100] right-0 space-y-4"
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-end py-3 px-5 shadow-lg my-2 gap-2"
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <Text className="text-base font-medium text-white">
              {item.title}
            </Text>
            <View className="w-10 h-10 bg-[#F2F2F7] rounded-full justify-center items-center mr-3">
              {item.icon}
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Pressable>
  );
}
