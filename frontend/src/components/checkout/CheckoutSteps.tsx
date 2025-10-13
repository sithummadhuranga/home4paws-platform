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
                      ? "bg-gradient-to-br from-purple-600 to-purple-700 border-purple-600 text-white shadow-purple-200 dark:shadow-purple-900/20"
                      : step.id === currentStep
                      ? "border-purple-600 text-purple-600 bg-neutral-900 dark:bg-neutral-800 shadow-lg border-purple-400/40"
                      : "border-purple-400/30 text-purple-400/60 bg-neutral-900 dark:bg-neutral-800"
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
                      "text-sm font-semibold transition-colors duration-200 font-urbanist",
                      step.id <= currentStep 
                        ? "text-purple-200" 
                        : "text-purple-400/60"
                    )}
                  >
                    {step.name}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-1 transition-colors duration-200 font-inter",
                      step.id <= currentStep 
                        ? "text-purple-300" 
                        : "text-purple-400/60"
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
                        ? "bg-gradient-to-r from-purple-600 to-purple-700" 
                        : "bg-purple-400/20"
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