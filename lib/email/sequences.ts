/**
 * Email Sequences — Automated drip campaigns
 *
 * Sequences:
 * 1. Welcome (5 emails / 7 days): Day 1, 2, 4, 6, 7
 * 2. Trial ending (3 emails): Day 5, 6, 7 of trial
 * 3. Re-engagement (3 emails): Day 7, 14, 21 after last login
 *
 * Each sequence checks if the email was already sent (via email_logs table)
 * before sending, preventing duplicates.
 */

import {
  welcomeSequenceEmail,
  trialEndingEmail,
  reEngagementEmail,
  paymentSuccessEmail,
} from "./templates/index";

export interface SequenceEmail {
  userId: string;
  email: string;
  name: string;
  sequenceType: "welcome" | "trial_ending" | "re_engagement";
  day: number;
  template: { subject: string; html: string } | null;
}

/**
 * Determine which emails should be sent today for a given user
 */
export function getScheduledEmails(user: {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLoginAt: string | null;
  plan: string;
  trialEndsAt: string | null;
  emailsSent: string[]; // array of "sequenceType:day" already sent
}): SequenceEmail[] {
  const emails: SequenceEmail[] = [];
  const now = new Date();

  // Calculate days since signup
  const signupDate = new Date(user.createdAt);
  const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate days since last login
  const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : signupDate;
  const daysSinceLastLogin = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

  // 1. Welcome sequence (days 1, 2, 4, 6)
  if (user.plan === "free" && daysSinceSignup <= 7) {
    const welcomeDays = [1, 2, 4, 6];
    for (const day of welcomeDays) {
      if (daysSinceSignup === day && !user.emailsSent.includes(`welcome:${day}`)) {
        const template = welcomeSequenceEmail(user.name, day);
        if (template) {
          emails.push({
            userId: user.id,
            email: user.email,
            name: user.name,
            sequenceType: "welcome",
            day,
            template,
          });
        }
      }
    }
  }

  // 2. Trial ending sequence (3 days before, 1 day before, day of)
  if (user.plan === "free" && user.trialEndsAt) {
    const trialEnd = new Date(user.trialEndsAt);
    const daysUntilTrialEnd = Math.floor((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const trialDays = [3, 1, 0];
    for (const daysLeft of trialDays) {
      if (daysUntilTrialEnd === daysLeft && !user.emailsSent.includes(`trial_ending:${daysLeft}`)) {
        emails.push({
          userId: user.id,
          email: user.email,
          name: user.name,
          sequenceType: "trial_ending",
          day: daysLeft,
          template: trialEndingEmail(user.name, daysLeft),
        });
      }
    }
  }

  // 3. Re-engagement (7, 14, 21 days since last login)
  if (daysSinceLastLogin >= 7 && user.plan !== "agency") {
    const reEngageDays = [7, 14, 21];
    for (const day of reEngageDays) {
      if (daysSinceLastLogin === day && !user.emailsSent.includes(`re_engagement:${day}`)) {
        emails.push({
          userId: user.id,
          email: user.email,
          name: user.name,
          sequenceType: "re_engagement",
          day,
          template: reEngagementEmail(user.name, day),
        });
      }
    }
  }

  return emails;
}

export { paymentSuccessEmail, welcomeSequenceEmail, trialEndingEmail, reEngagementEmail };
