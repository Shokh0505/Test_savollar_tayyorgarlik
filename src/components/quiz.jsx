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
    const [videoSourceURL, setVideoSourceURL] = useState(null);
    const [nextVideoURL, setNextVideoURL] = useState(null);

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

    const handleClick = async (e) => {
        if (ustidanKulish) return;
        const value = e.currentTarget.dataset.option;
        setHasSelectedOption(true);
        setSelectedOption(value);

        if (value === correctAnswer) {
            for (let i = 0; i < 3; i++) fireConfetti();
            setShowNextButton(true);
        } else {
            setFoundWrong(true);
            setUstidanKulish(true);
            setVideoSourceURL(nextVideoURL);

            setNextVideoURL(null);
            setTimeout(async () => {
                setUstidanKulish(false);
                const url = await fetchRandomVideo();
                setNextVideoURL(url);
            }, 1000);
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

    const handleVideoEnded = async () => {
        setUstidanKulish(false);
        const url = await fetchRandomVideo();
        setNextVideoURL(url);
    };

    useEffect(() => {
        const firstOptions = shuffle(questions[questionNumberIndex].options);
        fetchRandomVideo();
        setShuffledOptions(firstOptions);
    }, []);

    const fetchRandomVideo = async () => {
        const baseURL = window.location.origin;
        const randomVideo = Math.floor(Math.random() * VIDEO_NUMBER) + 1;
        console.log("i am fetching a video");
        try {
            const res = await fetch(`${baseURL}/${randomVideo}.webm`, {
                cache: "force-cache",
            });
            const blob = await res.blob();
            return URL.createObjectURL(blob);
        } catch (err) {
            console.error("Video fetch failed:", err);
            return null;
        }
    };

    useEffect(() => {
        fetchRandomVideo().then(setNextVideoURL);
    }, []);

    // clean up function for url
    useEffect(() => {
        return () => {
            if (videoSourceURL) {
                URL.revokeObjectURL(videoSourceURL);
            }
        };
    }, []);

    return (
        <>
            <section
                className={`px-8 main_section_gradient overflow-y-auto pb-8 ${
                    showNextButton ? "h-[90vh]" : "h-[100vh]"
                }`}
            >
                <Loadbar percentage={percentage} />

                {/* Question bar */}
                <div className="flex flex-col items-start rounded-lg mt-8 red_gradient min-h-[12rem] pb-2 text-white px-4 overflow-y-auto relative">
                    {ustidanKulish ? (
                        <div className="flex items-center justify-center pt-4 h-[16rem] w-full">
                            <video
                                key={videoSourceURL}
                                autoPlay
                                muted
                                className="h-full"
                                onEnded={handleVideoEnded}
                            >
                                <source
                                    src={videoSourceURL}
                                    type="video/webm"
                                />
                            </video>
                        </div>
                    ) : (
                        <>
                            <div className="mt-4 font-medium text-start w-full">
                                Matematika.
                            </div>
                            <div className="font-semibold text-2xl mt-8">
                                {questions[questionNumberIndex].id}.{" "}
                                {questions[questionNumberIndex].question}
                            </div>
                        </>
                    )}
                </div>

                {/* Options */}
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

            {/* Button for next */}
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
