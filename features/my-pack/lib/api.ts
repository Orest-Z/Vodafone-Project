const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export interface SubscriptionStatus {
  subscriptionId: string;
  touristFirstName: string;
  touristLastName: string;
  orderRef: string;
  packTitle: string;
  packSubtitle: string;
  dataAllowance: string;
  minutesAllowance: number;
  durationDays: number;
  deliveryMethod: "ESIM" | "PHYSICAL_SIM";
  status: "ACTIVE" | "PENDING" | "CANCELLED" | "FAILED";
  activatedAt: string | null;
  expiresAt: string | null;
  amountPaid: number | null;
  currency: string | null;
  gameCredits: number;
}

export async function fetchSubscriptionStatus(touristId: string): Promise<SubscriptionStatus> {
  const res = await fetch(`${API_BASE}/tourists/${touristId}/subscription`);
  if (!res.ok) throw new Error("Subscription not found");
  return res.json();
}
