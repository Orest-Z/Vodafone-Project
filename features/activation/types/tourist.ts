// Matches al.vodafone.vodafone_project_backend.dto.PackDto exactly.
// NOTE: backend field is `priceAll` (BigDecimal, price in Albanian Lek / ALL),
// there is no `price` and no `currency` field in the API response.
export interface PackFeature {
  label: string;
  iconKey: string;
}

export interface PackDetails {
  id: string;
  title: string;
  subtitle: string;
  priceAll: number;
  durationDays: number;
  dataAllowance: string;
  minutesAllowance: number;
  roamingDetails: string | null;
  imageUrl: string;
  features: PackFeature[];
}

export interface TouristDetails {
  firstName: string;
  lastName: string;
  email: string;
  passportNumber: string;
  deliveryMethod: "ESIM" | "PHYSICAL_SIM";
  termsAccepted: boolean;
}

// Matches al.vodafone.vodafone_project_backend.dto.CustomPlanRequest exactly.
export interface CustomPlanSpec {
  dataAllowanceGb: number | null;
  unlimitedData: boolean;
  minutesAllowance: number;
  durationDays: number;
}

// Matches al.vodafone.vodafone_project_backend.dto.CustomPlanQuoteResponse exactly.
export interface CustomPlanQuote {
  priceAll: number;
  dataAllowanceLabel: string;
  minutesLabel: string;
  durationLabel: string;
  durationDays: number;
}