import Header from '@/components/ui/header';
import Settings from '@/feature/(modules)/account-settings/Settings';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountSettingsPage() {
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-white"
      >
        <Header
          title="Account Settings"
          showBackButton
          rightComponent={
            <Ionicons name="notifications-sharp" size={24} color="white" />
          }
        />
        <View className="flex-1">
          <Settings />
        </View>
      </SafeAreaView>
    </>
  );
}
