import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    children: React.ReactNode;
    borderRadius?: number;
    padding?: number;
    style?: ViewStyle;
    colors?: any;
}

const GradientColor = ({
    children,
    borderRadius = 12,
    padding = 1,
    style,
    colors = ['#F79800', '#FBCF47'],
}: Props) => {
    return (
        <LinearGradient
            colors={colors}
            style={[
                {
                    borderRadius,
                    padding,
                },
                style,
            ]}
        >
            <View style={{ borderRadius, overflow: 'visible' }}>{children}</View>
        </LinearGradient>
    );
};

export default GradientColor;
