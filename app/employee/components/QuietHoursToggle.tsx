"use client";

import { useState } from "react";
import styles from "./QuietHoursToggle.module.scss";

interface QuietHoursToggleProps {
  enabled: boolean;
  // eslint-disable-next-line no-unused-vars
  onToggle: (enabled: boolean) => void;
}

export default function QuietHoursToggle({
  enabled,
  onToggle,
}: QuietHoursToggleProps) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const handleToggle = () => {
    onToggle(!enabled);
  };

  const handleTimeChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartTime(value);
      localStorage.setItem("quietHoursStart", value);
    } else {
      setEndTime(value);
      localStorage.setItem("quietHoursEnd", value);
    }
  };

  return (
    <div className={styles.quietHours}>
      <div className={styles.toggleSection}>
        <div className={styles.toggleInfo}>
          <h3>Quiet Hours Mode</h3>
          <p>Reduce notifications and distractions during focused work time</p>
        </div>

        <button
          className={`${styles.toggle} ${enabled ? styles.enabled : ""}`}
          onClick={handleToggle}
          aria-label={enabled ? "Disable quiet hours" : "Enable quiet hours"}
        >
          <div className={styles.toggleSlider} />
        </button>
      </div>

      {enabled && (
        <div className={styles.timeSettings}>
          <div className={styles.timeInput}>
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => handleTimeChange("start", e.target.value)}
              className={styles.timePicker}
            />
          </div>

          <div className={styles.timeInput}>
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => handleTimeChange("end", e.target.value)}
              className={styles.timePicker}
            />
          </div>
        </div>
      )}

      <div className={styles.status}>
        {enabled ? (
          <div className={styles.activeStatus}>
            <span className={styles.statusDot} />
            <span>
              Quiet hours active from {startTime} to {endTime}
            </span>
          </div>
        ) : (
          <div className={styles.inactiveStatus}>
            <span className={styles.statusDot} />
            <span>Quiet hours disabled</span>
          </div>
        )}
      </div>

      <div className={styles.features}>
        <h4>What happens during quiet hours:</h4>
        <ul>
          <li>🔕 Reduced notification frequency</li>
          <li>📧 Email notifications paused</li>
          <li>💬 Chat notifications minimized</li>
          <li>🎯 Focus mode indicators</li>
        </ul>
      </div>
    </div>
  );
}
