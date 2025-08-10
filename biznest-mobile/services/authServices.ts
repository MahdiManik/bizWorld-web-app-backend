import api from '@/lib/axios';
import useSession from '@/store/session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '@/types/user';

export const TOKEN_KEY = 'accessToken';
export const USER_DATA_KEY = 'userData';

export type User = AuthUser;

interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    documentId: string;
    email: string;
    fullName?: string;
    role?: any;
    userStatus?: string;
  };
  message?: string;
}

class AuthService {
  async register(
    fullName: string,
    email: string,
    password: string,
    username?: string,
    extra: Record<string, any> = {}
  ): Promise<{
    success: boolean;
    requiresEmailConfirmation: boolean;
    token?: string;
    user?: User;
    message?: string;
    registrationToken?: string;
  }> {
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = (username ?? email.split('@')[0]).toLowerCase();

    const payload = {
      fullName,
      email: normalizedEmail,
      username: normalizedUsername,
      password,
      ...extra,
    };

    const { data } = await api.post('/auth/local/register', payload);
    const { jwt, user, registrationToken } = data;

    if (jwt) {
      await AsyncStorage.setItem(TOKEN_KEY, jwt);
    }

    return {
      success: true,
      requiresEmailConfirmation: !jwt,
      token: jwt,
      user: user && {
        id: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
        userStatus: user.userStatus,
        role: user.role,
      },
      message:
        data.message ??
        (jwt
          ? 'Registration successful'
          : 'Registration successful. Please verify your email.'),
      registrationToken,
    };
  }

  async resendRegistrationOtp(
    token: string
  ): Promise<{
    success: boolean;
    message: string;
    registrationToken?: string;
  }> {
    const response = await api.post('/auth/resend-register-otp', {
      token,
    });

    return {
      success: true,
      message: response.data.message || 'OTP resent successfully',
      registrationToken: response.data.registrationToken,
    };
  }

  async verifyOtp(
    otp: string,
    registrationToken: string
  ): Promise<{
    success: boolean;
    verified: boolean;
    jwt?: string;
    user?: User;
    message?: string;
  }> {
    const response = await api.post('/auth/complete-registration', {
      otp,
      registrationToken,
    });

    const isVerified = !!(response.data.jwt && response.data.user);

    if (isVerified) {
      await AsyncStorage.setItem(TOKEN_KEY, response.data.jwt);
    }

    return {
      success: true,
      verified: isVerified,
      jwt: response.data.jwt,
      user: response.data.user,
      message: response.data.message,
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post('/auth/local', {
      identifier: email,
      password,
    });

    const { jwt, user, message } = data;

    if (jwt) await AsyncStorage.setItem(TOKEN_KEY, jwt);
    if (user)
      await AsyncStorage.setItem(
        USER_DATA_KEY,
        JSON.stringify({ ...user, id: String(user.id) })
      );

    return {
      jwt,
      user,
      message,
    };
  }

  async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/forgot-password', {
      email: email.toLowerCase(),
    });
    return {
      success: true,
      message: response.data.message || 'Reset code sent to your email',
    };
  }

  async resendOtp(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/resend-otp', {
      email: email.toLowerCase(),
    });
    return {
      success: true,
      message: response.data.message || 'OTP resent successfully',
    };
  }

  async OtpEnter(email: string, otp: string) {
    const response = await api.post('/auth/verify-otp', {
      email,
      otp,
    });

    // Return the response data as is
    return response.data;
  }

  async resetPassword(
    password: string,
    passwordConfirmation: string,
    code: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/reset-password', {
      password,
      passwordConfirmation,
      code,
    });
    return {
      success: true,
      message: response.data.message || 'Password reset successful',
    };
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
    await AsyncStorage.removeItem('session');
    useSession.setState({ user: null, isLoggedIn: false });
  }

  async changePassword(
    currentPassword: string,
    password: string,
    passwordConfirmation: string
  ): Promise<{ success: boolean; message: string }> {
    const userDataStr = await AsyncStorage.getItem(USER_DATA_KEY);
    const userData = userDataStr ? JSON.parse(userDataStr) : null;

    if (!userData) throw new Error('User not logged in');

    const response = await api.post('/auth/change-password', {
      currentPassword,
      password: password,
      passwordConfirmation: passwordConfirmation,
    });

    return {
      success: true,
      message: response.data.message || 'Password changed successfully',
    };
  }

  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    const userDataStr = await AsyncStorage.getItem(USER_DATA_KEY);
    const userData = userDataStr ? JSON.parse(userDataStr) : null;

    if (!userData?.id) throw new Error('User not logged in');

    const response = await api.delete(`/users/${userData.id}`);

    // Optional: cleanup after deletion
    await AsyncStorage.removeItem(USER_DATA_KEY);
    await AsyncStorage.removeItem('accessToken');

    return {
      success: true,
      message: response?.data?.message || 'Account deleted successfully',
    };
  }
}

export const authService = new AuthService();
