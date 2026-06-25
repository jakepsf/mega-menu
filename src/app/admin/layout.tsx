"use client";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, FolderOpen, Globe, LogOut, Loader2, Menu, X } from 'lucide-react';
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Auth Guard Logic
  useEffect(() => {
    if (isUserLoading) return;
    
    // If no user and we aren't on the login page, boot them to /admin
    if (!user && pathname !== "/admin") {
      router.push("/");
    }
  }, [user, isUserLoading, pathname, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/admin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // 2. Loading State
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0F0F3]">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  // 3. Login Page Exception: If on /admin, don't show the sidebar/layout
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  // 4. Final Protection: If someone tries to deep-link to /dashboard without auth
  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#F0F0F3] font-opensans relative overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bagel text-[#919191]">Admin</h1>
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === '/admin/dashboard' ? 'bg-black text-white' : 'hover:bg-slate-100'}`}>
              <LayoutGrid size={20} />
              <span className="font-medium">Overview</span>
            </div>
          </Link>
          <Link href="/admin/works" onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname.includes('/admin/works') ? 'bg-black text-white' : 'hover:bg-slate-100'}`}>
              <FolderOpen size={20} />
              <span className="font-medium">Works</span>
            </div>
          </Link>
          <Link href="/admin/sites" onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname.includes('/admin/sites') ? 'bg-black text-white' : 'hover:bg-slate-100'}`}>
              <Globe size={20} />
              <span className="font-medium">Sites</span>
            </div>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header Toggle */}
        <header className="lg:hidden p-4 bg-white border-b border-slate-200 flex items-center">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-slate-800 uppercase tracking-widest text-xs">Menu</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}