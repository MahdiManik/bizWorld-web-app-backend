import ConsultantsIcon from '@/assets/svgs/tabs/ConsultantsIcon';
import FavouriteIcon from '@/assets/svgs/tabs/FavouriteIcon';
import ProfileIcon from '@/assets/svgs/tabs/ProfileIcon';

import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
  }, [fadeAnim, scaleAnim]);

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
      title: 'Consultants',
      icon: <ConsultantsIcon />,
      onPress: () => {
        router.replace('/(module)/(a-root)/consultants');
      },
    },
    {
      title: 'My Favorites',
      icon: <FavouriteIcon />,
      onPress: () => {
        router.replace('/(module)/(a-root)/favourites');
      },
    },
    {
      title: 'Account Settings',
      icon: <ProfileIcon />,
      onPress: () => {
        router.replace('/(module)/(a-root)/account-settings');
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
            className="my-2 flex-row items-center justify-end gap-2 px-5 py-3 shadow-lg"
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <Text className="text-base font-medium text-white">
              {item.title}
            </Text>
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#F2F2F7]">
              {item.icon}
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Pressable>
  );
}
