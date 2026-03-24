import type { Metadata } from "next";
import { AuthSignupPageClient } from "@/components/auth-signup-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildAuthSignupPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildAuthSignupPageMetadata(locale as SupportedLocale);
}

export default function SignupPage() {
  return <AuthSignupPageClient />;
}
