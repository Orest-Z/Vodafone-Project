"use client";

import { useParams } from "next/navigation";
import WalletUnavailableNotice from "@/features/activation/components/WalletUnavailableNotice";

export default function AppleWalletFallbackPage() {
  const params = useParams<{ id: string }>();
  return <WalletUnavailableNotice platform="apple" subscriptionId={params.id} />;
}
