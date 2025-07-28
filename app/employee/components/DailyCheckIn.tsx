"use client";

import { useState, useEffect } from "react";
import styles from "./DailyCheckIn.module.scss";

interface DailyCheckInProps {
  onComplete: () => void;
  completed: boolean;
  userName: string;
  // eslint-disable-next-line no-unused-vars
  setUserName: (name: string) => void;
}

interface CheckInQuestion {
  id: string;
  question: string;
  type: "text" | "number" | "select";
  options?: string[];
  placeholder?: string;
}

const checkInQuestions: CheckInQuestion[] = [
  {
    id: "sleep",
    question: "How many hours did you sleep last night?",
    type: "number",
    placeholder: "Enter hours (e.g., 7.5)",
  },
  {
    id: "energy",
    question: "How would you rate your energy level this morning?",
    type: "select",
    options: ["Very Low", "Low", "Moderate", "High", "Very High"],
  },
  {
    id: "stress",
    question: "How stressed do you feel right now?",
    type: "select",
    options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
  },
  {
    id: "goals",
    question: "What's your main goal for today?",
    type: "text",
    placeholder: "e.g., Complete the project proposal",
  },
];

export default function DailyCheckIn({
  onComplete,
  completed,
  userName,
  setUserName,
}: DailyCheckInProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showForm, setShowForm] = useState(!completed);

  useEffect(() => {
    // Load saved answers
    const savedAnswers = localStorage.getItem("dailyCheckInAnswers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const handleAnswerChange = (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    localStorage.setItem("dailyCheckInAnswers", JSON.stringify(newAnswers));
  };

  const handleNext = () => {
    if (currentStep < checkInQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    setShowForm(false);
    // Save completion timestamp
    localStorage.setItem("lastCheckInDate", new Date().toDateString());
  };

  const handleStartNewCheckIn = () => {
    setShowForm(true);
    setCurrentStep(0);
    setAnswers({});
  };

  const renderQuestion = (question: CheckInQuestion) => {
    const value = answers[question.id] || "";

    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={styles.textInput}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            min="0"
            max="24"
            step="0.5"
            className={styles.numberInput}
          />
        );
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  if (!showForm) {
    return (
      <div className={styles.completedCheckIn}>
        <div className={styles.completedHeader}>
          <span className={styles.checkmark}>✅</span>
          <h3>Daily Check-in Complete!</h3>
        </div>
        <p>Great job taking care of yourself today, {userName || "there"}!</p>
        <button
          onClick={handleStartNewCheckIn}
          className={styles.newCheckInButton}
        >
          Start New Check-in
        </button>
      </div>
    );
  }

  const currentQuestion = checkInQuestions[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === checkInQuestions.length - 1;
  const canProceed =
    answers[currentQuestion.id] &&
    answers[currentQuestion.id].toString().trim() !== "";

  return (
    <div className={styles.dailyCheckIn}>
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{
            width: `${((currentStep + 1) / checkInQuestions.length) * 100}%`,
          }}
        />
      </div>

      {/* Step Indicator */}
      <div className={styles.stepIndicator}>
        Step {currentStep + 1} of {checkInQuestions.length}
      </div>

      {/* Question */}
      <div className={styles.questionSection}>
        <h3>{currentQuestion.question}</h3>
        <div className={styles.inputContainer}>
          {renderQuestion(currentQuestion)}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        {!isFirstStep && (
          <button onClick={handlePrevious} className={styles.previousButton}>
            Previous
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`${styles.nextButton} ${!canProceed ? styles.disabled : ""}`}
        >
          {isLastStep ? "Complete" : "Next"}
        </button>
      </div>

      {/* Name input for first step */}
      {isFirstStep && (
        <div className={styles.nameSection}>
          <label htmlFor="userName">What should we call you?</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              localStorage.setItem("userName", e.target.value);
            }}
            placeholder="Enter your name"
            className={styles.nameInput}
          />
        </div>
      )}
    </div>
  );
}
