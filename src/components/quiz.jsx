import confetti from "canvas-confetti";
import shuffle from "../../utils/shuffle";

import { questions } from "../data";
import { useEffect, useMemo, useState } from "react";
import { Loadbar } from "./loadbar";
import { useNavigate } from "react-router-dom";

const VIDEO_NUMBER = 17;

export const Quiz = () => {
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [showNextButton, setShowNextButton] = useState(false);
    const [questionNumberIndex, setQuestionNumberIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [hasSelectedOption, setHasSelectedOption] = useState(false);
    const [foundWrong, setFoundWrong] = useState(false);
    const [ustidanKulish, setUstidanKulish] = useState(false);
    const [videoNumber, setVideoNumber] = useState(1);

    const navigate = useNavigate();

    const numberQuestions = useMemo(() => {
        return questions.length;
    }, [questions]);

    const percentage = useMemo(() => {
        if (questionNumberIndex + 1 === numberQuestions) return 100;
        return Math.floor((questionNumberIndex / numberQuestions) * 100);
    }, [numberQuestions, questionNumberIndex]);

    const correctAnswer = useMemo(() => {
        if (questionNumberIndex === numberQuestions) return "";
        return questions[questionNumberIndex].correctAnswer;
    }, [numberQuestions, questionNumberIndex]);

    const fireConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 100,
            startVelocity: 50,
            origin: { y: 0.6 },
        });
    };

    const handleClick = (e) => {
        if (ustidanKulish) return;

        const value = e.currentTarget.dataset.option;
        setHasSelectedOption(true);
        setSelectedOption(value);
        if (value === correctAnswer) {
            for (let i = 0; i < 3; i++) {
                fireConfetti();
            }
            setShowNextButton(true);
        } else {
            const randomVideo = Math.floor(Math.random() * VIDEO_NUMBER) + 1;
            setVideoNumber(randomVideo);
            setUstidanKulish(true);
            setFoundWrong(true);
            setTimeout(() => {
                setUstidanKulish(false);
            }, 4000);
        }
    };

    const handleNext = () => {
        if (numberQuestions === 0 || ustidanKulish) return;

        const nextQuestionIndex = questionNumberIndex + 1;

        let options = [];
        if (!foundWrong) {
            options = shuffle(questions[nextQuestionIndex].options);
            setQuestionNumberIndex((prev) => prev + 1);
        } else {
            options = shuffle(questions[questionNumberIndex].options);
        }

        if (nextQuestionIndex >= numberQuestions) {
            navigate("/finished");
            return;
        }

        setFoundWrong(false);
        setShuffledOptions(options);
        setShowNextButton(false);
        setHasSelectedOption(false);
    };

    useEffect(() => {
        const firstOptions = shuffle(questions[questionNumberIndex].options);
        setShuffledOptions(firstOptions);
    }, []);

    return (
        <>
            <section
                className={`px-8 main_section_gradient overflow-y-auto ${
                    showNextButton ? "h-[90vh]" : "h-[100vh]"
                }`}
            >
                <Loadbar percentage={percentage} />
                <div className="flex flex-col items-start rounded-lg mt-8 red_gradient h-[12rem] text-white px-4 overflow-y-auto relative">
                    {ustidanKulish ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <video
                                autoPlay
                                muted
                                className="h-full"
                                onEnded={() => setUstidanKulish(false)}
                            >
                                <source
                                    src={`/${videoNumber}.webm`}
                                    type="video/webm"
                                />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <>
                            <div className="mt-4 font-medium text-start w-full">
                                Dasturlash.
                            </div>
                            <div className="font-semibold text-2xl mt-8">
                                {questions[questionNumberIndex].id}.{" "}
                                {questions[questionNumberIndex].question}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-col mt-4">
                    {shuffledOptions.map((option, indx) => (
                        <div
                            key={indx}
                            data-option={option}
                            onClick={handleClick}
                            className={`
                                mt-4 rounded-lg w-full text-xl p-4 cursor-pointer bg-white
                            ${
                                selectedOption === option && hasSelectedOption
                                    ? selectedOption === correctAnswer
                                        ? "green_gradient_correct"
                                        : "incorrect_gradient"
                                    : ""
                            }
                        `}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </section>
            {showNextButton && (
                <div className="h-[10vh] flex items-center justify-center footer_bg pb-4">
                    <button
                        className="px-6 py-4 red_gradient rounded-lg w-[80vw] cursor-pointer text-white font-semibold text-xl"
                        onClick={handleNext}
                    >
                        Keyingisi
                    </button>
                </div>
            )}
        </>
    );
};
