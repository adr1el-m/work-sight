"use client";

import { useState } from "react";
import styles from "./QuickActions.module.scss";

interface QuickActionsProps {
  currentMood: number | null;
  quietHoursEnabled: boolean;
  // eslint-disable-next-line no-unused-vars
  onMoodChange: (mood: number) => void;
  // eslint-disable-next-line no-unused-vars
  onQuietHoursToggle: (enabled: boolean) => void;
}

const quickMoodOptions = [
  { value: 1, emoji: "😢", label: "Struggling" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 5, emoji: "😊", label: "Great" },
];

export default function QuickActions({
  currentMood,
  quietHoursEnabled,
  onMoodChange,
  onQuietHoursToggle,
}: QuickActionsProps) {
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Move quickActions inside the component to access quietHoursEnabled prop
  const quickActions = [
    {
      id: "break",
      icon: "☕",
      label: "Take a Break",
      description: "5-minute wellness break",
      action: "break",
    },
    {
      id: "water",
      icon: "💧",
      label: "Drink Water",
      description: "Stay hydrated",
      action: "reminder",
    },
    {
      id: "stretch",
      icon: "🧘",
      label: "Quick Stretch",
      description: "2-minute stretch routine",
      action: "stretch",
    },
    {
      id: "focus",
      icon: "🎯",
      label: "Focus Mode",
      description: quietHoursEnabled
        ? "Disable quiet hours"
        : "Enable quiet hours",
      action: "toggle-quiet-hours",
    },
  ];

  const handleQuickMood = (mood: number) => {
    onMoodChange(mood);
    setLastAction(`Mood updated to ${mood}/5`);
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "break":
        setLastAction("Break timer started! Take 5 minutes.");
        // Could integrate with actual break timer
        break;
      case "reminder":
        setLastAction("Water reminder set! 💧");
        break;
      case "stretch":
        setLastAction("Stretch routine initiated! 🧘");
        break;
      case "toggle-quiet-hours":
        onQuietHoursToggle(!quietHoursEnabled);
        setLastAction(
          quietHoursEnabled ? "Quiet hours disabled" : "Quiet hours enabled",
        );
        break;
    }
    setTimeout(() => setLastAction(null), 3000);
  };

  return (
    <div className={styles.quickActions}>
      {/* Quick Mood Update */}
      <div className={styles.quickMoodSection}>
        <h3>Quick Mood Check</h3>
        <div className={styles.quickMoodGrid}>
          {quickMoodOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.quickMoodButton} ${
                currentMood === option.value ? styles.selected : ""
              }`}
              onClick={() => handleQuickMood(option.value)}
            >
              <span className={styles.quickMoodEmoji}>{option.emoji}</span>
              <span className={styles.quickMoodLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actionsSection}>
        <h3>Quick Actions</h3>
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <button
              key={action.id}
              className={styles.actionButton}
              onClick={() => handleAction(action.action)}
            >
              <span className={styles.actionIcon}>{action.icon}</span>
              <div className={styles.actionContent}>
                <span className={styles.actionLabel}>{action.label}</span>
                <span className={styles.actionDescription}>
                  {action.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Feedback */}
      {lastAction && (
        <div className={styles.actionFeedback}>
          <span>{lastAction}</span>
        </div>
      )}

      {/* Current Status */}
      <div className={styles.currentStatus}>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Current Mood:</span>
          <span className={styles.statusValue}>
            {currentMood ? `${currentMood}/5` : "Not set"}
          </span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Quiet Hours:</span>
          <span
            className={`${styles.statusValue} ${quietHoursEnabled ? styles.active : styles.inactive}`}
          >
            {quietHoursEnabled ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
}
