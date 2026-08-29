// app/api/paypal/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/features/activation/lib/paypal";
import { allToEur } from "@/features/activation/lib/currency";

const BACKEND_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
export async function POST(req: NextRequest) {
  try {
    const { packId, email } = await req.json();

    if (!packId) {
      return NextResponse.json({ error: "packId is required" }, { status: 400 });
    }

    const packRes = await fetch(`${BACKEND_API_BASE}/packs/${packId}`, { cache: "no-store" });
    if (!packRes.ok) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 });
    }
    const pack = await packRes.json();

    let discountPercent = 0;
    if (email) {
      const discountRes = await fetch(
        `${BACKEND_API_BASE}/tourists/discount-by-email?email=${encodeURIComponent(email)}`,
        { cache: "no-store" }
      );
      if (discountRes.ok) {
        const discountData = await discountRes.json();
        if (discountData.available) discountPercent = discountData.discountPercent;
      }
    }

    let amount = allToEur(pack.priceAll);
    if (discountPercent > 0) {
      amount = amount * (1 - discountPercent / 100);
    }
    const currency = "EUR";

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid pack price" }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: String(packId),
            description: pack.title ?? "Vodafone Tourist Pack",
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      console.error("PayPal create-order error:", orderData);
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 502 });
    }

    return NextResponse.json({ orderID: orderData.id, discountApplied: discountPercent });
  } catch (err) {
    console.error("create-order route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}