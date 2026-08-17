"use client";

import PackCard from "../components/PackCard";
import { ActivationStep } from "@/components/ActivationStep";
import { useEffect, useState } from "react";
import Image from "next/image";

import { 
  MapPin, Sun, Mountain, Building2, Calendar, 
  Smartphone, Globe, Gift, Trophy, Disc, HelpCircle, 
  CheckCircle2, RotateCcw, Sparkles, 
  Wifi, PhoneCall, Globe2 ,
    ShoppingCart, MousePointerClick, Zap
} from "lucide-react";
import ExclusiveOffers from "@/components/ExclusiveOffers";

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

  // Quiz State
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({
    destination: "",
    duration: "",
    primaryNeed: "",
    regionalTravel: ""
  });
 
  const [recommendedPack, setRecommendedPack] = useState<{ 
  title: string; 
  price: string; 
  duration: string; 
  features: { text: string; icon: React.ReactNode }[] 
} | null>(null);
 const realVodafonePacks = [
  { 
    title: "Tourist Tera Pack 1", 
    price: "2700 ALL", 
    duration: "15 Days", 
    features: [
      { text: "1 TB Data", icon: <Wifi size={18} color="#e60000" /> }, 
      { text: "1000 National Mins", icon: <PhoneCall size={18} color="#e60000" /> }
    ] 
  },
  { 
    title: "Tourist Tera Pack 2", 
    price: "2900 ALL", 
    duration: "21 Days", 
    features: [
      { text: "1.1 TB Data", icon: <Wifi size={18} color="#e60000" /> }, 
      { text: "1000 National Mins", icon: <PhoneCall size={18} color="#e60000" /> }
    ] 
  },
  { 
    title: "Tourist Tera Pack 3", 
    price: "3300 ALL", 
    duration: "30 Days", 
    features: [
      { text: "1.2 TB Data", icon: <Wifi size={18} color="#e60000" /> }, 
      { text: "3GB Greece Roaming", icon: <Globe2 size={18} color="#e60000" /> }, 
      { text: "20GB Balkan Roaming", icon: <Globe2 size={18} color="#e60000" /> }
    ] 
  }
];

  const handleAnswer = (field: string, value: string) => {
    const newAnswers = { ...quizAnswers, [field]: value };
    setQuizAnswers(newAnswers);

    if (quizStep < 4) {
      setQuizStep(quizStep + 1);
    } else {
      if (newAnswers.regionalTravel === "Yes" || newAnswers.duration === "22-30 days") {
        setRecommendedPack(realVodafonePacks[2]);
      } else if (newAnswers.duration === "16-21 days") {
        setRecommendedPack(realVodafonePacks[1]);
      } else {
        setRecommendedPack(realVodafonePacks[0]);
      }
      setQuizStep(5);
    }
  };

  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <>
    {/* Promo Banner */}
        <div className="promo-banner">
          <Gift size={20} />
          <span><strong>Summer Promo:</strong> Every Tourist Pack activation includes a 100% guaranteed reward!</span>
          <Sparkles size={20} />
        </div>

      {/* Hero Section */}
      <section className="hero-quiz-container">
        <div className="hero-map-column">
        <div className="hero-map-wrapper albania-mask-container">
  <video 
    autoPlay 
    loop 
    muted 
    playsInline 
    className="albania-video"
  >
    <source src="/assets/mapVideo.mp4" type="video/mp4" />
  </video>
</div>
        <p className="hero-map-caption">A 30-second tour of Albania's best views</p>
        </div>

        <div className="hero-quiz-content">
          {quizStep === 1 && (
            <div>
              <span className="hero-eyebrow">Mirë se vini · Welcome to Albania</span>
              <h1 className="hero-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", lineHeight: "1" }}>
                Where are you headed? <MapPin color="#e60000" size={32} style={{ marginTop: "-20px" }} />
              </h1>
              <p className="hero-text" style={{ marginBottom: "30px" }}>
                Let's tailor the perfect pack for your adventure.
              </p>
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
              <div className="hero-trust-strip">
                <span><Wifi size={16} color="#e60000" /> 4G/5G nationwide</span>
                <span><CheckCircle2 size={16} color="#e60000" /> Instant activation</span>
                <span><PhoneCall size={16} color="#e60000" /> 24/7 support</span>
              </div>
            </div>
          )}

          {quizStep === 2 && (
            <div>
              <h1 className="hero-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                How long is your stay? <Calendar color="#e60000" size={28} />
              </h1>
              <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" }}>
                <button onClick={() => handleAnswer("duration", "1-15 days")} className="pack-button" style={{ maxWidth: "200px" }}>1-15 Days</button>
                <button onClick={() => handleAnswer("duration", "16-21 days")} className="pack-button" style={{ maxWidth: "200px" }}>16-21 Days</button>
                <button onClick={() => handleAnswer("duration", "22-30 days")} className="pack-button" style={{ maxWidth: "200px" }}>Up to a Month</button>
              </div>
            </div>
          )}

          {quizStep === 3 && (
            <div>
              <h1 className="hero-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                What is your primary need? <Smartphone color="#e60000" size={28} />
              </h1>
              <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" }}>
                <button onClick={() => handleAnswer("primaryNeed", "Data")} className="pack-button" style={{ maxWidth: "250px" }}>Heavy Internet/Maps</button>
                <button onClick={() => handleAnswer("primaryNeed", "Calls")} className="pack-button" style={{ maxWidth: "250px" }}>Calls & Communication</button>
              </div>
            </div>
          )}

          {quizStep === 4 && (
            <div>
              <h1 className="hero-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                Visiting neighboring countries? <Globe color="#e60000" size={28} />
              </h1>
              <p style={{ marginBottom: "30px" }}>We offer roaming in Greece and the Western Balkans.</p>
              <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => handleAnswer("regionalTravel", "Yes")} className="pack-button" style={{ maxWidth: "200px" }}>Yes, I am</button>
                <button onClick={() => handleAnswer("regionalTravel", "No")} className="pack-button" style={{ maxWidth: "200px", background: "#555" }}>No, just Albania</button>
              </div>
            </div>
          )}

          {quizStep === 5 && recommendedPack && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#e60000", fontWeight: "bold", marginBottom: "10px" }}>
                <CheckCircle2 size={24} /> Perfect Match Found!
              </div>
              <h1 className="hero-title" style={{ marginBottom: "20px" }}>{recommendedPack.title}</h1>
              <div className="quiz-result-card">
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#e60000", margin: "10px 0" }}>{recommendedPack.price}</p>
                      <ul style={{ listStyle: "none", padding: 0, margin: "20px 0" }}>
                        {recommendedPack.features.map((feature, i) => (
                          <li key={i} style={{ padding: "12px 0", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", gap: "10px", color: "#333", fontWeight: "500" }}>
                            {feature.icon}
                            <span>{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                <button
                  className="pack-button"
                  onClick={() =>
                    (window.location.href = `/activate?title=${encodeURIComponent(recommendedPack.title)}&price=${encodeURIComponent(recommendedPack.price)}&duration=${encodeURIComponent(recommendedPack.duration)}`)
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
        </div>
      </section>

      {/* All Available Packs Section */}
      <section style={{ margin: "40px 0" }}>
        <h2 className="section-title">All Available Tourist Packs</h2>
        <p style={{ textAlign: "center", marginTop: "-15px", marginBottom: "30px" }}>
          Prefer to choose directly? Browse all official packages below.
        </p>
        <div className="pack-grid">
          {realVodafonePacks.map((pack, index) => (
            <PackCard
              key={index}
              title={pack.title}
              subtitle="Perfect for tourists"
              price={pack.price}
              duration={pack.duration}
              features={pack.features}
            />
          ))}
        </div>
      </section>

      {/* How to Activate Section */}
      <h2 className="section-title">How to Activate</h2>
      
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
        <div className="digital-pass-header">
          <h2 className="digital-pass-title">The "Zero-App" Digital Tourist Pass</h2>
          <p className="digital-pass-subtitle">
            One pass. Hundreds of benefits. Added instantly to your wallet.
          </p>
        </div>
        
        <div className="digital-pass-mockups">
          <div className="mockup-container">
            <Image 
              src="/assets/iphoneMockup.webp" 
              alt="Vodafone Tourist Pass on Apple Wallet" 
              width={340} 
              height={680} 
              className="phone-mockup"
              priority
            />
          </div>
          
          <div className="nfc-ripple">
            <Wifi size={48} color="#e60000" />
          </div>

          <div className="mockup-container">
            <Image 
              src="/assets/androidMockup.webp" 
              alt="Vodafone Tourist Pass on Google Wallet" 
              width={340} 
              height={680} 
              className="phone-mockup"
              priority
            />
          </div>
        </div>
      </section>

      <ExclusiveOffers />
      </>
  );
}