import AppSidebar from "@/components/layout/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#fbf9f5]">
      <AppSidebar />
      <div className="flex-1 min-w-0 overflow-y-auto pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
