import React from 'react';
import { Smartphone, Monitor, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

export type ScreenId = 'home' | 'submit' | 'track' | 'tech' | 'resolve' | 'admin';

interface ViewSwitcherBarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onOpenMailbox: () => void;
  unreadEmailCount: number;
  currentUserRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const ViewSwitcherBar: React.FC<ViewSwitcherBarProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileFrame,
  onToggleFrame,
  onOpenMailbox,
  unreadEmailCount,
  currentUserRole,
  onSelectRole
}) => {
  const screens = [
    { id: 'home', title: '1. หน้าหลัก', icon: '📱' },
    { id: 'submit', title: '2. แบบฟอร์มแจ้งซ่อม', icon: '📝' },
    { id: 'track', title: '3. ติดตามสถานะ', icon: '🔍' },
    { id: 'tech', title: '4. คิวงานช่าง', icon: '🔧' },
    { id: 'resolve', title: '5. บันทึกผลการซ่อม', icon: '✅' },
    { id: 'admin', title: '6. แดชบอร์ดผู้ดูแล (Admin Hub) 🔒', icon: '👑' },
  ] as const;

  const roles: { id: UserRole; label: string; icon: string }[] = [
    { id: 'STUDENT', label: 'นักศึกษา', icon: '🎓' },
    { id: 'TECHNICIAN', label: 'ช่างเทคนิค', icon: '🔧' },
    { id: 'ADMIN', label: 'ผู้ดูแล (Admin)', icon: '👑' },
  ];

  return (
    <div className="bg-slate-900 text-white px-3 py-2 text-xs border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Screen Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          <span className="font-extrabold text-[11px] text-pink-400 mr-1 shrink-0 hidden sm:inline">
            หน้าจอจำลอง:
          </span>
          {screens.map((s) => {
            const active = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectScreen(s.id as ScreenId)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1 ${
                  active
                    ? s.id === 'admin'
                      ? 'bg-gradient-to-r from-purple-800 to-spu-magenta text-white shadow-sm ring-1 ring-pink-400/50'
                      : 'bg-gradient-to-r from-spu-pink to-spu-magenta text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Role Switcher, Frame Toggle & Virtual Mailbox */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Role Switcher Pill */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold px-1.5 hidden md:inline">
              สิทธิ์ทดสอบ:
            </span>
            {roles.map((r) => {
              const active = currentUserRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRole(r.id)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                    active
                      ? r.id === 'ADMIN'
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`สลับบทบาทเป็น ${r.label}`}
                >
                  <span>{r.icon}</span>
                  <span className="hidden sm:inline">{r.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onToggleFrame}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors border border-slate-700"
            title="สลับมุมมองกรอบมือถือ / เต็มจอ"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden md:inline">เต็มจอ</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden md:inline">กรอบมือถือ</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenMailbox}
            className="relative px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-900 to-pink-900 hover:from-purple-800 hover:to-pink-800 text-pink-200 font-bold text-[11px] flex items-center gap-1.5 transition-colors border border-pink-700/50"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">กล่องอีเมลจำลอง</span>
            {unreadEmailCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                {unreadEmailCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
