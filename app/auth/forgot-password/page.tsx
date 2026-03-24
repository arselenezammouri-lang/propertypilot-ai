import type { Metadata } from "next";
import { AuthForgotPasswordPageClient } from "@/components/auth-forgot-password-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildAuthForgotPasswordPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildAuthForgotPasswordPageMetadata(locale as SupportedLocale);
}

export default function ForgotPasswordPage() {
  return <AuthForgotPasswordPageClient />;
}
