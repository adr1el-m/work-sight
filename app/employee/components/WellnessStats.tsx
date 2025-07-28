"use client";

import { useMemo } from "react";
import styles from "./WellnessStats.module.scss";

interface WellnessStatsProps {
  moodHistory: Array<{ date: string; mood: number }>;
  lastCheckInDate: string | null;
}

export default function WellnessStats({
  moodHistory,
  lastCheckInDate,
}: WellnessStatsProps) {
  // Move function definitions before useMemo
  const calculateCheckInStreak = (lastCheckIn: string | null) => {
    if (!lastCheckIn) return 0;

    const lastCheckInDate = new Date(lastCheckIn);
    const daysDiff =
      (new Date().getTime() - lastCheckInDate.getTime()) / (1000 * 3600 * 24);

    return daysDiff === 0 ? 1 : 0; // Simple streak calculation
  };

  const calculateMoodDistribution = (
    moods: Array<{ date: string; mood: number }>,
  ) => {
    const distribution = { low: 0, medium: 0, high: 0 };

    moods.forEach((entry) => {
      if (entry.mood <= 2) distribution.low++;
      else if (entry.mood <= 3) distribution.medium++;
      else distribution.high++;
    });

    return distribution;
  };

  const stats = useMemo(() => {
    const recentMoods = moodHistory.filter((entry) => {
      const entryDate = new Date(entry.date);
      const daysDiff =
        (new Date().getTime() - entryDate.getTime()) / (1000 * 3600 * 24);
      return daysDiff <= 7; // Last 7 days
    });

    const averageMood =
      recentMoods.length > 0
        ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) /
          recentMoods.length
        : null;

    const moodTrend =
      recentMoods.length >= 2
        ? recentMoods[recentMoods.length - 1].mood - recentMoods[0].mood
        : 0;

    const checkInStreak = calculateCheckInStreak(lastCheckInDate);
    const weeklyMoodDistribution = calculateMoodDistribution(recentMoods);

    return {
      averageMood: averageMood ? Math.round(averageMood * 10) / 10 : null,
      moodTrend,
      checkInStreak,
      weeklyMoodDistribution,
      totalEntries: moodHistory.length,
      recentEntries: recentMoods.length,
    };
  }, [moodHistory, lastCheckInDate]);

  const getMoodTrendIcon = (trend: number) => {
    if (trend > 0) return "📈";
    if (trend < 0) return "📉";
    return "➡️";
  };

  const getMoodTrendText = (trend: number) => {
    if (trend > 0) return "Improving";
    if (trend < 0) return "Declining";
    return "Stable";
  };

  const getMoodTrendColor = (trend: number) => {
    if (trend > 0) return "#10b981";
    if (trend < 0) return "#ef4444";
    return "#6b7280";
  };

  return (
    <div className={styles.wellnessStats}>
      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>📊</span>
            <span className={styles.statLabel}>Weekly Average</span>
          </div>
          <div className={styles.statValue}>
            {stats.averageMood ? `${stats.averageMood}/5` : "No data"}
          </div>
          {stats.averageMood && (
            <div className={styles.statSubtext}>
              Based on {stats.recentEntries} entries
            </div>
          )}
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>📈</span>
            <span className={styles.statLabel}>Mood Trend</span>
          </div>
          <div className={styles.statValue}>
            {stats.moodTrend !== 0 ? (
              <>
                <span className={styles.trendIcon}>
                  {getMoodTrendIcon(stats.moodTrend)}
                </span>
                <span style={{ color: getMoodTrendColor(stats.moodTrend) }}>
                  {getMoodTrendText(stats.moodTrend)}
                </span>
              </>
            ) : (
              "Stable"
            )}
          </div>
          <div className={styles.statSubtext}>Last 7 days</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>🔥</span>
            <span className={styles.statLabel}>Check-in Streak</span>
          </div>
          <div className={styles.statValue}>
            {stats.checkInStreak} day{stats.checkInStreak !== 1 ? "s" : ""}
          </div>
          <div className={styles.statSubtext}>
            {stats.checkInStreak > 0
              ? "Keep it up!"
              : "Start your streak today"}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>📝</span>
            <span className={styles.statLabel}>Total Entries</span>
          </div>
          <div className={styles.statValue}>{stats.totalEntries}</div>
          <div className={styles.statSubtext}>All time</div>
        </div>
      </div>

      {/* Mood Distribution Chart */}
      <div className={styles.moodDistribution}>
        <h3>Weekly Mood Distribution</h3>
        <div className={styles.distributionBars}>
          <div className={styles.distributionBar}>
            <div className={styles.barLabel}>Low (1-2)</div>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${styles.lowMood}`}
                style={{
                  width: `${stats.recentEntries > 0 ? (stats.weeklyMoodDistribution.low / stats.recentEntries) * 100 : 0}%`,
                }}
              />
            </div>
            <div className={styles.barValue}>
              {stats.weeklyMoodDistribution.low}
            </div>
          </div>

          <div className={styles.distributionBar}>
            <div className={styles.barLabel}>Medium (3)</div>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${styles.mediumMood}`}
                style={{
                  width: `${stats.recentEntries > 0 ? (stats.weeklyMoodDistribution.medium / stats.recentEntries) * 100 : 0}%`,
                }}
              />
            </div>
            <div className={styles.barValue}>
              {stats.weeklyMoodDistribution.medium}
            </div>
          </div>

          <div className={styles.distributionBar}>
            <div className={styles.barLabel}>High (4-5)</div>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${styles.highMood}`}
                style={{
                  width: `${stats.recentEntries > 0 ? (stats.weeklyMoodDistribution.high / stats.recentEntries) * 100 : 0}%`,
                }}
              />
            </div>
            <div className={styles.barValue}>
              {stats.weeklyMoodDistribution.high}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className={styles.insights}>
        <h3>Wellness Insights</h3>
        <div className={styles.insightList}>
          {stats.averageMood && stats.averageMood < 3 && (
            <div className={styles.insight}>
              <span className={styles.insightIcon}>💡</span>
              <span>
                Your mood has been lower than usual. Consider taking more breaks
                and practicing self-care.
              </span>
            </div>
          )}

          {stats.averageMood && stats.averageMood >= 4 && (
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🎉</span>
              <span>
                Great job maintaining positive energy! Your wellness practices
                are working well.
              </span>
            </div>
          )}

          {stats.checkInStreak === 0 && (
            <div className={styles.insight}>
              <span className={styles.insightIcon}>📅</span>
              <span>
                Start your daily check-in streak today to track your wellness
                journey.
              </span>
            </div>
          )}

          {stats.recentEntries === 0 && (
            <div className={styles.insight}>
              <span className={styles.insightIcon}>📊</span>
              <span>
                No mood data yet. Start tracking your mood to see your wellness
                patterns.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
