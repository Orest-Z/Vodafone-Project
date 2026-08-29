"use client";

import { FileText, CreditCard, PackageCheck, Check } from "lucide-react";
import { Fragment } from "react";

export type CheckoutStep = "DETAILS" | "PAYMENT" | "SUCCESS";

const STEPS: { key: CheckoutStep; label: string; icon: typeof FileText }[] = [
  { key: "DETAILS", label: "Enter Details", icon: FileText },
  { key: "PAYMENT", label: "Choose Payment", icon: CreditCard },
  { key: "SUCCESS", label: "Get Pack", icon: PackageCheck },
];

export default function CheckoutStepper({ currentStep }: { currentStep: CheckoutStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="checkout-stepper" role="list">
      {STEPS.map(({ key, label, icon: Icon }, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;
        const status = isCompleted ? "completed" : isActive ? "active" : "upcoming";

        return (
          <Fragment key={key}>
            <div className={`checkout-stepper-step checkout-stepper-step--${status}`} role="listitem">
              <span className="checkout-stepper-marker">
                {isCompleted ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}
              </span>
              <span className="checkout-stepper-label">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`checkout-stepper-connector ${
                  i < currentIndex ? "checkout-stepper-connector--filled" : ""
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}