import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface CheckoutStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function CheckoutSteps({ steps, currentStep, className }: CheckoutStepsProps) {
  return (
    <nav className={cn("", className)}>
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="flex items-center flex-1">
            <div className="flex items-center w-full">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    step.id < currentStep
                      ? "bg-blue-600 border-blue-600 text-white"
                      : step.id === currentStep
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-gray-300 text-gray-400 bg-white"
                  )}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                
                {/* Step Text */}
                <div className="ml-3 min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.id <= currentStep ? "text-gray-900" : "text-gray-400"
                    )}
                  >
                    {step.name}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      step.id <= currentStep ? "text-gray-600" : "text-gray-400"
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {stepIdx < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4",
                    step.id < currentStep ? "bg-blue-600" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}