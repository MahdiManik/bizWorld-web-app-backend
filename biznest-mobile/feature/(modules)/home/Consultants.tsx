import { Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';

interface ConsultantsProps {
  url: string;
  name: string;
}
const Consultants = ({ url, name }: ConsultantsProps) => {
  return (
    <TouchableOpacity>
      <Image
        source={{ uri: url }}
        alt="consultants"
        className="relative h-20 w-20 rounded-full object-cover"
        resizeMode="cover"
      />
      <Text className="text-center font-roboto500 text-xs text-gray-dark">
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default Consultants;
