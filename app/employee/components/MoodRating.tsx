"use client";

import React, { useState, useEffect } from "react";
import styles from "./MoodRating.module.scss";

interface MoodRatingProps {
  currentMood: number | null;
  // eslint-disable-next-line no-unused-vars
  onMoodChange: (mood: number) => void;
}

const moodOptions = [
  {
    value: 1,
    emoji: "😢",
    label: "Very Low",
    description: "Feeling overwhelmed",
    color: "#ef4444",
  },
  {
    value: 2,
    emoji: "😕",
    label: "Low",
    description: "A bit down",
    color: "#f59e0b",
  },
  {
    value: 3,
    emoji: "😐",
    label: "Neutral",
    description: "Okay",
    color: "#6b7280",
  },
  {
    value: 4,
    emoji: "🙂",
    label: "Good",
    description: "Feeling positive",
    color: "#10b981",
  },
  {
    value: 5,
    emoji: "😊",
    label: "Great",
    description: "Excellent mood",
    color: "#059669",
  },
];

export default function MoodRating({
  currentMood,
  onMoodChange,
}: MoodRatingProps) {
  const [hoveredMood, setHoveredMood] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(currentMood);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMoodTime, setLastMoodTime] = useState<string | null>(null);

  useEffect(() => {
    setSelectedMood(currentMood);
  }, [currentMood]);

  const handleMoodClick = (mood: number) => {
    setSelectedMood(mood);
    onMoodChange(mood);
    setLastMoodTime(new Date().toLocaleTimeString());

    // Show confetti for positive moods
    if (mood >= 4) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const getMoodDescription = () => {
    const mood = hoveredMood || selectedMood;
    if (!mood) return "How are you feeling today?";
    return (
      moodOptions.find((option) => option.value === mood)?.description || ""
    );
  };

  const getMoodAdvice = () => {
    if (!selectedMood) return null;

    const advice = {
      1: "It's okay to have tough days. Consider reaching out to someone you trust or taking a short break.",
      2: "Try a quick 5-minute walk or deep breathing exercise to lift your spirits.",
      3: "A neutral mood is perfectly normal. Maybe try something small to boost your energy.",
      4: "Great energy! This is a perfect time to tackle challenging tasks.",
      5: "Excellent mood! Your positive energy is contagious. Keep up the great work!",
    };

    return advice[selectedMood as keyof typeof advice];
  };

  return (
    <div className={styles.moodRating}>
      <div className={styles.moodGrid}>
        {moodOptions.map((option) => (
          <button
            key={option.value}
            className={`${styles.moodOption} ${
              selectedMood === option.value ? styles.selected : ""
            } ${hoveredMood === option.value ? styles.hovered : ""}`}
            onClick={() => handleMoodClick(option.value)}
            onMouseEnter={() => setHoveredMood(option.value)}
            onMouseLeave={() => setHoveredMood(null)}
            aria-label={`Rate mood as ${option.label}`}
            style={
              {
                "--mood-color": option.color,
              } as React.CSSProperties
            }
          >
            <span className={styles.emoji}>{option.emoji}</span>
            <span className={styles.label}>{option.label}</span>
            {selectedMood === option.value && (
              <div className={styles.selectedIndicator}>
                <span>✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className={styles.description}>
        <p>{getMoodDescription()}</p>
      </div>

      {selectedMood && (
        <div className={styles.selectedMood}>
          <div className={styles.moodInfo}>
            <div className={styles.moodHeader}>
              <span className={styles.moodEmoji}>
                {moodOptions.find((opt) => opt.value === selectedMood)?.emoji}
              </span>
              <div className={styles.moodDetails}>
                <p>
                  You rated your mood as:{" "}
                  <strong>
                    {
                      moodOptions.find((opt) => opt.value === selectedMood)
                        ?.label
                    }
                  </strong>
                </p>
                {lastMoodTime && <small>Last updated: {lastMoodTime}</small>}
              </div>
            </div>
            {getMoodAdvice() && (
              <div className={styles.moodAdvice}>
                <span className={styles.adviceIcon}>💡</span>
                <span>{getMoodAdvice()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confetti effect for positive moods */}
      {showConfetti && (
        <div className={styles.confetti}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.confettiPiece}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
