import React from 'react';
import { ShieldAlert, Lock, ArrowRight, Home, KeyRound, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface AdminAccessGuardProps {
  currentRole: UserRole;
  onSwitchToAdmin: () => void;
  onBackToHome: () => void;
}

export const AdminAccessGuard: React.FC<AdminAccessGuardProps> = ({
  currentRole,
  onSwitchToAdmin,
  onBackToHome
}) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return 'นักศึกษา / ผู้ใช้งานทั่วไป (Student)';
      case 'TECHNICIAN':
        return 'ช่างเทคนิคประจำศูนย์ (Technician)';
      default:
        return 'ผู้ใช้งานทั่วไป';
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200/80 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden animate-fade-in">
        {/* Background glow badge */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-100 rounded-full blur-2xl pointer-events-none opacity-60" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-100 rounded-full blur-2xl pointer-events-none opacity-60" />

        {/* Shield / Lock Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 mb-5">
          <Lock className="w-9 h-9 stroke-[2.2]" />
          <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </span>
        </div>

        {/* Security Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          สิทธิ์เฉพาะผู้ดูแลระบบ (Admin Only)
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          ไม่อนุญาตให้เข้าถึงหน้านี้
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          หน้าจอ <strong>UniLoop Admin & Analytics Portal</strong> ได้รับการป้องกันและจำกัดสิทธิ์เปิดได้เฉพาะ
          <strong> ผู้ดูแลระบบ (Admin) </strong> หรือฝ่ายบริหารจัดการอาคารสถานที่ มหาวิทยาลัยศรีปทุม เท่านั้น
        </p>

        {/* Current Role Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            สถานะสิทธิ์ปัจจุบันของคุณ:
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              {getRoleLabel(currentRole)}
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              ไม่มีสิทธิ์เข้าถึง
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onSwitchToAdmin}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-spu-purple to-spu-magenta hover:from-purple-900 hover:to-pink-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all active:scale-[0.98]"
          >
            <KeyRound className="w-4 h-4" />
            <span>เข้าสู่ระบบด้วยสิทธิ์ Admin (สลับบทบาท)</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={onBackToHome}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>กลับสู่หน้าหลักนักศึกษา</span>
          </button>
        </div>

        {/* Note */}
        <div className="mt-5 text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>ระบบรักษาความปลอดภัยตามมาตรฐานความปลอดภัย SPU Facilities</span>
        </div>
      </div>
    </div>
  );
};
