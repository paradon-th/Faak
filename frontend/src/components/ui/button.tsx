import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-lg hover:shadow-xl",
  {
    variants: {
      variant: {
        default: "bg-blue-600/90 text-white hover:bg-blue-600 backdrop-blur-md",
        destructive:
          "bg-red-500/90 text-white hover:bg-red-500 backdrop-blur-md",
        outline:
          "border border-white/50 dark:border-white/20 bg-white/30 dark:bg-black/30 hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-xl text-slate-900 dark:text-slate-100",
        secondary:
          "bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-md",
        ghost: "hover:bg-white/30 dark:hover:bg-black/30 shadow-none hover:shadow-md backdrop-blur-md",
        link: "text-blue-600 underline-offset-4 hover:underline shadow-none hover:shadow-none",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-xl px-4",
        lg: "h-12 rounded-2xl px-8 text-lg",
        icon: "h-11 w-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
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
