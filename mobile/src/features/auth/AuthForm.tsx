// /* eslint-disable no-unused-vars */
// import React, { useState } from 'react'
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
// } from 'react-native'
// import { Feather } from '@expo/vector-icons'

// enum AuthMode {
//   LOGIN = 'LOGIN',
//   REGISTER = 'REGISTER',
//   FORGOT_PASSWORD = 'FORGOT_PASSWORD',
// }

// const AuthForm = () => {
//   const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [name, setName] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async () => {
//     setIsLoading(true)

//     // try {
//     //   if (mode === AuthMode.LOGIN) {
//     //     await login(email, password)
//     //   } else if (mode === AuthMode.REGISTER) {
//     //     await register({ email, password, name })
//     //   } else if (mode === AuthMode.FORGOT_PASSWORD) {
//     //     await forgotPassword(email)
//     //   }
//     // } catch (error) {
//     //   console.error('Auth error:', error)
//     // } finally {
//     //   setIsLoading(false)
//     // }
//   }

//   const renderLoginForm = () => (
//     <View className="mt-6">
//       <View className="mb-4">
//         <Text className="text-gray-700 font-sans-medium mb-2">Email</Text>
//         <TextInput
//           className="bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-4 py-3"
//           placeholder="Enter your email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <View className="mb-4">
//         <Text className="text-gray-700 font-sans-medium mb-2">Password</Text>
//         <TextInput
//           className="bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-4 py-3"
//           placeholder="Enter your password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>

//       <TouchableOpacity
//         className="mt-2 mb-6"
//         onPress={() => setMode(AuthMode.FORGOT_PASSWORD)}>
//         <Text className="text-blue-600 font-sans-medium text-right">
//           Forgot Password?
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         className="bg-blue-600 rounded-md py-3 items-center"
//         onPress={handleSubmit}
//         disabled={isLoading}>
//         <Text className="text-white font-sans-bold text-lg">
//           {isLoading ? 'Signing in...' : 'Sign In'}
//         </Text>
//       </TouchableOpacity>

//       <View className="flex-row justify-center mt-6">
//         <Text className="text-gray-600">Don&apos;t have an account? </Text>
//         <TouchableOpacity onPress={() => setMode(AuthMode.REGISTER)}>
//           <Text className="text-blue-600 font-sans-medium">Sign Up</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )

//   const renderRegisterForm = () => (
//     <View className="mt-6">
//       <View className="mb-4">
//         <Text className="text-gray-700 font-sans-medium mb-2">Full Name</Text>
//         <TextInput
//           className="bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-4 py-3"
//           placeholder="Enter your full name"
//           value={name}
//           onChangeText={setName}
//         />
//       </View>

//       <View className="mb-4">
//         <Text className="text-gray-700 font-sans-medium mb-2">Email</Text>
//         <TextInput
//           className="bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-4 py-3"
//           placeholder="Enter your email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <View className="mb-6">
//         <Text className="text-gray-700 font-sans-medium mb-2">Password</Text>
//         <TextInput
//           className="bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-4 py-3"
//           placeholder="Create a password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>

//       <TouchableOpacity
//         className="bg-blue-600 rounded-md py-3 items-center"
//         onPress={handleSubmit}
//         disabled={isLoading}>
//         <Text className="text-white font-sans-bold text-lg">
//           {isLoading ? 'Creating Account...' : 'Create Account'}
//         </Text>
//       </TouchableOpacity>

//       <View className="flex-row justify-center mt-6">
//         <Text className="text-gray-600">Already have an account? </Text>
//         <TouchableOpacity onPress={() => setMode(AuthMode.LOGIN)}>
//           <Text className="text-blue-600 font-sans-medium">Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )

//   const renderForgotPasswordForm = () => (
//     <View className="mt-6">
//       <View className="mb-6">
//         <Text className="text-gray-700 font-sans-medium mb-2">Email</Text>
//         <TextInput
//           className="bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-4 py-3"
//           placeholder="Enter your email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <TouchableOpacity
//         className="bg-blue-600 rounded-md py-3 items-center"
//         onPress={handleSubmit}
//         disabled={isLoading}>
//         <Text className="text-white font-sans-bold text-lg">
//           {isLoading ? 'Sending Link...' : 'Reset Password'}
//         </Text>
//       </TouchableOpacity>

//       <View className="flex-row justify-center mt-6">
//         <Text className="text-gray-600">Remember your password? </Text>
//         <TouchableOpacity onPress={() => setMode(AuthMode.LOGIN)}>
//           <Text className="text-blue-600 font-sans-medium">Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )

//   return (
//     <ScrollView className="flex-1 px-6">
//       <View className="items-center mt-10 mb-6">
//         <View className="h-20 w-20 bg-blue-600 rounded-2xl items-center justify-center mb-4">
//           <Feather name="briefcase" size={40} color="white" />
//         </View>
//         <Text className="text-3xl font-sans-bold text-gray-800">BizNest</Text>
//         <Text className="text-gray-500 font-sans-medium mt-2">
//           Connect Entrepreneurs & Investors
//         </Text>
//       </View>

//       <View className="mt-6">
//         <Text className="text-2xl font-sans-bold text-gray-800">
//           {mode === AuthMode.LOGIN
//             ? 'Welcome Back'
//             : mode === AuthMode.REGISTER
//               ? 'Create Account'
//               : 'Reset Password'}
//         </Text>
//         <Text className="text-gray-500 mt-2">
//           {mode === AuthMode.LOGIN
//             ? 'Sign in to access your account'
//             : mode === AuthMode.REGISTER
//               ? 'Sign up to get started with BizNest'
//               : 'Enter your email to receive a reset link'}
//         </Text>
//       </View>

//       {mode === AuthMode.LOGIN && renderLoginForm()}
//       {mode === AuthMode.REGISTER && renderRegisterForm()}
//       {mode === AuthMode.FORGOT_PASSWORD && renderForgotPasswordForm()}
//     </ScrollView>
//   )
// }

// export default AuthForm
