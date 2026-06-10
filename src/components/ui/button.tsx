import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded-full text-white shadow-lg shadow-primary/30 bg-gradient-to-b from-[#3E8E5E] to-[#2E7048] hover:from-[#46996a] hover:to-[#327a52] active:translate-y-px",
        outline:
          "rounded-full border border-[#BFE3CC] bg-white text-primary hover:bg-[#F0FAF3]",
        ghost: "rounded-full text-primary hover:bg-[#E3F3E9]",
        social:
          "rounded-full border border-[#BFE3CC] bg-white shadow-sm hover:bg-[#F0FAF3]",
      },
      size: {
        default: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
