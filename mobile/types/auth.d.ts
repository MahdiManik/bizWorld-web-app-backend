/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
declare module '@react-native-async-storage/async-storage'

declare module '@/hooks/useAuth' {
  export function useAuth(): {
    isAuthenticated: boolean | null
    isLoading: boolean
    login: (token: string) => Promise<void>
    logout: () => Promise<void>
  }
}

declare module 'expo-router' {
  interface Router {
    push: (route: string) => void
    replace: (route: string) => void
    back: () => void
  }

  export const router: Router
  export const useRouter: () => Router

  export function Redirect(props: { href: string }): JSX.Element
}
