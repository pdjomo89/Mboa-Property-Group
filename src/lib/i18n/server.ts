import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale, getDictionary } from "./dictionaries";

export const LOCALE_COOKIE = "mboa-locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return (locales as readonly string[]).includes(value ?? "")
    ? (value as Locale)
    : defaultLocale;
}

export async function getDict() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
