// app/api/paypal/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";
import { allToEur } from "@/lib/currency";

const BACKEND_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export async function POST(req: NextRequest) {
  try {
    const { packId } = await req.json();

    if (!packId) {
      return NextResponse.json({ error: "packId is required" }, { status: 400 });
    }

    // SECURITY: always resolve the price server-side from the pack catalog.
    // Never accept an amount from the client — that would let anyone pay
    // whatever they want.
    const packRes = await fetch(`${BACKEND_API_BASE}/packs/${packId}`, {
      cache: "no-store",
    });

    if (!packRes.ok) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 });
    }

    const pack = await packRes.json();
    // Backend PackDto returns `priceAll` (BigDecimal) priced in Albanian Lek,
    // not `price`, and has no `currency` field at all — see
    // PackController/PackService/PackDto. All PayPal charges must be in EUR,
    // so convert here — never pass the raw Lek number to PayPal as "EUR".
    const amount = allToEur(pack.priceAll);
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
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 502 }
      );
    }

    return NextResponse.json({ orderID: orderData.id });
  } catch (err) {
    console.error("create-order route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}