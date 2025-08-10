import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authService, User } from '@/services/authServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSession from '@/store/session';
import { STORAGE_KEYS } from '@/lib/constants';
import { userService } from '@/services/userServices';
import Toast from 'react-native-toast-message';

// Hook: Register
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      fullName,
      email,
      password,
    }: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const username = email.split('@')[0];
      return authService.register(fullName, email, password, username);
    },
    onSuccess: async (result) => {
      await AsyncStorage.setItem(
        STORAGE_KEYS.pendingEmail,
        result.user?.email ?? ''
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.registrationToken,
        result.registrationToken ?? ''
      );
      router.push('/(auth)/verify-otp');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
};

// Hook: Login
export const useLogin = () => {
  const router = useRouter();
  const session = useSession.getState();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),

    onSuccess: (result) => {
      const user: User = {
        id: String(result.user.id),
        documentId: result.user?.documentId?.toString(),
        email: result.user.email,
        fullName: result.user.fullName,
        userStatus: result.user.userStatus,
        role: result.user.role,
      };

      session.signIn(result.jwt, user, true);
      Toast.show({
        type: 'success',
        text1: 'Login successfull',
      });
      router.push('/');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
};

// Hook: Verify OTP
export const useVerifyOtp = () => {
  const router = useRouter();
  const session = useSession.getState();

  return useMutation({
    mutationFn: async ({ otp }: { otp: string }) => {
      const registrationToken = await AsyncStorage.getItem(
        STORAGE_KEYS.registrationToken
      );
      return authService.verifyOtp(otp, registrationToken ?? '');
    },
    onSuccess: async (result) => {
      const jwt = result.jwt ?? '';
      const user: User = {
        id: String(result.user?.id ?? ''),
        email: result.user?.email ?? '',
        fullName: result.user?.fullName,
        userStatus: result.user?.userStatus,
        role: result.user?.role ?? null,
      };

      session.signIn(jwt, user, false);

      await AsyncStorage.setItem(STORAGE_KEYS.accessToken, jwt);
      await AsyncStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(user));
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.pendingEmail,
        STORAGE_KEYS.registrationToken,
      ]);

      router.push('/(auth)/user-onboarding');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
};

// Hook: Resend OTP for password reset
export const useResendOtp = () => {
  return useMutation({
    mutationFn: async () => {
      const email = await AsyncStorage.getItem(STORAGE_KEYS.resetEmail);
      if (!email) {
        throw new Error('Email for password reset not found.');
      }
      return authService.resendOtp(email);
    },
    onSuccess: (data) => {
      Toast.show({
        type: 'success',
        text1: data.message,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
};

// Hook: Forgot Password
export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: async (_, email) => {
      await AsyncStorage.setItem(STORAGE_KEYS.resetEmail, email ?? '');
      router.push('/(auth)/otp-enter');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
};

// Hook: OtpEnter
export const useOtpEnter = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ otp }: { otp: string }) => {
      const email = await AsyncStorage.getItem(STORAGE_KEYS.resetEmail);
      if (!email) {
        throw new Error(
          'Email not found. Please restart the password reset process.'
        );
      }
      return authService.OtpEnter(email, otp); // This returns { data: { code, jwt, ... } }
    },
    onSuccess: async (response) => {
      console.log('OTP verification response:', response);

      const code = response?.data?.code;
      if (code) {
        await AsyncStorage.setItem(STORAGE_KEYS.resetCode, code);
        router.push('/(auth)/reset-pass');
      } else {
        console.error('No code found in OTP response');
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
};

// Hook: Reset Password
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      password: string;
      passwordConfirmation: string;
    }) => {
      const code = await AsyncStorage.getItem(STORAGE_KEYS.resetCode);
      if (!code) {
        throw new Error(
          'Reset code not found. Please try the password reset process again.'
        );
      }
      return authService.resetPassword(
        data.password,
        data.passwordConfirmation,
        code
      );
    },
    onSuccess: async () => {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.resetEmail,
        STORAGE_KEYS.resetCode,
      ]);
      router.replace('/(modal)/reset-pass-success');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
};

// Hook: Change Password
export const useChangePassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({
      currentPassword,
      password,
      passwordConfirmation,
    }: {
      currentPassword: string;
      password: string;
      passwordConfirmation: string;
    }) =>
      authService.changePassword(
        currentPassword,
        password,
        passwordConfirmation
      ),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Password changed successfully',
      });
      router.push('/account-settings');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
};

// Hook: Logout
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      Toast.show({
        type: 'success',
        text1: 'Logout successfully',
      });
      router.replace('/(auth)/login');
    },
    onError: (error: any) => {
      queryClient.clear();
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
      router.replace('/(auth)/login');
    },
  });
};

export function useDeleteAccount() {
  const router = useRouter();
  const resetSession = useSession((s) => s.signOut);

  return useMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: (data) => {
      Toast.show({
        type: 'success',
        text1: data.message,
      });

      resetSession();
      router.replace('/(auth)/login');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
}

export const useSessionUser = () => useSession((s) => s.user);
export const useUserId = () => useSession((s) => s.user?.id ?? null);
export const useIsLoggedIn = () => useSession((s) => s.isLoggedIn);

// Utility hook to get stored emails & tokens
export const useStoredEmail = () => ({
  getPendingEmail: () => AsyncStorage.getItem(STORAGE_KEYS.pendingEmail),
  getResetEmail: () => AsyncStorage.getItem(STORAGE_KEYS.resetEmail),
  getRegistrationToken: () =>
    AsyncStorage.getItem(STORAGE_KEYS.registrationToken),
  getResetCode: () => AsyncStorage.getItem(STORAGE_KEYS.resetCode),
});

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: userService.getMe,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook: Resend Registration OTP
export const useResendRegisterOtp = () => {
  return useMutation({
    mutationFn: async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.registrationToken);
      if (!token) {
        throw new Error('No registration token found.');
      }
      return authService.resendRegistrationOtp(token);
    },
    onSuccess: async (result) => {
      if (result.registrationToken) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.registrationToken,
          result.registrationToken
        );
      }
      Toast.show({
        type: 'success',
        text1: result.message,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error?.message || error.message,
      });
    },
  });
};
