import React, { useState } from 'react';
import { Ticket } from '../../types';
import { AlertTriangle, Bell, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { subscribeToTicket } from '../../lib/storage';

interface DuplicateAlertBannerProps {
  existingTicket: Ticket;
  onViewExisting: (ticketId: string, token: string) => void;
  defaultEmail?: string;
}

export const DuplicateAlertBanner: React.FC<DuplicateAlertBannerProps> = ({
  existingTicket,
  onViewExisting,
  defaultEmail = ''
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('กรุณากรอกอีเมลมหาวิทยาลัยที่ถูกต้อง');
      return;
    }

    setSubscribing(true);
    setTimeout(() => {
      subscribeToTicket(existingTicket.id, email);
      setSubscribed(true);
      setSubscribing(false);
    }, 400);
  };

  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 shadow-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-200/70 text-amber-800 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-amber-900 text-sm">
              พบรายการแจ้งซ่อมอุปกรณ์หมวดนี้ค้างอยู่แล้ว
            </span>
            <span className="text-[11px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              #{existingTicket.id}
            </span>
          </div>

          <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
            มีผู้แจ้ง <strong>"{existingTicket.title}"</strong> ไว้เมื่อ{' '}
            {new Date(existingTicket.createdAt).toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit'
            })}{' '}
            น. สถานะปัจจุบัน:{' '}
            <strong>
              {existingTicket.status === 'IN_PROGRESS'
                ? 'กำลังดำเนินการ'
                : existingTicket.status === 'RESOLVED'
                ? 'ซ่อมเสร็จสิ้น'
                : existingTicket.status === 'ACKNOWLEDGED'
                ? 'รับเรื่องแล้ว'
                : 'รอรับเรื่อง'}
            </strong>
          </p>

          <p className="text-xs text-amber-900/80 font-medium mt-1">
            💡 คุณไม่จำเป็นต้องส่งเรื่องซ้ำ! สามารถกดติดตามเพื่อรับอีเมลแจ้งเตือนเมื่อซ่อมเสร็จได้ทันที
          </p>

          {subscribed ? (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-between text-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ลงทะเบียนติดตามเรียบร้อยแล้ว! ระบบจะส่งอีเมลแจ้งเมื่อช่างซ่อมเสร็จ</span>
              </div>
              <button
                type="button"
                onClick={() => onViewExisting(existingTicket.id, existingTicket.accessToken)}
                className="font-bold text-emerald-800 underline hover:text-emerald-900"
              >
                ดูความคืบหน้า
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="ระบุอีเมลของคุณ เช่น student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 disabled:opacity-50"
              >
                <Bell className="w-3.5 h-3.5" />
                {subscribing ? 'กำลังบันทึก...' : 'แจ้งเตือนฉันเมื่อซ่อมเสร็จ'}
              </button>
            </form>
          )}

          <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
            <span className="text-amber-800/80">
              ผู้ติดตามรายการนี้แล้ว: {existingTicket.subscribers.length + existingTicket.upvotes} คน
            </span>
            <button
              type="button"
              onClick={() => onViewExisting(existingTicket.id, existingTicket.accessToken)}
              className="text-amber-900 font-semibold flex items-center gap-1 hover:underline"
            >
              เปิดดูรายละเอียดคำร้องเดิม
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
