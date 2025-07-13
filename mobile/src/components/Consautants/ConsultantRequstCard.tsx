// import React, { useState } from 'react'
// import { View, Text, Image, TouchableOpacity } from 'react-native'
// import tw from '@/lib/tailwind'
// import { Ionicons } from '@expo/vector-icons'
// import { UserProfile } from '@/../data/profileData'
// import ActionButton from '../ActionButton'
// import { colors } from '@/constants/colors'

// type ConsultantRequestCardProps = {
//   item: UserProfile
//   onAction?: (item: UserProfile, action: 'accept' | 'reject') => void
//   onMessage?: (item: UserProfile) => void
//   navigation?: any
// }

// const ConsultantRequestCard: React.FC<ConsultantRequestCardProps> = ({
//   item,
//   onAction,
//   onMessage,
//   navigation,
// }) => {
//   const status = item.status || 'default'

//   return (
//     <View
//       style={[
//         tw`bg-white mt-4 rounded-lg overflow-hidden border`,
//         { borderColor: colors.gray[800] },
//       ]}>
//       <View style={tw`flex-row p-3 border-b border-gray-100`}>
//         <Image
//           source={{ uri: item.profileImage }}
//           style={tw`w-12 h-12 rounded-full`}
//           resizeMode="cover"
//         />
//         <View style={tw`flex-1 ml-3`}>
//           <View style={tw`flex-row justify-between items-center`}>
//             <Text style={tw`font-bold text-base `}>
//               {`${item.firstName} ${item.lastName}`}
//             </Text>
//             <View style={tw`flex-row items-center`}>
//               <View style={tw`flex-row items-center`}>
//                 <Ionicons name="star" size={14} color="#FFD700" />
//                 <Text
//                   style={[
//                     tw`text-lg font-bold ml-1`,
//                     { color: colors.gray[600] },
//                   ]}>
//                   {item.rating || 0}
//                   <Text
//                     style={[
//                       tw`text-xs ml-1`,
//                       { color: colors.secondary[600] },
//                     ]}>
//                     (28)
//                   </Text>
//                 </Text>
//               </View>
//             </View>
//           </View>
//           <View style={tw``}>
//             {item.areasOfExpertise && (
//               <Text style={tw`text-gray-800 text-sm mb-0.5`}>
//                 {item.areasOfExpertise}
//               </Text>
//             )}
//             {item.companyInfo.location && (
//               <Text style={tw`text-gray-800 text-sm mb-3`}>
//                 {item.companyInfo.location}
//               </Text>
//             )}
//           </View>

//           <View style={tw``}>
//             <View style={tw`flex-row justify-between items-center mb-2`}>
//               <Text style={tw`font-bold text-base `}>
//                 {`$ ${item.hourlyRate}`}{' '}
//                 <Text style={tw`text-gray-400 text-base`}>{`/hour`}</Text>
//               </Text>
//               <View style={tw`flex-row items-center`}>
//                 <View style={tw`flex-row items-center`}>
//                   <Text
//                     style={[
//                       tw`text-xs capitalize px-3 py-1.5 rounded-full`,
//                       {
//                         color: colors.secondary[800],
//                         backgroundColor: colors.secondary[700],
//                       },
//                     ]}>
//                     Available
//                   </Text>
//                 </View>
//               </View>
//             </View>
//             {item.introduction && (
//               <Text style={tw`text-gray-800 text-sm mb-3`}>
//                 {item.introduction}
//               </Text>
//             )}
//             <View style={tw`mt-2`}>
//               <ActionButton
//                 label="Select & Request"
//                 variant="reject"
//                 onPress={() => {
//                   if (navigation) {
//                     navigation.push(
//                       `/(root-layout)/request-consultant/${item.id || '1'}?name=${encodeURIComponent(`${item.firstName} ${item.lastName}`)}`
//                     )
//                   }
//                 }}
//               />
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   )
// }

// export default ConsultantRequestCard
