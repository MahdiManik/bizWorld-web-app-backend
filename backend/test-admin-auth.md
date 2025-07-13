# Testing Admin Authentication for Subscription Creation

## Implementation Summary

I've implemented role-based access control for subscription creation with the following changes:

### 1. Enhanced Auth Middleware (`backend/src/app/middlewares/auth.ts`)
- Added `adminAuth()` middleware function
- Verifies JWT token contains admin credentials
- Checks that the user exists in the `Admin` table
- Validates that the role is "ADMIN"
- Sets `req.admin` object with admin details

### 2. Updated Subscription Routes (`backend/src/app/modules/subscriptions/subscription.routes.ts`)
- Applied `adminAuth()` middleware to the POST route for creating subscriptions
- Only admins can now create subscription plans

### 3. Enhanced Subscription Service (`backend/src/app/modules/subscriptions/subscription.service.ts`)
- Fixed field naming from `plan_type` to `planType` to match schema
- Added admin verification in `createSubscription` function
- Added proper validation for required fields
- Ensures only authenticated admins can create subscriptions

## How to Test

### 1. Admin Login
First, login as an admin to get the JWT token:
```bash
POST /api/v1/admin/login
{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

### 2. Create Subscription (Admin Only)
Use the admin JWT token to create a subscription:
```bash
POST /api/v1/subscriptions/
Authorization: Bearer <admin_jwt_token>
{
  "planType": "Premium",
  "userId": "user_id_here",
  "price": "29.99",
  "period": "monthly",
  "description": "Premium subscription plan",
  "features": ["Feature 1", "Feature 2", "Feature 3"]
}
```

### 3. Test Unauthorized Access
Try to create a subscription without admin token (should fail):
```bash
POST /api/v1/subscriptions/
{
  "planType": "Premium",
  "userId": "user_id_here",
  "price": "29.99"
}
```

## Expected Results

✅ **With Admin Token**: Subscription created successfully
❌ **Without Token**: 401 Unauthorized error
❌ **With User Token**: 401/403 Forbidden error (admin required)

## Next Steps

You can now test this implementation and let me know which other operations you'd like to restrict to admin-only access. Some suggestions:

1. **User Management**: Create, update, delete users
2. **Listing Approval**: Approve/reject business listings
3. **Company Status**: Update company verification status
4. **Subscription Management**: Update, delete subscription plans
5. **System Settings**: Modify platform configurations

Let me know which operation you'd like me to implement admin-only access for next!
