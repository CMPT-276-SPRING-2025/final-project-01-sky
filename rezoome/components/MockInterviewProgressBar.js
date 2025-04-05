// component for progress bar in mock interview pages
import React from 'react';

const MockInterviewProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Upload Resume' },
    { number: 2, label: 'Add Job' },
    { number: 3, label: 'Interview' },
    { number: 4, label: 'View Feedback' }
  ];

  return (
    <div className="flex justify-center items-center w-full max-w-2xl mx-auto my-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step.number === currentStep
                  ? 'bg-[var(--second-button-colour)] text-white'
                  : step.number < currentStep
                    ? 'bg-[var(--secondary-colour)] text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.number}
            </div>
            {/* Step Label */}
            <span 
              className={`mt-2 text-sm ${
                step.number === currentStep 
                  ? 'text-[var(--second-button-colour)] font-medium' 
                  : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
          
          {/* Connector Line (except after last step) */}
          {index < steps.length - 1 && (
            <div 
              className={`flex-1 h-0.5 mx-3 ${
                index < currentStep - 1 
                  ? 'bg-[var(--secondary-colour)]' 
                  : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MockInterviewProgressBar;