/* eslint-disable no-unused-vars */
import { Text, TouchableOpacity, View } from 'react-native'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

type Category = {
  id: string
  label: string
}

type CategoryPillsProps = {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}

export const CategoryPills = ({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryPillsProps) => {
  return (
    <View
      style={tw`flex flex-row items-center justify-between w-full py-4`}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onCategorySelect(category.id)}
          style={[
            tw`px-4 py-2 rounded-full`,
            selectedCategory === category.id
              ? { backgroundColor: colors.primary.DEFAULT }
              : { backgroundColor: colors.gray[200] },
          ]}>
          <Text
            style={[
              tw`font-medium`,
              selectedCategory === category.id
                ? tw`text-white font-semibold`
                : [{ color: colors.gray[600] }],
            ]}>
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
