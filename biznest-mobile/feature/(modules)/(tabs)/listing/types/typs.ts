import { AuthUser } from "../../profile/types/types";

export interface ConsultantProfileProps {
  id: string;
  name: string;
  image: string;
  onPress: () => void;
}

export interface User {
  id: number;
  fullName: string;
}
export interface MonthlyFinancialInput {
  month: number;
  year: number;
  revenue: string;
  ebitda: string;
  profitMargin: string;
}

export interface Image {
  id: number;
  url: string;
}

/** Input/response structure for a Listing */
export interface ListingInput {
  id: number;
  title: string;
  askingPrice: string;
  category: string;
  status?: string;
  country: string;
  description?: string | null;
  visibility?: "Public" | "Private";
  monthlyFinancials?: MonthlyFinancialInput[];
  equityOffered: string;
  employees: string;
  established: string;
  marginYoY: string;
  ebitdaYoY: string;
  revenueYoY: string;
  ebitda: string;
  industry: string;
  type: string;
  profitMargin: string;
  growthRate: string;
  companyName: string;
  isFavorite?: boolean;
  document: Image | null;
  image?: Image | null;
  user?: AuthUser;
}

/** Final mapped Listing returned from service */

export interface Listing extends ListingInput {
  id: number;
  user?: AuthUser;
}
