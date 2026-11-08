import AppSidebar from "@/components/layout/AppSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fbf9f5] w-full max-w-full overflow-x-hidden">
      <AppSidebar />
      <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden pt-14 lg:pt-0 pb-20 lg:pb-0">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
