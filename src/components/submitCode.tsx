import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../helpers/axios';

interface Question {
  question: string;
  answer: string;
}

interface SubmitCodeProps {
  isOpen: boolean;
  onClose: () => void;
  onPointsUpdated?: (points: number) => void; // Callback to update points in parent
}

interface RedeemCodeResponse {
  success: boolean;
  message: string;
  points?: number;
}

const SubmitCode: React.FC<SubmitCodeProps> = ({ isOpen, onClose, onPointsUpdated }) => {
  const [question, setQuestion] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  // Animation effect for messages
  useEffect(() => {
    if (message) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [message]);

  // Questions Database
  const questions: Question[] = [
    { question: "What is 5 + 3?", answer: "8" },
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "How many legs does a spider have?", answer: "8" },
    { question: "What is the square root of 64?", answer: "8" },
  ];

  // Get Random Question
  const fetchQuestion = () => {
    setShowCodeInput(false);
    setUserAnswer("");
    setMessage("");
    setIsSuccess(false);

    const randomIndex = Math.floor(Math.random() * questions.length);
    setQuestion(questions[randomIndex].question);
    setCorrectAnswer(questions[randomIndex].answer);
  };

  // Check Answer
  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === correctAnswer?.toLowerCase()) {
      setShowCodeInput(true);
      setMessage("Correct! Now you can enter your code.");
      setIsSuccess(true);
    } else {
      setMessage("Incorrect answer, try again!");
      setIsSuccess(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      setMessage("Please enter a valid code.");
      setIsSuccess(false);
      return;
    }
  
    setIsLoading(true);
    setMessage("");
  
    try {
      const response = await api.post<RedeemCodeResponse>(
        "/points/redeem-code",
        { code: code.trim() }
      );
      
      if (response.data.success) {
        const pointsMessage = response.data.points ? ` (+${response.data.points} points)` : '';
        setMessage(`${response.data.message}${pointsMessage}`);
        setIsSuccess(true);
        setCode("");
        
        // Update parent component's points if callback exists and points were awarded
        if (onPointsUpdated && response.data.points) {
          onPointsUpdated(response.data.points);
        }
      } else {
        setMessage(response.data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Failed to redeem code. Please try again later.");
      setIsSuccess(false);
      console.error("Error redeeming code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset State & Close Modal
  const handleClose = () => {
    setQuestion(null);
    setUserAnswer("");
    setCorrectAnswer(null);
    setShowCodeInput(false);
    setCode("");
    setMessage("");
    setIsSuccess(false);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-indigo-900">Submit Code</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Initial State - Get Question Button */}
          {!question && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Answer a question correctly to submit your code
              </p>
              <button
                onClick={fetchQuestion}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                disabled={isLoading}
              >
                Get Question
              </button>
            </div>
          )}

          {/* Question & Answer Section */}
          {question && !showCodeInput && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <p className="text-lg font-medium text-indigo-900 bg-indigo-50 p-3 rounded-lg">
                  {question}
                </p>
              </div>
              
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Answer
                </label>
                <input
                  type="text"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your answer"
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                />
              </div>

              <button
                onClick={checkAnswer}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                disabled={isLoading}
              >
                Submit Answer
              </button>
            </div>
          )}

          {/* Code Input Section */}
          {showCodeInput && (
            <div className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your code
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your code here"
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmitCode()}
                />
              </div>

              <button
                onClick={handleSubmitCode}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Code'
                )}
              </button>
            </div>
          )}

          {/* Message Display with improved styling and animation */}
          {message && (
            <div 
              className={`mt-4 p-3 rounded-lg flex items-start space-x-2 transition-opacity duration-300 ${
                fadeIn ? 'opacity-100' : 'opacity-0'
              } ${
                isSuccess 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitCode;