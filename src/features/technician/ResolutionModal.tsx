import React, { useState } from 'react';
import { Ticket } from '../../types';
import { X, CheckCircle2, Camera, Upload, Trash2, Loader2, Sparkles } from 'lucide-react';
import { compressClientImage, formatBytes } from '../../lib/compression';
import { createSamplePhoto } from '../../lib/mockData';
import { updateTicketStatus } from '../../lib/storage';
import confetti from 'canvas-confetti';

interface ResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  technicianName: string;
  onSuccess: () => void;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({
  isOpen,
  onClose,
  ticket,
  technicianName,
  onSuccess
}) => {
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string>('');
  const [note, setNote] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [compressStats, setCompressStats] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setCompressing(true);
    try {
      const result = await compressClientImage(file, 1200, 1200, 0.75);
      setProofPhotoUrl(result.dataUrl);
      setCompressStats(`บีบอัดรูปเสร็จสิ้น: ${formatBytes(result.originalSizeBytes)} ➔ ${formatBytes(result.compressedSizeBytes)} (-${result.reductionPercentage}%)`);
    } catch (err) {
      alert('ไม่สามารถประมวลผลรูปภาพได้');
    } finally {
      setCompressing(false);
    }
  };

  const handleSamplePhoto = () => {
    const sample = createSamplePhoto(`ซ่อมเสร็จสมบูรณ์: ${ticket.category}`, '#16a34a', '✅');
    setProofPhotoUrl(sample);
    setCompressStats('ใช้รูปหลักฐานจำลอง (Demo Proof Photo)');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofPhotoUrl) {
      alert('กรุณาถ่ายภาพหรือแนบหลักฐานภาพถ่ายหลังการซ่อมเสร็จสิ้น');
      return;
    }
    if (!note.trim()) {
      alert('กรุณาระบุรายละเอียดการแก้ไขเพื่อบันทึกในระบบ');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      updateTicketStatus({
        ticketId: ticket.id,
        status: 'RESOLVED',
        note,
        proofPhotoUrl,
        technicianName
      });

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setSubmitting(false);
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">บันทึกผลการซ่อมแซมและปิดงาน</h3>
              <p className="text-xs text-emerald-100">
                รหัสคำร้อง: #{ticket.id} • {ticket.roomName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Issue summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="font-bold text-slate-700">ปัญหาที่แจ้ง:</div>
            <div className="text-slate-600 mt-0.5">{ticket.title}</div>
          </div>

          {/* Resolution Photo Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                ถ่ายภาพหลักฐานหลังการซ่อมเสร็จ <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                รูปจะส่งให้นักศึกษาทางอีเมล
              </span>
            </div>

            {proofPhotoUrl ? (
              <div className="relative rounded-xl overflow-hidden bg-slate-900 border-2 border-emerald-300 aspect-video flex items-center justify-center">
                <img src={proofPhotoUrl} alt="Proof" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setProofPhotoUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 flex flex-col items-center justify-center">
                {compressing ? (
                  <div className="flex flex-col items-center py-2">
                    <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mb-1" />
                    <span className="text-xs text-slate-600">กำลังบีบอัดรูปถ่าย...</span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs font-bold text-slate-700">ถ่ายภาพอุปกรณ์ที่ซ่อมเสร็จแล้ว</p>
                    <div className="flex gap-2 mt-3">
                      <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 shadow-sm">
                        <Camera className="w-3.5 h-3.5" />
                        เปิดกล้องถ่าย
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleSamplePhoto}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        ใช้ภาพตัวอย่าง
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {compressStats && (
              <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                ✓ {compressStats}
              </p>
            )}
          </div>

          {/* Work Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              บันทึกรายละเอียดการแก้ไข / อะไหล่ที่เปลี่ยน <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="เช่น: ทำการล้างท่อเดรนแอร์และเติมน้ำยาแอร์ R-32 ทดสอบความเย็น 30 นาที ใช้งานได้ปกติ..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'กำลังบันทึก...' : 'ยืนยันปิดงานซ่อม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
