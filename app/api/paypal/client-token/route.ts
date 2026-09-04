import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/features/activation/lib/paypal";
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMIT_RULES } from "@/features/activation/lib/rateLimit";

export async function GET(req: NextRequest) {
  if (!checkRateLimit(`client-token:${getClientIp(req)}`, RATE_LIMIT_RULES.clientToken)) {
    return rateLimitResponse();
  }

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