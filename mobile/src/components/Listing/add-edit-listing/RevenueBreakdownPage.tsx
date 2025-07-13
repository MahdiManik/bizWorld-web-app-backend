/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Dimensions } from 'react-native'
import tw from '@/lib/tailwind'

import { Input } from '@/components/form/input'
import { MonthlyFinancialInput } from '@/types/listing'

type RevenueBreakdownPageProps = {
  monthlyRevenue: MonthlyFinancialInput[] | null
  setMonthlyRevenue: (month: string, value: string) => void

  isEditMode?: boolean
}

export const RevenueBreakdownPage = ({
  monthlyRevenue,
  setMonthlyRevenue,

  isEditMode = false,
}: RevenueBreakdownPageProps) => {
  // Chart data
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
  })

  // Update chart data when monthly revenue changes
  useEffect(() => {
    const firstSixMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const data = firstSixMonths.map(
      (month) => parseFloat(monthlyRevenue[month]) || 0
    )

    setChartData({
      labels: firstSixMonths,
      datasets: [{ data }],
    })
  }, [monthlyRevenue])

  // Screen width for chart
  const screenWidth = Dimensions.get('window').width - 32 // 16px padding on each side

  return (
    <ScrollView style={tw`flex-1 px-4`}>
      <Text style={tw`text-xl font-bold mt-4 mb-6`}>Revenue Breakdown</Text>

      {/* Revenue Chart */}
      <View style={tw`mb-6 bg-white rounded-2xl p-4`}>
        <View
          style={tw`flex-row items-end justify-between h-40 border-b border-l border-gray-200`}>
          {chartData.labels.map((month, index) => {
            const value = chartData.datasets[0].data[index]
            const maxValue = Math.max(...chartData.datasets[0].data)
            const height = maxValue > 0 ? (value / maxValue) * 120 : 0

            return (
              <View key={month} style={tw`flex-1 items-center`}>
                <View style={tw`mb-2`}>
                  <Text style={tw`text-xs text-gray-600 text-center`}>
                    ${value}K
                  </Text>
                </View>
                <View
                  style={[
                    tw`bg-blue-500 rounded-t-sm w-6`,
                    { height: Math.max(height, 4) },
                  ]}
                />
                <Text style={tw`text-xs text-gray-600 mt-2 text-center`}>
                  {month}
                </Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* Monthly Revenue Inputs */}
      <View style={tw`flex-row flex-wrap justify-between`}>
        {Object.keys(monthlyRevenue)
          .slice(0, 6)
          .map((month) => (
            <View key={month} style={[tw`mb-4`, { width: '48%' }]}>
              <Text style={tw`text-gray-800 font-medium mb-1`}>{month}</Text>
              <Input
                prefix="$"
                value={monthlyRevenue[month]}
                onChangeText={(value) => setMonthlyRevenue(month, value)}
                keyboardType="numeric"
                containerStyle="mb-0"
                placeholder="0"
              />
            </View>
          ))}
      </View>

      <View style={tw`flex-row flex-wrap justify-between`}>
        {Object.keys(monthlyRevenue)
          .slice(6, 12)
          .map((month) => (
            <View key={month} style={[tw`mb-4`, { width: '48%' }]}>
              <Text style={tw`text-gray-800 font-medium mb-1`}>{month}</Text>
              <Input
                prefix="$"
                value={monthlyRevenue[month]}
                onChangeText={(value) => setMonthlyRevenue(month, value)}
                keyboardType="numeric"
                containerStyle="mb-0"
                placeholder="0"
              />
            </View>
          ))}
      </View>

      {/* Key Financial Metrics */}
      <Text style={tw`text-xl font-bold mt-4 mb-6`}>Key Financial Metrics</Text>

      <Input
        label="EBITDA"
        prefix="$"
        value={financialMetrics.ebitda}
        onChangeText={(value) =>
          setFinancialMetrics('ebitda', value.replace(/[^0-9.]/g, ''))
        }
        keyboardType="numeric"
        placeholder="0"
      />

      <Input
        label="Revenue YoY Change"
        suffix="%"
        value={financialMetrics.revenueYoY}
        onChangeText={(value) =>
          setFinancialMetrics('revenueYoY', value.replace(/[^0-9.]/g, ''))
        }
        keyboardType="numeric"
        placeholder="0"
      />

      <Input
        label="EBITDA YoY Change"
        suffix="%"
        value={financialMetrics.ebitdaYoY}
        onChangeText={(value) =>
          setFinancialMetrics('ebitdaYoY', value.replace(/[^0-9.]/g, ''))
        }
        keyboardType="numeric"
        placeholder="0"
      />

      <Input
        label="Profit Margin YoY Change"
        suffix="%"
        value={financialMetrics.profitMarginYoY}
        onChangeText={(value) =>
          setFinancialMetrics('profitMarginYoY', value.replace(/[^0-9.]/g, ''))
        }
        keyboardType="numeric"
        placeholder="0"
      />

      {/* Add some space at the bottom */}
      <View style={tw`h-24`} />
    </ScrollView>
  )
}
