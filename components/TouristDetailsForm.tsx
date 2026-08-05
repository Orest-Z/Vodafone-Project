"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { TouristDetails } from "../types/tourist";

interface TouristDetailsFormProps {
  onSubmit: (data: TouristDetails) => void;
  onCancel?: () => void;
}

export default function TouristDetailsForm({
  onSubmit,
  onCancel,
}: TouristDetailsFormProps) {
  const [formData, setFormData] = useState<TouristDetails>({
    firstName: "",
    lastName: "",
    passportNumber: "",
    email: "",
    deliveryMethod: "ESIM",
  });

  // Type-safe handler for both inputs and select fields
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Sends typed payload to parent
  };

  return (
    <form onSubmit={handleSubmit} className="tourist-form">
      <h3>Enter Your Identification Details</h3>

      <label>
        First Name
        <input
          type="text"
          name="firstName"
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
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Email Address
        <input
          type="email"
          name="email"
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
          value={formData.passportNumber}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        SIM Delivery Method
        <select
          name="deliveryMethod"
          value={formData.deliveryMethod}
          onChange={handleChange}
        >
          <option value="ESIM">Instant eSIM (Digital)</option>
          <option value="PHYSICAL_SIM">Physical SIM (Airport Pickup)</option>
        </select>
      </label>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Back
          </button>
        )}
        <button type="submit">Proceed to Payment</button>
      </div>
    </form>
  );
}