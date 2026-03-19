const FOUNDER_EMAIL = 'arselenezammouri@gmail.com';

export function isFounderEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === FOUNDER_EMAIL;
}

export function getFounderEmail(): string {
  return FOUNDER_EMAIL;
}
