import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, getFirestore, query, where, getDocs } from 'firebase/firestore';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import UpArrow from '../../assets/up.svg';
import DownArrow from '../../assets/down.svg';
import Tick from '../../assets/tick.svg';
import FormImage from '../../../public/assets/login-bg2.webp';

import './OnboardingQuestions.css';

const OnboardingQuestions = () => {
    const [questions] = useState([
        {
            id: 1,
            question: "What are your primary financial goals?",
            options: ["Savings and Budgeting", "Investing for Income", "Investing for Growth", "Retirement Plan", "Education Funding", "Debt Reduction"],
            type: "choice"
        },
        {
            id: 2,
            question: "How do you describe your investment experience?",
            options: ["Beginner: I am New to investing", "Intermediate: I have some experience and understanding of investment", "Advanced: I am exerienced with a solid understanding of various investment strategies"],
            type: "dropdown"
        },
        {
            id: 3,
            question: "Which statement best describes your risk tolerance?",
            options: ["Low: I prefer to avoid looses and am okay with lower returns.", "Medium: I'm willing to take moderate risks for potential higher returns.", "High: I'm willing to take significant risks for the possibility of higher returns."],
            type: "choice"
        },
        {
            id: 4,
            question: "What is your annual income range?",
            options: ["Under $25000", "$25,000 to $50,000", "$50,000 to $75,000", "$75,000 to $100,000", "Over $100,000"],
            type: "dropdown"
        },
        {
            id: 5,
            question: "Age Range",
            options: ["Under 18", "18-24", "24-35", "35-44", "45-54", "55-64", "65+"],
            type: "choice"
        },
        {
            id: 6,
            question: "Gender",
            options: ["Male", "Female", "Prefer not to say"],
            type: "choice"
        },
        {
            id: 7,
            question: "What is the highest level of education you have completed?",
            options: ["Some high school", "High School Graduate", "Some College", "Bachelor's Degree", "Graduate Degree"],
            type: "dropdown"
        },
        {
            id: 8,
            question: "What is your current employment status?",
            options: ["Employed Full-time", "Employed Part-time", "Self-Employed", "Unemployed", "Student", "Retired"],
            type: "choice"
        },
        {
            id: 9,
            question: "If Known, What is your credit score range?",
            options: ["Below 580 (Poor)", "580-669 (Fair)", "670-739 (Good)", "740-799 (Very Good)", "800+ (Excellent)", "Prefer not to say"],
            type: "dropdown"
        },
        {
            id: 10,
            question: "Approximately How much capital are you willing to invest?",
            options: ["less than $1,000", "$1,000 to $5,000", "$5,001 to $10,000", "$10,001 to $50,000", "More than $50,000"],
            type: "dropdown"
        },
        {
            id: 11,
            question: "Which part of US/State do you reside in?",
            options: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
            type: "dropdown"
        }
    ]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(Array.from({ length: questions.length }, () => ""));
    const [error, setError] = useState<string | null>(null);
    const [isLoader, setIsLoader] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);
    const navigate = useNavigate();

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const storedUserData = JSON.parse(localStorage.getItem('usrAcsData') || '{}');
    const { email } = storedUserData;

    const handleAnswerSelect = (answer: any) => {
        setSelectedAnswers(prevState => {
            const updatedAnswers = [...prevState];
            updatedAnswers[currentQuestionIndex] = answer;
            return updatedAnswers;
        });
        setSelectedOption(answer);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            if (selectedAnswers[currentQuestionIndex] !== "") {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                setError(null);
                setFadeOut(true);

                setTimeout(()=> {
                    setFadeOut(false);
                }, 1000)
            } else {
                setError("Please select an answer before proceeding.");
            }
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleFinalSubmit = () => {
        // Check if answer is selected for the last question before submitting
        if (selectedAnswers[currentQuestionIndex] !== "") {
            sendToFirestore();
        } else {
            setError("Please select an answer before submitting.");
        }
    };

    const sendToFirestore = async () => {
        setIsLoader(true);
        try {
            const db = getFirestore();
            const onboardingQuestionsCollection = collection(db, 'onboardingQuestions');
            const q = query(onboardingQuestionsCollection, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(onboardingQuestionsCollection, {
                    question: questions.map((q, index) => ({ ...q, answer: selectedAnswers[index] })),
                    email: email,
                    timestamp: serverTimestamp()
                });
                setIsLoader(false);
                navigate('/Home')
            } else {
                console.log("User already exists in Firestore.");
            }
        } catch (error) {
            setIsLoader(false);
            console.error("Error adding document: ", error);
        }
    };

    return (
        <>
            <Header isMenu={false} />
            {isLoader && <Loader />}
            {currentQuestion && (
                <div className='question-container'>
                    <div className='question-side'>
                        <h3>{currentQuestion?.id}. {currentQuestion?.question}</h3>
                        {currentQuestion.type === "choice" ? (
                            <div className={`answer-options ${fadeOut ? 'fade-out' : ''}`}>
                                {currentQuestion.options.map((option, index) => (
                                    <button className='form-control' key={index} onClick={() => handleAnswerSelect(option)}>
                                        {option}
                                        {selectedOption === option && <img src={Tick} alt="Tick" />}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className={`answer-options ${fadeOut ? 'fade-out' : ''}`}>
                                <select className='form-control' onChange={(e) => handleAnswerSelect(e.target.value)} required>
                                    {currentQuestion.options.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {error && <p className="errorMessage">{error}</p>}
                        <div className='form-controls-top'>
                            {currentQuestionIndex === 4 && (
                                <button onClick={handleFinalSubmit}>Skip and Submit</button>
                            )}
                            {isLastQuestion && (
                                <button onClick={handleFinalSubmit}>Submit</button>
                            )}
                            {!isLastQuestion && (
                                <button onClick={handleNextQuestion}>Next</button>
                            )}
                        </div>
                        <div className='form-controls'>
                            <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                                <img src={UpArrow} alt="Previous" />
                            </button>
                            <button onClick={handleNextQuestion} disabled={isLastQuestion}>
                                <img src={DownArrow} alt="Next" />
                            </button>
                        </div>
                    </div>
                    <div className='visual-side'>
                        <img src={FormImage} alt="Form" />
                    </div>
                </div>
            )}

        </>
    );
};

export default OnboardingQuestions;
