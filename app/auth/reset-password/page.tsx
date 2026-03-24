import type { Metadata } from "next";
import { AuthResetPasswordPageClient } from "@/components/auth-reset-password-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildAuthResetPasswordPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildAuthResetPasswordPageMetadata(locale as SupportedLocale);
}

export default function ResetPasswordPage() {
  return <AuthResetPasswordPageClient />;
}
