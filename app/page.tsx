"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import PackCard from "../components/PackCard";
import { ActivationStep } from "@/components/ActivationStep";
import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Timer, MapPin, Sun, Mountain, Building2, Calendar, 
  Smartphone, Globe, Gift, Trophy, Disc, HelpCircle, 
  CheckCircle2, RotateCcw, Sparkles 
} from "lucide-react";

const activationSteps = [
  {
    number: "1",
    title: "Choose Pack",
    text: "Select the tourist pack that fits your needs",
  },
  {
    number: "2",
    title: "Click Activate",
    text: "Press the activate button on your chosen pack",
  },
  {
    number: "3",
    title: "Start Using",
    text: "Your pack is ready to use immediately",
  },
  {
    number: "4",
    title: "Claim Reward",
    text: "Scroll down to play a mini-game for guaranteed extra data",
  }
];

export default function HomePage() {
  const [name, setName] = useState("Vodafone Albania");
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    document.title = "Hey, I Changed the Title";
    console.log("Page title updated to:", document.title);
  }, []);

  useEffect(() => {
    console.log("the name has changed to:", name);
    document.title = `Welcome to ${name}`;
  }, [name]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) clearInterval(intervalId);
        return prev - 1;
      });
      if (timer <= 0) {
        clearInterval(intervalId);
        console.log("Timer has reached zero!");
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      console.log("Cleaned up the old timer!");
    };
  }, []);

  // Quiz State
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({
    destination: "",
    duration: "",
    primaryNeed: "",
    regionalTravel: ""
  });
  const [recommendedPack, setRecommendedPack] = useState<{ title: string; price: string; duration: string; features: string[] } | null>(null);

  // The actual 2026 Vodafone Tourist Packs
  const realVodafonePacks = [
    { title: "Tourist Tera Pack 1", price: "2700 ALL", duration: "15 Days", features: ["1 TB Data", "1000 National Mins"] },
    { title: "Tourist Tera Pack 2", price: "2900 ALL", duration: "21 Days", features: ["1.1 TB Data", "1000 National Mins"] },
    { title: "Tourist Tera Pack 3", price: "3300 ALL", duration: "30 Days", features: ["1.2 TB Data", "3GB Greece Roaming", "20GB Balkan Roaming"] }
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
    <div className="page">
      <div style={{ background: "#e60000", color: "white", padding: "10px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontWeight: "bold", fontSize: "14px" }}>
    <Gift size={18} />
    Summer Promo: Every Tourist Pack activation includes a 100% guaranteed reward!
    <Sparkles size={18} />
  </div>
      
      <Header />

      <main className="main">
        {/* Recommendation Quiz Hero Section with Albania Map Graphic */}
        <section className="hero-quiz-container">
          {/* Left / Top Side SVG Map Asset */}
          <div className="hero-map-wrapper">
            <Image 
              src="/assets/albania-map.svg" 
              alt="Vodafone Albania Tourist Map" 
              width={260} 
              height={360} 
              className="hero-map-img"
              priority
            />
          </div>


      
          {/* Right / Bottom Side Quiz Content */}
          <div className="hero-quiz-content">
            {quizStep === 1 && (
              <div>
                <h1 className="hero-title" style={{ color: "#333", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", lineHeight: "1" }}>
                  Where are you headed? <MapPin color="#e60000" size={32} style={{ marginTop: "-20px" }} />
                </h1>
                <p className="hero-text" style={{ color: "#666", marginBottom: "30px" }}>
                  Let's tailor the perfect pack for your adventure.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
                  <button onClick={() => handleAnswer("destination", "Beach")} className="pack-button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Sun size={18} /> The Riviera
                  </button>
                  <button onClick={() => handleAnswer("destination", "Mountains")} className="pack-button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Mountain size={18} /> The Alps
                  </button>
                  <button onClick={() => handleAnswer("destination", "City")} className="pack-button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Building2 size={18} /> City Explorer
                  </button>
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div>
                <h1 className="hero-title" style={{ color: "#333", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
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
                <h1 className="hero-title" style={{ color: "#333", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
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
                <h1 className="hero-title" style={{ color: "#333", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  Visiting neighboring countries? <Globe color="#e60000" size={28} />
                </h1>
                <p style={{ color: "#666", marginBottom: "30px" }}>We offer roaming in Greece and the Western Balkans.</p>
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
                <h1 className="hero-title" style={{ color: "#333", marginBottom: "20px" }}>{recommendedPack.title}</h1>
                <div style={{ background: "#f8f9fa", border: "2px solid #e60000", padding: "25px", borderRadius: "12px", maxWidth: "400px", margin: "0 auto" }}>
                  <p style={{ fontSize: "32px", fontWeight: "bold", color: "#e60000", margin: "10px 0" }}>{recommendedPack.price}</p>
                  <ul style={{ listStyle: "none", padding: 0, color: "#444", margin: "20px 0" }}>
                    {recommendedPack.features.map((feature, i) => (
                      <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid #ddd" }}>{feature}</li>
                    ))}
                  </ul>
                  <button className="pack-button" onClick={() => window.location.href = "/activate"}></button>
                                  <div style={{ marginTop: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#e60000", fontWeight: "600", fontSize: "14px", background: "#fff0f0", padding: "10px", borderRadius: "8px", border: "1px dashed #e60000" }}>
                  <Gift size={18} />
                  Activating this pack unlocks a guaranteed prize! </div>
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
          <p style={{ textAlign: "center", color: "#666", marginTop: "-15px", marginBottom: "30px" }}>
            Prefer to choose directly? Browse all official packages below.
          </p>
          <div className="pack-grid">
            {realVodafonePacks.map((pack, index) => (
              <PackCard
                key={index}
                title={pack.title}
                subtitle={`Valid for ${pack.duration}`}
                price={pack.price}
                duration={pack.duration}
                features={pack.features}
              />
            ))}
          </div>
        </section>

        {/* How to Activate Section */}
        <h2 className="section-title">How to Activate</h2>
        <div className="steps">
          {activationSteps.map((step, index) => (
            <ActivationStep
              key={index}
              number={step.number}
              title={step.title}
              text={step.text}
            />
          ))}
        </div>

        {/* Gamification Section */}
        <section style={{ padding: "40px 20px", textAlign: "center", background: "#fff", borderRadius: "12px", margin: "40px 0", border: "1px solid #e0e0e0" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            Play & Win Rewards! <Gift color="#e60000" size={28} />
          </h2>
          <p style={{ color: "#666", marginBottom: "30px" }}>
            Choose a mini-game to win extra data, plan extensions, or local sponsor discounts.
          </p>

          {!activeGame ? (
            <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
              <button 
                onClick={() => setActiveGame("penalty")}
                style={{ padding: "20px", borderRadius: "8px", border: "2px solid #e60000", background: "white", cursor: "pointer", flex: "1", minWidth: "200px" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
                  <Trophy color="#e60000" size={22} />
                  <h3 style={{ fontSize: "20px", margin: 0 }}>Beat TOBI</h3>
                </div>
                <p style={{ color: "#666", margin: 0 }}>Block TOBI's penalty kicks</p>
              </button>

              <button 
                onClick={() => setActiveGame("spin")}
                style={{ padding: "20px", borderRadius: "8px", border: "2px solid #e60000", background: "white", cursor: "pointer", flex: "1", minWidth: "200px" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
                  <Disc color="#e60000" size={22} />
                  <h3 style={{ fontSize: "20px", margin: 0 }}>Spin & Win</h3>
                </div>
                <p style={{ color: "#666", margin: 0 }}>Test your luck on the wheel</p>
              </button>

              <button 
                onClick={() => setActiveGame("trivia")}
                style={{ padding: "20px", borderRadius: "8px", border: "2px solid #e60000", background: "white", cursor: "pointer", flex: "1", minWidth: "200px" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
                  <HelpCircle color="#e60000" size={22} />
                  <h3 style={{ fontSize: "20px", margin: 0 }}>Albania Quiz</h3>
                </div>
                <p style={{ color: "#666", margin: 0 }}>Answer 3 quick questions</p>
              </button>
            </div>
          ) : (
            <div style={{ padding: "40px", background: "#f8f9fa", borderRadius: "8px", border: "2px dashed #ccc" }}>
              <h3>Loading the {activeGame} challenge...</h3>
              <button 
                onClick={() => setActiveGame(null)} 
                style={{ marginTop: "20px", padding: "10px 20px", background: "#f5f5f5", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer" }}
              >
                Back to Menu
              </button>
            </div>
          )}
        </section>

       
      </main>

      <Footer />
    </div>
  );
}