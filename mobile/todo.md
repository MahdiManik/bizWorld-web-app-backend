# BizNest Mobile App - Todo List

## Completed
- ✅ Set up basic project structure with Expo React Native and TypeScript
- ✅ Configured TailwindCSS with NativeWind for styling
- ✅ Created folder structure following best practices (src, components, screens, etc.)
- ✅ Set up navigation system with stack and bottom tabs
- ✅ Created authentication screens and flow
- ✅ Set up basic UI components (ListingCard, NotificationBadge)
- ✅ Implemented basic screens (Home, Profile, Auth)
- ✅ Fixed login page to show backend-specific error messages (pending/accepted status)
- ✅ Updated login navigation flow to correctly navigate to dashboard on success
- ✅ Updated navigation guards to check correct user_profile and company relations
- ✅ Added GuardedScreen components to login and dashboard pages
- ✅ Updated user service to fetch user with populated relations
- ✅ Improved dashboard page user data fetching with proper error handling

## To Do

### High Priority
- [ ] Fix listing service API endpoint for fetching user listings (currently returns 404)
- [ ] Install fonts for the app
- [ ] Set up proper API service layer for backend communication
- [ ] Implement Form validation in auth screens
- [ ] Add Toast notifications for user feedback
- [ ] Create Loading and Error state components

### Medium Priority
- [ ] Create remaining screens for business profile creation
- [ ] Implement company/equity listing functionality
- [ ] Create document upload and management functionality
- [ ] Add investor interaction controls
- [ ] Implement real-time notifications

### Low Priority
- [ ] Add analytics for investor engagement insights
- [ ] Create direct communication approval system
- [ ] Implement offline mode capabilities
- [ ] Add unit and integration tests
- [ ] Create theme customization options

## Notes
- App follows the entrepreneur user stories from project.md
- Using NativeWind for styling with TailwindCSS syntax
- Zustand for state management
- API Base URL: http://localhost:5000/api/v1 (using local development setup only)
- Connecting to local Express.js backend with Prisma (instead of Supabase)
