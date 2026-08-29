"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { useTheme } from "next-themes";
import { Lock, ShieldCheck } from "lucide-react";
import {
  PayPalCardFieldsProvider,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";

interface BillingAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

interface CardPaymentFormProps {
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void> | void;
  onError: (message: string) => void;
  disabled?: boolean;
}

// Kept short on purpose — extend with whatever markets this pack actually
// ships to. Albania first since that's who's buying the eSIM.
const BILLING_COUNTRIES = [
  { code: "AL", label: "Albania" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "DE", label: "Germany" },
  { code: "IT", label: "Italy" },
  { code: "GR", label: "Greece" },
  { code: "FR", label: "France" },
  { code: "XK", label: "Kosovo" },
];

const EMPTY_BILLING: BillingAddress = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "AL",
};

/**
 * Lives inside PayPalCardFieldsProvider so it can reach the cardFields
 * instance via the hook — this is the only supported way to trigger
 * submission of the hosted (cross-origin) card inputs.
 */
function CardSubmitButton({
  billingAddress,
  disabled,
  isSubmitting,
  onSubmit,
}: {
  billingAddress: BillingAddress;
  disabled?: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm || typeof cardFieldsForm.submit !== "function") return;
    onSubmit();
    await cardFieldsForm.submit({
      billingAddress: {
        addressLine1: billingAddress.addressLine1,
        addressLine2: billingAddress.addressLine2 || undefined,
        adminArea1: billingAddress.state || undefined,
        adminArea2: billingAddress.city,
        postalCode: billingAddress.postalCode,
        countryCode: billingAddress.countryCode,
      },
    });
  };

  return (
    <button
      type="button"
      className="card-pay-btn"
      onClick={handleClick}
      disabled={disabled || isSubmitting}
    >
      <Lock size={15} />
      {isSubmitting ? "Processing..." : "Pay with card"}
    </button>
  );
}

export default function CardPaymentForm({
  createOrder,
  onApprove,
  onError,
  disabled,
}: CardPaymentFormProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billing, setBilling] = useState<BillingAddress>(EMPTY_BILLING);

  // The hosted card inputs render inside a cross-origin PayPal iframe, so
  // they can't read our CSS custom properties — we mirror the active
  // --text-main / --text-muted values here as literal colors instead so
  // the fields still track the light/dark toggle.
  const cardFieldStyle = {
  input: {
    color: "#ffffff",
    background: "transparent",
    height: "100%",
    "font-size": "15px",
    "font-family": "Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  "::placeholder": {
    color: "#8a8f9d",
  },
  ".invalid": {
    color: "#e60000",
  },
};

  const updateBilling =
    (field: keyof BillingAddress) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setBilling((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleApprove = async (data: { orderID: string }) => {
    try {
      await onApprove(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (err: any) => {
    console.error("Card fields error:", err);
    setIsSubmitting(false);
    onError("We couldn't process your card. Please check the details and try again.");
  };

  return (
    <div className="card-payment-wrapper">
      <PayPalCardFieldsProvider
        createOrder={createOrder}
        onApprove={handleApprove}
        onError={handleError}
        style={cardFieldStyle}
      >
        <div className="card-field-group">
          <label className="card-field-label">Cardholder name</label>
          <div className="card-field-input" style={{ width: "100%" }}>
            <PayPalNameField />
          </div>
        </div>

        <div className="card-field-group">
          <label className="card-field-label">Card number</label>
         <div className="card-field-input" style={{ width: "100%" }}>
            <PayPalNumberField />
          </div>
        </div>

        <div className="form-row">
          <div className="card-field-group">
            <label className="card-field-label">Expires</label>
            <div className="card-field-input" style={{ width: "100%" }}>
              <PayPalExpiryField />
            </div>
          </div>
          <div className="card-field-group">
            <label className="card-field-label">CVC</label>
            <div className="card-field-input" style={{ width: "100%" }}>
              <PayPalCVVField />
            </div>
          </div>
        </div>

        <h4 className="card-billing-title">Billing address</h4>

        <div className="tourist-form card-billing-form">
          <div className="form-row">
            <label>
              Street address
              <input
                type="text"
                value={billing.addressLine1}
                onChange={updateBilling("addressLine1")}
                placeholder="Street and number"
                required
              />
            </label>
            <label>
              Apt., suite, bldg. (optional)
              <input
                type="text"
                value={billing.addressLine2}
                onChange={updateBilling("addressLine2")}
                placeholder="Apt, suite, etc."
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              City
              <input
                type="text"
                value={billing.city}
                onChange={updateBilling("city")}
                placeholder="City"
                required
              />
            </label>
            <label>
              State / Region
              <input
                type="text"
                value={billing.state}
                onChange={updateBilling("state")}
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Postal code
              <input
                type="text"
                value={billing.postalCode}
                onChange={updateBilling("postalCode")}
                placeholder="Postal code"
                required
              />
            </label>
            <label>
              Country
              <select value={billing.countryCode} onChange={updateBilling("countryCode")}>
                {BILLING_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <CardSubmitButton
          billingAddress={billing}
          disabled={disabled}
          isSubmitting={isSubmitting}
          onSubmit={() => setIsSubmitting(true)}
        />

        <p className="card-secure-note">
          <ShieldCheck size={13} />
          Payments are encrypted and processed securely by PayPal.
        </p>
      </PayPalCardFieldsProvider>
    </div>
  );
}