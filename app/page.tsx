"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PackCard from "../components/PackCard";
import { ActivationStep } from "@/components/ActivationStep";
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";


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
];

const packs = [
  {
    title: "Basic Pack",
    subtitle: "Perfect for short visits",
    price: "500 L",
    duration: "3 days",
    features: ["2GB Data", "50 Minutes", "100 SMS"],
  },
  {
    title: "Standard Pack",
    subtitle: "Great for week-long stays",
    price: "1000 L",
    duration: "7 days",
    features: ["5GB Data", "100 Minutes", "Unlimited SMS"],
  },
];

  

export default function HomePage()
 {
  const [name,setName] = useState("Vodafone Albania");
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    document.title="Hey, I Changed the Title";
    console.log("Page title updated to:", document.title);
    
  },[]);

  useEffect(() => {
    console.log("the name has changed to:", name);
    document.title = `Welcome to ${name}`;
  } , [name]);

  //test 3

  
    const [maxPrice,setMaxPrice] = useState<number>(1000);
    const filteredPacks = packs.filter(pack => parseInt(pack.price) <= maxPrice);

    
  useEffect(() => {
    // 1. Setup a timer that ticks every 1 second (1000ms)
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
    // 2. The Cleanup Function!
    return () => {
      clearInterval(intervalId);
      console.log("Cleaned up the old timer!");
    };
  }, []);console.log("Current timer value:", timer);  

  return (
    <div className="page">
      <Header />

      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <h1 className="hero-title">Welcome to {name}</h1>
          <button onClick={() => setName("Tirana Explorer")}>Change Name</button>
          <p className="hero-text">
            Stay connected during your visit to Albania with our special tourist
            packages. Choose the perfect plan for your needs.
          </p>
        </section>

        {/* Packs Section */}
        <section>
          <h2 className="section-title">Tourist Packs</h2>
          <div className="pack-grid">
            {filteredPacks.map((pack, index) => (
              <PackCard
                key={index}
                title={pack.title}
                subtitle={pack.subtitle}
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
        <h3 style={{ color: "red" }}>Special offer ends in: {timer} seconds</h3>
        
        
      </main>

      <Footer />
    </div>
  );
}
