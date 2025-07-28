"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./NudgeSuggestions.module.scss";

interface NudgeSuggestionsProps {
  currentMood: number | null;
  quietHoursEnabled: boolean;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "wellness" | "productivity" | "break" | "focus";
  priority: "high" | "medium" | "low";
  duration?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

export default function NudgeSuggestions({
  currentMood,
  quietHoursEnabled,
}: NudgeSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [completedActions, setCompletedActions] = useState<Set<string>>(
    new Set(),
  );
  const [showCompleted, setShowCompleted] = useState(false);

  const generateSuggestions = useCallback(() => {
    const allSuggestions: Suggestion[] = [
      // Wellness suggestions
      {
        id: "take-break",
        title: "Take a 5-minute break",
        description: "Step away from your screen and stretch or walk around",
        icon: "☕",
        category: "wellness",
        priority: "high",
        duration: "5 min",
        difficulty: "easy",
        tags: ["break", "stretch"],
      },
      {
        id: "deep-breathing",
        title: "Practice deep breathing",
        description: "Take 3 deep breaths to reduce stress and improve focus",
        icon: "🫁",
        category: "wellness",
        priority: "medium",
        duration: "2 min",
        difficulty: "easy",
        tags: ["breathing", "stress-relief"],
      },
      {
        id: "water-reminder",
        title: "Stay hydrated",
        description: "Drink a glass of water to maintain energy levels",
        icon: "💧",
        category: "wellness",
        priority: "medium",
        duration: "1 min",
        difficulty: "easy",
        tags: ["hydration", "energy"],
      },
      {
        id: "eye-rest",
        title: "Rest your eyes",
        description: "Look at something 20 feet away for 20 seconds",
        icon: "👁️",
        category: "wellness",
        priority: "medium",
        duration: "20 sec",
        difficulty: "easy",
        tags: ["eye-care", "screen-break"],
      },
      {
        id: "gratitude",
        title: "Practice gratitude",
        description: "Write down one thing you&apos;re grateful for today",
        icon: "🙏",
        category: "wellness",
        priority: "low",
        duration: "3 min",
        difficulty: "easy",
        tags: ["gratitude", "mindfulness"],
      },
      {
        id: "quick-stretch",
        title: "Quick stretch routine",
        description: "Simple stretches to relieve tension and improve posture",
        icon: "🧘",
        category: "wellness",
        priority: "medium",
        duration: "3 min",
        difficulty: "easy",
        tags: ["stretch", "posture"],
      },
      // Productivity suggestions
      {
        id: "task-prioritization",
        title: "Prioritize your tasks",
        description:
          "Review your to-do list and focus on the most important items",
        icon: "📋",
        category: "productivity",
        priority: "high",
        duration: "5 min",
        difficulty: "medium",
        tags: ["planning", "organization"],
      },
      {
        id: "time-blocking",
        title: "Try time blocking",
        description: "Schedule specific time slots for different types of work",
        icon: "⏰",
        category: "productivity",
        priority: "medium",
        duration: "10 min",
        difficulty: "medium",
        tags: ["planning", "time-management"],
      },
      {
        id: "declutter-desk",
        title: "Declutter your workspace",
        description: "Organize your desk for better focus and productivity",
        icon: "🗂️",
        category: "productivity",
        priority: "low",
        duration: "5 min",
        difficulty: "easy",
        tags: ["organization", "workspace"],
      },
      // Focus suggestions
      {
        id: "minimize-distractions",
        title: "Minimize distractions",
        description: "Close unnecessary tabs and put your phone on silent",
        icon: "🔇",
        category: "focus",
        priority: "high",
        duration: "2 min",
        difficulty: "easy",
        tags: ["focus", "distractions"],
      },
      {
        id: "pomodoro-technique",
        title: "Use Pomodoro technique",
        description: "Work for 25 minutes, then take a 5-minute break",
        icon: "🍅",
        category: "focus",
        priority: "medium",
        duration: "25 min",
        difficulty: "medium",
        tags: ["focus", "time-management"],
      },
      {
        id: "noise-cancellation",
        title: "Use noise-cancelling",
        description: "Put on headphones or find a quieter environment",
        icon: "🎧",
        category: "focus",
        priority: "medium",
        duration: "1 min",
        difficulty: "easy",
        tags: ["focus", "environment"],
      },
    ];

    // Filter suggestions based on mood and settings
    let filteredSuggestions = allSuggestions;

    // Mood-based filtering
    if (currentMood !== null) {
      if (currentMood <= 2) {
        // Low mood - prioritize wellness and breaks
        filteredSuggestions = allSuggestions.filter(
          (s) => s.category === "wellness" || s.category === "break",
        );
      } else if (currentMood >= 4) {
        // High mood - can focus on productivity
        filteredSuggestions = allSuggestions.filter(
          (s) => s.category === "productivity" || s.category === "focus",
        );
      }
    }

    // Quiet hours filtering
    if (quietHoursEnabled) {
      filteredSuggestions = filteredSuggestions.filter(
        (s) => s.category !== "break" || s.id === "take-break",
      );
    }

    // Limit to top 6 suggestions
    filteredSuggestions = filteredSuggestions.slice(0, 6);
    setSuggestions(filteredSuggestions);
  }, [currentMood, quietHoursEnabled]);

  useEffect(() => {
    generateSuggestions();
    loadCompletedActions();
  }, [generateSuggestions]);

  const loadCompletedActions = () => {
    const saved = localStorage.getItem("completedActions");
    if (saved) {
      setCompletedActions(new Set(JSON.parse(saved)));
    }
  };

  const saveCompletedActions = (actions: Set<string>) => {
    localStorage.setItem("completedActions", JSON.stringify([...actions]));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const handleActionComplete = (suggestionId: string) => {
    const newCompleted = new Set(completedActions);
    newCompleted.add(suggestionId);
    setCompletedActions(newCompleted);
    saveCompletedActions(newCompleted);
  };

  const handleActionUndo = (suggestionId: string) => {
    const newCompleted = new Set(completedActions);
    newCompleted.delete(suggestionId);
    setCompletedActions(newCompleted);
    saveCompletedActions(newCompleted);
  };

  const categories = [
    { id: "all", label: "All", icon: "🌟" },
    { id: "wellness", label: "Wellness", icon: "💚" },
    { id: "productivity", label: "Productivity", icon: "⚡" },
    { id: "focus", label: "Focus", icon: "🎯" },
  ];

  const filteredSuggestions =
    selectedCategory === "all"
      ? suggestions
      : suggestions.filter((s) => s.category === selectedCategory);

  const displaySuggestions = showCompleted
    ? filteredSuggestions
    : filteredSuggestions.filter((s) => !completedActions.has(s.id));

  return (
    <div className={styles.nudgeSuggestions}>
      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${
              selectedCategory === category.id ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className={styles.categoryIcon}>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Show/Hide Completed Toggle */}
      <div className={styles.completedToggle}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className={styles.toggleInput}
          />
          <span className={styles.toggleSlider}></span>
          Show completed actions
        </label>
      </div>

      {/* Suggestions List */}
      <div className={styles.suggestionsList}>
        {displaySuggestions.length > 0 ? (
          displaySuggestions.map((suggestion) => {
            const isCompleted = completedActions.has(suggestion.id);
            return (
              <div
                key={suggestion.id}
                className={`${styles.suggestionCard} ${isCompleted ? styles.completed : ""}`}
              >
                <div className={styles.suggestionHeader}>
                  <span className={styles.suggestionIcon}>
                    {suggestion.icon}
                  </span>
                  <div className={styles.suggestionInfo}>
                    <h4>{suggestion.title}</h4>
                    <p>{suggestion.description}</p>
                    <div className={styles.suggestionMeta}>
                      {suggestion.duration && (
                        <span className={styles.metaItem}>
                          <span className={styles.metaIcon}>⏱️</span>
                          {suggestion.duration}
                        </span>
                      )}
                      {suggestion.difficulty && (
                        <span className={styles.metaItem}>
                          <span className={styles.metaIcon}>📊</span>
                          <span
                            style={{
                              color: getDifficultyColor(suggestion.difficulty),
                            }}
                          >
                            {suggestion.difficulty}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={styles.priorityIndicator}
                    style={{
                      backgroundColor: getPriorityColor(suggestion.priority),
                    }}
                  />
                </div>

                {suggestion.tags && (
                  <div className={styles.suggestionTags}>
                    {suggestion.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.suggestionActions}>
                  {isCompleted ? (
                    <button
                      onClick={() => handleActionUndo(suggestion.id)}
                      className={styles.undoButton}
                    >
                      Undo
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActionComplete(suggestion.id)}
                      className={styles.actionButton}
                    >
                      Try this
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.noSuggestions}>
            <p>No suggestions available for this category.</p>
          </div>
        )}
      </div>

      {/* Mood-based message */}
      {currentMood !== null && (
        <div className={styles.moodMessage}>
          {currentMood <= 2 && (
            <p>
              💙 Remember, it&apos;s okay to take breaks and prioritize your
              well-being.
            </p>
          )}
          {currentMood >= 4 && (
            <p>✨ Great mood! Perfect time to tackle challenging tasks.</p>
          )}
        </div>
      )}

      {/* Progress Summary */}
      {completedActions.size > 0 && (
        <div className={styles.progressSummary}>
          <h4>Today&apos;s Progress</h4>
          <p>
            You&apos;ve completed {completedActions.size} wellness action
            {completedActions.size !== 1 ? "s" : ""} today! 🎉
          </p>
        </div>
      )}
    </div>
  );
}
