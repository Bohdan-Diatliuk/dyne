"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function LanguageSelect() {
  return (
    <div className="flex items-center justify-between">
      <Select defaultValue="ukr">
        <SelectTrigger className="w-45 bg-background">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>

        <SelectContent className="bg-background">
          <SelectItem value="ukr">Ukrainian</SelectItem>
          <SelectItem value="eng">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
