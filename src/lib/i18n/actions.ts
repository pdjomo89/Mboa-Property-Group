"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { locales, type Locale } from "./dictionaries";
import { LOCALE_COOKIE } from "./server";

export async function setLocale(locale: Locale) {
  if (!(locales as readonly string[]).includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
