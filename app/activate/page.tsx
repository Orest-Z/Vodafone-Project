"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TouristDetailsForm from "@/components/TouristDetailsForm";
import WalletSyncStatus from "@/components/game/WalletSyncStatus";

function ActivateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // NEW: Read packId from the URL
  const packId = searchParams.get("packId");

  const [packDetails, setPackDetails] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [orderRef, setOrderRef] = useState("");
  // NEW: State to store the identity of the user for gamification
  const [touristId, setTouristId] = useState("");

  // NEW: Fetch specific pack details for the summary view
  useEffect(() => {
    if (!packId) return;
    const fetchPack = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${apiUrl}/packs/${packId}`);
      if (res.ok) {
        setPackDetails(await res.json());
      }
    };
    fetchPack();
  }, [packId]);

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // NEW: Actual backend call to the activation service
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${apiUrl}/activations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, packId }),
      });

      if (!res.ok) throw new Error(`Activation failed: ${res.status}`);

      const data = await res.json();
      
      setOrderRef(data.orderRef);
      // NEW: Save the generated ID so we can track credits
      setTouristId(data.touristId); 
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to activate pack. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!packId) return <div className="p-8 text-center">No pack selected.</div>;
  if (!packDetails) return <div className="p-8 text-center">Loading pack details...</div>;

  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Activate {packDetails.title}</h1>
      
      {!isSuccess ? (
        <TouristDetailsForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      ) : (
        <div className="bg-gray-50 p-8 rounded-xl shadow-md text-center border border-gray-100">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Activation Successful!</h2>
          <p className="mb-8 text-lg">Your Order Reference: <span className="font-mono font-bold">{orderRef}</span></p>
          
          <div className="mt-8">
             {/* NEW: Pass touristId in the URL to init the Game Hub correctly */}
            <WalletSyncStatus 
              packTitle={packDetails.title}
              onComplete={() => router.push(`/game-hub?touristId=${touristId}`)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

// NEW: Required by Next.js 14 when using useSearchParams()
export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ActivateContent />
    </Suspense>
  );
}