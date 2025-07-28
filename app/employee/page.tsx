"use client";

import { useState, useEffect } from "react";
import styles from "./employee.module.scss";
import MoodRating from "./components/MoodRating";
import QuietHoursToggle from "./components/QuietHoursToggle";
import NudgeSuggestions from "./components/NudgeSuggestions";
import DailyCheckIn from "./components/DailyCheckIn";
import WellnessStats from "./components/WellnessStats";
import QuickActions from "./components/QuickActions";

export default function EmployeeDashboard() {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [dailyCheckInCompleted, setDailyCheckInCompleted] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<
    Array<{ date: string; mood: number }>
  >([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      // Load user preferences from localStorage
      const savedQuietHours = localStorage.getItem("quietHoursEnabled");
      const savedMood = localStorage.getItem("currentMood");
      const savedCheckIn = localStorage.getItem("dailyCheckInCompleted");
      const savedUserName = localStorage.getItem("userName");
      const savedLastCheckIn = localStorage.getItem("lastCheckInDate");
      const savedMoodHistory = localStorage.getItem("moodHistory");

      if (savedQuietHours) setQuietHoursEnabled(JSON.parse(savedQuietHours));
      if (savedMood) setCurrentMood(JSON.parse(savedMood));
      if (savedCheckIn) setDailyCheckInCompleted(JSON.parse(savedCheckIn));
      if (savedUserName) setUserName(savedUserName);
      if (savedLastCheckIn) setLastCheckInDate(savedLastCheckIn);
      if (savedMoodHistory) setMoodHistory(JSON.parse(savedMoodHistory));
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodChange = (mood: number) => {
    setCurrentMood(mood);
    localStorage.setItem("currentMood", JSON.stringify(mood));

    // Update mood history
    const today = new Date().toDateString();
    const newMoodHistory = moodHistory.filter((entry) => entry.date !== today);
    newMoodHistory.push({ date: today, mood });
    setMoodHistory(newMoodHistory);
    localStorage.setItem("moodHistory", JSON.stringify(newMoodHistory));
  };

  const handleQuietHoursToggle = (enabled: boolean) => {
    setQuietHoursEnabled(enabled);
    localStorage.setItem("quietHoursEnabled", JSON.stringify(enabled));
  };

  const handleCheckInComplete = () => {
    setDailyCheckInCompleted(true);
    setLastCheckInDate(new Date().toDateString());
    localStorage.setItem("dailyCheckInCompleted", JSON.stringify(true));
    localStorage.setItem("lastCheckInDate", new Date().toDateString());
  };

  const resetDailyCheckIn = () => {
    setDailyCheckInCompleted(false);
    localStorage.removeItem("dailyCheckInCompleted");
  };

  const shouldShowCheckIn = () => {
    if (!dailyCheckInCompleted) return true;
    if (!lastCheckInDate) return true;

    const today = new Date().toDateString();
    return lastCheckInDate !== today;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your wellness dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>WorkSight Employee Tools</h1>
          <p>Take care of yourself, take care of your work</p>
          {userName && (
            <div className={styles.userGreeting}>
              <span>👋 Welcome back, {userName}!</span>
              <span className={styles.dateDisplay}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Daily Check-in Section */}
          {shouldShowCheckIn() && (
            <section className={`${styles.section} ${styles.highlight}`}>
              <h2>Daily Check-in</h2>
              <DailyCheckIn
                onComplete={handleCheckInComplete}
                completed={dailyCheckInCompleted}
                userName={userName}
                setUserName={setUserName}
              />
            </section>
          )}

          {/* Quick Actions */}
          <section className={styles.section}>
            <h2>Quick Actions</h2>
            <QuickActions
              currentMood={currentMood}
              quietHoursEnabled={quietHoursEnabled}
              onMoodChange={handleMoodChange}
              onQuietHoursToggle={handleQuietHoursToggle}
            />
          </section>

          {/* Mood Rating Section */}
          <section className={styles.section}>
            <h2>How are you feeling today?</h2>
            <MoodRating
              currentMood={currentMood}
              onMoodChange={handleMoodChange}
            />
          </section>

          {/* Wellness Stats */}
          <section className={styles.section}>
            <h2>Your Wellness Overview</h2>
            <WellnessStats
              moodHistory={moodHistory}
              lastCheckInDate={lastCheckInDate}
            />
          </section>

          {/* Quiet Hours Toggle */}
          <section className={styles.section}>
            <h2>Focus Settings</h2>
            <QuietHoursToggle
              enabled={quietHoursEnabled}
              onToggle={handleQuietHoursToggle}
            />
          </section>

          {/* Nudge Suggestions */}
          <section className={styles.section}>
            <h2>Wellness Suggestions</h2>
            <NudgeSuggestions
              currentMood={currentMood}
              quietHoursEnabled={quietHoursEnabled}
            />
          </section>
        </div>

        {/* Reset Check-in Button */}
        {dailyCheckInCompleted && (
          <div className={styles.resetSection}>
            <button onClick={resetDailyCheckIn} className={styles.resetButton}>
              Reset Daily Check-in
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
