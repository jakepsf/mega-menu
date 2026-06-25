"use client";
import { FolderOpen, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <>
      <header className="mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome Back, Admin</h2>
        <p className="text-slate-500 text-sm md:text-base">Manage your portfolio and sites.</p>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
        <Link href="/admin/works" className='w-full'>
        <button className="group relative bg-white p-6 w-full md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all text-left">
          <div className="bg-[#B0B4A8]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-[#B0B4A8] group-hover:bg-[#B0B4A8] group-hover:text-white transition-all">
            <FolderOpen size={24} />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-800">Manage Works</h3>
          <p className="text-slate-500 mb-4 text-xs md:text-sm">Upload new images/videos for work portfolio.</p>
          <div className="flex items-center gap-2 text-black font-semibold group-hover:gap-4 transition-all">
            Go to Works <span className="text-lg">→</span>
          </div>
        </button>
        </Link>

        <Link href="/admin/sites" className='w-full'>
          <button className="group relative w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all text-left">
            <div className="bg-[#C9ADA2]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-[#C9ADA2] group-hover:bg-[#C9ADA2] group-hover:text-white transition-all">
              <Globe size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800">Manage Sites</h3>
            <p className="text-slate-500 mb-4 text-xs md:text-sm">Update links, tags, and badges for websites.</p>
            <div className="flex items-center gap-2 text-black font-semibold group-hover:gap-4 transition-all">
              Go to Sites <span className="text-lg">→</span>
            </div>
          </button>
        </Link>
      </div>
    </>
  );
}