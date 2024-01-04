import React, { useEffect, useState } from 'react';
import './App.css'; 
const API_URL = "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";

export default function App() {
  const [tQuestions, setTQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setTQuestions(data.results);
      });
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    if (timer === 0) {
      handleAnswerOptionClick(false); // Auto-submit if the timer reaches 0
    }

    return () => clearInterval(timerInterval);
  }, [timer, currentQuestion]);

  const reloadQuiz = () => {
    window.location.reload(false);
  };

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < tQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setTimer(5); // Reset timer for the next question
    } else {
      setShowScore(true);
    }
  };

  const handleSkip = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < tQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setTimer(5); // Reset timer for the next question
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className='app'>
      {showScore ? (
        <div className='score-section'>
          <div>
            You scored {score} out of {tQuestions.length}
          </div>
          <button className='reload-quiz-button' onClick={() => reloadQuiz()}>
            <span>want to play again?</span>
          </button>
        </div>
      ) : (
        <>
          <div className='question-section'>
            <div className='question-count'>
              <span>Question {currentQuestion + 1}</span>/{tQuestions.length}
            </div>
            <div
              className='question-text'
              dangerouslySetInnerHTML={{
                __html: tQuestions.length > 0 ? tQuestions[currentQuestion].question : 'Loading...',
              }}
            />
            <div className='timer-section'>Timer: {timer}s</div>
          </div>
          <div className='answer-section'>
            {tQuestions[currentQuestion]?.incorrect_answers &&
              tQuestions[currentQuestion]?.correct_answer && (
                <>
                  {[...tQuestions[currentQuestion].incorrect_answers, tQuestions[currentQuestion].correct_answer].map(
                    (answerOption, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerOptionClick(answerOption === tQuestions[currentQuestion].correct_answer)}
                        dangerouslySetInnerHTML={{ __html: answerOption }}
                      />
                    )
                  )}
                  <button className='skip-button' onClick={handleSkip}>
                    Skip
                  </button>
                </>
              )}
          </div>
        </>
      )}
    </div>
  );
}
