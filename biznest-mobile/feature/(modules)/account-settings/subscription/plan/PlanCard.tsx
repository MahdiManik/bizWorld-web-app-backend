import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import GradientColor from '@/components/ui/gradient-color';

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  badge?: string | null;
  badgeColor?: string;
  textColor?: string;
  periodColor?: string;
  borderColor?: string;
  isActive?: boolean;
  isPopular?: boolean;
  nameColor?: string;
  onPress?: () => void;
}

const PlanCard = ({
  name,
  price,
  period,
  badge,
  badgeColor = '',
  textColor = '',
  borderColor = '',
  periodColor = '',
  isPopular = false,
  nameColor = '',
  onPress,
}: PlanCardProps) => {
  const isGradient = borderColor === 'gradiant';

  const cardContent = (
    <Pressable
      onPress={onPress}
      className={`relative h-[110px] w-full items-center justify-center rounded-xl p-4 ${badgeColor} ${borderColor}`}
      style={{
        shadowColor: '#0000000F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 3,
        shadowRadius: 9,
        elevation: 4,
      }}
    >
      <Text className={`font-roboto400 text-xl ${textColor}`}>
        {price}
        <Text className={`text-sm ${periodColor}`}>{period}</Text>
      </Text>

      <Text className={`mt-1 ${nameColor} font-roboto400 text-base`}>
        {name}
      </Text>

      {badge && badge !== 'Most Popular' && (
        <View
          className={`mt-2 rounded-full border border-link bg-bd_tech_secondary px-3 py-0.5`}
        >
          <Text className="font-roboto400 text-xs text-link">{badge}</Text>
        </View>
      )}

      {isPopular && (
        <View
          className={`absolute right-[-10px] top-[-10px] rounded-full bg-gradient-to-r from-[#FBCF47] to-[#F79800] px-2 py-0.5`}
        >
          <Text className="font-roboto400 text-xs text-[#78350F]">
            Most Popular
          </Text>
        </View>
      )}
    </Pressable>
  );

  return isGradient ? (
    <GradientColor style={{ width: '48%' }}>{cardContent}</GradientColor>
  ) : (
    <View style={{ width: '48%' }}>{cardContent}</View>
  );
};

export default PlanCard;
