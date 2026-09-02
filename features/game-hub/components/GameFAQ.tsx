"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_ITEMS = [
  {
    q: "How does the Daily Drop work?",
    a: "Each day you hold an active Vodafone Tourist Pack you earn one free scratch credit. Claim it here, scratch to reveal your prize, and a code is sent to the email you registered with. Credits reset at midnight Albania time.",
  },
  {
    q: "Do unused credits expire?",
    a: "No — credits carry over. If you can't play today your credit stays in your account until you're ready. You can always check your balance at the top of this page.",
  },
  {
    q: "How do I redeem my prize?",
    a: "Your prize code is shown immediately after you scratch and is also sent to your registered email. Present the code at the partner venue or paste it at their online checkout to apply your discount.",
  },
];

export default function GameFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="game-faq">
      <p className="game-faq-title">Frequently asked</p>
      <div className="game-faq-list">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="game-faq-item">
              <button
                className="game-faq-question"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <motion.span
                  className="game-faq-chevron"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown size={17} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="game-faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                  >
                    <p>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
