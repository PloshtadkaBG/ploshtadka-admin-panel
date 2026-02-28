"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

interface ModeToggleProps {
  variant?: "outline" | "ghost" | "default"
}

export function ModeToggle({ variant = "outline" }: ModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    if (theme === "dark") {
      setIsDark(true)
    } else if (theme === "light") {
      setIsDark(false)
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [theme])

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="cursor-pointer"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Switch to {isDark ? "light" : "dark"} mode</span>
    </Button>
  )
}
