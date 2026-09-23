import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../../types';
import {
  MapPin,
  Clock,
  Wrench,
  CheckCircle2,
  Check,
  Camera,
  MessageCircle,
  ChevronRight,
  Info,
  Eye,
  Star,
  FileText
} from 'lucide-react';

interface MyReportsViewProps {
  tickets: Ticket[];
  onSelectTicket: (ticketId: string, token: string) => void;
  onContactTech?: (ticket: Ticket) => void;
  onViewBeforeAfter?: (ticket: Ticket) => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  tickets,
  onSelectTicket,
  onContactTech,
  onViewBeforeAfter
}) => {
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED'>('ALL');

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
    if (filter === 'PENDING') return t.status === 'PENDING' || t.status === 'PENDING_REVIEW';
    if (filter === 'RESOLVED') return t.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="space-y-4 pb-8 animate-fade-in">
      {/* Title Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            รายการแจ้งซ่อมของฉัน & ติดตามสถานะ
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-spu-lightPink text-spu-pink text-[11px] font-extrabold border border-spu-borderPink flex items-center gap-1">
            <FileText className="w-3 h-3" />
            ทั้งหมด {tickets.length} รายการ
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          ติดตามสถานะการซ่อมและการเข้าพื้นที่ของช่างแบบเรียลไทม์ทั่วมหาวิทยาลัยศรีปทุม
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {[
          { id: 'ALL', label: `ทั้งหมด (${tickets.length})` },
          { id: 'IN_PROGRESS', label: `กำลังดำเนินการ (${tickets.filter((t) => t.status === 'IN_PROGRESS').length})` },
          { id: 'PENDING', label: `รอรับเรื่อง (${tickets.filter((t) => t.status === 'PENDING' || t.status === 'PENDING_REVIEW').length})` },
          { id: 'RESOLVED', label: `ซ่อมเสร็จสิ้น (${tickets.filter((t) => t.status === 'RESOLVED').length})` }
        ].map((tab) => {
          const isSelected = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap text-[11px] transition-all ${
                isSelected
                  ? 'bg-[#3B0764] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Ticket Cards List */}
      <div className="space-y-3.5">
        {filteredTickets.map((ticket) => {
          const isInProgress = ticket.status === 'IN_PROGRESS';
          const isResolved = ticket.status === 'RESOLVED';
          const isPending = ticket.status === 'PENDING' || ticket.status === 'PENDING_REVIEW';

          return (
            <div
              key={ticket.id}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
            >
              {/* Card Top: ID, Date, Status */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-xs text-slate-900">
                    #{ticket.id}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • {ticket.timeAgoText || 'วันนี้'}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isInProgress
                      ? 'bg-spu-lightPink text-spu-pink'
                      : isResolved
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ● {isInProgress ? 'กำลังดำเนินการ' : isResolved ? 'ซ่อมเสร็จสิ้น' : 'รอตรวจสอบ'}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-spu-pink shrink-0" />
                <span className="font-semibold truncate">
                  {ticket.building}, ชั้น {ticket.floor}, ห้อง {ticket.roomNumber}
                </span>
              </div>

              {/* Middle Thumbnail & Category Box */}
              <div className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                  <img
                    src={ticket.photoUrl}
                    alt={ticket.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.5">
                    รูปตอนแจ้ง
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full mb-1">
                    {ticket.category === 'AIR_CONDITIONER' && '❄️'}
                    {ticket.category === 'PROJECTOR_PC' && '📽️'}
                    {ticket.category === 'DESK_CHAIR' && '🪑'}
                    {ticket.categoryLabel || 'อุปกรณ์'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {ticket.title}
                  </h4>
                  {ticket.assignedTechName && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                      <Wrench className="w-3 h-3 text-spu-pink" />
                      {ticket.assignedTechName}
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">
                        ถึงหน้างานแล้ว
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* 4-Stage Stepper */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-2">
                  <span>ความคืบหน้าการทำงาน</span>
                  <span className="text-spu-pink">
                    ขั้นตอนที่ {ticket.workflowStep || 1} จาก 4
                  </span>
                </div>

                <div className="relative flex items-center justify-between px-2">
                  {/* Connecting line */}
                  <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-200 -z-0">
                    <div
                      className="h-full bg-spu-plum transition-all duration-500"
                      style={{
                        width: `${Math.max(0, ((ticket.workflowStep || 1) - 1) / 3) * 100}%`
                      }}
                    />
                  </div>

                  {/* 4 Nodes */}
                  {[
                    { step: 1, label: 'รับเรื่อง' },
                    { step: 2, label: ticket.status === 'PENDING_REVIEW' ? 'ส่งเรื่อง' : 'มอบหมายงาน' },
                    { step: 3, label: ticket.status === 'RESOLVED' ? 'ซ่อมเสร็จ' : 'กำลังซ่อม' },
                    { step: 4, label: 'ปิดงาน' }
                  ].map((node) => {
                    const isDone = (ticket.workflowStep || 1) > node.step;
                    const isCurrent = (ticket.workflowStep || 1) === node.step;

                    return (
                      <div
                        key={node.step}
                        className="flex flex-col items-center gap-1 relative z-10"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                            isDone
                              ? 'bg-[#3B0764] text-white'
                              : isCurrent
                              ? 'bg-gradient-to-r from-spu-purple to-spu-pink text-white ring-4 ring-pink-100'
                              : 'bg-white text-slate-300 border-2 border-slate-200'
                          }`}
                        >
                          {isDone ? '✓' : isCurrent ? '🔧' : node.step}
                        </div>
                        <span
                          className={`text-[9px] font-bold ${
                            isCurrent
                              ? 'text-spu-plum'
                              : isDone
                              ? 'text-slate-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {node.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technician Update Note (if in progress) */}
              {ticket.techStatusNote && (
                <div className="p-2.5 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-start gap-2 text-[11px] text-spu-plum font-medium leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-spu-pink shrink-0 mt-0.5" />
                  <span>
                    <strong>อัปเดตจากช่าง:</strong> {ticket.techStatusNote}
                  </span>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
                {isInProgress && (
                  <>
                    <button
                      onClick={() => onSelectTicket(ticket.id, ticket.accessToken)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      ดูรูปถ่าย (2)
                    </button>
                    <button
                      onClick={() => onContactTech && onContactTech(ticket)}
                      className="flex-1 py-2 px-3 bg-[#3B0764] hover:bg-[#4A154B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      ติดต่อช่าง
                    </button>
                  </>
                )}

                {isPending && (
                  <div className="w-full flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      ระยะเวลาตรวจสอบ: ~30 นาที
                    </span>
                    <button
                      onClick={() => onSelectTicket(ticket.id, ticket.accessToken)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1"
                    >
                      เพิ่มรายละเอียด <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {isResolved && (
                  <div className="w-full flex items-center justify-between text-xs">
                    <button
                      onClick={() => onViewBeforeAfter && onViewBeforeAfter(ticket)}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-spu-pink" />
                      ดูภาพเปรียบเทียบ ก่อน/หลัง
                    </button>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                      <span>ให้คะแนนแล้ว</span>
                      <div className="flex text-amber-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
