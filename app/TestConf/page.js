"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, List, CheckCircle, RefreshCcw } from "lucide-react";

const questions = [
  {
    question: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Custom Style Sheets"],
    correct: "Cascading Style Sheets"
  },
  {
    question: "Which of the following is a JavaScript framework?",
    options: ["React", "Laravel", "Django", "Flask"],
    correct: "React"
  },
  {
    question: "What is the default behavior of flexbox direction?",
    options: ["row", "column", "row-reverse", "column-reverse"],
    correct: "row"
  },
  {
    question: "Which tag is used to define an unordered list in HTML?",
    options: ["<ul>", "<ol>", "<li>", "<div>"],
    correct: "<ul>"
  },
  {
    question: "What is the primary purpose of JavaScript in web development?",
    options: ["Styling", "Structure", "Interactivity", "Database management"],
    correct: "Interactivity"
  },
  {
    question: "Which CSS property is used to change the text color?",
    options: ["color", "text-color", "foreground", "font-color"],
    correct: "color"
  },
  {
    question: "Which of the following is NOT a valid JavaScript data type?",
    options: ["Number", "Boolean", "Float", "String"],
    correct: "Float"
  },
  {
    question: "Which HTML attribute is used to define inline styles?",
    options: ["style", "class", "id", "css"],
    correct: "style"
  },
  {
    question: "What does the 'this' keyword refer to in JavaScript?",
    options: ["The previous function", "The current object", "The global object", "A new variable"],
    correct: "The current object"
  },
  {
    question: "Which function is used to parse a string into a JSON object?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "JSON.decode()"],
    correct: "JSON.parse()"
  },
  {
    question: "Which of the following is used to create a responsive layout in CSS?",
    options: ["Flexbox", "Grid", "Both", "None"],
    correct: "Both"
  },
  {
    question: "Which of these is NOT a valid way to declare a JavaScript variable?",
    options: ["var", "let", "const", "int"],
    correct: "int"
  },
  {
    question: "Which HTML element is used for the largest heading?",
    options: ["<h1>", "<h2>", "<h3>", "<h4>"],
    correct: "<h1>"
  },
  {
    question: "What does the '=== ' operator do in JavaScript?",
    options: ["Compares value only", "Compares value and type", "Assigns a value", "None of the above"],
    correct: "Compares value and type"
  },
  {
    question: "Which CSS property controls the space between lines of text?",
    options: ["line-height", "spacing", "letter-spacing", "text-indent"],
    correct: "line-height"
  }
];

export default function FrontendAssessmentPage() {
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswer = (index, option) => {
    setAnswers({ ...answers, [index]: option });
  };

  const calculateScore = () => {
    return Object.keys(answers).reduce((score, index) => {
      return answers[index] === questions[index].correct ? score + 1 : score;
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-3xl mx-auto border-black border-2 p-10 rounded-lg">
        <div className="text-2xl md:text-3xl font-bold mb-3">Frontend Developer Skills Assessment</div>
        <div className="text-[14px] text-gray-400 mb-3">Please review the test details before applying</div>

        {!isSubmitted ? (
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{q.question}</h3>
                <div className="mt-2">
                  {q.options.map((option) => (
                    <div key={option} className="mb-2">
                      <input
                        type="radio"
                        id={`q${index}-${option}`}
                        name={`q${index}`}
                        value={option}
                        onChange={() => handleAnswer(index, option)}
                        checked={answers[index] === option}
                      />
                      <label htmlFor={`q${index}-${option}`} className="ml-2 cursor-pointer">{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              className="bg-black text-white border-2 border-black rounded-lg px-4 py-2 hover:bg-gray-800 transition-all"
              onClick={() => setIsSubmitted(true)}
            >
              Submit Test
            </button>
          </div>
        ) : (
          <div className="text-xl font-semibold text-center">
            Your Score: {calculateScore()} / {questions.length}
            {calculateScore() / questions.length >= 0.9 && (
              <div className="mt-4">
                <p className="text-green-600 font-semibold">You are eligible for the position!</p>
                <Link href="/join">
                  <button className="mt-2 bg-green-600 text-white border-2 border-green-600 rounded-lg px-4 py-2 hover:bg-green-700 transition-all">
                    Join Now
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}