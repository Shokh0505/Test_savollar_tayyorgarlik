import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { questions } from "./data";
import "./App.css";

function App() {
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [hasAlreadySelected, setHasAlreadySelected] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");

    const fireConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 100,
            startVelocity: 50,
            origin: { y: 0.6 },
        });
    };

    const shuffle = (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedAnswer(value);

        const correct = questions[selectedQuestionIndex].correctAnswer;
        if (value === correct) {
            fireConfetti();
            setHasAlreadySelected(true);
        }
    };

    const handleNext = () => {
        const length = questions.length;
        if (length === 0) return;

        const index = Math.floor(Math.random() * length);
        const options = shuffle(questions[index].options);

        setSelectedQuestionIndex(index);
        setShuffledOptions(options);
        setHasAlreadySelected(false);
        setSelectedAnswer("");
    };

    useEffect(() => {
        const firstOptions = shuffle(questions[0].options);
        setShuffledOptions(firstOptions);
    }, []);

    return (
        <>
            <div className="flex items-center justify-center mt-8">
                <h1 className="font-medium md:text-3xl text-2xl">
                    Dasturlash savollar ATT-24
                </h1>
            </div>

            <div className="mt-16 text-xl flex items-center lg:px-[25vw] md:px-16 px-8 font-normal">
                <div>
                    {questions[selectedQuestionIndex].id}.{" "}
                    {questions[selectedQuestionIndex].question}
                </div>
            </div>

            <div className="flex flex-col lg:px-[27vw] md:px-16 px-8 mt-4">
                {shuffledOptions.map((option, indx) => (
                    <div
                        className="mt-4 flex items-center justify-start"
                        key={indx}
                    >
                        <input
                            type="radio"
                            name="btn1"
                            id={`btn-${indx}`}
                            checked={selectedAnswer === option}
                            disabled={hasAlreadySelected}
                            value={option}
                            onChange={handleChange}
                            className="w-5 h-5"
                        />
                        <label htmlFor={`btn-${indx}`} className="ml-4 text-xl">
                            {option}
                        </label>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex items-center justify-end md:px-16 lg:mr-[25vw]">
                {hasAlreadySelected && (
                    <button
                        type="button"
                        className="cursor-pointer text-md focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-md px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        onClick={handleNext}
                    >
                        Keyingisi
                    </button>
                )}
            </div>
        </>
    );
}

export default App;
