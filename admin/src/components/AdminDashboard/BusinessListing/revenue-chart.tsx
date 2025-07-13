"use client";

import { useEffect, ReactNode } from "react";
import { useImmerReducer } from "use-immer";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

type RevenueData = {
  month: string;
  product: number;
  service: number;
  subscription: number;
};

type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

type ChartContainerProps = {
  children: ReactNode;
  config: ChartConfig;
  className?: string;
};

const ChartContainer = ({
  children,
  config,
  className,
}: ChartContainerProps) => {
  return (
    <div
      className={className}
      style={
        {
          "--color-product": config.product.color,
          "--color-service": config.service.color,
          "--color-subscription": config.subscription.color,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

const ChartTooltipContent = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
      <p className="font-medium text-sm">{payload[0].payload.month}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>
            {entry.name}: {entry.value}K
          </span>
        </div>
      ))}
    </div>
  );
};

type State = {
  data: RevenueData[];
  loading: boolean;
};

type Action =
  | { type: "SET_DATA"; payload: RevenueData[] }
  | { type: "SET_LOADING"; payload: boolean };

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "SET_DATA":
      draft.data = action.payload;
      break;
    case "SET_LOADING":
      draft.loading = action.payload;
      break;
  }
}

export default function RevenueChart() {
  const [state, dispatch] = useImmerReducer(reducer, {
    data: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/revenue-data.json");
        const jsonData = await response.json();
        dispatch({ type: "SET_DATA", payload: jsonData });
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-[300px] w-full">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Revenue Breakdown</h2>
      <ChartContainer
        config={{
          product: {
            label: "Product",
            color: "#22c55e", // Green color matching the image
          },
          service: {
            label: "Service",
            color: "#ef4444", // Red color matching the image
          },
          subscription: {
            label: "Subscription",
            color: "#3b82f6", // Blue color matching the image
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={state.data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={40}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              fontSize={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}K`}
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
              fontSize={12}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="product"
              stackId="a"
              fill="var(--color-product)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="service"
              stackId="a"
              fill="var(--color-service)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="subscription"
              stackId="a"
              fill="var(--color-subscription)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#22c55e] rounded-sm"></div>
          <span className="text-sm text-gray-600">Product</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#ef4444] rounded-sm"></div>
          <span className="text-sm text-gray-600">Service</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3b82f6] rounded-sm"></div>
          <span className="text-sm text-gray-600">Subscription</span>
        </div>
      </div>
    </div>
  );
}
