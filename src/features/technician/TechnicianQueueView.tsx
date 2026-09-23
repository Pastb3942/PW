import React, { useState } from 'react';
import { Ticket } from '../../types';
import { CURRENT_TECH } from '../../lib/mockData';
import { claimTicket } from '../../lib/storage';
import {
  Wrench,
  AlertCircle,
  Search,
  SlidersHorizontal,
  MapPin,
  Phone,
  Navigation,
  Check,
  Clock,
  Radio,
  ArrowRight,
  Sparkles,
  QrCode,
  Layers,
  History as HistoryIcon,
  Map
} from 'lucide-react';

interface TechnicianQueueViewProps {
  tickets: Ticket[];
  onOpenTicket: (ticketId: string, token: string) => void;
  onOpenResolution: (ticket: Ticket) => void;
  onRefresh: () => void;
}

export const TechnicianQueueView: React.FC<TechnicianQueueViewProps> = ({
  tickets,
  onOpenTicket,
  onOpenResolution,
  onRefresh
}) => {
  const [filterBldg, setFilterBldg] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleClaim = (ticketId: string) => {
    claimTicket(ticketId, CURRENT_TECH.name, CURRENT_TECH.id);
    onRefresh();
  };

  const newCount = tickets.filter((t) => t.status === 'PENDING' || t.status === 'PENDING_REVIEW').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tickets.filter((t) => t.status === 'RESOLVED').length;

  return (
    <div className="space-y-4 pb-8 animate-fade-in">
      {/* Top Bar: UniLoop / SPU Tech Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-spu-purple text-white flex items-center justify-center font-black text-xs">
            SPU
          </div>
          <div>
            <span className="font-extrabold text-xs text-slate-900">
              ช่างเทคนิค SPU
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              คิวงานซ่อม
            </span>
          </div>
        </div>

        <div className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          เข้าเวรปฏิบัติหน้าที่ • โซนเหนือ
        </div>
      </div>

      {/* Technician Profile Card */}
      <div className="p-3.5 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
            <img
              src={CURRENT_TECH.avatarUrl}
              alt={CURRENT_TECH.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
              {CURRENT_TECH.name}
            </h3>
            <div className="text-[11px] text-slate-500 font-medium">
              รหัสช่าง: {CURRENT_TECH.id}
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
              ผู้เชี่ยวชาญอาวุโส ระบบแอร์และไฟฟ้า
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="px-2 py-0.5 rounded-full bg-spu-lightPink text-spu-pink text-[9px] font-black uppercase tracking-wider block">
            กำลังเข้ากะ
          </span>
          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
            โซนเหนือ (อาคาร 5, 11)
          </span>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        {/* NEW */}
        <div className="p-3 bg-[#3B0764] text-white rounded-2xl shadow-sm flex flex-col justify-between">
          <span className="text-[9px] uppercase font-extrabold text-pink-200">
            งานใหม่
          </span>
          <div className="text-xl font-black mt-1">
            {newCount + 2}{' '}
            <span className="text-[10px] font-normal text-pink-200">!</span>
          </div>
          <span className="text-[9px] text-pink-200/80 font-semibold mt-0.5">
            3 ด่วนมาก
          </span>
        </div>

        {/* IN PROGRESS */}
        <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <span className="text-[9px] uppercase font-extrabold text-slate-400">
            กำลังทำ
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {inProgressCount}
          </div>
          <span className="text-[9px] text-slate-500 font-semibold mt-0.5">
            1 อยู่ในเกณฑ์
          </span>
        </div>

        {/* COMPLETED */}
        <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <span className="text-[9px] uppercase font-extrabold text-slate-400">
            เสร็จสิ้น
          </span>
          <div className="text-xl font-black text-emerald-600 mt-1">
            {completedCount + 7}
          </div>
          <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">
            +100% ตาม SLA
          </span>
        </div>
      </div>

      {/* Critical Alert Banner */}
      <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
        <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
          !
        </div>
        <div>
          <div className="font-extrabold text-xs text-rose-900">
            แจ้งเตือนด่วนมาก: ต้องเข้าพื้นที่ทันที
          </div>
          <div className="text-[11px] text-rose-800 leading-snug mt-0.5">
            มีงานด่วน 2 รายการรอเข้าตรวจสอบทันที ที่อาคาร 11 (ชั้น 5) และอาคาร 5
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="ค้นหารหัสคำร้อง, ห้อง หรืออุปกรณ์..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-pink/20 focus:border-spu-pink shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <button className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600">
          <QrCode className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {[
          { id: 'ALL', label: 'ทุกระดับความเร่งด่วน' },
          { id: 'B11', label: 'อาคาร 11 (2)' },
          { id: 'B5', label: 'อาคาร 5 (1)' },
          { id: 'LIB', label: 'หอสมุดกลาง' }
        ].map((f) => {
          const isSelected = filterBldg === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilterBldg(f.id)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap text-[11px] transition-all ${
                isSelected
                  ? 'bg-[#3B0764] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Assigned Queue Title */}
      <div className="flex items-center justify-between text-xs pt-1">
        <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5">
          รายการงานที่ได้รับมอบหมาย
          <span className="text-[11px] font-semibold text-slate-400">
            (กำลังดำเนินการ {tickets.length} งาน)
          </span>
        </h3>
        <span className="text-[11px] font-bold text-spu-pink">
          เรียงตาม: ความเร่งด่วน ⇅
        </span>
      </div>

      {/* Task Queue Cards */}
      <div className="space-y-3">
        {/* Card 1: SPU-8821 (Urgent Leaking AC) */}
        <div className="p-4 bg-white rounded-3xl border-l-4 border-l-rose-500 border border-slate-100 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-xs text-slate-900">#SPU-8821</span>
              <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                ● ด่วนมาก • SLA &lt; 30 นาที
              </span>
            </div>
            <span>18 นาทีที่แล้ว</span>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              อาคาร 11 ชั้น 5 ห้อง 11-502
            </div>
            <div className="text-[11px] text-slate-500 font-medium pl-4 mt-0.5">
              เครื่องปรับอากาศ (แบบฝังฝ้า 02) • ห้องแล็บออกแบบมัลติมีเดีย
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-2xl flex items-start gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
              <img
                src={tickets[0]?.photoUrl || ''}
                alt="Cassette leak"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.2">
                3 รูปถ่าย
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                น้ำแอร์หยดลงโต๊ะเรียนแถว 14 อย่างหนัก มีเสียงสั่นดังผิดปกติ...
              </p>
              <div className="text-[10px] text-slate-400 mt-1">
                👤 แพรว ส. (ตัวแทนนักศึกษา)
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onOpenResolution(tickets[0])}
              className="flex-1 py-2.5 px-4 bg-[#3B0764] hover:bg-[#4A154B] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              รับงาน & เข้าพื้นที่
            </button>
            <button className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: SPU-8824 (Urgent Slip Hazard) */}
        <div className="p-4 bg-white rounded-3xl border-l-4 border-l-rose-500 border border-slate-100 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900">#SPU-8824</span>
              <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                ● ด่วนมาก • ระวังพื้นลื่นล้ม
              </span>
            </div>
            <span>27 นาทีที่แล้ว</span>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              อาคาร 5 ชั้น 1 ห้องน้ำหลัก
            </div>
            <div className="text-[11px] text-slate-500 font-medium pl-4 mt-0.5">
              สุขภัณฑ์ / ประปา • ใกล้ห้องบรรยาย 5-101
            </div>
          </div>

          <div className="p-2.5 bg-rose-50/50 rounded-2xl border border-rose-100 text-xs text-rose-900 leading-relaxed">
            ⚠️ วาล์วน้ำหลักรั่ว เอ่อล้นสู่ทางเดิน เสี่ยงลื่นล้มอันตรายช่วงเปลี่ยนคาบเรียน
            <div className="text-[10px] text-slate-400 mt-1">
              👤 แจ้งโดย รปภ. กิตติพงษ์
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleClaim('SPU-8824')}
              className="flex-1 py-2.5 px-4 bg-[#3B0764] hover:bg-[#4A154B] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Wrench className="w-4 h-4" />
              รับงานนี้
            </button>
            <button className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 3: SPU-8815 (In Progress Lighting) */}
        <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-extrabold text-xs text-slate-900">#SPU-8815</span>
            <span>เริ่มเมื่อ 45 นาทีที่แล้ว</span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-spu-lightPink text-spu-pink text-[10px] font-extrabold w-max border border-spu-borderPink">
            ● กำลังดำเนินการ • มอบหมายให้คุณ
          </div>

          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-spu-pink shrink-0" />
              หอสมุดกลาง ชั้น 2 โซน B
            </div>
            <div className="text-[11px] text-slate-500 font-medium pl-4 mt-0.5">
              ระบบไฟฟ้า / แสงสว่าง • โต๊ะอ่านหนังสือ 12-18
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-2xl text-[11px] text-slate-600 leading-relaxed border border-slate-100">
            <strong>เบิกอะไหล่จากคลัง A:</strong> เปลี่ยน LED Driver 40W แล้ว อยู่ระหว่างทดสอบบัลลาสต์
          </div>

          <button
            onClick={() => onOpenResolution(tickets.find(t => t.id === 'SPU-8815') || tickets[0])}
            className="w-full py-2.5 px-4 bg-[#3B0764] hover:bg-[#4A154B] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            ทำงานต่อ →
          </button>
        </div>

        {/* Card 4: SPU-8794 (Pending Normal) */}
        <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900">#SPU-8794</span>
              <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                ปกติ • SLA 24 ชม.
              </span>
            </div>
            <span>1 ชม. ที่แล้ว</span>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              อาคาร 5 ชั้น 3 ห้อง 5-301
            </div>
            <div className="text-[11px] text-slate-500 font-medium pl-4 mt-0.5">
              โปรเจกเตอร์ / คอมพิวเตอร์ห้องเรียน
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            สายสัญญาณ HDMI บนเพดานภาพกระพริบสีม่วง ไฟส้มเตือนหลอดภาพกระพริบเมื่อเสียบโต๊ะอาจารย์
          </p>
          <div className="text-[10px] text-slate-400">
            แจ้งโดย ดร.อนันต์ (คณะนิเทศศาสตร์)
          </div>

          <button
            onClick={() => handleClaim('SPU-8794')}
            className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            กดรับเรื่อง
          </button>
        </div>
      </div>

      {/* Floating Status Broadcast */}
      <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-center gap-2 text-xs text-slate-600 font-bold border border-slate-200">
        <Radio className="w-4 h-4 text-spu-pink animate-pulse" />
        กระจายสัญญาณสถานะช่าง: ประจำโซนอาคารทิศเหนือ
      </div>

      {/* Bottom Sub-Nav for Technician */}
      <div className="flex items-center justify-around pt-2 border-t border-slate-100 text-xs text-slate-400 font-bold">
        <span className="text-spu-pink flex flex-col items-center gap-1">
          <Layers className="w-4 h-4" />
          คิวงานซ่อม
        </span>
        <span className="flex flex-col items-center gap-1 hover:text-slate-700 cursor-pointer">
          <Map className="w-4 h-4" />
          แผนที่ / โซน
        </span>
        <span className="flex flex-col items-center gap-1 hover:text-slate-700 cursor-pointer">
          <HistoryIcon className="w-4 h-4" />
          ประวัติงาน
        </span>
      </div>
    </div>
  );
};
