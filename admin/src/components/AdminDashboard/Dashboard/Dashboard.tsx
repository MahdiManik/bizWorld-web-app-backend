/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect } from "react";
import { UserStatistics } from "../../../services/admin.services";
import UserManagementService, {
  User,
} from "../../../services/usermanagement.services";
import BusinessListingService, {
  Listing,
} from "../../../services/businesslisting.services";
import { BsReverseLayoutSidebarReverse } from "react-icons/bs";
import { FaGripVertical } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { GoArrowDownRight } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useImmerReducer } from "use-immer";
import DashboardSkeleton from "../../Skeletons/DashboardSkeleton";
import {
  calculatePeriodGrowth,
  GrowthResult,
} from "../../../utils/growthCalculation";

type NewUserData = {
  day: string;
  users: number;
  originalDate?: Date;
};

type UserApprovalData = {
  name: string;
  value: number;
  color: string;
};

type BusinessListingData = {
  week: string;
  Active: number;
  "Waiting Approval": number;
};

type WeekRange = {
  start: Date;
  end: Date;
  label: string;
  weekNumber: number;
};

type DayData = {
  date: Date;
  dayOfWeek: number;
  dayName: string;
  count: number;
};

type RecentActivityData = {
  id: string | number;
  text: string;
  time: string;
  color: string;
  date?: Date;
};

type DashboardState = {
  newUsersData: NewUserData[];
  userApprovalData: UserApprovalData[];
  businessListingsData: BusinessListingData[];
  recentActivity: RecentActivityData[];
  isLoading: boolean;
  error: string | null;
  userStats: UserStatistics | null;
  users: User[];
  activeCount: number;
  pendingCount: number;
  listings: Listing[];
  listingStats: {
    activeCount: number;
    percentage: number;
    isIncrease: boolean;
  };
  userGrowth: GrowthResult;
};

type DashboardAction =
  | { type: "SET_NEW_USERS_DATA"; payload: NewUserData[] }
  | { type: "SET_USER_APPROVAL_DATA"; payload: UserApprovalData[] }
  | { type: "SET_BUSINESS_LISTINGS_DATA"; payload: BusinessListingData[] }
  | { type: "SET_RECENT_ACTIVITY"; payload: RecentActivityData[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_USER_STATS"; payload: UserStatistics | null }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "UPDATE_USER_COUNTS" }
  | { type: "SET_LISTINGS"; payload: Listing[] }
  | { type: "UPDATE_LISTING_STATS" }
  | {
      type: "SET_ALL_DATA";
      payload: {
        newUsers: NewUserData[];
        userApproval: UserApprovalData[];
        businessListings: BusinessListingData[];
        recentActivity: RecentActivityData[];
      };
    };

const initialState: DashboardState = {
  newUsersData: [],
  userApprovalData: [],
  businessListingsData: [],
  recentActivity: [],
  isLoading: true,
  error: null,
  userStats: null,
  users: [],
  activeCount: 0,
  pendingCount: 0,
  listings: [],
  listingStats: {
    activeCount: 0,
    percentage: 0,
    isIncrease: true,
  },
  userGrowth: {
    percentage: 0,
    isIncrease: true,
  },
};

function dashboardReducer(draft: DashboardState, action: DashboardAction) {
  switch (action.type) {
    case "SET_NEW_USERS_DATA":
      draft.newUsersData = action.payload;
      break;
    case "SET_USER_APPROVAL_DATA":
      draft.userApprovalData = action.payload;
      break;
    case "SET_BUSINESS_LISTINGS_DATA":
      draft.businessListingsData = action.payload;
      break;
    case "SET_RECENT_ACTIVITY":
      draft.recentActivity = action.payload;
      break;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      break;
    case "SET_ERROR":
      draft.error = action.payload;
      break;
    case "SET_USER_STATS":
      draft.userStats = action.payload;
      break;
    case "SET_USERS":
      draft.users = action.payload;
      break;
    case "SET_LISTINGS":
      draft.listings = action.payload;
      break;
    case "UPDATE_USER_COUNTS":
      // Count active and pending users
      const activeUsers = draft.users.filter(
        (user) => user.userStatus === "ACTIVE"
      ).length;
      const pendingUsers = draft.users.filter(
        (user) => user.userStatus === "PENDING"
      ).length;

      draft.activeCount = activeUsers;
      draft.pendingCount = pendingUsers;

      // Update the userApprovalData for the pie chart
      draft.userApprovalData = [
        { name: "Active", value: activeUsers, color: "#4F46E5" },
        { name: "Waiting Approval", value: pendingUsers, color: "#60A5FA" },
      ];

      // Calculate user growth using the utility function
      const userGrowth = calculatePeriodGrowth(draft.users, 7);
      draft.userGrowth = userGrowth;

      break;
    case "UPDATE_LISTING_STATS":
      // Count active listings (status === "APPROVED")
      const activeListings = draft.listings.filter(
        (listing) => listing.listingStatus === "APPROVED"
      ).length;

      // Calculate growth using the utility function
      // Only count approved listings for growth calculation
      const listingGrowth = calculatePeriodGrowth(
        draft.listings.filter(
          (listing) => listing.listingStatus === "APPROVED"
        ),
        7
      );

      // Update listing stats with calculated growth
      draft.listingStats = {
        activeCount: activeListings,
        percentage: listingGrowth.percentage,
        isIncrease: listingGrowth.isIncrease,
      };
      break;
    case "SET_ALL_DATA":
      draft.newUsersData = action.payload.newUsers;
      draft.businessListingsData = action.payload.businessListings;
      draft.recentActivity = action.payload.recentActivity;
      // Note: userApprovalData is now calculated from real user data, not from the payload
      break;
  }
}

export default function Dashboard() {
  const [state, dispatch] = useImmerReducer(dashboardReducer, initialState);
  const {
    newUsersData,
    userApprovalData,
    businessListingsData,
    recentActivity,
    isLoading,
    userStats,
    users,
    listings,
    listingStats,
  } = state;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Fetch real users data from API
        const users = await UserManagementService.getUsers();
        dispatch({ type: "SET_USERS", payload: users });
        const listings = await BusinessListingService.getListings();
        dispatch({ type: "SET_LISTINGS", payload: listings });

        // Make sure to update listing stats after setting listings
        setTimeout(() => {
          dispatch({ type: "UPDATE_LISTING_STATS" });
        }, 0);

        // Calculate new users for the last 7 days using createdAt field
        const usersCurrentDate = new Date();
        const sevenDaysAgo = new Date(usersCurrentDate);
        sevenDaysAgo.setDate(usersCurrentDate.getDate() - 6); // -6 to include today

        // Set hours to beginning of day for accurate comparison
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Initialize data for the last 7 days
        const last7Days: DayData[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(sevenDaysAgo);
          date.setDate(sevenDaysAgo.getDate() + i);
          last7Days.push({
            date: new Date(date),
            dayOfWeek: date.getDay(),
            dayName: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
              date.getDay()
            ],
            count: 0,
          });
        }

        // Count users created in the last 7 days
        users.forEach((user) => {
          // Use createdAt if available, otherwise try joinDate
          const dateStr = user.createdAt || user.joinDate;
          if (!dateStr) return;

          try {
            const createdDate = new Date(dateStr);
            // Set hours to beginning of day for accurate comparison
            createdDate.setHours(0, 0, 0, 0);

            // Check if the user was created in the last 7 days
            if (
              createdDate >= sevenDaysAgo &&
              createdDate <= usersCurrentDate
            ) {
              // Find the matching day and increment count
              for (const day of last7Days) {
                if (
                  day.date.getDate() === createdDate.getDate() &&
                  day.date.getMonth() === createdDate.getMonth() &&
                  day.date.getFullYear() === createdDate.getFullYear()
                ) {
                  day.count++;
                  break;
                }
              }
            }
          } catch (e) {
            console.error("Error parsing user creation date:", e);
          }
        });

        // Format data for the chart
        const newUsersData = last7Days.map((day) => ({
          day: day.dayName,
          users: day.count,
          originalDate: day.date,
        }));

        // Calculate user statistics from actual users data
        const userStatistics: UserStatistics = {
          totalUsers: users.length,
          percentageChange: 0, // Will be calculated in UPDATE_USER_COUNTS
          last7DaysNewUsers: newUsersData, // We'll calculate this from users array
        };

        // Update state with calculated data
        dispatch({ type: "SET_NEW_USERS_DATA", payload: newUsersData });
        dispatch({ type: "SET_USER_STATS", payload: userStatistics });
        // Calculate user counts and growth
        dispatch({ type: "UPDATE_USER_COUNTS" });

        // Generate dynamic recent activity data from users and listings
        const generateRecentActivity = () => {
          const activities: RecentActivityData[] = [];

          // Add activities from users
          users.forEach((user) => {
            const dateStr = user.createdAt || user.joinDate;
            if (!dateStr) return;

            try {
              const createdDate = new Date(dateStr);
              activities.push({
                id: `user-${
                  user.id || Math.random().toString(36).substr(2, 9)
                }`,
                text: `New user registered: ${user.fullName}`,
                time: formatTimeAgo(createdDate),
                date: createdDate,
                color: "#10B981", // Green color for user registrations
              });
            } catch (e) {
              console.error("Error parsing user date:", e);
            }
          });

          // Add activities from listings
          listings.forEach((listing) => {
            const dateStr = listing.createdAt || listing.date;
            if (!dateStr) return;

            try {
              const createdDate = new Date(dateStr);
              let text = "";
              let color = "";

              const ownerName = listing.title ?? "Unnamed listing";

              if (listing.listingStatus === "APPROVED") {
                text = `Business listing approved: ${ownerName}`;
                color = "#3B82F6"; // Blue color for approved listings
              } else if (listing.listingStatus === "PENDING") {
                text = `New business listing submitted: ${ownerName}`;
                color = "#F59E0B"; // Amber color for pending listings
              } else {
                text = `Business listing updated: ${ownerName}`;
                color = "#8B5CF6"; // Purple color for other listing activities
              }

              activities.push({
                id: `listing-${
                  listing.id || Math.random().toString(36).substr(2, 9)
                }`,
                text,
                time: formatTimeAgo(createdDate),
                date: createdDate,
                color,
              });
            } catch (e) {
              console.error("Error parsing listing date:", e);
            }
          });

          // Sort activities by date (newest first)
          activities.sort((a, b) => {
            // Handle potentially undefined dates
            const dateA = a.date ? a.date.getTime() : 0;
            const dateB = b.date ? b.date.getTime() : 0;
            return dateB - dateA;
          });

          // Take the most recent 5 activities
          return activities.slice(0, 5);
        };

        // Helper function to format time ago
        const formatTimeAgo = (date: Date): string => {
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffSec = Math.floor(diffMs / 1000);
          const diffMin = Math.floor(diffSec / 60);
          const diffHour = Math.floor(diffMin / 60);
          const diffDay = Math.floor(diffHour / 24);

          if (diffDay > 0) {
            return `${diffDay}d ago`;
          } else if (diffHour > 0) {
            return `${diffHour}h ago`;
          } else if (diffMin > 0) {
            return `${diffMin}m ago`;
          } else {
            return "Just now";
          }
        };

        const recentActivity = generateRecentActivity();

        // Dispatch the recent activity data to the state
        dispatch({ type: "SET_RECENT_ACTIVITY", payload: recentActivity });

        // Function to get week of month (1-4)
        const getWeekOfMonth = (date: Date): number => {
          const dayOfMonth = date.getDate();
          // Calculate which week of the month (1-4)
          return Math.min(4, Math.ceil(dayOfMonth / 7));
        };

        // Get current date and current month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Get first and last day of current month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        
        // Always create exactly 4 weeks
        const weeks: WeekRange[] = [];
        const daysInMonth = lastDayOfMonth.getDate();
        const daysPerWeek = Math.ceil(daysInMonth / 4);
        
        for (let i = 0; i < 4; i++) {
          const startDay = (i * daysPerWeek) + 1;
          let endDay = (i + 1) * daysPerWeek;
          
          // Ensure we don't go beyond the end of the month
          if (endDay > daysInMonth) {
            endDay = daysInMonth;
          }
          
          const weekStart = new Date(currentYear, currentMonth, startDay);
          const weekEnd = new Date(currentYear, currentMonth, endDay);
          
          weeks.push({
            start: weekStart,
            end: weekEnd,
            label: `Week ${i + 1}`,
            weekNumber: i + 1
          });
        }

        // Initialize business listings data for each week
        const businessListingsData: (BusinessListingData & { weekNumber: number })[] = weeks.map((week) => ({
          week: week.label,
          weekNumber: week.weekNumber,
          Active: 0,
          "Waiting Approval": 0,
        }));

        // Process each listing
        listings.forEach((listing) => {
          // Get the listing date (use createdAt or date field)
          const listingDate = listing.createdAt
            ? new Date(listing.createdAt)
            : listing.date
            ? new Date(listing.date)
            : null;

          if (!listingDate) return; // Skip if no date available

          // Skip listings not from current month
          if (listingDate.getMonth() !== currentMonth || 
              listingDate.getFullYear() !== currentYear) {
            return;
          }

          // Get week of month (1-based)
          const weekOfMonth = getWeekOfMonth(listingDate);
          
          // Find the corresponding week in our data
          const weekData = businessListingsData.find(w => w.weekNumber === weekOfMonth);
          if (weekData) {
            // Count based on status
            if (listing.listingStatus === "APPROVED") {
              weekData.Active++;
            } else if (listing.listingStatus === "PENDING") {
              weekData["Waiting Approval"]++;
            }
          }
        });

        // Update the state with processed data
        dispatch({
          type: "SET_BUSINESS_LISTINGS_DATA",
          payload: businessListingsData,
        });

        const businessListings = businessListingsData;

        dispatch({
          type: "SET_ALL_DATA",
          payload: {
            newUsers: newUsersData,
            userApproval: [], // Empty as we're using real data now
            businessListings,
            recentActivity,
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load dashboard data",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mt-4 ">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <div className="rounded-lg border border-gray-200 p-2 px-4 bg-white shadow-sm">
          <div className="flex justify-between">
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="text-primary bg-[#F3F4F6] p-2 rounded-md">
              <FiUsers className="font-bold text-xl text-[#4361EE]" />
            </div>
          </div>
          <div className="text-2xl font-bold">
            {users.length.toLocaleString()}
          </div>
          <div className="my-1 text-xs text-gray-500">
            Total registered users on platform
          </div>
          <div
            className={`flex items-center text-xs ${
              state.userGrowth.isIncrease ? "text-green-500" : "text-red-500"
            }`}
          >
            {state.userGrowth.isIncrease ? (
              <MdArrowOutward />
            ) : (
              <GoArrowDownRight />
            )}
            {state.userGrowth.percentage}%{" "}
            {state.userGrowth.isIncrease ? "increase" : "decrease"}
          </div>
        </div>

        {/* Active Listings Card */}
        <div className="rounded-lg border border-gray-200 p-2 px-4 bg-white shadow-sm">
          <div className="flex justify-between">
            <div className="text-sm font-medium text-gray-500">
              Active Listings
            </div>
            <div className="text-primary bg-[#F3F4F6] p-2 rounded-md">
              <FaGripVertical className="font-bold text-xl text-[#4361EE]" />
            </div>
          </div>
          <div className="text-2xl font-bold">
            {listingStats.activeCount.toLocaleString()}
          </div>
          <div className="my-1 text-xs text-gray-500">
            Business listings currently active
          </div>
          <div
            className={`flex items-center text-xs ${
              listingStats.isIncrease ? "text-green-500" : "text-red-500"
            }`}
          >
            {listingStats.isIncrease ? (
              <MdArrowOutward />
            ) : (
              <GoArrowDownRight />
            )}
            {listingStats.percentage}%{" "}
            {listingStats.isIncrease ? "increase" : "decrease"}
          </div>
        </div>

        {/* Pending Posts Card */}
        <div className="rounded-lg border border-gray-200 p-2 px-4 bg-white shadow-sm">
          <div className="flex justify-between">
            <div className="text-sm font-medium text-gray-500">
              Pending Posts
            </div>
            <div className="text-primary bg-[#F3F4F6] p-2 rounded-md">
              <IoDocumentTextOutline className="font-bold text-xl text-[#4361EE]" />
            </div>
          </div>
          <div className="text-2xl font-bold">24</div>
          <div className="my-1 text-xs text-gray-500">
            Consultant posts awaiting approval
          </div>
          <div className="flex items-center text-xs text-red-500">
            <GoArrowDownRight />
            3% decrease
          </div>
        </div>

        {/* Revenue Card */}
        <div className="rounded-lg border border-gray-200 p-2 px-4 bg-white shadow-sm">
          <div className="flex justify-between">
            <div className="text-sm font-medium text-gray-500">Revenue</div>
            <div className="text-primary bg-[#F3F4F6] p-2 rounded-md">
              <BsReverseLayoutSidebarReverse className="transform rotate-270 font-bold text-xl text-[#4361EE]" />
            </div>
          </div>
          <div className="text-2xl font-bold">$28,459</div>
          <div className="my-1 text-xs text-gray-500">
            Monthly subscription revenue
          </div>
          <div className="flex items-center text-xs text-green-500">
            <MdArrowOutward />
            13% increase
          </div>
        </div>
      </div>

      {/* Dashboard Content (formerly Overview Tab) */}
      <div className="mt-3">
        <div className="flex items-stretch gap-5 mb-3 flex-col lg:flex-row">
          {/* New Users Chart */}
          <div className="rounded-lg border border-gray-200 bg-white py-2 px-4 shadow-sm lg:w-4/6 md:h-[270px] lg:h-[380px]">
            <h3 className="text-lg font-bold">New Users (Last 7 days)</h3>
            <p className="text-xs text-gray-500">
              Number of new user registrations
            </p>
            <div className="mt-2 md:h-[200px] lg:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={newUsersData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#4F46E5"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    domain={[0, "auto"]}
                    allowDecimals={false}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Engagement Distribution */}
          <div className="rounded-lg border border-gray-200 bg-white py-2 px-4 shadow-sm lg:w-2/6 md:h-[270px] lg:h-[380px]">
            <h3 className="text-lg font-bold">User Approval Status</h3>
            <p className="text-xs text-gray-500">
              Breakdown of Active and Pending Users
            </p>
            <div className="flex md:h-[190px] lg:h-[270px] items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userApprovalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {userApprovalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex space-x-8">
              {userApprovalData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="mr-2 h-3 w-3"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm">{entry.name}</span>
                  <span className="ml-1 text-sm font-medium">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-stretch gap-5 flex-col lg:flex-row">
          {/* Business Listings */}
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm lg:w-7/12 md:h-[270px] lg:h-[380px]">
            <h3 className="text-lg font-bold">Business Listings</h3>
            <p className="text-xs text-gray-500">
              Active vs pending listings by week
            </p>
            <div className="mt-2 md:h-[200px] lg:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={businessListingsData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    domain={[0, "dataMax + 10"]}
                    ticks={[0, 10, 20, 30, 40]}
                  />
                  <Tooltip />
                  <Bar dataKey="Active" fill="#4F46E5" barSize={20} />
                  <Bar dataKey="Waiting Approval" fill="#60A5FA" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-start space-x-8 -mt-4">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 bg-[#4F46E5]"></div>
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 bg-[#60A5FA]"></div>
                <span className="text-sm">Waiting Approval</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm lg:w-5/12 md:h-[270px] lg:h-[380px]">
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <p className="text-xs text-gray-500">Latest system activity</p>
            <div className="mt-2 md:h-[200px] lg:h-[300px]">
              <div className="mb-4 text-sm font-medium">Today</div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div
                      className="mr-4 flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${activity.color}20` }}
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: activity.color }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <h1 className="text-sm">{activity.text}</h1>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
