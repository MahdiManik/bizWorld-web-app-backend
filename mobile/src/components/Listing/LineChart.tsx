import { colors } from '@/constants/colors'
import React, { useRef, useState } from 'react'
import { View, Text, Dimensions, Platform, ScrollView } from 'react-native'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Get screen width from Dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window')
// Define chart width - either screen width minus padding or larger if many months
const DEFAULT_CHART_WIDTH = Platform.select({
  web: 800,
  default: SCREEN_WIDTH - 32
}) // 16px padding on each side

export interface RevenueData {
  month: string
  annualRevenue: number
  ebidta: number
  profitMargin: number
}

interface RevenueChartProps {
  data: RevenueData[]
  height?: number
}

export function MobileRevenueChart({ data, height = 350 }: RevenueChartProps) {
  const labels = data.map((item) => item.month)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.map(item => item.annualRevenue),
        backgroundColor: colors.green,
        stack: 'Stack 0',
      },
      {
        label: 'EBITDA',
        data: data.map(item => item.ebidta),
        backgroundColor: colors.red,
        stack: 'Stack 0',
      },
      {
        label: 'Profit',
        data: data.map(item => item.profitMargin),
        backgroundColor: colors.secondary[400],
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
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return `$${value / 1000}K`;
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
            const value = typeof context.raw === 'string' 
              ? parseFloat(context.raw) 
              : context.raw;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    barPercentage: 0.7,
    categoryPercentage: 0.8,
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
        <Legend color={colors.green} label="Revenue" />
        <Legend color={colors.red} label="EBITDA" />
        <Legend color={colors.secondary[400]} label="Profit" />
      </View>

      <View style={{
        height: height + 20, // Extra space for the border
        position: 'relative',
      }}>
        {/* Full width border at the bottom */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: '#E5E7EB',
        }} />
        
        {/* Removable border on top */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 20,
          borderBottomWidth: 2,
          borderBottomColor: colors.primary[500],
          zIndex: 1,
        }} />
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            height: '100%',
            minWidth: '100%',
            paddingBottom: 20, // Match the border height
          }}
          scrollEventThrottle={16}
        >
          <View style={{ 
            width: Math.max(DEFAULT_CHART_WIDTH, SCREEN_WIDTH - 32), 
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
