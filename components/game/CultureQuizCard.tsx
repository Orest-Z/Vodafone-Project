"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { GameResult } from "@/types/game";
import { rollPrize } from "./GameContext";

interface Question {
  prompt: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  { prompt: "Albania's currency is the:", options: ["Lek", "Dinar", "Lev"], correctIndex: 0 },
  {
    prompt: "Which sea borders Albania's Riviera coast?",
    options: ["Adriatic", "Ionian", "Black Sea"],
    correctIndex: 1,
  },
  {
    prompt: "Tirana's iconic hilltop viewpoint is called:",
    options: ["Dajti Mountain", "Mount Olympus", "Butrint"],
    correctIndex: 0,
  },
];

const TIMER_SECONDS = 10;
const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type Answered = { index: number; correct: boolean } | null;

export default function CultureQuizCard({
  onFinish,
}: {
  onFinish: (result: GameResult) => void;
}) {
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState<Answered>(null);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[step];

  useEffect(() => {
    if (answered || finished) return;
    const t = setTimeout(() => commitAnswer(-1), TIMER_SECONDS * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, answered, finished]);

  const commitAnswer = (index: number) => {
    if (answered) return;
    const correct = index === question.correctIndex;
    setAnswered({ index, correct });
    if (correct) setCorrectCount((c) => c + 1);

    setTimeout(() => {
      if (step + 1 < QUESTIONS.length) {
        setStep((s) => s + 1);
        setAnswered(null);
      } else {
        setFinished(true);
      }
    }, 700);
  };

  const won = correctCount >= 2;

  const finish = () => {
    onFinish({ gameId: "culture-quiz", won, prize: won ? rollPrize() : null });
  };

  return (
    <div className="game-card">
      <div className="game-card-header">
        <p className="game-eyebrow">Mini-Game</p>
        <h1 className="game-title">Culture Quiz</h1>
      </div>

      <div className="game-card-body">
        {!finished ? (
          <>
            <div className="quiz-meta">
              <span>Question {step + 1} / {QUESTIONS.length}</span>
              <span>{correctCount} correct</span>
            </div>

            <div className="quiz-timer-track">
              <motion.div
                key={step}
                className="quiz-timer-bar"
                initial={{ width: "100%" }}
                animate={{ width: answered ? undefined : "0%" }}
                transition={{ duration: TIMER_SECONDS, ease: "linear" }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={SPRING}
              >
                <h2 className="quiz-question">{question.prompt}</h2>

                <div className="quiz-options">
                  {question.options.map((opt, i) => {
                    const isAnswered = answered !== null;
                    const isSelected = answered?.index === i;
                    const isCorrectOpt = i === question.correctIndex;

                    let extraClass = "";
                    if (isAnswered && isCorrectOpt) extraClass = "quiz-option--correct";
                    else if (isAnswered && isSelected) extraClass = "quiz-option--wrong-selected";

                    return (
                      <button
                        key={opt}
                        disabled={isAnswered}
                        onClick={() => commitAnswer(i)}
                        className={`quiz-option ${extraClass}`}
                      >
                        {opt}
                        {isAnswered && isCorrectOpt && <Check size={16} color="var(--primary)" />}
                        {isAnswered && isSelected && !isCorrectOpt && <X size={16} color="var(--text-main)" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="quiz-result">
            <p className="quiz-result-score">{correctCount} / {QUESTIONS.length} correct</p>
            <p className="quiz-result-sub">
              {won ? "That's a win — prize unlocked." : "Score 2 of 3 next time to unlock a prize."}
            </p>
            <button onClick={finish} className="game-btn game-btn--primary" style={{ marginTop: 20 }}>
              Continue
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}