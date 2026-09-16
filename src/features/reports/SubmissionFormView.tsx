import React, { useState } from 'react';
import { Room, EquipmentCategory, UrgencyLevel } from '../../types';
import {
  MapPin,
  Camera,
  Plus,
  X,
  Send,
  Zap,
  Check,
  AirVent,
  Lightbulb,
  Wrench,
  Armchair,
  Video,
  Settings,
  Mail,
  HelpCircle,
  Clock
} from 'lucide-react';
import { compressClientImage, formatBytes } from '../../lib/compression';
import { createTicket, getRooms, getRoomById } from '../../lib/storage';
import { AC_LEAK_PHOTO } from '../../lib/mockData';
import confetti from 'canvas-confetti';

interface SubmissionFormViewProps {
  initialRoomId?: string;
  onOpenQrScanner: () => void;
  onTicketSubmitted: (ticketId: string, token: string) => void;
  onBack: () => void;
}

interface CategoryCard {
  id: EquipmentCategory;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const CATEGORIES: CategoryCard[] = [
  { id: 'AIR_CONDITIONER', label: 'Air Condition...', icon: AirVent },
  { id: 'LIGHTS_ELECTRICAL', label: 'Lights / Ele...', icon: Lightbulb },
  { id: 'SANITARY', label: 'Sanitary / T...', icon: Wrench },
  { id: 'DESK_CHAIR', label: 'Desk & Chair', icon: Armchair },
  { id: 'PROJECTOR_PC', label: 'Projector / PC', icon: Video },
  { id: 'OTHER_ISSUE', label: 'Other Issue', icon: Settings }
];

export const SubmissionFormView: React.FC<SubmissionFormViewProps> = ({
  initialRoomId = 'ROOM-SPU-11-502',
  onOpenQrScanner,
  onTicketSubmitted,
  onBack
}) => {
  const rooms = getRooms();
  const currentRoom = getRoomById(initialRoomId) || rooms[0];

  const [category, setCategory] = useState<EquipmentCategory>('AIR_CONDITIONER');
  const [urgency, setUrgency] = useState<UrgencyLevel>('NORMAL');
  const [description, setDescription] = useState(
    'Water leaking from AC vent onto computer desk 14. Loud humming vibration sound since 9:00 AM lecture started.'
  );
  const [email, setEmail] = useState('praew.suk@spu.ac.th');
  const [photos, setPhotos] = useState<string[]>([AC_LEAK_PHOTO]);
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAddPhoto = async (file: File) => {
    setCompressing(true);
    try {
      const result = await compressClientImage(file, 1200, 1200, 0.75);
      setPhotos((prev) => [...prev.slice(0, 2), result.dataUrl]);
    } catch (e) {
      alert('Photo compression failed');
    } finally {
      setCompressing(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const ticket = createTicket({
        roomId: currentRoom.id,
        category,
        title: description.slice(0, 48),
        description,
        photoUrl: photos[0] || AC_LEAK_PHOTO,
        studentName: 'Praew Suk.',
        studentEmail: email,
        urgency
      });

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setSubmitting(false);
      onTicketSubmitted(ticket.id, ticket.accessToken);
    }, 450);
  };

  return (
    <div className="space-y-4 pb-8 animate-fade-in">
      {/* Top Breadcrumb & Step Info */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-spu-pink hover:underline flex items-center gap-1"
        >
          ← Back to Hub
        </button>
        <span className="px-3 py-0.5 rounded-full bg-spu-lightPink text-spu-pink text-[11px] font-extrabold border border-spu-borderPink">
          Step 1 of 2
        </span>
      </div>

      {/* Title & Estimated Time */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Report an Issue
          </h1>
          <span className="text-[11px] text-slate-400 font-semibold">
            Estimated: 1 min
          </span>
        </div>
        {/* Progress Line */}
        <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div className="w-1/2 h-full bg-gradient-to-r from-spu-purple to-spu-magenta rounded-full"></div>
        </div>
      </div>

      {/* Auto-Detected Location Box */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-pink-100 text-spu-pink flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
          <MapPin className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                AUTO-DETECTED LOCATION
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-pink-50 text-spu-pink text-[9px] font-bold border border-pink-200">
                ● Verified GPS
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenQrScanner}
              className="text-xs font-bold text-spu-pink hover:underline shrink-0"
            >
              Change
            </button>
          </div>

          <div className="font-extrabold text-xs text-slate-900 mt-1">
            {currentRoom.building}, Floor {currentRoom.floor}
          </div>
          <div className="text-[11px] text-slate-500">
            {currentRoom.name}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Issue Category (2x3 Grid) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-slate-900">
            Issue Category <span className="text-spu-pink">*</span>
          </label>
          <p className="text-[11px] text-slate-400">
            Select the type of facility problem
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {CATEGORIES.map((item) => {
              const isSelected = category === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`p-3 rounded-2xl text-left flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'bg-[#3B0764] text-white border-[#3B0764] shadow-md'
                      : 'bg-white text-slate-700 border-slate-100 hover:border-pink-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-pink-300' : 'text-slate-500'
                      }`}
                    />
                    <span className="text-xs font-bold truncate">
                      {item.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-spu-pink text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Urgency Level (Normal vs Urgent) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black text-slate-900">
              Urgency Level
            </label>
            <span className="text-[11px] text-slate-400 font-medium">Response SLA</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUrgency('NORMAL')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                urgency === 'NORMAL'
                  ? 'bg-white border-slate-300 shadow-sm ring-1 ring-slate-200'
                  : 'bg-slate-50 border-slate-100 text-slate-400'
              }`}
            >
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-spu-plum"></span>
                Normal
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Routine fix (12–24h)
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUrgency('URGENT')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                urgency === 'URGENT'
                  ? 'bg-pink-50 border-spu-pink shadow-sm ring-1 ring-spu-pink'
                  : 'bg-slate-50 border-slate-100 text-slate-400'
              }`}
            >
              <div className="font-extrabold text-xs text-red-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Urgent
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Hazard, water leak, class halt
              </div>
            </button>
          </div>
        </div>

        {/* Attach Photos or Video */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black text-slate-900">
              Attach Photos or Video
            </label>
            <span className="text-[11px] text-slate-400">
              Max 3 files ({photos.length} attached)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Attached Photo 1 Thumbnail */}
            {photos.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-square border border-slate-200 shadow-inner group"
              >
                <img
                  src={imgUrl}
                  alt={`Attached ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center text-xs hover:bg-red-600 shadow"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-[#3B0764]/90 text-white text-[9px] font-bold text-center py-0.5">
                  Photo {idx + 1}
                </div>
              </div>
            ))}

            {/* Add Photo Button */}
            {photos.length < 3 && (
              <label className="border-2 border-dashed border-slate-200 hover:border-spu-pink rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-pink-50/50 transition-all p-2 text-center">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleAddPhoto(e.target.files[0])}
                />
                <Camera className="w-5 h-5 text-spu-pink mb-1" />
                <span className="text-[10px] font-bold text-slate-700 leading-tight">
                  + Add Photo
                </span>
              </label>
            )}

            {/* Pro Tip Card */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center text-[10px] text-slate-500 leading-tight">
              <span className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                💡 Pro Tip
              </span>
              Capturing room number stickers or barcodes speeds up repairs!
            </div>
          </div>
        </div>

        {/* Describe the Issue Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black text-slate-900">
              Describe the Issue <span className="text-spu-pink">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {description.length} / 500
            </span>
          </div>

          <textarea
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-spu-pink/20 focus:border-spu-pink shadow-sm leading-relaxed"
            placeholder="Describe what happened..."
            required
          />
        </div>

        {/* Student / Staff SPU Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-slate-900">
            Student / Staff SPU Email <span className="text-spu-pink">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-spu-pink/20 focus:border-spu-pink shadow-sm"
              placeholder="praew.suk@spu.ac.th"
              required
            />
            <Mail className="w-4 h-4 text-spu-pink absolute left-3 top-3" />
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            🔔 SMS and email tracking updates are dispatched automatically at every milestone.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#4A154B] via-[#3B0764] to-[#BE185D] hover:from-[#3B0764] hover:to-[#9D174D] text-white text-xs font-black flex items-center justify-center gap-2 shadow-spu active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Report ▷'}
          </button>

          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <span className="text-spu-pink">⚡</span> SPU Facility Team resolves urgent lab tickets within ~30 mins.
          </p>
        </div>
      </form>
    </div>
  );
};
