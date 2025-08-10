import { AuthUser, BaseUser } from '@/types/user';

export const transformUserData = (rawUser: any): AuthUser => {
  return {
    id: rawUser.id || rawUser.documentId,
    documentId: rawUser.documentId,
    fullName: rawUser.fullName || rawUser.name,
    email: rawUser.email,
    userStatus: rawUser.userStatus,
    role: rawUser.role,
  };
};

export const getUserDisplayName = (user: AuthUser | BaseUser | null): string => {
  if (!user) return 'Unknown User';
  return user.fullName || user.email || 'User';
};

export const isInvestorUser = (user: AuthUser | BaseUser | null): boolean => {
  if (!user) return false;
  return (user as BaseUser).investerStatus === 'APPROVED';
};

export const isConsultantUser = (user: AuthUser | BaseUser | null): boolean => {
  if (!user) return false;
  return (user as BaseUser).consultantStatus === 'APPROVED';
};

export const getUserInitials = (user: AuthUser | BaseUser | null): string => {
  const displayName = getUserDisplayName(user);
  return displayName
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const formatUserRole = (role?: any): string => {
  if (!role) return 'User';
  if (typeof role === 'object' && role.name) {
    return role.name;
  }
  return 'User';
};