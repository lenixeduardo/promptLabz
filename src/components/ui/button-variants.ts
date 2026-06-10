import { cva } from "class-variance-authority"

export const buttonVariants = cva(
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
