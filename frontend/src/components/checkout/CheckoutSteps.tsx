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
      <ol className="flex items-center justify-between w-full max-w-4xl mx-auto">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="flex items-center flex-1">
            <div className="flex items-center w-full">
              {/* Step Container */}
              <div className="flex items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-300 shadow-sm",
                    step.id < currentStep
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-600 text-white shadow-blue-200 dark:shadow-blue-900/20"
                      : step.id === currentStep
                      ? "border-blue-600 text-blue-600 bg-white dark:bg-gray-800 shadow-lg"
                      : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800"
                  )}
                >
                  {step.id < currentStep ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                </div>
                
                {/* Step Text */}
                <div className="ml-4 min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-semibold transition-colors duration-200",
                      step.id <= currentStep 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {step.name}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-1 transition-colors duration-200",
                      step.id <= currentStep 
                        ? "text-gray-600 dark:text-gray-400" 
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {stepIdx < steps.length - 1 && (
                <div className="flex-1 flex items-center px-4">
                  <div
                    className={cn(
                      "flex-1 h-1 rounded-full transition-colors duration-300",
                      step.id < currentStep 
                        ? "bg-gradient-to-r from-blue-600 to-blue-700" 
                        : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}