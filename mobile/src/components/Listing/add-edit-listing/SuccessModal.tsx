import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tailwind";

type SuccessModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const SuccessModal = ({ visible, onClose }: SuccessModalProps) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center px-4`}
      >
        <View style={tw`bg-white rounded-lg p-6 w-full max-w-sm`}>
          <View style={tw`items-center`}>
            <View
              style={tw`bg-blue-900 rounded-full w-20 h-20 items-center justify-center mb-4`}
            >
              <Feather name="check" size={32} color="white" />
            </View>

            <Text style={tw`text-xl font-bold mb-2`}>Success</Text>

            <Text style={tw`text-gray-600 text-center mb-6`}>
              You've successfully submitted your listing. Our team will review
              and if there are no issues, your listing will be approved within 3
              working days.
            </Text>

            <TouchableOpacity
              style={tw`bg-blue-900 rounded-md py-3 w-full items-center`}
              onPress={onClose}
            >
              <Text style={tw`text-white font-bold`}>Back to listing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
