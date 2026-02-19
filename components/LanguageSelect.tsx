"use client"

import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function LanguageSelect() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (next: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center justify-between">
      <Select value={locale} onValueChange={switchLocale}>
        <SelectTrigger className="w-45 bg-background">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="uk">Ukrainian</SelectItem>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="cn">Chinese</SelectItem>
          <SelectItem value="pl">Polski</SelectItem>
          <SelectItem value="es">Spain</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}