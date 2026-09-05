"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Smartphone, Store, ArrowLeft, ArrowRight, Info, Gift } from "lucide-react";
import { TouristDetails } from "../types/tourist";
import PassportScanButton from "./PassportScanButton";
import type { PassportScanResult } from "../lib/passportScan";

interface TouristDetailsFormProps {
  onSubmit: (data: TouristDetails) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const DELIVERY_OPTIONS: {
  value: TouristDetails["deliveryMethod"];
  label: string;
  sublabel: string;
  icon: typeof Smartphone;
}[] = [
  {
    value: "ESIM",
    label: "eSIM (Digital)",
    sublabel: "Instant delivery to your email",
    icon: Smartphone,
  },
  {
    value: "PHYSICAL_SIM",
    label: "Physical SIM",
    sublabel: "Pick up in-store in Albania",
    icon: Store,
  },
];

export default function TouristDetailsForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TouristDetailsFormProps) {
  const [formData, setFormData] = useState<TouristDetails>({
    firstName: "",
    lastName: "",
    passportNumber: "",
    email: "",
    deliveryMethod: "ESIM",
    termsAccepted: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectDelivery = (value: TouristDetails["deliveryMethod"]) => {
    setFormData((prev) => ({ ...prev, deliveryMethod: value }));
  };

  // Scanning only ever autofills these three fields — email is never part
  // of PassportScanResult, so it structurally cannot be touched here.
  const handlePassportScanned = (fields: PassportScanResult) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEsim = formData.deliveryMethod === "ESIM";

  return (
    <form onSubmit={handleSubmit} className="tourist-form">
      <h3 className="form-section-title">Personal Information</h3>

      <div className="form-row">
        <label>
          First Name
          <input
            type="text"
            name="firstName"
            placeholder="e.g. Maria"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            name="lastName"
            placeholder="e.g. Schmidt"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>
        Email Address
        <input
          type="email"
          name="email"
          placeholder="your@email.com, eSIM QR code delivered here"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Passport / ID Number
        <input
          type="text"
          name="passportNumber"
          placeholder="e.g. AB1234567, required for SIM registration by law"
          value={formData.passportNumber}
          onChange={handleChange}
          required
        />
      </label>

      <PassportScanButton onScanned={handlePassportScanned} />

      <div className="form-field-group">
        <span className="form-field-label">SIM Delivery Method</span>
        <div className="delivery-options">
          {DELIVERY_OPTIONS.map(({ value, label, sublabel, icon: Icon }) => {
            const active = formData.deliveryMethod === value;
            return (
              <button
                type="button"
                key={value}
                onClick={() => selectDelivery(value)}
                className={`delivery-option${active ? " active" : ""}`}
                aria-pressed={active}
              >
                <span className="delivery-icon">
                  <Icon size={16} />
                </span>
                <span className="delivery-copy">
                  <span className="delivery-label">{label}</span>
                  <span className="delivery-sublabel">{sublabel}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-field-group">
        <span className="form-field-label">Terms &amp; Confirmation</span>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }))
            }
            required
          />
          <span>
            I agree to the{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms &amp; Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </span>
        </label>

        <p className="form-hint">
          <Info size={13} />
          {isEsim
            ? "eSIM will be sent to your email instantly after successful payment."
            : "Bring your passport to any Vodafone store in Albania to collect your SIM."}
        </p>
      </div>

      <div className="form-promo-note">
        <Gift size={14} color="var(--primary)" />
        <span>
          <strong>Promo included</strong>: guaranteed reward with every activation. Play the Daily Drop after checkout.
        </span>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            <ArrowLeft size={16} />
            Back
          </button>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Processing..." : "Continue to Payment"}
          {!isSubmitting && <ArrowRight size={16} />}
        </button>
      </div>
    </form>
  );
}