import { ShoppingCart, Truck, CheckCircle } from "lucide-react"

interface CheckoutStepperProps {
  activeStep: 1 | 2 | 3
}

const steps = [
  { icon: ShoppingCart, label: "Panier" },
  { icon: Truck, label: "Livraison" },
  { icon: CheckCircle, label: "Confirmation" },
]

export function CheckoutStepper({ activeStep }: CheckoutStepperProps) {
  return (
    <div className="relative py-2 px-4">
      {/* Background connector line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 rounded-full z-0" />

      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3
          const isCompleted = stepNumber < activeStep
          const isActive = stepNumber === activeStep
          const Icon = step.icon

          return (
            <div key={step.label} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-background ${
                  isCompleted || isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border-2 border-border text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs font-medium ${
                  isCompleted || isActive ? "font-bold text-primary" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
