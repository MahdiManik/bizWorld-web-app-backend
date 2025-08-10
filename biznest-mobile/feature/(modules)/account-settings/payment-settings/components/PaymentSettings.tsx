import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { AntDesign } from '@expo/vector-icons';
import colors from '@/constants/colors';
import Button from '@/components/ui/button';

const PaymentSettings = () => {
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header title="Payment Settings" showBackButton />


        <View className="flex-1 p-4">
          <View className="flex-1">
            {/* Payment Settings Header */}
            <Text className="mb-2 font-roboto600 text-lg text-title">
              Payment Settings
            </Text>
            <Text className="mb-6 font-roboto400 text-xs text-placeholder">
              Manage your payment integration for client services
            </Text>

            {/* Payment Settings Card */}
            <View className="mb-4 rounded-lg border border-unselect bg-bd_tech_secondary p-4">
              <View className="gap-3">
                <View className="flex-row items-center gap-2">
                  <AntDesign name="infocirlceo" size={18} className='bg-orange50 p-2 rounded-full' color={colors.orange600} />
                  <Text className="font-roboto600 text-sm text-primary">
                    HitPay Account Not Connected
                  </Text>
                </View>
                <Text className="font-roboto400 text-xs text-description-text">
                  Connect your HitPay account to enable QR code payments for your services.
                </Text>

                <View className="mb-4 rounded-lg border border-unselect bg-white p-4">
                  <View className="flex-row items-center gap-2">
                    <AntDesign name="close" size={16} className='bg-secondary2 p-2 rounded-full' color={colors.red} />
                    <View>
                      <Text className="font-roboto600 text-sm text-primary">HitPay connection failed.</Text>
                      <Text className="font-roboto400 text-xs text-description-text">Please create a HitPay account first.</Text>
                    </View>
                  </View>
                </View>

                <Button
                  title='Create HitPay Account'
                  onPress={() => { }}
                  variant='primary'
                  fullWidth
                />
              </View>
            </View>

            {/* payment QR code */}
            <View className="mb-4 rounded-lg border border-unselect bg-card_bg p-4">
              <View className="flex-row items-start gap-2">
                <AntDesign name="qrcode" className='bg-white p-1 rounded-full' size={24} color={colors.primary} />
                <View className="flex-1 gap-1">
                  <Text className="font-roboto600 text-sm text-primary">Automatic QR Payments</Text>
                  <Text className="font-roboto400 text-xs text-description-text">Once connected, your services will automatically generate HitPay QR codes in chat so clients can scan and pay easily.</Text>
                </View>
              </View>

            </View>

            <View className="flex-row items-center justify-center gap-2">
              <Text className="font-roboto400 text-center text-sm text-link">Don’t have a HitPay account? Create one</Text>
              <AntDesign name="export" size={20} color={colors.link} />
            </View>
          </View>
        </View>

      </SafeAreaView>
    </>
  );
};

export default PaymentSettings; 
