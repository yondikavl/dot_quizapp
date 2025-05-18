import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizApp = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("quizState"));
    if (savedState) {
      setQuizData(savedState.quizData);
      setCurrentQuestion(savedState.currentQuestion);
      setUserAnswers(savedState.userAnswers);
      setScore(savedState.score);
      setQuizDone(savedState.quizDone);
      setTimeLeft(savedState.timeLeft);
    } else {
      fetchQuiz();
    }
  }, []);

  useEffect(() => {
    if (!quizDone && quizData.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setQuizDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizDone, quizData]);

  useEffect(() => {
    localStorage.setItem(
      "quizState",
      JSON.stringify({
        quizData,
        currentQuestion,
        userAnswers,
        score,
        quizDone,
        timeLeft,
      })
    );
  }, [quizData, currentQuestion, userAnswers, score, quizDone, timeLeft]);

  const fetchQuiz = async () => {
    const res = await axios.get(
      "https://opentdb.com/api.php?amount=5&type=multiple"
    );
    const formatted = res.data.results.map((q) => ({
      ...q,
      allAnswers: shuffle([...q.incorrect_answers, q.correct_answer]),
    }));
    setQuizData(formatted);
  };

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const handleAnswer = (answer) => {
    const current = quizData[currentQuestion];
    const isCorrect = answer === current.correct_answer;
    if (isCorrect) setScore(score + 1);

    setUserAnswers([...userAnswers, answer]);

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizDone(true);
    }
  };

  const resetQuiz = () => {
    localStorage.removeItem("quizState");
    setQuizData([]);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setQuizDone(false);
    setTimeLeft(60);
    fetchQuiz();
  };

  if (quizData.length === 0) return <div>Loading Quiz...</div>;

  if (quizDone) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Result</h2>
        <p>Total Question: {quizData.length}</p>
        <p>Number of Answer: {userAnswers.length}</p>
        <p>Correct Answer: {score}</p>
        <p>Incorrect Answer: {userAnswers.length - score}</p>
        <button
          className="mt-4 px-4 py-2 bg-[#31ad0b] rounded-sm text-white"
          onClick={resetQuiz}
        >
          Try Again
        </button>
      </div>
    );
  }

  const current = quizData[currentQuestion];

  return (
    <div className="p-6 max-w-xl mx-auto">
      <img
        src="/bg_quiz.svg"
        alt="Quiz"
        className="absolute bottom-0 w-full md:w-auto md:h-5/6 left-0 object-cover opacity-50 z-0"
      />
      <div className="mb-4">Time Left: {timeLeft}s</div>
      <h2
        className="text-xl font-semibold mb-2"
        dangerouslySetInnerHTML={{ __html: current.question }}
      />
      <div className="space-y-2 my-6">
        {current.allAnswers.map((ans, idx) => (
          <button
            key={idx}
            className="block w-full px-4 py-2 bg-gray-200 hover:bg-[#31ad0b] hover:text-white text-left"
            onClick={() => handleAnswer(ans)}
            dangerouslySetInnerHTML={{ __html: ans }}
          />
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Question {currentQuestion + 1} of {quizData.length}
      </div>
    </div>
  );
};

export default QuizApp;
