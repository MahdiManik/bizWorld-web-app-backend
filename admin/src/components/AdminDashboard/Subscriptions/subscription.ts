
export interface SubscriptionPlanItem {
  id: number;
  type: string;
  forType: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  iconBg: string;
  iconColor: string;
}

export interface SubscriptionItem {
  id: number;
  name: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: string;
  email: string;
}
