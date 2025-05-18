import React from "react";

export const Loadbar = ({ percentage }) => {
    return (
        <div className="flex items-center justify-between pt-6">
            <div className="bg-gray-400 flex-6/8 sm:flex-10/12 h-6 rounded-lg relative">
                <div
                    className={`h-6 rounded-lg green_gradient`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="flex-2/8 sm:flex-2/12 text-end text-xl font-semibold">
                {percentage}%
            </div>
        </div>
    );
};
