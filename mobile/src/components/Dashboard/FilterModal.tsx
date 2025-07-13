import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

type Industry = {
  id: string
  name: string
}

type BusinessType = 'Startup' | 'SME' | 'Enterprise' | 'Franchise'
type InvestmentType =
  | 'Full Sale'
  | 'Partial Investment'
  | 'Partnership'
  | 'Franchise'

type FilterProps = {
  visible: boolean
  onClose: () => void
  onApply: (filters: FilterValues) => void
  initialFilters?: FilterValues
}

export type FilterValues = {
  industries: string[]
  priceRange: {
    min: string
    max: string
  }
  businessType: BusinessType
  investmentType: InvestmentType
}

const industries: Industry[] = [
  { id: '1', name: 'Finance' },
  { id: '2', name: 'Technology' },
  { id: '3', name: 'Education' },
  { id: '4', name: 'Healthcare' },
  { id: '5', name: 'Media & Entertainment' },
  { id: '6', name: 'Insurance' },
  { id: '7', name: 'Marketing & Advertising' },
  { id: '8', name: 'E-commerce' },
  { id: '9', name: 'Manufacturing' },
  { id: '10', name: 'Food & Beverage' },
]

const businessTypes: BusinessType[] = [
  'Startup',
  'SME',
  'Enterprise',
  'Franchise',
]
const investmentTypes: InvestmentType[] = [
  'Full Sale',
  'Partial Investment',
  'Partnership',
  'Franchise',
]

export default function FilterScreen({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FilterProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    initialFilters?.industries || []
  )
  const [priceRange, setPriceRange] = useState({
    min: initialFilters?.priceRange?.min || '',
    max: initialFilters?.priceRange?.max || '',
  })
  const [businessType, setBusinessType] = useState<BusinessType>(
    initialFilters?.businessType || 'Startup'
  )
  const [investmentType, setInvestmentType] = useState<InvestmentType>(
    initialFilters?.investmentType || 'Full Sale'
  )

  const [showBusinessTypeDropdown, setShowBusinessTypeDropdown] =
    useState(false)
  const [showInvestmentTypeDropdown, setShowInvestmentTypeDropdown] =
    useState(false)

  const handleIndustryToggle = (industryName: string) => {
    if (selectedIndustries.includes(industryName)) {
      setSelectedIndustries(
        selectedIndustries.filter((i) => i !== industryName)
      )
    } else {
      setSelectedIndustries([...selectedIndustries, industryName])
    }
  }

  const handleSelectAllIndustries = () => {
    if (selectedIndustries.length === industries.length) {
      setSelectedIndustries([])
    } else {
      setSelectedIndustries(industries.map((i) => i.name))
    }
  }

  const handleApply = () => {
    onApply({
      industries: selectedIndustries,
      priceRange,
      businessType,
      investmentType,
    })
    onClose()
  }

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '')
    setPriceRange({
      ...priceRange,
      [field]: numericValue,
    })
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={tw`flex-1 justify-end`}>
        <Pressable
          style={tw`absolute inset-0 bg-black bg-opacity-40`}
          onPress={onClose}
        />
        <View style={tw`bg-white rounded-t-3xl pb-6`}> 
          <View style={tw`w-4/5 mx-auto items-center py-6 border-b border-gray-200`}>
            <View style={tw`w-10 h-1 bg-gray-300 rounded-full mb-2`} />
            <Text style={tw`text-xl font-bold text-gray-800`}>Filter</Text>
          </View>

          <ScrollView
            style={tw`px-4 pt-4 pb-16`}
            showsVerticalScrollIndicator={false}>
            <View style={tw`mb-6`}>
              <View style={tw`flex-row justify-between items-center mb-3`}>
                <Text style={tw`text-base font-semibold text-gray-800`}>
                  Industry
                </Text>
                <TouchableOpacity onPress={handleSelectAllIndustries}>
                  <Text
                    style={[tw`font-medium`, { color: colors.primary.DEFAULT }]}>
                    Select All
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={tw`flex-row flex-wrap`}>
                {industries.map((industry) => (
                  <TouchableOpacity
                    key={industry.id}
                    style={[
                      tw`px-4 py-2 rounded-full mb-3 mr-4`,
                      selectedIndustries.includes(industry.name)
                        ? tw`bg-[${colors.primary.DEFAULT}]`
                        : tw`bg-gray-100`,
                    ]}
                    onPress={() => handleIndustryToggle(industry.name)}>
                    <Text
                      style={[
                        selectedIndustries.includes(industry.name)
                          ? tw`text-white font-medium`
                          : tw`text-gray-700`,
                      ]}>
                      {industry.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`text-base font-semibold text-gray-800 mb-3`}>
                Price Range
              </Text>
              <View style={tw`flex-row items-center`}>
                <View style={tw`flex-1`}>
                  <TextInput
                    style={tw`border border-gray-300 rounded-md px-3 py-3 text-gray-700`}
                    placeholder="Min"
                    keyboardType="numeric"
                    value={priceRange.min}
                    onChangeText={(value: string) =>
                      handlePriceChange('min', value)
                    }
                  />
                </View>
                <Text style={tw`mx-3 text-gray-400`}>—</Text>
                <View style={tw`flex-1`}>
                  <TextInput
                    style={tw`border border-gray-300 rounded-md px-3 py-3 text-gray-700`}
                    placeholder="Max"
                    keyboardType="numeric"
                    value={priceRange.max}
                    onChangeText={(value: string) =>
                      handlePriceChange('max', value)
                    }
                  />
                </View>
              </View>
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`text-base font-semibold text-gray-800 mb-3`}>
                Business Type
              </Text>
              <TouchableOpacity
                style={tw`border border-gray-300 rounded-md px-4 py-3 flex-row justify-between items-center`}
                onPress={() =>
                  setShowBusinessTypeDropdown(!showBusinessTypeDropdown)
                }>
                <Text style={tw`text-gray-700`}>{businessType}</Text>
                <Feather
                  name="chevron-down"
                  size={20}
                  color={colors.gray[500]}
                />
              </TouchableOpacity>

              {showBusinessTypeDropdown && (
                <View
                  style={tw`border border-gray-300 rounded-md mt-1 bg-white absolute z-10 left-4 right-4`}>
                  {businessTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={tw`px-4 py-3 border-b border-gray-100`}
                      onPress={() => {
                        setBusinessType(type)
                        setShowBusinessTypeDropdown(false)
                      }}>
                      <Text
                        style={[
                          tw`text-gray-700`,
                          businessType === type &&
                            tw`font-medium text-[${colors.primary.DEFAULT}]`,
                        ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`text-base font-semibold text-gray-800 mb-3`}>
                Investment Type
              </Text>
              <TouchableOpacity
                style={tw`border border-gray-300 rounded-md px-4 py-3 flex-row justify-between items-center`}
                onPress={() =>
                  setShowInvestmentTypeDropdown(!showInvestmentTypeDropdown)
                }>
                <Text style={tw`text-gray-700`}>{investmentType}</Text>
                <Feather
                  name="chevron-down"
                  size={20}
                  color={colors.gray[500]}
                />
              </TouchableOpacity>

              {showInvestmentTypeDropdown && (
                <View
                  style={tw`border border-gray-300 rounded-md mt-1 bg-white absolute z-10 left-4 right-4`}>
                  {investmentTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={tw`px-4 py-3 border-b border-gray-100`}
                      onPress={() => {
                        setInvestmentType(type)
                        setShowInvestmentTypeDropdown(false)
                      }}>
                      <Text
                        style={[
                          tw`text-gray-700`,
                          investmentType === type &&
                            tw`font-medium text-[${colors.primary.DEFAULT}]`,
                        ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={tw`px-4 flex-row mt-1`}>
            <TouchableOpacity
              style={tw`flex-1 border border-gray-300 rounded-md py-3 mr-2 items-center`}
              onPress={onClose}>
              <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tw`flex-1 rounded-md py-3 ml-2 items-center`, { backgroundColor: colors.primary.DEFAULT }]}
              onPress={handleApply}>
              <Text style={tw`text-white font-medium`}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
