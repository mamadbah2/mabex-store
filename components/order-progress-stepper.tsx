import type { OrderStatus } from "@/lib/types"
import { Clock, Settings, CheckCircle } from "lucide-react"

interface OrderProgressStepperProps {
  status: OrderStatus
}

const steps = [
  { label: "En attente", icon: Clock, key: "pending" },
  { label: "En préparation", icon: Settings, key: "preparing" },
  { label: "Confirmée", icon: CheckCircle, key: "confirmed" },
] as const

const statusIndex: Record<OrderStatus, number> = {
  pending: 0,
  preparing: 1,
  confirmed: 2,
}

export function OrderProgressStepper({ status }: OrderProgressStepperProps) {
  const currentIndex = statusIndex[status]

  return (
    <div className="relative mx-4 sm:mx-8">
      {/* Background bar */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
      {/* Progress bar */}
      <div
        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      />

      <div className="relative flex justify-between z-10">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isPast = index < currentIndex
          const isCurrent = index === currentIndex
          const isFuture = index > currentIndex

          return (
            <div key={step.key} className="flex flex-col items-center gap-2">
              <div
                className={`
                  flex items-center justify-center rounded-full ring-4 ring-card transition-all
                  ${isCurrent
                    ? "w-10 h-10 bg-primary text-white shadow-lg shadow-primary/30 -mt-1"
                    : isPast
                      ? "w-8 h-8 bg-primary text-white shadow-md"
                      : "w-8 h-8 bg-muted text-muted-foreground shadow-sm"
                  }
                `}
              >
                {isPast ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className={`${isCurrent ? "w-5 h-5" : "w-4 h-4"} ${isCurrent ? "animate-pulse" : ""}`} />
                )}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  isFuture
                    ? "font-medium text-muted-foreground"
                    : isCurrent
                      ? "font-bold text-primary"
                      : "font-semibold text-primary"
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
