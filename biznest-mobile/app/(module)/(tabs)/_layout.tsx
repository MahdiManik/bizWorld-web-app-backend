import BurgerIcon from '@/assets/svgs/tabs/BurgerIcon';
import ChatIcon from '@/assets/svgs/tabs/ChatIcon';
import DocumentIcon from '@/assets/svgs/tabs/DocumentIcon';
import HomeIcon from '@/assets/svgs/tabs/HomeIcon';
import UserIcon from '@/assets/svgs/tabs/UserIcon';
import colors from '@/constants/colors';
import { Tabs, router } from 'expo-router';
import { Platform, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.placeholder,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <HomeIcon isActive={focused} />,
        }}
      />

      <Tabs.Screen
        name="listings"
        options={{
          title: 'Listings',
          tabBarIcon: ({ focused }) => <DocumentIcon isActive={focused} />,
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => <ChatIcon isActive={focused} />,
        }}
      />

      <Tabs.Screen
        name="investors"
        options={{
          title: 'Investors',
          tabBarIcon: ({ focused }) => <UserIcon isActive={focused} />,
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: () => (
            <View>
              <BurgerIcon />
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              accessibilityRole={props.accessibilityRole}
              accessibilityState={props.accessibilityState}
              accessibilityLabel={props.accessibilityLabel}
              testID={props.testID}
              style={props.style}
              onPress={() => {
                // Open modal instead of navigating to more screen
                router.push('/more-menu');
              }}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
