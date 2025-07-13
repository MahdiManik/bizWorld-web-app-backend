import { colors } from '@/constants/colors'
import React from 'react'
import { View, Text, Dimensions, Platform, ScrollView } from 'react-native'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
if (Platform.OS === 'web') {
  Chart.register(...registerables)
}

// Get screen width from Dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window')
// Define chart width - either screen width minus padding or larger if many months
const DEFAULT_CHART_WIDTH = Platform.select({
  web: 800,
  default: SCREEN_WIDTH - 32,
}) // 16px padding on each side

// Chart data type definition - keep field names aligned with existing data
export interface RevenueData {
  month: string
  annualRevenue: number
  ebitda: number
  profitMargin: number
}

interface MobileRevenueChartProps {
  data: RevenueData[]
  height?: number
  width?: number
}

export const MobileRevenueChart: React.FC<MobileRevenueChartProps> = ({
  data,
  height = 350,
  // width = Dimensions.get('window').width - 40
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No revenue data available</Text>
      </View>
    )
  }

  // Create a native fallback for platforms other than web
  if (Platform.OS !== 'web') {
    return (
      <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
          Revenue Breakdown
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
            marginBottom: 10,
          }}>
          <Legend color={colors.green || '#22c55e'} label="Revenue" />
          <Legend color={colors.red || '#ef4444'} label="EBITDA" />
          <Legend color={colors.secondary?.[400] || '#60a5fa'} label="Profit" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ padding: 10 }}>
            <Text>Chart is only fully available on web version</Text>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: '#eee',
                paddingVertical: 8,
              }}>
              <Text style={{ width: 60, fontWeight: 'bold' }}>Month</Text>
              <Text style={{ width: 80, fontWeight: 'bold' }}>Revenue</Text>
              <Text style={{ width: 80, fontWeight: 'bold' }}>EBITDA</Text>
              <Text style={{ width: 80, fontWeight: 'bold' }}>Profit</Text>
            </View>

            {data.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderColor: '#eee',
                  paddingVertical: 8,
                }}>
                <Text style={{ width: 60 }}>{item.month}</Text>
                <Text style={{ width: 80 }}>
                  ${item.annualRevenue.toLocaleString()}
                </Text>
                <Text style={{ width: 80 }}>
                  ${item.ebitda.toLocaleString()}
                </Text>
                <Text style={{ width: 80 }}>{item.profitMargin}%</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    )
  }

  // Web implementation with react-chartjs-2
  const labels = data.map((item) => item.month)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.map((item) => item.annualRevenue),
        backgroundColor: colors.green || '#22c55e', // Fallback in case colors object structure is different
        stack: 'Stack 0',
      },
      {
        label: 'EBITDA',
        data: data.map((item) => item.ebitda),
        backgroundColor: colors.red || '#ef4444',
        stack: 'Stack 0',
      },
      {
        label: 'Profit',
        data: data.map((item) => item.profitMargin),
        backgroundColor: colors.secondary?.[400] || '#60a5fa',
        stack: 'Stack 0',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          callback: (tickValue: string | number) => {
            const value =
              typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue
            return `$${value / 1000}K`
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value =
              typeof context.raw === 'string'
                ? parseFloat(context.raw)
                : context.raw
            return `${context.dataset.label}: $${value.toLocaleString()}`
          },
        },
      },
    },
    barPercentage: 0.4,
    categoryPercentage: 0.6,
  } as const

  return (
    <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 10,
          marginBottom: 10,
        }}>
        <Legend color={colors.green || '#22c55e'} label="Revenue" />
        <Legend color={colors.red || '#ef4444'} label="EBITDA" />
        <Legend color={colors.secondary?.[400] || '#60a5fa'} label="Profit" />
      </View>

      <View
        style={{
          height: height + 20, // Extra space for the border
          position: 'relative',
        }}>
        {/* Full width border at the bottom */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: '#E5E7EB',
          }}
        />

        {/* Removable border on top */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 20,
            borderBottomWidth: 2,
            borderBottomColor: colors.primary?.[500] || '#3b82f6',
            zIndex: 1,
          }}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            height: '100%',
            minWidth: '100%',
            paddingBottom: 20, // Match the border height
          }}
          scrollEventThrottle={16}>
          <View
            style={{
              width: Math.max(DEFAULT_CHART_WIDTH || 800, SCREEN_WIDTH - 32),
              height: '100%',
              paddingTop: 4,
            }}>
            <Bar
              data={chartData}
              options={{
                ...options,
                // Ensure chart fills the container width
                layout: {
                  padding: 0,
                },
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: color,
        }}
      />
      <Text style={{ fontSize: 12, color: '#4B5563' }}>{label}</Text>
    </View>
  )
}

export default MobileRevenueChart
