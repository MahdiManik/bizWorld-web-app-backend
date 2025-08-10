export interface CreateListing {
  title: string;
  askingPrice: string;
  category: string;
  country: string;
  image: number;
  description: string;
  equityOffered: string;
  employees: string;
  established: string;
  businessOwner: string;
  listingStatus: string;
  annualRevenue: string;
  profitMargin: string;
  growthRate: string;
  revenueBreakDown: RevenueBreakDown;
  document: number[];
}

export interface RevenueBreakDown {
  Jan: string;
  Feb: string;
  Mar: string;
  Apr: string;
  May: string;
  Jun: string;
  Jul: string;
  Aug: string;
  Sep: string;
  Oct: string;
  Nov: string;
  Dec: string;
  EBITDA: string;
}
