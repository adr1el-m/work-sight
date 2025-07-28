import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Image
            className={styles.logo}
            src="/assets/next.svg"
            alt="WorkSight logo"
            width={180}
            height={38}
            priority
          />
          <h1>WorkSight</h1>
          <p>Employee Wellness & Burnout Prevention Platform</p>
        </div>

        <div className={styles.navigation}>
          <Link href="/employee" className={styles.navCard}>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>👤</div>
              <h2>Employee Tools</h2>
              <p>Self-check tools, mood tracking, and wellness suggestions</p>
              <ul>
                <li>Daily mood check-ins</li>
                <li>Quiet hours toggle</li>
                <li>Personalized wellness nudges</li>
                <li>Focus and productivity tips</li>
              </ul>
            </div>
          </Link>

          <div className={styles.navCard}>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>📊</div>
              <h2>Manager Dashboard</h2>
              <p>Team overview and burnout risk monitoring</p>
              <ul>
                <li>Team burnout risk overview</li>
                <li>Department and date filters</li>
                <li>Team-level insights and alerts</li>
                <li>Employee wellness analytics</li>
              </ul>
              <span className={styles.comingSoon}>Coming Soon</span>
            </div>
          </div>
        </div>

        <div className={styles.features}>
          <h2>Platform Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎯</span>
              <h3>Burnout Prevention</h3>
              <p>
                Early detection and prevention of employee burnout through
                behavioral analysis
              </p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💚</span>
              <h3>Wellness Tracking</h3>
              <p>
                Comprehensive mood and wellness monitoring with personalized
                insights
              </p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔕</span>
              <h3>Focus Tools</h3>
              <p>
                Quiet hours and distraction management to improve productivity
              </p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📈</span>
              <h3>Analytics</h3>
              <p>
                Data-driven insights for managers to support team well-being
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 WorkSight. Built for better workplace wellness.</p>
      </footer>
    </div>
  );
}
