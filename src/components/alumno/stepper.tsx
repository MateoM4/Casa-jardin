import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
/* 
interface Step {
  title: string;
  //description: string;
} */

interface StepperProps {
  steps: string[]; 
  currentStep: number;
  className?: string;
//simple?: boolean;
}

export function Stepper({ steps, currentStep, className = ''  /* simple = false, */ }: StepperProps) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        {steps.map((_, idx) => (
          <React.Fragment key={idx}>
            <div className="flex-shrink-0">
              {currentStep > idx + 1 ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : currentStep === idx + 1 ? (
                <Circle className="w-6 h-6 text-blue-500 fill-current" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>
            {idx < steps.length - 1 && (
              <div className="w-8 h-[2px] bg-gray-200">
                <div 
                  className="bg-green-500 h-full transition-all duration-500"
                  style={{ 
                    transform: `scaleX(${currentStep > idx + 1 ? 1 : 0})`,
                    transformOrigin: 'left'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );

  //es una version más completa, pero no se usa actualmente
  
  /* return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      {steps.map((step, idx) => (
        <div key={idx} className="relative">
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex-shrink-0 mt-1">
              {currentStep > idx + 1 ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : currentStep === idx + 1 ? (
                <Circle className="w-6 h-6 text-blue-500 fill-current" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <div className={`flex-grow pb-8 ${idx === steps.length - 1 ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-medium ${
                  currentStep === idx + 1 ? 'text-blue-600' :
                  currentStep > idx + 1 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </h3>
                {currentStep === idx + 1 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Current
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          </div>
          
          {idx < steps.length - 1 && (
            <div className="absolute left-3 top-8 bottom-0 w-[2px] bg-gray-200">
              <div 
                className="bg-green-500 h-full transition-all duration-500"
                style={{ 
                  transform: `scaleY(${currentStep > idx + 1 ? 1 : 0})`,
                  transformOrigin: 'top'
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  ); */
}