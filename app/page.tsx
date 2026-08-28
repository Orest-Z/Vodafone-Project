"use client";

import PackCard from "@/features/activation/components/PackCard";
import { ActivationStep } from "@/features/activation/components/ActivationStep";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { 
  MapPin, Sun, Mountain, Building2, Calendar, 
  Smartphone, Globe, Gift,
  CheckCircle2, RotateCcw, ArrowDown,
  Image as ImageIcon, Clock,
  ShoppingCart, MousePointerClick, Zap
} from "lucide-react";
import { NfcWaveIcon, SpeechMarkIcon, BadgeCheckIcon } from "@/shared/components/icons";
import ExclusiveOffers from "@/features/marketing/components/ExclusiveOffers";
import StoreMapPins from "@/features/stores/components/StoreMapPins";

// Minimal inline brand glyphs for the wallet buttons — kept local to this
// file since shared/components/icons.tsx isn't part of this pass.
function AppleGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function GoogleGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.3 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.4 26.9 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.6 5.1C9.5 39.7 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.6 5.4C40.3 36.4 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

const activationSteps = [
  {
    number: "1",
    title: "Choose Pack",
    text: "Select the tourist pack that fits your needs",
    icon: <ShoppingCart size={28} color="#e60000" />
  },
  {
    number: "2",
    title: "Click Activate",
    text: "Press the activate button on your chosen pack",
    icon: <MousePointerClick size={28} color="#e60000" />
  },
  {
    number: "3",
    title: "Start Using",
    text: "Your pack is ready to use immediately",
    icon: <Zap size={28} color="#e60000" />
  },
  {
    number: "4",
    title: "Claim Reward",
    text: "Scroll down to play a mini-game for extra data",
    icon: <Gift size={28} color="#e60000" />
  }
];

export default function HomePage() {
  const [name] = useState("Vodafone Albania");

  useEffect(() => {
    document.title = `Welcome to ${name}`;
  }, [name]);

  // NEW: State to hold dynamic packs from Spring Boot
  const [packs, setPacks] = useState<any[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);

  // NEW: Fetch packs on component mount
  useEffect(() => {
    async function loadPacks() {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
      try {
        const res = await fetch(`${apiUrl}/packs`, { cache: "no-store" });
        if (res.ok) {
          setPacks(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch packs", error);
      } finally {
        setLoadingPacks(false);
      }
    }
    loadPacks();
  }, []);

  // Quiz State
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({
    destination: "",
    duration: "",
    primaryNeed: "",
    regionalTravel: ""
  });
  
  // NEW: Updated Recommended Pack state to match DB response
  const [recommendedPack, setRecommendedPack] = useState<any | null>(null);

  const handleAnswer = (field: string, value: string) => {
    const newAnswers = { ...quizAnswers, [field]: value };
    setQuizAnswers(newAnswers);

    if (quizStep < 4) {
      setQuizStep(quizStep + 1);
    } else {
      // NEW: Use the fetched 'packs' array instead of the hardcoded realVodafonePacks
      if (packs.length > 0) {
        if (newAnswers.regionalTravel === "Yes" || newAnswers.duration === "22-30 days") {
          setRecommendedPack(packs[2] || packs[packs.length - 1]);
        } else if (newAnswers.duration === "16-21 days") {
          setRecommendedPack(packs[1] || packs[0]);
        } else {
          setRecommendedPack(packs[0]);
        }
      }
      setQuizStep(5);
    }
  };

  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Wallet buttons on the digital pass section don't actually issue a pass —
  // there's nothing to add until a pack has been activated. Nudge the
  // visitor back to the packages grid instead.
  const handleWalletClick = (_wallet: "apple" | "google") => {
    alert("You must activate a package first! Pick a Tourist Pack below to get your digital pass.");
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- Hero map: mouse-follow 3D tilt ---
  // The Albania shape idly auto-rotates (see .hero-map-3d keyframes in CSS).
  // While the visitor's cursor is over it, that idle animation is paused and
  // the shape instead tilts to follow the pointer, giving it a "rotatable
  // 3D object" feel without needing drag handles.
  const mapStageRef = useRef<HTMLDivElement>(null);
  const map3dRef = useRef<HTMLDivElement>(null);

  const handleMapTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const stage = mapStageRef.current;
    const map = map3dRef.current;
    if (!stage || !map) return;
    const rect = stage.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    map.classList.add("is-interacting");
    map.style.transform = `rotateY(${relX * 34}deg) rotateX(${relY * -22}deg)`;
  };

  const resetMapTilt = () => {
    const map = map3dRef.current;
    if (!map) return;
    map.classList.remove("is-interacting");
    map.style.transform = "";
  };

  return (
    <>
      {/* Promo Banner */}
      <div className="promo-banner">
        <SpeechMarkIcon size={16} color="#fff" />
        <span><strong>Summer Promo:</strong> Every Tourist Pack activation includes a 100% guaranteed reward</span>
      </div>

      {/* Hero Banner — full-bleed static background photo, bold stacked
          headline, and a rotatable 3D Albania shape with the map video
          masked inside it. No quiz here — that lives in #pack-finder below. */}
      <section className="hero-banner hero-banner--photo">
        <div className="hero-banner-bg" aria-hidden="true" />
        <div className="hero-banner-scrim" aria-hidden="true" />

        <div className="hero-banner-inner">
          <div className="hero-banner-content">
            <span className="hero-eyebrow hero-eyebrow--light">Mirë se vini · Welcome to Albania</span>

            <h1 className="hero-title hero-title--display">
              <span className="hero-title-row hero-title-row--white">Welcome</span>
              <span className="hero-title-row">
                <span className="hero-title-outline">To</span>{" "}
                <span className="hero-title-red">Albania</span>
              </span>
            </h1>

            <p className="hero-text hero-text--light">
              Tourist SIM &amp; eSIM packs with instant activation, nationwide 4G/5G coverage,
              and exclusive local perks — built for how you actually travel.
            </p>

            <div className="hero-cta-row">
              <a href="#pack-finder" className="hero-cta">
                Find My Pack <ArrowDown size={16} />
              </a>
              <a href="#how-it-works" className="hero-cta-secondary">
                How It Works
              </a>
            </div>

            <div className="hero-trust-strip hero-trust-strip--dark">
              <span><span className="trust-icon-badge trust-icon-badge--dark"><ImageIcon size={14} /></span> 4G/5G Nationwide</span>
              <span><span className="trust-icon-badge trust-icon-badge--dark"><Zap size={14} /></span> Instant Activation</span>
              <span><span className="trust-icon-badge trust-icon-badge--dark"><Clock size={14} /></span> 24/7 Support</span>
            </div>
          </div>

          <div
            className="hero-3d-stage"
            ref={mapStageRef}
            onMouseMove={handleMapTilt}
            onMouseLeave={resetMapTilt}
          >
            <div className="hero-map-3d" ref={map3dRef}>
              <div className="hero-map-wrapper albania-mask-container hero-map-wrapper--glow">
                <video autoPlay loop muted playsInline className="albania-video">
                  <source src="https://kigosmhsxdyewcdleaov.supabase.co/storage/v1/object/public/vodafone-assets/mapVideo.mp4" type="video/mp4" />
                </video>
                <div className="hero-map-tint" />
              </div>
              <img src="/assets/albaniaMap.svg" alt="" aria-hidden="true" className="hero-map-outline" />

              <StoreMapPins />
            </div>

            
        </div>
      </div>
      </section>

      {/* Pack Finder — the tourist questionnaire lives here, its own
          section below the welcome banner, not competing with it. */}
      <section className="quiz-section" id="pack-finder">
        <div className="quiz-card">
          <span className="quiz-kicker">Pack Finder</span>

          {quizStep === 1 && (
            <div>
              <h2 className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                Where are you headed? <MapPin color="#e60000" size={22} />
              </h2>
              <p className="section-subtitle">Let's tailor the perfect pack for your adventure.</p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
                <button onClick={() => handleAnswer("destination", "Beach")} className="pack-button" style={{ flex: "1 1 140px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <Sun size={18} /> The Riviera
                </button>
                <button onClick={() => handleAnswer("destination", "Mountains")} className="pack-button" style={{ flex: "1 1 140px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <Mountain size={18} /> The Alps
                </button>
                <button onClick={() => handleAnswer("destination", "City")} className="pack-button" style={{ flex: "1 1 140px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <Building2 size={18} /> City Explorer
                </button>
              </div>
            </div>
          )}

          {quizStep === 2 && (
            <div>
              <h2 className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                How long is your stay? <Calendar color="#e60000" size={20} />
              </h2>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "22px", flexWrap: "wrap" }}>
                <button onClick={() => handleAnswer("duration", "1-15 days")} className="pack-button" style={{ maxWidth: "200px" }}>1-15 Days</button>
                <button onClick={() => handleAnswer("duration", "16-21 days")} className="pack-button" style={{ maxWidth: "200px" }}>16-21 Days</button>
                <button onClick={() => handleAnswer("duration", "22-30 days")} className="pack-button" style={{ maxWidth: "200px" }}>Up to a Month</button>
              </div>
            </div>
          )}

          {quizStep === 3 && (
            <div>
              <h2 className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                What is your primary need? <Smartphone color="#e60000" size={20} />
              </h2>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "22px", flexWrap: "wrap" }}>
                <button onClick={() => handleAnswer("primaryNeed", "Data")} className="pack-button" style={{ maxWidth: "250px" }}>Heavy Internet/Maps</button>
                <button onClick={() => handleAnswer("primaryNeed", "Calls")} className="pack-button" style={{ maxWidth: "250px" }}>Calls &amp; Communication</button>
              </div>
            </div>
          )}

          {quizStep === 4 && (
            <div>
              <h2 className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                Visiting neighboring countries? <Globe color="#e60000" size={20} />
              </h2>
              <p className="section-subtitle">We offer roaming in Greece and the Western Balkans.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => handleAnswer("regionalTravel", "Yes")} className="pack-button" style={{ maxWidth: "200px" }}>Yes, I am</button>
                <button onClick={() => handleAnswer("regionalTravel", "No")} className="pack-button" style={{ maxWidth: "200px", background: "#555" }}>No, just Albania</button>
              </div>
            </div>
          )}

          {quizStep === 5 && recommendedPack && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#e60000", fontWeight: "bold", marginBottom: "8px" }}>
                <BadgeCheckIcon size={20} color="#e60000" /> Perfect Match Found!
              </div>
              <h2 className="section-title" style={{ marginBottom: "16px" }}>{recommendedPack.title}</h2>
              <div className="quiz-result-card">
                <p style={{ fontSize: "30px", fontWeight: "bold", color: "#e60000", margin: "8px 0" }}>
                  {recommendedPack.priceAll} LEK
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "16px 0" }}>
                  {/* NEW: Render feature labels from the database DTO */}
                  {recommendedPack.features?.map((feature: any, i: number) => (
                    <li key={i} style={{ padding: "12px 0", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", gap: "10px", color: "#333", fontWeight: "500" }}>
                      <CheckCircle2 size={16} color="#e60000" />
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="pack-button"
                  onClick={() =>
                    // NEW: Pass packId to the activation page instead of raw query string data
                    (window.location.href = `/activate?packId=${recommendedPack.id}`)
                  }
                >
                  Activate Pack
                </button>
                <button 
                  onClick={() => { setQuizStep(1); setRecommendedPack(null); }} 
                  style={{ background: "none", border: "none", color: "#777", textDecoration: "underline", marginTop: "15px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px" }}
                >
                  <RotateCcw size={14} /> Retake Quiz
                </button>
              </div>
            </div>
          )}

          <div className="quiz-progress">
            {[1, 2, 3, 4, 5].map((step) => (
              <span key={step} className={`quiz-progress-dot ${quizStep >= step ? "active" : ""}`} />
            ))}
          </div>
        </div>
      </section>

      {/* All Available Packs Section */}
      <section id="packages" style={{ margin: "28px 0 0" }}>
        <h2 className="section-title">All Available Tourist Packs</h2>
        <p className="section-subtitle">
          Prefer to choose directly? Browse all official packages below.
        </p>
        <div className="pack-grid">
          {/* NEW: Map over dynamic database results, pass the whole pack object */}
          {loadingPacks ? (
            <p style={{ textAlign: "center", width: "100%" }}>Loading packs...</p>
          ) : (
            packs.map((pack, index) => (
              <PackCard
                key={pack.id}
                pack={pack}
                badge={
                  index === 0 ? "starter" : index === 1 ? "popular" : index === 2 ? "best-value" : undefined
                }
              />
            ))
          )}
        </div>
      </section>

      {/* How to Activate Section */}
      <h2 className="section-title" id="how-it-works" style={{ marginTop: "36px", scrollMarginTop: "90px" }}>How to Activate</h2>

      <section className="activation-journey-container">
        <div className="steps progress-line-enabled">
          {activationSteps.map((step, index) => (
            <ActivationStep
              key={index}
              number={step.number}
              title={step.title}
              text={step.text}
              icon={step.icon}
            />
          ))}
        </div>
      </section>

      <section className="digital-pass-section fade-in-up">
        <div className="digital-pass-grid">
          <div className="digital-pass-content">
            <span className="digital-pass-badge">
              <NfcWaveIcon size={14} color="#ff5252" /> Zero-App Digital Pass
            </span>

            <h2 className="digital-pass-title digital-pass-title--display">
              <span className="digital-pass-title-row digital-pass-title-row--white">The &quot;Zero-App&quot;</span>
              <span className="digital-pass-title-row digital-pass-title-row--red">Digital Tourist Pass</span>
            </h2>

            <p className="digital-pass-subtitle digital-pass-subtitle--dark">
              One pass. Hundreds of benefits. Added instantly to your Apple or Google
              Wallet — no app download required. Scan, tap, and unlock exclusive
              partner deals across Albania.
            </p>

            <div className="digital-pass-cta-row">
              <button
                type="button"
                className="wallet-button wallet-button--apple"
                onClick={() => handleWalletClick("apple")}
              >
                <AppleGlyph size={20} /> Add to Apple Wallet
              </button>
              <button
                type="button"
                className="wallet-button wallet-button--google"
                onClick={() => handleWalletClick("google")}
              >
                <GoogleGlyph size={18} /> Add to Google Wallet
              </button>
            </div>
          </div>

          <div className="digital-pass-visual">
            <div className="mockup-glow" aria-hidden="true" />

            <div className="mockup-container mockup-container--back">
              <Image
                src="https://kigosmhsxdyewcdleaov.supabase.co/storage/v1/object/public/vodafone-assets/androidMockup.webp"
                alt="Vodafone Tourist Pass on Google Wallet"
                width={300}
                height={600}
                className="phone-mockup phone-mockup--back"
              />
            </div>

            <div className="mockup-container mockup-container--front">
              <Image
                src="https://kigosmhsxdyewcdleaov.supabase.co/storage/v1/object/public/vodafone-assets/iphoneMockup.webp"
                alt="Vodafone Tourist Pass on Apple Wallet"
                width={320}
                height={640}
                className="phone-mockup phone-mockup--front"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <ExclusiveOffers />
    </>
  );
}