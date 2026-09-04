"use client";

import { useParams } from "next/navigation";
import WalletUnavailableNotice from "@/features/activation/components/WalletUnavailableNotice";

export default function GoogleWalletFallbackPage() {
  const params = useParams<{ id: string }>();
  return <WalletUnavailableNotice platform="google" subscriptionId={params.id} />;
}
