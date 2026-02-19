import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["uk", "en", "cn", "pl", "es"],
  defaultLocale: "uk",
})