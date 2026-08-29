import { NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/features/activation/lib/paypal";

export async function GET() {
  try {
    const accessToken = await getPayPalAccessToken();

    const res = await fetch(`${PAYPAL_API_BASE}/v1/identity/generate-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": "en_US",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("PayPal generate-token error:", data);
      return NextResponse.json({ error: "Failed to generate client token" }, { status: 502 });
    }

    return NextResponse.json({ clientToken: data.client_token });
  } catch (err) {
    console.error("client-token route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}