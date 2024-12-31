"use server";

import { cookies, headers } from "next/headers";
import { Locale, locales } from "@/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale(): Promise<Locale> {
  // Await the headers promise
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") || "";
  const systemLanguage = acceptLanguage.split(",")[0].split("-")[0];
  // Fallback to a valid locale or default to 'en'
  const resolvedLocale = locales.includes(systemLanguage as Locale)
    ? (systemLanguage as Locale)
    : "en";

  const cookieStore = await cookies();
  return (cookieStore.get(COOKIE_NAME)?.value as Locale) || resolvedLocale;
}

export async function setUserLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
}
