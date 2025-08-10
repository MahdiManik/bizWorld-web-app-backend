import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';

type NoDataProps = {
  title: string;
  description: string;
  image?: ImageSourcePropType;
};

const defaultImage = require('@/assets/svgs/tabs/No data-cuate 1.svg');

const NoData = ({ image = defaultImage, title, description }: NoDataProps) => {
  return (
    <View className="items-center justify-center px-6 py-10">
      <Image
        source={image}
        className="w-[150px] h-[150px] mb-5"
        resizeMode="contain"
      />
      <Text className="text-base roboto700 mb-3 text-title text-center">{title}</Text>
      <Text className="text-sm text-description-text text-center roboto400">{description}</Text>
    </View>
  );
};

export default NoData;
