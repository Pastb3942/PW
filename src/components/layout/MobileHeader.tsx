import React from 'react';
import { Bell } from 'lucide-react';
import { CURRENT_STUDENT } from '../../lib/mockData';

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  unreadCount?: number;
  onOpenMailbox: () => void;
  avatarUrl?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'SPU Facility Fix',
  subtitle = 'Home',
  unreadCount = 1,
  onOpenMailbox,
  avatarUrl = CURRENT_STUDENT.avatarUrl,
  onBack,
  showBack = false
}) => {
  return (
    <header className="px-5 py-3.5 bg-white flex items-center justify-between border-b border-slate-100 sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        {showBack && (
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-slate-700 hover:text-spu-plum font-bold"
          >
            ←
          </button>
        )}
        <div className="flex items-center gap-2">
          {/* SPU Logo Icon */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-spu-purple to-spu-magenta flex items-center justify-center text-white font-black text-xs shadow-sm">
            SPU
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 leading-tight">
              {title}
            </div>
            <div className="text-[11px] text-slate-400 font-medium leading-none">
              {subtitle}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          onClick={onOpenMailbox}
          className="relative p-1.5 text-slate-600 hover:text-spu-purple transition-colors"
          title="Campus Mailbox / Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-spu-pink ring-2 ring-white"></span>
          )}
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0">
          <img
            src={avatarUrl}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
