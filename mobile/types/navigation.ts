// Navigation types for the app

export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  ListingDetails: { id: string };
  CreateListing: undefined;
  EditListing: { id: string };
  ViewProposal: { id: string };
};

export type ProfileStackParamList = {
  UserProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  Documents: undefined;
  EditProfile: undefined;
};
