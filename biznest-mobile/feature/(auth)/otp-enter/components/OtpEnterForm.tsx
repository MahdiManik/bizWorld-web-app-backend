import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Button from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import OTPInput from '@/components/ui/otp-input';
import useCountdown from '../../verify-otp/hooks/useCountdown';
import { useOtpEnter, useResendOtp } from '../../hooks/useAuth';

const OtpEnterForm = () => {
  const { formattedTime, restart } = useCountdown(60);
  const { mutate: verifyOtp, isPending: isVerifying } = useOtpEnter();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { otp: '' },
  });

  const otpValue = watch('otp');

  const onSubmit = ({ otp }: { otp: string }) => {
    verifyOtp({ otp });
  };

  const handleResend = () => {
    console.log('Resending OTP...');
    if (isResending || formattedTime !== '00:00') return;
    restart(60);
    console.log('Resending OTP with countdown reset');
    resendOtp(undefined, {
      onSuccess: () => restart(60),
    });
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
          disabled={isVerifying || !otpValue}
        />
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="font-roboto400 text-sm text-primary">
            Did not receive code?
          </Text>
          <Button
            title={isResending ? 'Sending...' : 'Send again'}
            onPress={handleResend}
            className="py-2"
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

export default OtpEnterForm;
