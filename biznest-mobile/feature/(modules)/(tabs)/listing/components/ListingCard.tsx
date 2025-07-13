import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ListingInput } from "../types/typs";
import Button from "@/components/ui/button";

interface ListingCardProps {
  listing: ListingInput;
  onPress?: () => void;
  onMenuPress?: () => void;
  onViewBusiness?: () => void;
  onMessageOwner?: () => void;
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
      className="bg-white rounded-lg overflow-hidden shadow-2xl mb-4 w-full"
      onPress={onPress}
    >
      <View className="relative">
        <Image
          source={{ uri: listing?.image?.url }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="absolute bg-primary top-0 left-0 px-2 py-1.5 rounded-r-md rounded-t-none">
          <Text className="text-white text-xs font-medium">
            {listing?.category || "ECOMMERCE"}
          </Text>
        </View>

        {onMenuPress && (
          <Button
            title=""
            className="absolute top-2 right-2 p-1"
            onPress={onMenuPress}
            variant="ghost"
            icon={<Feather name="more-vertical" size={26} color="white" />}
          />
        )}
      </View>

      <View className="p-3">
        <Text className="font-semibold text-base mb-1" numberOfLines={2}>
          {listing?.title}
        </Text>

        <Text className="py-1 text-base text-link" numberOfLines={2}>
          Asking Price - {listing?.askingPrice || "$0"}
        </Text>

        <Text className="text-sm font-medium pb-2" numberOfLines={2}>
          {listing?.category || "Small Business"}
        </Text>

        {(onViewBusiness || onMessageOwner) && (
          <View className="flex-row mt-2">
            {onViewBusiness && (
              <Button
                className="flex-1 border border-primary rounded-md py-2 mr-2"
                onPress={onViewBusiness}
                title="View Business"
              />
            )}

            {onMessageOwner && (
              <Button
                className="flex-1 rounded-md py-2 "
                onPress={onMessageOwner}
                title="Message Owner"
                variant="primary"
              />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
