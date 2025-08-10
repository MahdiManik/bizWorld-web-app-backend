import { View, Text, Image } from 'react-native';
import React from 'react';

interface NoListingDataProps {
  isFavourite?: boolean;
}
const NoListingData = ({ isFavourite }: NoListingDataProps) => {
  return (
    <View className="items-center justify-center px-8 py-16">
      <Image
        source={require('../../../../assets/images/listing-empty.png')}
        resizeMode="contain"
        style={{ width: 192, height: 192, marginBottom: 10 }}
      />
      <Text className="mb-4 text-center font-roboto600 text-base text-title">
        {isFavourite ? 'No Favorites Yet !' : 'No Business Listings Yet !'}
      </Text>
      <Text className="mb-8 text-center font-roboto400 text-sm text-black">
        {isFavourite
          ? 'You haven’t added any items to your favourites. Tap the heart icon on any item to save it here for quick access.'
          : 'It looks like there are no listings to display right now.'}
      </Text>
    </View>
  );
};

export default NoListingData;
