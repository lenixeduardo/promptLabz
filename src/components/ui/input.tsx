import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon rendered inside the pill */
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type = "text", ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-4 flex h-7 w-7 items-center justify-center text-primary">
            {icon}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "h-14 w-full rounded-full border border-[#BFE3CC] bg-white text-base text-foreground placeholder:text-[#8A998F] shadow-sm transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            icon ? "pl-14 pr-5" : "px-5",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
