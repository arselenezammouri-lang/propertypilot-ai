"use client";

import { PendingCheckoutBanner } from "./pending-checkout-banner";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  return (
    <>
      <PendingCheckoutBanner />
      {children}
    </>
  );
}
