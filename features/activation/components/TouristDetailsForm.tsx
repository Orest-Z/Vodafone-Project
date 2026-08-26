"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Smartphone, Store, ArrowLeft, ArrowRight, Info } from "lucide-react";
import { TouristDetails } from "../types/tourist";

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
            placeholder="Enter first name"
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
            placeholder="Enter last name"
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
          placeholder="Enter email address"
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
          placeholder="Enter passport or ID number"
          value={formData.passportNumber}
          onChange={handleChange}
          required
        />
      </label>

      <div className="form-field-group">
        <span className="form-field-label">SIM Delivery</span>
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
            I agree to the <a href="#">Terms &amp; Conditions</a> and{" "}
            <a href="#">Privacy Policy</a>
          </span>
        </label>

        <p className="form-hint">
          <Info size={13} />
          {isEsim
            ? "eSIM will be sent to your email instantly after payment."
            : "Bring your passport to any Vodafone store in Albania to collect your SIM."}
        </p>
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