# 📱 BizNest – Business Owner Portal Todo List

## 📋 Project Overview

This document outlines the implementation tasks for the BizNest business portal application using Expo, Prisma with SQLite/Supabase, Tailwind CSS, and Radix UI (Shadcn).

## 🗂 Progress Dashboard

| Module                         | Status         | Priority  | Progress |
| ------------------------------ | -------------- | --------- | -------- |
| Technical Setup                | 🟡 In Progress | 1-Highest | 30%      |
| Account & Onboarding           | 🔴 Not Started | 1-Highest | 0%       |
| Business Listing Management    | 🔴 Not Started | 2-High    | 0%       |
| Consultant Engagement          | 🔴 Not Started | 3-Medium  | 0%       |
| Investor Interaction           | 🔴 Not Started | 3-Medium  | 0%       |
| Document Management            | 🔴 Not Started | 2-High    | 0%       |
| Chat System                    | 🔴 Not Started | 4-Low     | 0%       |
| Notifications                  | 🔴 Not Started | 4-Low     | 0%       |
| Subscription & Plan Management | 🔴 Not Started | 3-Medium  | 0%       |
| Admin Approval                 | 🔴 Not Started | 2-High    | 0%       |

## 🛠 Implementation Tasks

### 1️⃣ Technical Setup (Priority: Highest)

- [ ] Initialize project with Expo
- [ ] Set up Prisma with SQLite for development
- [ ] Configure Supabase for production database
- [ ] Install and configure TailwindCSS
- [ ] Set up Radix UI (Shadcn) components
- [ ] Configure React Toast
- [ ] Create folder structure (services, types, etc.)
- [ ] Set up responsive layouts
- [ ] Create reusable UI components
- [ ] Implement API client with proper error handling
- [ ] Add navigation system
- [ ] Set up authentication flow

### 1️⃣ Account & Onboarding (Priority: Highest)

- [ ] Create Register/Login screens
  - [ ] Email/Password authentication
  - [ ] Google login integration
  - [ ] Email verification UI
  - [ ] Password reset functionality
- [ ] Build Onboarding flow
  - [ ] Company Name input
  - [ ] Industry dropdown/select
  - [ ] Country dropdown
  - [ ] Company Size input
  - [ ] Business Status selection (Active / Closing)
  - [ ] Interest selection (Sell / Share)
- [ ] Navigation to dashboard after successful onboarding
- [ ] User profile management

### 2️⃣ Business Listing Management (Priority: High)

- [ ] Create database schema for listings
  - [ ] Set up Prisma model for Company with additional fields:
    ```
    established, employees, annualRevenue, equityOffered, revenueGrowth,
    ebitda, ebitdaGrowth, profitMargin, profitMarginGrowth
    ```
  - [ ] Create Listing model with status enum: PENDING, APPROVED, REJECTED
- [ ] Implement Create Listing UI
  - [ ] Title input
  - [ ] Summary textarea
  - [ ] Financials section (optional)
  - [ ] Asking Price input
  - [ ] Tags input (chip input or multi-select)
  - [ ] Upload section for documents
  - [ ] Submit button with status handling
- [ ] Build Edit/Delete Listing functionality
  - [ ] List view of current listings
  - [ ] Edit and delete buttons
  - [ ] Status badges
  - [ ] Admin feedback display

### 2️⃣ Document Management (Priority: High)

- [ ] Create database schema for documents
- [ ] Build Document Upload functionality
  - [ ] File picker UI
  - [ ] Upload implementation
  - [ ] Organization by Company/Listing
- [ ] Implement View Permissions UI
  - [ ] Documents list view
  - [ ] Visibility badges
  - [ ] Permission toggles

### 2️⃣ Admin Approval UI (Priority: High)

- [ ] Build Admin Listing Review UI
  - [ ] Admin panel (mobile responsive)
  - [ ] Pending listings view
  - [ ] Approve/Reject buttons
  - [ ] Feedback input area

### 3️⃣ Consultant Engagement (Priority: Medium)

- [ ] Create database schema for consultants
- [ ] Create Request Consultant UI
  - [ ] Consultant matching/search view
  - [ ] Project Scope form
  - [ ] Budget input
  - [ ] Timeline selection
  - [ ] Submit functionality
- [ ] Implement Consultant Response Management
  - [ ] Consultant cards with action buttons
  - [ ] Engagements list view

### 3️⃣ Investor Interaction (Priority: Medium)

- [ ] Create database schema for investors
- [ ] Build Investor Interest View
  - [ ] Investor cards with interest level
  - [ ] Filtering options
  - [ ] Connection request handling
- [ ] Create Connection Management
  - [ ] Active connections list
  - [ ] Messaging integration
  - [ ] Connection history
  - [ ] Approve/Reject functionality
  - [ ] Chat activation for approved connections

### 3️⃣ Subscription & Plan Management (Priority: Medium)

- [ ] Create database schema for subscriptions
- [ ] Create Subscription UI
  - [ ] Plan comparison cards
  - [ ] Subscribe button
  - [ ] Payment integration (Stripe)

### 4️⃣ Chat System (Priority: Low)

- [ ] Create database schema for chat messages
- [ ] Create Real-time Chat UI
  - [ ] Chat inbox with filtering
  - [ ] Message thread screen
  - [ ] Message composition area
  - [ ] File upload UI
  - [ ] Emoji picker
  - [ ] Typing indicator
- [ ] Implement real-time messaging functionality
  > 💡 Consider using Socket.io or an external chat API

### 4️⃣ Notifications (Priority: Low)

- [ ] Create database schema for notifications
- [ ] Implement Notifications Center
  - [ ] Various notification types
  - [ ] List view with icons
  - [ ] Timestamp display
  - [ ] Unread indicators
  - [ ] Push notification integration
    > 💡 Consider implementing with webhooks or scheduled jobs

## 📝 API Client Usage Standards

- Always import the API client from appropriate service:
  ```typescript
  import { api } from "@/services/api";
  ```
- Follow proper error handling pattern in service methods
- Return typed data from API responses
- Use appropriate HTTP methods for CRUD operations

## 🧪 Testing & Refinement

- [ ] Test UI on various screen sizes
- [ ] Verify all interactive elements
- [ ] Ensure consistent styling
- [ ] Review accessibility
- [ ] Optimize performance
- [ ] End-to-end testing of critical flows

## ✅ Completed Tasks

- _None yet_

---

> **Note:** Mark tasks as complete by changing `[ ]` to `[x]` as you progress
