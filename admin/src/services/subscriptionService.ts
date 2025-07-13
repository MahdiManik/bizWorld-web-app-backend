const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Helper function to get auth token from cookies
const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "authToken") {
      return value;
    }
  }
  return null;
};

export interface SubscriptionPlan {
  documentId?: string;
  planType: string;
  forType?: string;
  price: string;
  period: string;
  features: string[];
}

export const subscriptionService = {
  // Get the API base URL for debugging
  getApiBaseUrl(): string {
    return API_BASE_URL || "";
  },
  // Create a new subscription plan
  async createPlan(
    planData: Omit<SubscriptionPlan, "id">
  ): Promise<SubscriptionPlan> {
    const authToken = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: planData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create subscription plan");
    }

    return response.json();
  },

  // Get a single subscription plan by ID
  async getPlanById(documentId: string): Promise<SubscriptionPlan> {
    try {
      if (!documentId) {
        throw new Error("Invalid subscription plan ID");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/subscriptions/${documentId}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `Failed to fetch subscription plan: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();

      // Handle different API response structures
      const planData = responseData.data || responseData;

      // Ensure features is always an array
      if (planData && !Array.isArray(planData.features)) {
        planData.features = planData.features ? [planData.features] : [];
      }

      return planData;
    } catch (error) {
      console.error("Error in getPlanById:", error);
      throw error;
    }
  },

  // Update an existing subscription plan
  async updatePlan(
    documentId: string,
    planData: Partial<SubscriptionPlan>
  ): Promise<SubscriptionPlan> {
    const authToken = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/api/subscriptions/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ data: planData }),
      }
    );

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.log('API Error Response:', errorData);
        throw new Error(errorData.error?.message || "Failed to update subscription plan");
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
    }

    return response.json();
  },

  // Delete a subscription plan
  async deletePlan(documentId: string): Promise<void> {
    const authToken = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/api/subscriptions/${documentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete subscription plan");
    }
  },

  // Get all subscription plans
  async getAllPlans(): Promise<SubscriptionPlan[]> {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions`);
    console.log(response, "SubscriptionPlans");

    if (!response.ok) {
      throw new Error("Failed to fetch subscription plans");
    }

    const data = await response.json();

    if (data && typeof data === "object") {
      if (Array.isArray(data)) {
        return data;
      } else if (data.plans && Array.isArray(data.plans)) {
        return data.plans;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
    }

    return Array.isArray(data) ? data : [];
  },
};
