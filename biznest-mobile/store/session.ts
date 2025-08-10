import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/services/authServices';

interface SessionState {
  user: User | null;
  isLoggedIn: boolean;
  updateIsLoggedIn: (isLoggedIn: boolean) => void;
  updateUser: (user: User) => void;
  signIn: (access_token: string, user: User, isLoggedIn?: boolean) => void;
  signOut: () => Promise<void>;
}

const initData: SessionState = {
  user: null,
  isLoggedIn: false,
  updateIsLoggedIn: () => {},
  updateUser: () => {},
  signIn: () => {},
  signOut: async () => {},
};

const useSession = create<SessionState>()(
  persist(
    (set) => ({
      ...initData,
      updateIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

      updateUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : user,
        })),

      signIn: (access_token, user, isLoggedIn = true) => {
        if (access_token) {
          AsyncStorage.setItem('accessToken', access_token);
        }

        set({
          user,
          isLoggedIn,
        });
      },

      signOut: async () => {
        await AsyncStorage.multiRemove(['accessToken', 'userData']);
        set({ user: null, isLoggedIn: false });
      },
    }),
    {
      name: 'session',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useSession;
