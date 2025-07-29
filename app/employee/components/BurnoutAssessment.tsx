"use client";

import React, { useState } from "react";
import styles from "./BurnoutAssessment.module.scss";

interface BurnoutAssessmentProps {
  // eslint-disable-next-line no-unused-vars
  onComplete?: (results: BurnoutResults) => void;
}

interface BurnoutResults {
  exhaustion: number;
  mentalDistance: number;
  cognitiveImpairment: number;
  emotionalImpairment: number;
  totalScore: number;
  riskLevel: string;
  recommendations: string[];
  completedAt: string;
  participantInfo: {
    fullName: string;
    department: string;
    date: string;
  };
}

interface Question {
  id: string;
  text: string;
  dimension: keyof Omit<
    BurnoutResults,
    | "totalScore"
    | "riskLevel"
    | "recommendations"
    | "completedAt"
    | "participantInfo"
  >;
}

const questions: Question[] = [
  // Exhaustion
  {
    id: "ex1",
    text: "At work, I feel mentally exhausted.",
    dimension: "exhaustion",
  },
  {
    id: "ex2",
    text: "At work, I feel emotionally exhausted.",
    dimension: "exhaustion",
  },
  {
    id: "ex3",
    text: "After a day's work, I find it hard to recover my energy.",
    dimension: "exhaustion",
  },

  // Mental Distance
  {
    id: "md1",
    text: "I struggle to find any enthusiasm for my work.",
    dimension: "mentalDistance",
  },
  {
    id: "md2",
    text: "I feel indifferent about my job.",
    dimension: "mentalDistance",
  },
  {
    id: "md3",
    text: "I feel emotionally detached from my work.",
    dimension: "mentalDistance",
  },

  // Cognitive Impairment
  {
    id: "ci1",
    text: "At work, I have trouble concentrating.",
    dimension: "cognitiveImpairment",
  },
  {
    id: "ci2",
    text: "I find it hard to think clearly at work.",
    dimension: "cognitiveImpairment",
  },
  {
    id: "ci3",
    text: "I forget what I'm doing at work.",
    dimension: "cognitiveImpairment",
  },

  // Emotional Impairment
  {
    id: "ei1",
    text: "At work, I can't control my emotions.",
    dimension: "emotionalImpairment",
  },
  {
    id: "ei2",
    text: "I often feel angry or frustrated at work.",
    dimension: "emotionalImpairment",
  },
  {
    id: "ei3",
    text: "Even small setbacks at work feel overwhelming.",
    dimension: "emotionalImpairment",
  },
];

const scaleOptions = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Always" },
];

const BurnoutAssessment: React.FC<BurnoutAssessmentProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<
    "info" | "assessment" | "results"
  >("info");
  const [participantInfo, setParticipantInfo] = useState({
    fullName: "",
    department: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<BurnoutResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantInfo.fullName.trim()) {
      setCurrentStep("assessment");
    }
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const calculateResults = (): BurnoutResults => {
    const dimensionScores: Record<string, number[]> = {
      exhaustion: [],
      mentalDistance: [],
      cognitiveImpairment: [],
      emotionalImpairment: [],
    };

    // Group answers by dimension
    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer) {
        dimensionScores[question.dimension].push(answer);
      }
    });

    // Calculate average scores for each dimension
    const exhaustion =
      dimensionScores.exhaustion.length > 0
        ? dimensionScores.exhaustion.reduce((a, b) => a + b, 0) /
          dimensionScores.exhaustion.length
        : 0;
    const mentalDistance =
      dimensionScores.mentalDistance.length > 0
        ? dimensionScores.mentalDistance.reduce((a, b) => a + b, 0) /
          dimensionScores.mentalDistance.length
        : 0;
    const cognitiveImpairment =
      dimensionScores.cognitiveImpairment.length > 0
        ? dimensionScores.cognitiveImpairment.reduce((a, b) => a + b, 0) /
          dimensionScores.cognitiveImpairment.length
        : 0;
    const emotionalImpairment =
      dimensionScores.emotionalImpairment.length > 0
        ? dimensionScores.emotionalImpairment.reduce((a, b) => a + b, 0) /
          dimensionScores.emotionalImpairment.length
        : 0;

    const totalScore =
      (exhaustion +
        mentalDistance +
        cognitiveImpairment +
        emotionalImpairment) /
      4;

    // Determine risk level
    let riskLevel = "Low";
    let recommendations: string[] = [];

    if (totalScore >= 4.0) {
      riskLevel = "High";
      recommendations = [
        "Consider speaking with HR or a mental health professional",
        "Take regular breaks and practice stress management techniques",
        "Discuss workload concerns with your manager",
        "Prioritize self-care and work-life balance",
      ];
    } else if (totalScore >= 3.0) {
      riskLevel = "Moderate";
      recommendations = [
        "Monitor your stress levels and take proactive steps",
        "Practice mindfulness and relaxation techniques",
        "Set clear boundaries between work and personal time",
        "Consider discussing workload with your manager",
      ];
    } else {
      riskLevel = "Low";
      recommendations = [
        "Continue maintaining healthy work habits",
        "Stay aware of stress triggers",
        "Keep up with regular breaks and self-care",
        "Support colleagues who may be struggling",
      ];
    }

    return {
      exhaustion,
      mentalDistance,
      cognitiveImpairment,
      emotionalImpairment,
      totalScore,
      riskLevel,
      recommendations,
      completedAt: new Date().toISOString(),
      participantInfo,
    };
  };

  const handleAssessmentComplete = () => {
    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setCurrentStep("results");
      setIsLoading(false);

      // Save to localStorage
      const savedAssessments = JSON.parse(
        localStorage.getItem("burnoutAssessments") || "[]",
      );
      savedAssessments.push(calculatedResults);
      localStorage.setItem(
        "burnoutAssessments",
        JSON.stringify(savedAssessments),
      );

      if (onComplete) {
        onComplete(calculatedResults);
      }
    }, 1500);
  };

  const isAssessmentComplete = questions.every(
    (question) => answers[question.id],
  );

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "#dc3545";
      case "Moderate":
        return "#ffc107";
      case "Low":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const getDimensionColor = (score: number) => {
    if (score >= 4) return "#dc3545";
    if (score >= 3) return "#ffc107";
    return "#28a745";
  };

  if (currentStep === "info") {
    return (
      <div className={styles.burnoutAssessment}>
        <div className={styles.header}>
          <h2>🔥 Burnout Assessment Tool</h2>
          <p className={styles.citation}>
            Based on: Schaufeli, De Witte, & Desart (2020)
          </p>
        </div>

        <div className={styles.infoSection}>
          <h3>Purpose</h3>
          <p>Measure employee burnout across four core dimensions.</p>

          <h3>Instructions</h3>
          <p>
            Please indicate how often each statement applies to you in the
            context of your work.
          </p>

          <div className={styles.scaleInfo}>
            <h4>Scale:</h4>
            <div className={styles.scaleOptions}>
              {scaleOptions.map((option) => (
                <div key={option.value} className={styles.scaleOption}>
                  <span className={styles.scaleValue}>{option.value}</span>
                  <span className={styles.scaleLabel}>– {option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleInfoSubmit} className={styles.infoForm}>
          <h3>Participant Information (Optional)</h3>

          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={participantInfo.fullName}
              onChange={(e) =>
                setParticipantInfo((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              placeholder="Enter your full name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="department">Department / Team</label>
            <input
              type="text"
              id="department"
              value={participantInfo.department}
              onChange={(e) =>
                setParticipantInfo((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
              placeholder="Enter your department or team"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={participantInfo.date}
              onChange={(e) =>
                setParticipantInfo((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
            />
          </div>

          <button type="submit" className={styles.startButton}>
            Start Assessment
          </button>
        </form>
      </div>
    );
  }

  if (currentStep === "assessment") {
    return (
      <div className={styles.burnoutAssessment}>
        <div className={styles.header}>
          <h2>🔥 Burnout Assessment</h2>
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{
                width: `${(Object.keys(answers).length / questions.length) * 100}%`,
              }}
            />
            <span className={styles.progressText}>
              {Object.keys(answers).length} of {questions.length} questions
              answered
            </span>
          </div>
        </div>

        <div className={styles.questionsContainer}>
          {questions.map((question, index) => (
            <div key={question.id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>Q{index + 1}</span>
                <span className={styles.dimension}>
                  {question.dimension.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>

              <p className={styles.questionText}>{question.text}</p>

              <div className={styles.scaleGrid}>
                {scaleOptions.map((option) => (
                  <label key={option.value} className={styles.scaleOption}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={(e) =>
                        handleAnswerChange(
                          question.id,
                          parseInt(e.target.value),
                        )
                      }
                    />
                    <span className={styles.optionContent}>
                      <span className={styles.optionValue}>{option.value}</span>
                      <span className={styles.optionLabel}>{option.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.assessmentActions}>
          <button
            onClick={handleAssessmentComplete}
            disabled={!isAssessmentComplete || isLoading}
            className={styles.completeButton}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Calculating Results...
              </>
            ) : (
              "Complete Assessment"
            )}
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === "results" && results) {
    return (
      <div className={styles.burnoutAssessment}>
        <div className={styles.header}>
          <h2>🔥 Assessment Results</h2>
          <p className={styles.completedAt}>
            Completed on {new Date(results.completedAt).toLocaleDateString()}
          </p>
        </div>

        <div className={styles.resultsContainer}>
          <div className={styles.overallScore}>
            <h3>Overall Burnout Risk</h3>
            <div
              className={styles.riskLevel}
              style={{ color: getRiskLevelColor(results.riskLevel) }}
            >
              {results.riskLevel} Risk
            </div>
            <div className={styles.totalScore}>
              Average Score: {results.totalScore.toFixed(1)}/5.0
            </div>
          </div>

          <div className={styles.dimensionScores}>
            <h3>Dimension Breakdown</h3>
            <div className={styles.dimensionsGrid}>
              <div className={styles.dimensionCard}>
                <h4>Exhaustion</h4>
                <div
                  className={styles.dimensionScore}
                  style={{ color: getDimensionColor(results.exhaustion) }}
                >
                  {results.exhaustion.toFixed(1)}
                </div>
              </div>

              <div className={styles.dimensionCard}>
                <h4>Mental Distance</h4>
                <div
                  className={styles.dimensionScore}
                  style={{ color: getDimensionColor(results.mentalDistance) }}
                >
                  {results.mentalDistance.toFixed(1)}
                </div>
              </div>

              <div className={styles.dimensionCard}>
                <h4>Cognitive Impairment</h4>
                <div
                  className={styles.dimensionScore}
                  style={{
                    color: getDimensionColor(results.cognitiveImpairment),
                  }}
                >
                  {results.cognitiveImpairment.toFixed(1)}
                </div>
              </div>

              <div className={styles.dimensionCard}>
                <h4>Emotional Impairment</h4>
                <div
                  className={styles.dimensionScore}
                  style={{
                    color: getDimensionColor(results.emotionalImpairment),
                  }}
                >
                  {results.emotionalImpairment.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.recommendations}>
            <h3>Recommendations</h3>
            <ul className={styles.recommendationsList}>
              {results.recommendations.map((rec, index) => (
                <li key={index} className={styles.recommendation}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.resultsActions}>
            <button
              onClick={() => {
                setCurrentStep("info");
                setAnswers({});
                setResults(null);
              }}
              className={styles.retakeButton}
            >
              Take Assessment Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BurnoutAssessment;
