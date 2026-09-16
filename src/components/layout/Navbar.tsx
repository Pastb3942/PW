import React from 'react';
import {
  Wrench,
  QrCode,
  Mail,
  Home,
  PlusCircle,
  Clock,
  Layers,
  BarChart3,
  Bell
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenQrScanner: () => void;
  onOpenMailbox: () => void;
  unreadEmailCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenQrScanner,
  onOpenMailbox,
  unreadEmailCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              Facility Fix
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
                Campus
              </span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
              ระบบแจ้งซ่อมสิ่งอำนวยความสะดวก
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentView === 'home'
                ? 'bg-brand-50 text-brand-700 font-extrabold'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            หน้าแรก
          </button>
          <button
            onClick={() => onNavigate('submit')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentView === 'submit'
                ? 'bg-brand-50 text-brand-700 font-extrabold'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            แจ้งซ่อม (No-Login)
          </button>
          <button
            onClick={() => onNavigate('tech')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentView === 'tech'
                ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            คิวงานช่างเทคนิค
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentView === 'admin'
                ? 'bg-slate-900 text-white font-extrabold'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            สถิติผู้บริหาร
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* QR Scan Button */}
          <button
            onClick={onOpenQrScanner}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            title="สแกน QR Code ประจำห้อง"
          >
            <QrCode className="w-4 h-4 text-brand-600" />
            <span className="hidden sm:inline">สแกน QR</span>
          </button>

          {/* Virtual Mailbox Trigger (Real-time email inspector) */}
          <button
            onClick={onOpenMailbox}
            className="relative p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all flex items-center gap-1.5 text-xs font-bold"
            title="กล่องจดหมายจำลอง (Nodemailer / Resend)"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">จำลองอีเมล</span>
            {unreadEmailCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-bounce shadow-sm">
                {unreadEmailCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
