# 🧩 BizNest – Business Owner Portal (Mobile App UI Only)

## 👤 Primary User

**Business Owner** – An entrepreneur looking to list their business for sale/share, seek consultants, and connect with investors.

## 🎯 Project Goal

Design and develop a **mobile-first UI** (no backend logic in this phase) that:

- Allows business owners to create/edit listings
- Engage with consultants and investors
- View notifications and documents
- Preview admin-side approval UI

> ⚠️ This project focuses solely on UI. Backend logic will be integrated later via **Strapi** CMS.

---

## 🔧 Tech Stack Overview

| Layer             | Technology                                 |
| ----------------- | ------------------------------------------ |
| Mobile Runtime    | Expo (React Native)                        |
| Package Manager   | **Bun**                                    |
| Styling           | **Tailwind CSS** (via NativeWind)          |
| UI Library        | React Native Elements / Custom             |
| State (if needed) | Zustand / Context (light, mock state only) |
| API (future use)  | Axios (with `api.ts` instance wrapper)     |
| Backend (future)  | Strapi CMS                                 |

---

## 📱 UI Development Scope

This phase includes **UI-only views**, no real data flow:

- Account + Onboarding
- Listings CRUD views
- Consultant/Investor Cards
- Document/File Management
- Notifications
- Chat System (UI only)
- Admin Panel (mobile preview)

✅ UI screens must reflect responsive design for mobile phones only.

---

## 🌐 API Setup for Mobile App

### Base URL Usage

All API calls will use a central axios instance.

```ts
// File: src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // or your production base URL
});

export default api;
```
