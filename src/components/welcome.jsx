import { useNavigate } from "react-router-dom";

export const Welcome = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/quiz");
    };
    return (
        <div className="h-[100vh] red_gradient flex items-center justify-center flex-col">
            <div className="font-bold text-4xl text-white text-center">
                Olayligu oldirmaylik, imtihondan yiqilmaylik!
            </div>
            <button
                className="px-6 py-2 rounded-lg text-2xl font-semibold text-white green_gradient cursor-pointer mt-10"
                onClick={handleClick}
            >
                Boshladik!
            </button>
        </div>
    );
};
