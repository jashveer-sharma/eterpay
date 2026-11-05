import { redirect } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col">
      {children}
    </div>
  );
}
