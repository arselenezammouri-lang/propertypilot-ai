import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardClientWrapper } from "@/components/dashboard-client-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />
      <DashboardClientWrapper>
        <main id="main-content" className="relative pt-16 lg:ml-60 min-h-screen" role="main">
          {children}
        </main>
      </DashboardClientWrapper>
    </div>
  );
}
