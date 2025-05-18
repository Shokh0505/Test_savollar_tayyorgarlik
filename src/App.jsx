import { Route, Routes } from "react-router-dom";
import { Quiz } from "./components/quiz";
import { Welcome } from "./components/welcome";
import { FinishedOnce } from "./components/finishedOnce";
import "./App.css";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/finished" element={<FinishedOnce />} />
            </Routes>
        </>
    );
}

export default App;
