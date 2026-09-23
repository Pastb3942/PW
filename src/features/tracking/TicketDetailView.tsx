import React, { useState } from 'react';
import { Ticket } from '../../types';
import { StatusBadge, UrgencyBadge, CategoryIcon, getCategoryLabel } from '../../components/shared/StatusBadge';
import { TicketTimeline } from './TicketTimeline';
import {
  MapPin,
  Clock,
  User,
  Share2,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Camera,
  Copy,
  Check
} from 'lucide-react';

interface TicketDetailViewProps {
  ticket: Ticket;
  onBack: () => void;
  tokenValid: boolean;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({ ticket, onBack, tokenValid }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/track/${ticket.id}?token=${ticket.accessToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mask student email if viewing without owner token
  const displayEmail = tokenValid
    ? ticket.studentEmail
    : ticket.studentEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับหน้ารายการ
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl border border-brand-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              คัดลอกลิงก์สำเร็จ!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              แชร์ลิงก์ติดตามงาน (ไม่ต้องล็อกอิน)
            </>
          )}
        </button>
      </div>

      {/* Ticket Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-lg text-slate-900">
                #{ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
              <UrgencyBadge urgency={ticket.urgency} />
            </div>
            <h1 className="font-bold text-lg md:text-xl text-slate-800 mt-1.5">
              {ticket.title}
            </h1>
          </div>

          <div className="text-right text-xs text-slate-400 shrink-0">
            <div>ส่งเรื่องเมื่อ</div>
            <div className="font-medium text-slate-700">
              {new Date(ticket.createdAt).toLocaleString('th-TH')}
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <div className="text-slate-400 font-medium">สถานที่</div>
              <div className="font-bold text-slate-800">{ticket.roomName}</div>
              <div className="text-[11px] text-slate-500">{ticket.building}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CategoryIcon category={ticket.category} className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <div className="text-slate-400 font-medium">ประเภทอุปกรณ์</div>
              <div className="font-bold text-slate-800">{getCategoryLabel(ticket.category)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <div className="text-slate-400 font-medium">ผู้แจ้ง</div>
              <div className="font-bold text-slate-800">{displayEmail}</div>
              {tokenValid && (
                <div className="text-[10px] text-emerald-600 font-semibold">ยืนยันสิทธิ์ผ่านโทเคนเรียบร้อย</div>
              )}
            </div>
          </div>
        </div>

        {/* Description text */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            รายละเอียดปัญหาที่รายงาน
          </div>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <TicketTimeline ticket={ticket} />

      {/* Photos Grid: Before & After (Resolution Proof) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Camera className="w-4 h-4 text-brand-600" />
          หลักฐานภาพถ่าย
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Photo */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              ภาพถ่ายตอนแจ้งซ่อม (ก่อนซ่อม)
            </span>
            <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-200 shadow-inner">
              <img
                src={ticket.photoUrl}
                alt="Before repair"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* After Photo (Resolution Proof) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ภาพถ่ายยืนยันหลังการซ่อมเสร็จ (หลักฐานการปิดงาน)
            </span>
            {ticket.resolutionProofPhotoUrl ? (
              <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border-2 border-emerald-300 shadow-inner">
                <img
                  src={ticket.resolutionProofPhotoUrl}
                  alt="After repair proof"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 aspect-video flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                <Clock className="w-8 h-8 opacity-30 mb-2" />
                <span className="text-xs font-medium">รอช่างเข้าตรวจสอบและอัปโหลดภาพหลังการแก้ไข</span>
                <span className="text-[11px] text-slate-400 mt-0.5">ภาพหลักฐานจะปรากฏเมื่อปิดงาน</span>
              </div>
            )}
          </div>
        </div>

        {/* Resolution Note if resolved */}
        {ticket.resolutionNote && (
          <div className="mt-3 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-950 text-xs leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              บันทึกการแก้ไขโดยช่างเทคนิค:
            </div>
            {ticket.resolutionNote}
          </div>
        )}
      </div>

      {/* Audit Event Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          ประวัติการดำเนินงานอย่างละเอียด (บันทึกประวัติ)
        </h3>

        <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {ticket.events.map((evt) => {
            const actorTypeThai =
              evt.actorType === 'STUDENT'
                ? 'นักศึกษา'
                : evt.actorType === 'TECHNICIAN'
                ? 'ช่างเทคนิค'
                : evt.actorType === 'ADMIN'
                ? 'ผู้ดูแลระบบ'
                : 'ระบบ';

            return (
              <div key={evt.id} className="relative flex items-start gap-3.5 pl-1 text-xs">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 border-2 border-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-sm">
                  •
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-bold text-slate-800">{evt.action}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(evt.timestamp).toLocaleString('th-TH')}
                    </span>
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    โดย: <span className="font-medium text-slate-800">{evt.actorName}</span>{' '}
                    <span className="text-[10px] text-slate-400 uppercase">({actorTypeThai})</span>
                  </div>
                  {evt.note && (
                    <div className="text-slate-500 mt-1 italic bg-white p-2 rounded border border-slate-100">
                      "{evt.note}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
