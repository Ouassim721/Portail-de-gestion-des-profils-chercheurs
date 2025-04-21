import React from "react";

const steps = [
  { label: "Step 1: Starting" },
  { label: "Step 2: Processing" },
  { label: "Step 3: Analyzing" },
];

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="h-full w-full py-16">
      <div className="container mx-auto">
        <div className="w-11/12 lg:w-2/6 mx-auto">
          <div className="bg-gray-200 h-1 flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;

              return (
                <div
                  key={index}
                  className={`w-1/3 flex items-center ${
                    index !== steps.length - 1
                      ? "justify-between"
                      : "justify-end"
                  } ${isCompleted || isActive ? "bg-indigo-700 h-1" : "h-1"}`}
                >
                  {/* Tooltip for active step */}
                  {isActive && (
                    <div className="absolute right-0 -mr-2">
                      <div className="relative bg-white shadow-lg px-2 py-1 rounded mt-16 -mr-12">
                        <svg
                          className="absolute top-0 -mt-1 w-full right-0 left-0"
                          width="16px"
                          height="8px"
                          viewBox="0 0 16 8"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polygon
                            points="20 0 28 8 12 8"
                            fill="#FFFFFF"
                          ></polygon>
                        </svg>
                        <p className="text-indigo-700 text-xs font-bold">
                          {step.label}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Completed step circle */}
                  {isCompleted && (
                    <div className="bg-indigo-700 h-6 w-6 rounded-full shadow flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-check"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#FFFFFF"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                    </div>
                  )}

                  {/* Active step dual circle */}
                  {isActive && (
                    <>
                      <div className="bg-indigo-700 h-6 w-6 rounded-full shadow flex items-center justify-center -ml-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-check"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#FFFFFF"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <path d="M5 12l5 5l10 -10" />
                        </svg>
                      </div>
                      <div className="bg-white h-6 w-6 rounded-full shadow flex items-center justify-center -mr-3 relative">
                        <div className="h-3 w-3 bg-indigo-700 rounded-full"></div>
                      </div>
                    </>
                  )}

                  {/* Future step circle */}
                  {!isCompleted && !isActive && (
                    <div className="bg-white h-6 w-6 rounded-full shadow"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
