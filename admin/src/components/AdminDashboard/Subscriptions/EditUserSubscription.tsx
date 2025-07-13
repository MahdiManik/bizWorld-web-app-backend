/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCalendar } from "react-icons/fi";
import { SubscriptionItem } from "@/components/AdminDashboard/Subscriptions/subscription";

const EditUserSubscription = () => {
  const router = useRouter();
  // Using useSearchParams inside a try-catch to handle SSR gracefully
  let id: string | null = null;
  try {
    const searchParams = useSearchParams();
    id = searchParams.get("id");
  } catch (e) {
    console.log("SearchParams not available during SSR");
  }

  const [formData, setFormData] = useState({
    email: "",
    planName: "",
    startDate: "",
    endDate: "",
    amount: "",
  });

  useEffect(() => {
    // Fetch subscription data if ID is provided
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/data/subscriptionData.json");
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const subscription = data.find(
          (item: SubscriptionItem) => item.id.toString() === id
        );

        if (subscription) {
          setFormData({
            email: subscription.email || "",
            planName: subscription.planName || "",
            startDate: subscription.startDate || "",
            endDate: subscription.endDate || "",
            amount: subscription.amount?.replace("$", "") || "",
          });
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    if (id) fetchSubscription();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving subscription:", formData);
    // Here you would typically send the data to your API
    router.push("/subscriptions");
  };

  const handleCancel = () => {
    router.push("/subscriptions");
  };

  return (
    <div className="">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Edit User Subscription
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                required
              />
            </div>

            <div className="flex items-center gap-4 w-full">
              {/* Start Date Field */}
              <div className="w-full">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    placeholder="Select Date"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) =>
                      (e.target.type = formData.startDate ? "date" : "text")
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* End Date Field */}
              <div className="w-full">
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    placeholder="Select Date"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) =>
                      (e.target.type = formData.endDate ? "date" : "text")
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Name Field */}
            <div>
              <label
                htmlFor="planName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Plan Name
              </label>
              <input
                type="text"
                id="planName"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                placeholder="Enter Plan Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                required
              />
            </div>

            {/* Amount Field */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter Amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002C69]"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#002C69] text-white rounded-md hover:bg-[#002C69]/90 focus:outline-none"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserSubscription;
