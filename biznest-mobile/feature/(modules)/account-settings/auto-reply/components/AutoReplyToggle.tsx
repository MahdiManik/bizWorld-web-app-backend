import { View, Text } from 'react-native';
import React from 'react';
import { Switch } from 'react-native-paper';
import colors from '@/constants/colors';

interface AutoReplyToggleProps {
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}
const AutoReplyToggle = ({ title, description, value, onValueChange }: AutoReplyToggleProps) => {
    return (
        <View className="flex-row items-start justify-between">
            <View className="flex-1 mb-2">
                <Text className="font-roboto500 text-base text-subtle">{title}</Text>
                <Text className="font-roboto400 text-sm text-description-text">
                    {description}
                </Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                color={colors.primary}
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
            />
        </View>
    );
};

export default AutoReplyToggle;