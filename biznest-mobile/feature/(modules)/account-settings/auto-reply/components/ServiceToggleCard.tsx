import { View, Pressable, LayoutAnimation, Switch } from 'react-native';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import AutoReplyToggle from './AutoReplyToggle';

const ServiceToggleCard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);
    const [isMarkating, setIsMarkating] = useState(false);
    const [isFinancial, setIsFinancial] = useState(false);
    const toggleCollapse = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsCollapsed((prev) => !prev);
    };

    return (
        <View className="rounded-lg border-[0.5px] border-stroke-border bg-white p-4 mt-4 shadow-sm">
            {/* Header Row */}
            <Pressable
                onPress={toggleCollapse}
                className="flex-row justify-between items-center"
            >
                <Text className="mb-2 text-base font-roboto500 text-black">
                    Include Services
                </Text>
                <Feather name={isCollapsed ? 'chevron-up' : 'chevron-down'} size={20} />
            </Pressable>

            {/* Collapsed Content */}
            {isCollapsed && (
                <>
                    <View className="flex-row items-center mt-4 gap-2">
                        <Switch
                            value={isEnabled}
                            onValueChange={setIsEnabled}
                            trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
                            thumbColor={isEnabled ? '#fff' : '#fff'}
                        />
                        <Text className="text-sm text-[#374151]">
                            Include services in auto-reply
                        </Text>
                    </View>
                    {isEnabled && (
                        <View className="mt-4">
                            <Text className="mb-4 text-base font-roboto500 text-[#374151]">
                                Select services to include:
                            </Text>
                            <View>
                                <AutoReplyToggle title='Business Strategy Consultation' description='$ 150/hour' value={isBusiness}
                                    onValueChange={setIsBusiness} />
                            </View>
                            <View>
                                <AutoReplyToggle title='Business Strategy Consultation' description='$ 150/hour' value={isMarkating}
                                    onValueChange={setIsMarkating} />
                            </View>
                            <View>
                                <AutoReplyToggle title='Business Strategy Consultation' description='$ 150/hour' value={isFinancial}
                                    onValueChange={setIsFinancial} />
                            </View>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

export default ServiceToggleCard;
