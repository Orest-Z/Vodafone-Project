// app/api/paypal/capture-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";
import type { TouristDetails } from "@/types/tourist";

const BACKEND_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export async function POST(req: NextRequest) {
  try {
    const { orderID, packId, formData } = (await req.json()) as {
      orderID?: string;
      packId?: string;
      formData?: TouristDetails;
    };

    if (!orderID || !packId || !formData) {
      return NextResponse.json(
        { error: "orderID, packId and formData are required" },
        { status: 400 }
      );
    }

    // 1. Actually capture the approved PayPal order. Creating an order
    // (create-order) only authorizes it — no money moves and no proof of
    // payment exists until this capture call succeeds.
    const accessToken = await getPayPalAccessToken();

    const captureRes = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      const issue = captureData?.details?.[0]?.issue;
      console.error("PayPal capture-order error:", JSON.stringify(captureData, null, 2));
      return NextResponse.json(
        {
          error: "Failed to capture PayPal payment",
          // Lets the client special-case recoverable declines (e.g. offer
          // the buyer a different funding source) instead of dead-ending.
          issue,
          // TEMP DEBUG — remove once fully verified. Surfaces PayPal's
          // actual error name/message instead of a generic string.
          debug: {
            name: captureData?.name,
            message: captureData?.message,
            details: captureData?.details,
          },
        },
        { status: 502 }
      );
    }

    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];

    if (captureData.status !== "COMPLETED" || !capture) {
      console.error("PayPal capture did not complete:", captureData);
      return NextResponse.json(
        { error: "Payment was not completed" },
        { status: 402 }
      );
    }

    const amountPaid = capture.amount?.value;
    const currency = capture.amount?.currency_code;

    // 2. Persist the paid activation in our own database. If this fails,
    // the customer HAS been charged on PayPal's side but we have no record
    // of it — that must never fail silently, so we log loudly and surface
    // an error instead of pretending it succeeded.
    const activationRes = await fetch(`${BACKEND_API_BASE}/activations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        passportNumber: formData.passportNumber,
        deliveryMethod: formData.deliveryMethod,
        termsAccepted: formData.termsAccepted,
        paypalOrderId: orderID,
        paypalCaptureId: capture.id,
        amountPaid,
        currency,
      }),
    });

    const activationData = await activationRes.json();

    if (!activationRes.ok) {
      console.error(
        `CRITICAL: PayPal capture ${capture.id} for order ${orderID} succeeded ` +
          `but activation was not recorded in the backend:`,
        activationData
      );
      return NextResponse.json(
        {
          error:
            "Your payment went through, but we couldn't finish activating your pack. " +
            "Please contact support with this reference: " + capture.id,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      orderRef: activationData.orderRef,
      touristId: activationData.touristId,
      transactionId: activationData.transactionId,
    });
  } catch (err) {
    console.error("capture-order route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}