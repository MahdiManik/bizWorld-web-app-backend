// import React, { useState } from 'react'
// import { View, Text, Image, TouchableOpacity } from 'react-native'
// import tw from '@/lib/tailwind'
// import { UserProfile } from '@/../data/profileData'
// import ActionButton from '../ActionButton'
// import { colors } from '@/constants/colors'

// type ConsultantCardProps = {
//   item: UserProfile
//   onAction?: (item: UserProfile, action: 'accept' | 'reject') => void
//   onMessage?: (item: UserProfile) => void
// }

// const ConsultantCard: React.FC<ConsultantCardProps> = ({
//   item,
//   onAction,
//   onMessage,
// }) => {
//   const [showFullMessage, setShowFullMessage] = useState(false)
//   const fullMessage =
//     'I would be happy to help with your business valuation. Based on your project scope, I recommend starting with a comprehensive analysis of your financial statements and market position.'
//   const truncatedMessage = fullMessage.substring(0, 92) + '...'

//   const toggleMessage = () => {
//     setShowFullMessage(!showFullMessage)
//   }

//   const statusStyles = {
//     pending: {
//       bg: 'bg-[#FEF9C2]',
//       text: 'text-[#884B00]',
//       label: 'Pending',
//     },
//     accepted: {
//       bg: 'bg-[#DCFCE7]',
//       text: 'text-[#016730]',
//       label: 'Accepted',
//     },
//     rejected: {
//       bg: 'bg-[#FFE2E1]',
//       text: 'text-[#9F0A12]',
//       label: 'Rejected',
//     },
//     default: {
//       bg: 'bg-gray-100',
//       text: 'text-gray-700',
//       label: 'Unknown',
//     },
//   }

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
//           <View style={tw`flex-row justify-between items-center mb-2`}>
//             <Text style={tw`font-bold text-base `}>
//               {`${item.firstName} ${item.lastName}`}
//             </Text>
//             <View style={tw`flex-row items-center`}>
//               <Text
//                 style={[
//                   tw`text-xs capitalize px-3 py-1.5 rounded-full`,
//                   {
//                     backgroundColor:
//                       statusStyles[status as keyof typeof statusStyles]?.bg
//                         .replace('bg-[', '')
//                         .replace(']', '') ||
//                       statusStyles.default.bg
//                         .replace('bg-[', '')
//                         .replace(']', ''),
//                     color:
//                       statusStyles[status as keyof typeof statusStyles]?.text
//                         .replace('text-[', '')
//                         .replace(']', '') ||
//                       statusStyles.default.text
//                         .replace('text-[', '')
//                         .replace(']', ''),
//                   },
//                 ]}>
//                 {statusStyles[status as keyof typeof statusStyles]?.label ||
//                   status}
//               </Text>
//             </View>
//           </View>
//           {item.professionalHeadline && (
//             <Text style={tw`text-gray-600 text-xs`}>
//               {item.professionalHeadline}
//             </Text>
//           )}
//           {item.industrySpecialization && (
//             <Text style={tw`text-gray-500 text-xs mt-1`}>
//               {item.industrySpecialization}
//             </Text>
//           )}
//           <View style={tw``}>
//             {item.introduction && (
//               <Text style={tw`text-gray-800 text-sm mb-3`}>
//                 {item.introduction}
//               </Text>
//             )}
//             <View
//               style={[
//                 tw`p-2 mt-1 rounded-lg`,
//                 {
//                   color: colors.primary.DEFAULT,
//                   backgroundColor: colors.secondary[200],
//                 },
//               ]}>
//               <Text style={tw`text-sm font-medium mb-1`}>Message:</Text>
//               <View style={tw`rounded-lg `}>
//                 <Text style={tw`text-sm text-gray-700`}>
//                   {showFullMessage ? (
//                     fullMessage
//                   ) : (
//                     <>
//                       {truncatedMessage}
//                       <TouchableOpacity onPress={toggleMessage}>
//                         <Text
//                           style={[
//                             tw`block text-base font-semibold`,
//                             { color: colors.primary.DEFAULT },
//                           ]}>
//                           see more
//                         </Text>
//                       </TouchableOpacity>
//                     </>
//                   )}
//                 </Text>
//                 {showFullMessage && (
//                   <TouchableOpacity onPress={toggleMessage}>
//                     <Text style={tw`mt-1 text-base font-semibold`}>
//                       See Less
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>

//             <View style={tw`mt-2`}>
//               {status === 'pending' ? (
//                 <View style={tw`flex-row`}>
//                   <ActionButton
//                     label="Reject"
//                     variant="reject"
//                     onPress={() => onAction?.(item, 'reject')}
//                   />
//                   <ActionButton
//                     style={tw`ml-4`}
//                     label="Accept Request"
//                     variant="accept"
//                     onPress={() => onAction?.(item, 'accept')}
//                   />
//                 </View>
//               ) : status === 'accepted' ? (
//                 <ActionButton
//                   label="Message"
//                   variant="accept"
//                   onPress={() => onMessage?.(item)}
//                 />
//               ) : (
//                 <Text></Text>
//               )}
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   )
// }

// export default ConsultantCard
