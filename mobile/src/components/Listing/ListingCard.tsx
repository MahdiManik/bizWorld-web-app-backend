import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { ListingCreateInput } from '@/types/listing'

interface ListingCardProps {
  listing: ListingCreateInput
  onPress?: () => void
  onMenuPress?: () => void
  onViewBusiness?: () => void
  onMessageOwner?: () => void
}

export const ListingCard = ({
  listing,
  onPress,
  onMenuPress,
  onViewBusiness,
  onMessageOwner,
}: ListingCardProps) => {
  return (
    <TouchableOpacity
      style={[tw`bg-white rounded-lg overflow-hidden shadow-2xl mb-4 w-full`]}
      onPress={onPress}>
      <View style={tw`relative`}>
        <Image
          source={listing.image?.url}
          style={tw`w-full h-48`}
          resizeMode="cover"
        />

        <View
          style={[
            tw`absolute top-0 left-0 px-2 py-1.5 rounded-r-md rounded-t-none`,
            { backgroundColor: colors.primary.DEFAULT },
          ]}>
          <Text style={tw`text-white text-xs font-medium`}>
            {listing?.category || 'ECOMMERCE'}
          </Text>
        </View>

        {onMenuPress && (
          <TouchableOpacity
            style={tw`absolute top-2 right-2 p-1`}
            onPress={onMenuPress}>
            <Feather name="more-vertical" size={26} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View style={tw`p-3`}>
        <Text
          style={[
            tw`font-semibold text-base mb-1`,
            { color: colors.primary[50] },
          ]}
          numberOfLines={2}>
          {listing?.title}
        </Text>

        <Text style={[tw`py-1 text-base`, { color: colors.link }]}>
          Asking Price - {listing?.askingPrice || '$0'}
        </Text>

        <Text
          style={[tw`text-sm font-medium pb-2`, { color: colors.primary[50] }]}>
          {listing?.category || 'Small Business'}
        </Text>

        {(onViewBusiness || onMessageOwner) && (
          <View style={tw`flex-row mt-2`}>
            {onViewBusiness && (
              <TouchableOpacity
                style={tw`flex-1 border border-blue-900 rounded-md py-2 mr-2`}
                onPress={onViewBusiness}>
                <Text style={tw`text-blue-900 text-center text-xs font-medium`}>
                  View Business
                </Text>
              </TouchableOpacity>
            )}

            {onMessageOwner && (
              <TouchableOpacity
                style={[
                  tw`flex-1 rounded-md py-2`,
                  { backgroundColor: colors.primary.DEFAULT },
                ]}
                onPress={onMessageOwner}>
                <Text style={tw`text-white text-center text-xs font-medium`}>
                  Message Owner
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
