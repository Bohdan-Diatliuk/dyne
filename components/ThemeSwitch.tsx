"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const themes = ["dark", "theme-ocean", "theme-sunset"] as const
type Theme = typeof themes[number]

const themeLabels: Record<Theme, string> = {
  "dark": "Dark",
  "theme-ocean": "Ocean",
  "theme-sunset": "Sunset",
}

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) ?? "dark"
    document.documentElement.classList.add(saved)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved)
  }, [])

  const switchTheme = (next: Theme) => {
    document.documentElement.classList.remove(...themes)
    document.documentElement.classList.add(next)
    localStorage.setItem("theme", next)
    setTheme(next)
  }

  return (
    <Select value={theme} onValueChange={(val) => switchTheme(val as Theme)}>
      <SelectTrigger className="w-36 bg-background text-foreground">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="bg-background text-foreground">
        {themes.map((t) => (
          <SelectItem key={t} value={t}>
            {themeLabels[t]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}