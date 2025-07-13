# 📋 BizNest – Project Rules

This document outlines the core rules and conventions for working on the **BizNest Mobile App (UI-Only)**.

---

## ✅ Project Constraints

- 🧱 **Package Manager**: Use **Bun** (`bun install`, `bun run` etc.)
- 📱 **UI Scope**: Mobile view only (Expo + TailwindCSS)
- 🎨 **Styling**: Use Tailwind CSS (via NativeWind or similar)
- 🧪 **Data**: Use mock data or light Zustand state; no backend logic
- 🧾 **Tracking**: Update `todo.md` **only after** tasks are completed
- 🛑 **Discipline**: Do **not** make extra changes unless explicitly requested

---

## 🌐 API Client Usage Rules

All HTTP requests must follow these conventions.

- ✅ Use only the shared `axios` instance
- 📦 Import it from: `src/lib/api.ts`
- 🚫 Do **not** use raw `axios` imports
- 🚫 Do **not** prefix endpoints with `/api/v1` (already included in base URL)

### ✅ Correct Usage Example:

```ts
// In a service file
import api from "@/lib/api";

async function getData() {
  const response = await api.get("/endpoint");
  return response.data;
}
```
