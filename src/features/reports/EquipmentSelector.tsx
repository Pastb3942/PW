import React from 'react';
import { EquipmentCategory } from '../../types';
import { AirVent, Projector, Zap, Armchair, Monitor, Check } from 'lucide-react';

interface EquipmentSelectorProps {
  selected: EquipmentCategory | null;
  onSelect: (category: EquipmentCategory) => void;
}

interface EquipmentOption {
  id: EquipmentCategory;
  name: string;
  nameEn: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgLight: string;
  borderActive: string;
}

const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: 'AIR_CONDITIONER',
    name: 'เครื่องปรับอากาศ',
    nameEn: 'Air Conditioner',
    desc: 'น้ำหยด, ไม่เย็น, เสียงดัง, รีโมทเสีย',
    icon: AirVent,
    color: 'text-sky-600',
    bgLight: 'bg-sky-50',
    borderActive: 'border-sky-500 ring-sky-500'
  },
  {
    id: 'PROJECTOR_AV',
    name: 'โปรเจกเตอร์ / ระบบภาพและเสียง',
    nameEn: 'Projector & AV',
    desc: 'ภาพไม่ติด, สีเพี้ยน, ลำโพงไม่ดัง, สาย HDMI',
    icon: Projector,
    color: 'text-amber-600',
    bgLight: 'bg-amber-50',
    borderActive: 'border-amber-500 ring-amber-500'
  },
  {
    id: 'ELECTRICAL_PLUGS',
    name: 'ระบบไฟฟ้า / ปลั๊กไฟ / หลอดไฟ',
    nameEn: 'Electrical & Plugs',
    desc: 'ปลั๊กไฟช็อต, ไฟไม่เข้า, หลอดไฟกระพริบ/ขาด',
    icon: Zap,
    color: 'text-rose-600',
    bgLight: 'bg-rose-50',
    borderActive: 'border-rose-500 ring-rose-500'
  },
  {
    id: 'FURNITURE',
    name: 'ครุภัณฑ์ / โต๊ะ / เก้าอี้',
    nameEn: 'Furniture & Fixtures',
    desc: 'เก้าอี้หัก/ล้อหลุด, โต๊ะโยก, ประตู/หน้าต่างชำรุด',
    icon: Armchair,
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    borderActive: 'border-emerald-500 ring-emerald-500'
  },
  {
    id: 'LAB_COMPUTERS',
    name: 'คอมพิวเตอร์ห้องปฏิบัติการ',
    nameEn: 'Lab Computers',
    desc: 'เปิดไม่ติด, จอดำ, เมาส์/คีย์บอร์ดเสีย, ปัญหาระบบ LAN',
    icon: Monitor,
    color: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    borderActive: 'border-indigo-500 ring-indigo-500'
  }
];

export const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        เลือกประเภทอุปกรณ์ที่ชำรุด <span className="text-rose-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {EQUIPMENT_OPTIONS.map((item) => {
          const isSelected = selected === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex items-start gap-3.5 ${
                isSelected
                  ? `bg-white border-2 ${item.borderActive} ring-2 ring-offset-1 shadow-sm`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 ${
                  isSelected ? `${item.bgLight} ${item.color}` : 'bg-slate-100 text-slate-600'
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <div className="font-bold text-sm text-slate-800 leading-tight">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {item.nameEn}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {item.desc}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center animate-fade-in shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
