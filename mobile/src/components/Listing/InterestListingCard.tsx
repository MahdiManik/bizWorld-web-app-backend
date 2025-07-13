import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getImageSource } from '@/utils/getImageSource'
import { ListingAttributes } from 'types/listing'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { Entypo } from '@expo/vector-icons'
import { getCategoryLabel } from '@/utils/categoryMapping'

interface InterestCardProps {
  listing: ListingAttributes
  onViewBusiness?: (listing: ListingAttributes) => void
  onMessageOwner?: (listing: ListingAttributes) => void
  onMenuPress?: (listing: ListingAttributes) => void
  currentUserId?: number | null
}

export const InterestListingCard = ({
  listing,
  onViewBusiness,
  onMessageOwner,
  onMenuPress,
}: InterestCardProps) => {
  const getStatusColor = () => {
    switch (listing.status) {
      case 'Approved':
        return '#167F60'
      case 'Pending':
        return '#E3A14E'
      case 'Declined':
        return '#E31F1F'
      default:
        return '#6B7280'
    }
  }

  // const isOwnListing = listing.ownerId === currentUserId

  return (
    <View
      style={[tw`bg-white rounded-lg overflow-hidden shadow-2xl mb-4 w-full`]}>
      {/* Main image */}
      <View style={tw`relative`}>
        <Image
          source={getImageSource(listing?.image || '')}
          style={tw`w-full h-48`}
          resizeMode="cover"
        />
      </View>

      <View
        style={[
          tw`absolute top-0 left-0 px-2 py-1.5 rounded-r-md rounded-t-none`,
          { backgroundColor: colors.primary.DEFAULT },
        ]}>
        <Text style={tw`text-white text-xs font-medium`}>
          {getCategoryLabel(listing?.category)}
        </Text>
      </View>

      <TouchableOpacity
        style={tw`absolute top-2 right-2`}
        onPress={() => onMenuPress?.(listing)}>
        <Ionicons name="ellipsis-vertical" size={20} color="white" />
      </TouchableOpacity>

      {/* Content */}
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
          {listing?.askingPrice}
        </Text>

        <Text
          style={[tw`text-sm font-medium pb-1`, { color: colors.primary[50] }]}>
          {getCategoryLabel(listing?.category)}
        </Text>

        {/* Status */}
        <View style={styles.statusContainer}>
          <Entypo name="dot-single" size={28} color={getStatusColor()} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {listing.status}
          </Text>
        </View>

        {listing?.status === 'Declined' && (
          <View
            style={[
              tw`pl-2 py-2 rounded-lg text-lg mb-4`,
              {
                backgroundColor: colors.secondary[200],
                color: colors.primary.DEFAULT,
              },
            ]}>
            <Text style={[tw`font-semibold mb-2`]}>Reason for Decline</Text>
            <Text style={[tw`font-medium`]}>
              The business owner has decided to pursue other investment
              opportunities at this time.
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => onViewBusiness?.(listing)}>
            <Text style={styles.viewButtonText}>View Business</Text>
          </TouchableOpacity>

          {listing?.status === 'Declined' ? (
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => onViewBusiness?.(listing)}>
              <Text style={styles.viewButtonText}>Find Similar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => onMessageOwner?.(listing)}>
              <Text style={styles.messageButtonText}>Message Owner</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },

  ownerBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  ownerBadgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  viewButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary.DEFAULT,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: colors.primary.DEFAULT,
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  messageButtonText: {
    color: colors.white2,
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.white2,
    fontSize: 14,
    fontWeight: '600',
  },
})

export default InterestListingCard
