"use client";

import { useEffect, useState } from "react";
import { formatAll, allToEur } from "@/features/activation/lib/currency";
import { quoteCustomPlan, buildCustomPlan } from "@/features/activation/lib/api";
import type { CustomPlanQuote } from "@/features/activation/types/tourist";

// Data slider steps 1-50 are metered GB; the 51st (top) step means
// "Unlimited" — kept as one slider (matches the reference screenshot)
// instead of a separate toggle.
const MAX_METERED_GB = 50;
const UNLIMITED_STEP = MAX_METERED_GB + 1;

const DURATION_OPTIONS = [7, 15, 22, 30];

export default function CustomPlanBuilder() {
  const [dataStep, setDataStep] = useState(15);
  const [minutesAllowance, setMinutesAllowance] = useState(200);
  const [durationDays, setDurationDays] = useState(15);

  const [quote, setQuote] = useState<CustomPlanQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlimitedData = dataStep === UNLIMITED_STEP;
  const dataAllowanceGb = unlimitedData ? null : dataStep;

  useEffect(() => {
    setError(null);
    const timer = setTimeout(() => {
      setQuoting(true);
      quoteCustomPlan({ dataAllowanceGb, unlimitedData, minutesAllowance, durationDays })
        .then(setQuote)
        .catch(() => setError("Couldn't price this plan — please try again."))
        .finally(() => setQuoting(false));
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAllowanceGb, unlimitedData, minutesAllowance, durationDays]);

  const handleBuildAndContinue = async () => {
    setBuilding(true);
    setError(null);
    try {
      const pack = await buildCustomPlan({ dataAllowanceGb, unlimitedData, minutesAllowance, durationDays });
      window.location.href = `/activate?packId=${pack.id}`;
    } catch {
      setError("Couldn't build your plan — please try again.");
      setBuilding(false);
    }
  };

  return (
    <div className="custom-plan-card">
      <div className="custom-plan-field">
        <div className="custom-plan-field-header">
          <span>Data allowance</span>
          <span className="custom-plan-field-value">{unlimitedData ? "Unlimited" : `${dataStep} GB`}</span>
        </div>
        <input
          type="range"
          min={1}
          max={UNLIMITED_STEP}
          step={1}
          value={dataStep}
          onChange={(e) => setDataStep(Number(e.target.value))}
          className="custom-plan-slider"
          aria-label="Data allowance"
        />
      </div>

      <div className="custom-plan-field">
        <div className="custom-plan-field-header">
          <span>Minutes</span>
          <span className="custom-plan-field-value">{minutesAllowance} min</span>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          step={50}
          value={minutesAllowance}
          onChange={(e) => setMinutesAllowance(Number(e.target.value))}
          className="custom-plan-slider"
          aria-label="Minutes"
        />
      </div>

      <div className="custom-plan-field">
        <div className="custom-plan-field-header">
          <span>Validity period</span>
        </div>
        <select
          className="custom-plan-select"
          value={durationDays}
          onChange={(e) => setDurationDays(Number(e.target.value))}
          aria-label="Validity period"
        >
          {DURATION_OPTIONS.map((days) => (
            <option key={days} value={days}>
              {days} days
            </option>
          ))}
        </select>
      </div>

      <div className="custom-plan-footer">
        <div className="custom-plan-price">
          <span className="custom-plan-price-label">Estimated price</span>
          <span className="custom-plan-price-amount">
            {quoting || !quote
              ? "…"
              : `${formatAll(quote.priceAll)} (~${allToEur(quote.priceAll)} EUR)`}
          </span>
        </div>
        <button
          className="pack-button custom-plan-build-button"
          onClick={handleBuildAndContinue}
          disabled={quoting || !quote || building}
        >
          {building ? "Building…" : "Build & Continue"}
        </button>
      </div>

      {error && <p className="custom-plan-error">{error}</p>}
    </div>
  );
}
