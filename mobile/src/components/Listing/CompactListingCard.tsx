/* eslint-disable no-unused-vars */
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { getCategoryLabel } from '@/utils/categoryMapping'
import { ListingCreateInput } from '@/types/listing'

type CompactListingCardProps = {
  listing: ListingCreateInput
  onPress: (id: string) => void
  onFavorite?: () => void
  isFavorite?: boolean
  fullWidth?: boolean
}

export const CompactListingCard = ({
  listing,
  onPress,
  onFavorite,
  isFavorite = false,
  fullWidth = false,
}: CompactListingCardProps) => {
  const { width } = useWindowDimensions()

  // Calculate half width for the default card size
  const cardWidth = Math.max((width - 28) / 2 - 6)

  return (
    <TouchableOpacity
      style={[
        tw`rounded-2xl shadow-md overflow-hidden mb-4 p-2`,
        fullWidth
          ? { width: '100%', backgroundColor: colors.gray[50], height: 245 }
          : { width: cardWidth, backgroundColor: colors.gray[50], height: 245 },
      ]}
      onPress={() => onPress(String(listing.id))}>
      {/* Image section with overlay elements */}
      <View style={tw`relative`}>
        <Image
          source={listing.image?.url}
          style={[tw`h-40 rounded-lg`, { width: '100%', height: 153 }]} // Adjusted height to 153px
          resizeMode="cover"
        />

        {/* Favorite icon */}
        {onFavorite && (
          <TouchableOpacity
            style={[
              tw`absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm`,
              { backgroundColor: isFavorite ? colors.white : colors.gray[100] },
            ]}
            onPress={onFavorite}>
            <Feather
              name="heart"
              size={18}
              color={isFavorite ? colors.error : colors.gray[600]}
            />
          </TouchableOpacity>
        )}

        <Text
          style={[
            tw`absolute bottom-3 right-1 px-3 text-xs py-2 rounded-full`,
            { color: colors.gray[400], backgroundColor: colors.secondary[100] },
          ]}>
          {getCategoryLabel(listing?.category)}
        </Text>
      </View>

      {/* Info section */}
      <View style={tw`py-2`}>
        <Text style={tw`text-gray-900 font-semibold text-sm`} numberOfLines={1}>
          {listing?.title}
        </Text>
        <View style={tw`my-1`}>
          <Text style={[tw`text-xs`, { color: colors.link }]}>
            Asking Price - {listing?.askingPrice}
          </Text>
        </View>
        <View
          style={[tw`flex-row items-center mt-1`, { color: colors.gray[500] }]}>
          <Feather name="map-pin" size={12} color={colors.gray[500]} />
          <Text style={tw`text-gray-500 text-xs ml-1`}>
            {listing?.country || 'Location not available'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
