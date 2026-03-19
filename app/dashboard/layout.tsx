import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardClientWrapper } from "@/components/dashboard-client-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="diamond-silicon-elite min-h-screen bg-[#000000] text-white relative overflow-hidden">
      {/* Mesh gradient background - same as dashboard home */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9333ea]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#06b6d4]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9333ea]/10 rounded-full blur-3xl" />
      </div>
      <DashboardHeader />
      <DashboardClientWrapper>
        <main id="main-content" className="relative z-10 pt-24 pb-16" role="main">
          {children}
        </main>
      </DashboardClientWrapper>
    </div>
  );
}
