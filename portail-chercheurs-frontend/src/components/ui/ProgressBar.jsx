import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";
import { LanguageContext } from "../../contexts/LanguageContext";

const stepIds = ["step1", "step2", "step3"];

const ProgressBar = ({ currentStep }) => {
  const { t } = useContext(LanguageContext);

  const steps = stepIds.map((id) => ({
    id,
    title: t(id),
    icon: <CheckIcon className="w-4 h-4" />,
  }));

  return (
    <div className="w-full px-4 pt-6 sm:px-8">
      <div className="relative flex justify-between items-start">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-100 -z-10" />

        <motion.div
          className="absolute top-4 left-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 -z-10"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center text-center w-1/3">
              <motion.div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors duration-300 ${
                  isCompleted
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : isActive
                    ? "border-indigo-600 bg-white text-indigo-600 shadow-md"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      {step.icon}
                    </motion.div>
                  ) : (
                    <motion.span key="number" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      {index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                className={`mt-3 max-w-[120px] text-xs sm:text-sm font-medium ${
                  isActive
                    ? "text-indigo-600 font-semibold"
                    : isCompleted
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {step.title}
                {isActive && (
                  <motion.div
                    className="h-1 w-6 bg-indigo-600 rounded-full mt-1 mx-auto"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4 }}
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {steps[currentStep] && (
          <motion.div className="mt-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              {t("stepLabel")
                .replace("{current}", currentStep + 1)
                .replace("{total}", steps.length)}
            </span>
            <h3 className="mt-4 text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">
              {steps[currentStep].title}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressBar;
