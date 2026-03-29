import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { PoweredByAura } from "@/components/PoweredByAura";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-card flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Dasbor Manajemen Service HP</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
          <footer className="px-6 py-3 border-t bg-card/60">
            <PoweredByAura />
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
