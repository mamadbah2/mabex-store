import { CheckCircle, Clock, Package } from "lucide-react"
import type { OrderStatus } from "@/lib/types"

interface OrderTimelineProps {
  currentStatus: OrderStatus
  createdAt: Date
}

export function OrderTimeline({ currentStatus, createdAt }: OrderTimelineProps) {
  const steps = [
    { key: "pending", label: "Commande reçue", icon: Clock },
    { key: "preparing", label: "En préparation", icon: Package },
    { key: "confirmed", label: "Confirmée", icon: CheckCircle },
  ]

  const getStepStatus = (stepKey: string) => {
    const statusOrder = ["pending", "preparing", "confirmed"]
    const currentIndex = statusOrder.indexOf(currentStatus)
    const stepIndex = statusOrder.indexOf(stepKey)

    if (stepIndex <= currentIndex) {
      return "completed"
    } else {
      return "pending"
    }
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const status = getStepStatus(step.key)
        const Icon = step.icon
        const isLast = index === steps.length - 1

        return (
          <div key={step.key} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  status === "completed"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              {!isLast && <div className={`w-0.5 h-8 mt-2 ${status === "completed" ? "bg-primary" : "bg-muted"}`} />}
            </div>

            <div className="flex-1 pb-8">
              <p
                className={`font-medium ${
                  status === "completed"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
              {step.key === "pending" && (
                <p className="text-sm text-muted-foreground">
                  {createdAt.toLocaleDateString("fr-FR")} à {createdAt.toLocaleTimeString("fr-FR")}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
