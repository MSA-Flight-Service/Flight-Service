import React from 'react';
import './StepProgressBar.css';

function StepProgressBar({ steps, currentStep }) {
    return (
        <div className="step-text-progress-bar">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="step-item">
                        <img
                            src={step.icon}
                            alt={step.label}
                            className={`step-icon ${index <= currentStep ? 'active' : ''}`}
                        />
                        <span className={`step-text ${index <= currentStep ? 'active' : ''}`}>
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <span
                            className={`step-separator ${index < currentStep ? 'active' : ''}`}
                        >
                            ========
                        </span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
export default StepProgressBar;
