// Subscription and billing data

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    period: 'monthly' | 'yearly';
    features: string[];
    limits: {
      activeListings: number | 'unlimited';
      documentStorage: string;
      support: string;
      analytics: string;
    };
    isPopular?: boolean;
    isCurrentPlan?: boolean;
  }
  
  export interface PaymentMethod {
    id: string;
    type: 'paypal' | 'card' | 'bank';
    name: string;
    details: string;
    isDefault: boolean;
    expiryDate?: string;
    icon: string;
  }
  
  export interface UserSubscription {
    currentPlan: SubscriptionPlan;
    usage: {
      activeListings: {
        used: number;
        total: number | 'unlimited';
      };
      documentStorage: {
        used: number;
        total: number;
        unit: 'GB';
      };
    };
    paymentMethods: PaymentMethod[];
    billingHistory: {
      id: string;
      date: string;
      amount: number;
      status: 'paid' | 'pending' | 'failed';
      plan: string;
    }[];
    nextBillingDate?: string;
  }
  
  export const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      period: 'monthly',
      features: [
        '1 Active Listing',
        '2 GB Document Storage',
        'Community Support',
        'Basic Analytics'
      ],
      limits: {
        activeListings: 1,
        documentStorage: '2 GB',
        support: 'Community Support',
        analytics: 'Basic Analytics'
      },
      isCurrentPlan: true
    },
    {
      id: 'starter',
      name: 'Starter Plan',
      price: 19.99,
      period: 'monthly',
      features: [
        '3 Active Listings',
        '10 GB Document Storage',
        'Standard Support',
        'Basic Analytics'
      ],
      limits: {
        activeListings: 3,
        documentStorage: '10 GB',
        support: 'Standard Support',
        analytics: 'Basic Analytics'
      }
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 49.99,
      period: 'monthly',
      features: [
        'Unlimited Listings',
        '100 GB Document Storage',
        '24/7 Priority Support',
        'Enterprise Analytics',
        'Verified Badge'
      ],
      limits: {
        activeListings: 'unlimited',
        documentStorage: '100 GB',
        support: '24/7 Priority Support',
        analytics: 'Enterprise Analytics'
      },
      isPopular: true
    },
    {
      id: 'business',
      name: 'Business Plan',
      price: 99.99,
      period: 'monthly',
      features: [
        'Unlimited Listings',
        '100 GB Document Storage',
        '24/7 Priority Support',
        'Enterprise Analytics',
        'Verified Badge',
        'API Access',
        'Custom Branding'
      ],
      limits: {
        activeListings: 'unlimited',
        documentStorage: '100 GB',
        support: '24/7 Priority Support',
        analytics: 'Enterprise Analytics'
      }
    }
  ];
  
  export const mockUserSubscription: UserSubscription = {
    currentPlan: subscriptionPlans[0], // Free plan
    usage: {
      activeListings: {
        used: 1,
        total: 1
      },
      documentStorage: {
        used: 1.5,
        total: 2,
        unit: 'GB'
      }
    },
    paymentMethods: [
      {
        id: 'paypal1',
        type: 'paypal',
        name: 'PayPal',
        details: 'Default',
        isDefault: true,
        expiryDate: '9/2024',
        icon: 'paypal'
      }
    ],
    billingHistory: [
      {
        id: 'bill1',
        date: '2023-12-01',
        amount: 0,
        status: 'paid',
        plan: 'Free Plan'
      }
    ]
  };
  
  export const calculateTax = (amount: number): number => {
    return Math.round(amount * 0.09 * 100) / 100; // 9% tax
  };
  
  export const calculateTotal = (amount: number): number => {
    return amount + calculateTax(amount);
  };