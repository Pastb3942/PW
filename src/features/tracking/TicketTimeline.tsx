import React from 'react';
import { Ticket, TicketStatus } from '../../types';
import { Clock, CheckCircle2, Wrench, AlertCircle, Calendar, User, ShieldCheck } from 'lucide-react';

interface TicketTimelineProps {
  ticket: Ticket;
}

interface StepItem {
  id: TicketStatus;
  title: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
}

const STEPS: StepItem[] = [
  {
    id: 'PENDING',
    title: 'รับเรื่องแจ้งซ่อม',
    desc: 'ระบบบันทึกเข้าระบบคิวงาน',
    icon: Clock
  },
  {
    id: 'ACKNOWLEDGED',
    title: 'มอบหมายช่างเทคนิค',
    desc: 'ช่างรับเรื่องและจัดเตรียมอุปกรณ์',
    icon: AlertCircle
  },
  {
    id: 'IN_PROGRESS',
    title: 'กำลังดำเนินการซ่อม',
    desc: 'เจ้าหน้าที่เข้าตรวจสอบหน้างาน',
    icon: Wrench
  },
  {
    id: 'RESOLVED',
    title: 'ซ่อมเสร็จสมบูรณ์',
    desc: 'ทดสอบระบบและแนบหลักฐานปิดงาน',
    icon: CheckCircle2
  }
];

export const TicketTimeline: React.FC<TicketTimelineProps> = ({ ticket }) => {
  const getStepIndex = (status: TicketStatus): number => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'ACKNOWLEDGED':
        return 1;
      case 'IN_PROGRESS':
        return 2;
      case 'RESOLVED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(ticket.status);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          ลำดับขั้นตอนความคืบหน้า (Progress Timeline)
        </h3>
        <span className="text-xs text-slate-400">
          อัปเดตล่าสุด: {new Date(ticket.updatedAt).toLocaleTimeString('th-TH')} น.
        </span>
      </div>

      {/* Stepper for Desktop and Mobile */}
      <div className="relative">
        {/* Horizontal Progress Bar for Tablet/Desktop */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-100 -z-0">
          <div
            className="h-full bg-brand-600 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isFuture = idx > currentStepIndex;
            const IconComponent = step.icon;

            return (
              <div
                key={step.id}
                className={`flex md:flex-col items-center md:items-center gap-3 p-3 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-brand-50/80 border border-brand-200 md:bg-transparent md:border-none'
                    : ''
                }`}
              >
                {/* Node Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Text Content */}
                <div className="flex-1 md:text-center min-w-0">
                  <div
                    className={`font-bold text-xs ${
                      isCurrent
                        ? 'text-brand-700'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technician Info banner if assigned */}
      {ticket.assignedTechName && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-slate-500">ช่างเทคนิคผู้รับผิดชอบ: </span>
              <span className="font-bold text-slate-800">{ticket.assignedTechName}</span>
            </div>
          </div>
          <span className="text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded border border-brand-200 text-[11px]">
            {ticket.status === 'RESOLVED' ? 'ปิดงานแล้ว' : 'กำลังดูแล'}
          </span>
        </div>
      )}
    </div>
  );
};
