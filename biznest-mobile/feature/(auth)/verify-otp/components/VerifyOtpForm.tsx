import Button from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import OTPInput from '@/components/ui/otp-input';
import useCountdown from '../hooks/useCountdown';
import { useVerifyOtp, useResendRegisterOtp } from '../../hooks/useAuth';

const VerifyOtpForm = () => {
  const { formattedTime, restart } = useCountdown(60);
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendRegistrationOtp, isPending: isResending } =
    useResendRegisterOtp();

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      otp: '',
    },
  });

  const otpValue = watch('otp');

  const onSubmit = (data: { otp: string }) => {
    verifyOtp(data);
    reset()
  };

  const resendCode = () => {
    console.log('Resending OTP...');
    if (isResending) return;
    console.log('Resending OTP with countdown reset');
    resendRegistrationOtp();
    restart(60);
  };

  return (
    <View className="w-full gap-6">
      <View className="w-full gap-4">
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, onBlur, value } }) => (
            <OTPInput value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
      </View>

      <View className="mt-24 w-full gap-2">
        <Button
          className="py-4"
          onPress={handleSubmit(onSubmit)}
          title={isVerifying ? 'Verifying...' : 'Confirm'}
          fullWidth
          disabled={isVerifying || !otpValue || otpValue.length === 0}
        />
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="font-roboto400 text-sm text-primary">
            Did not recieve code?
          </Text>
          <Button
            title={isResending ? 'Sending...' : 'Send again'}
            onPress={resendCode}
            className="flex-row items-center justify-center rounded-lg py-2"
            variant="ghost"
            size="none"
            disabled={isResending || formattedTime !== '00:00'}
          />
        </View>
        <Text className="font-roboto400 text-sm text-gray-lighter">
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};

export default VerifyOtpForm;
