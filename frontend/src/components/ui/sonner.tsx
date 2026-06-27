"use client"

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/60 group-[.toaster]:dark:bg-black/60 group-[.toaster]:backdrop-blur-2xl group-[.toaster]:text-slate-900 group-[.toaster]:dark:text-slate-100 group-[.toaster]:border group-[.toaster]:border-white/50 group-[.toaster]:dark:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-slate-600 group-[.toast]:dark:text-slate-400",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:rounded-xl",
          cancelButton:
            "group-[.toast]:bg-slate-200 group-[.toast]:dark:bg-slate-800 group-[.toast]:text-slate-700 group-[.toast]:dark:text-slate-300 group-[.toast]:rounded-xl",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
