export interface TouristDetails {
  firstName: string;
  lastName: string;
  email: string;
  passportNumber: string;
  deliveryMethod: "ESIM" | "PHYSICAL_SIM";
  termsAccepted: boolean;
}