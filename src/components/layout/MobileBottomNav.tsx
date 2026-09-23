import React from 'react';
import { Home, FileText, QrCode } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenQrScanner: () => void;
  activeReportsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenQrScanner,
  activeReportsCount = 2
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2">
      <div className="flex items-center justify-around relative">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'home' ? 'text-spu-plum font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">หน้าหลัก</span>
        </button>

        {/* Center Floating QR Button */}
        <button
          onClick={onOpenQrScanner}
          className="relative -top-4 w-13 h-13 rounded-full bg-gradient-to-tr from-spu-purple to-spu-plum text-white shadow-spu-lg flex items-center justify-center active:scale-95 transition-transform ring-4 ring-white"
          title="เปิดสแกน QR Code"
          style={{ width: '3.25rem', height: '3.25rem' }}
        >
          <QrCode className="w-6 h-6 text-white" />
        </button>

        {/* My Reports */}
        <button
          onClick={() => onNavigate('track')}
          className={`flex flex-col items-center gap-1 transition-colors relative ${
            currentView === 'track' ? 'text-spu-plum font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <FileText className="w-5 h-5" />
            {activeReportsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-spu-pink text-white text-[9px] font-black leading-none">
                {activeReportsCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">ติดตามงาน</span>
        </button>
      </div>
    </div>
  );
};
