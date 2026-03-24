import type { Metadata } from "next";
import { AuthLoginPageClient } from "@/components/auth-login-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildAuthLoginPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildAuthLoginPageMetadata(locale as SupportedLocale);
}

export default function LoginPage() {
  return <AuthLoginPageClient />;
}
