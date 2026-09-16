import React from 'react';
import { TicketStatus, UrgencyLevel, EquipmentCategory } from '../../types';
import { Clock, CheckCircle2, Wrench, AlertCircle, ShieldAlert, Zap, AirVent, Projector, Armchair, Monitor, Lightbulb, Video, Settings } from 'lucide-react';

export const StatusBadge: React.FC<{ status: TicketStatus; size?: 'sm' | 'md' }> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-xs px-2 py-0.5' : 'text-xs md:text-sm px-2.5 py-1';

  switch (status) {
    case 'PENDING':
    case 'PENDING_REVIEW':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <Clock className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          รอรับเรื่อง
        </span>
      );
    case 'ACKNOWLEDGED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <AlertCircle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          รับเรื่องแล้ว
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-pink-50 text-spu-pink border border-pink-200 ${sizeClasses}`}>
          <Wrench className={isSm ? 'w-3 h-3 animate-spin' : 'w-3.5 h-3.5 animate-spin'} />
          กำลังดำเนินการ
        </span>
      );
    case 'RESOLVED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle2 className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          ซ่อมเสร็จสิ้น
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <AlertCircle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          ระงับ / ส่งต่อ
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-slate-100 text-slate-700 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel }> = ({ urgency }) => {
  switch (urgency) {
    case 'CRITICAL':
    case 'URGENT':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
          <ShieldAlert className="w-3 h-3 text-red-600" />
          Urgent
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
          <AlertCircle className="w-3 h-3 text-orange-600" />
          High
        </span>
      );
    case 'MEDIUM':
    case 'NORMAL':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Normal
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Low
        </span>
      );
  }
};

export const CategoryIcon: React.FC<{ category: EquipmentCategory; className?: string }> = ({ category, className = 'w-5 h-5' }) => {
  switch (category) {
    case 'AIR_CONDITIONER':
      return <AirVent className={className} />;
    case 'PROJECTOR_PC':
    case 'PROJECTOR_AV':
      return <Video className={className} />;
    case 'LIGHTS_ELECTRICAL':
    case 'ELECTRICAL_PLUGS':
      return <Lightbulb className={className} />;
    case 'SANITARY':
      return <Wrench className={className} />;
    case 'DESK_CHAIR':
    case 'FURNITURE':
      return <Armchair className={className} />;
    case 'LAB_COMPUTERS':
      return <Monitor className={className} />;
    default:
      return <Settings className={className} />;
  }
};

export const getCategoryLabel = (category: EquipmentCategory): string => {
  switch (category) {
    case 'AIR_CONDITIONER':
      return 'Air Conditioner';
    case 'LIGHTS_ELECTRICAL':
    case 'ELECTRICAL_PLUGS':
      return 'Lights / Electrical';
    case 'SANITARY':
      return 'Sanitary / Plumbing';
    case 'DESK_CHAIR':
    case 'FURNITURE':
      return 'Desk & Chair';
    case 'PROJECTOR_PC':
    case 'PROJECTOR_AV':
      return 'Projector / PC';
    case 'LAB_COMPUTERS':
      return 'Lab Computers';
    case 'OTHER_ISSUE':
    default:
      return 'Other Issue';
  }
};
