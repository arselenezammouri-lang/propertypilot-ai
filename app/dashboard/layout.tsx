import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardClientWrapper } from "@/components/dashboard-client-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardClientWrapper>
        <main id="main-content" className="relative pt-20 pb-16" role="main">
          {children}
        </main>
      </DashboardClientWrapper>
    </div>
  );
}
