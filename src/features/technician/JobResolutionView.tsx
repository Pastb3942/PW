import React, { useState } from 'react';
import { Ticket } from '../../types';
import { updateTicketStatus } from '../../lib/storage';
import { AC_REPAIR_PROOF_PHOTO, CURRENT_TECH } from '../../lib/mockData';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Camera,
  ShieldCheck,
  Send,
  Save,
  ArrowRightLeft,
  X,
  Plus,
  RotateCw,
  Sparkles,
  Check,
  Mail,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JobResolutionViewProps {
  ticket?: Ticket;
  onBack: () => void;
  onResolved: () => void;
}

export const JobResolutionView: React.FC<JobResolutionViewProps> = ({
  ticket,
  onBack,
  onResolved
}) => {
  const currentTicket = ticket || {
    id: 'SPU-8821',
    refNumber: 'TK-1083',
    roomId: 'ROOM-SPU-11-502',
    roomName: 'Building 11, Fl. 5, Room 11-502',
    building: 'Building 11',
    floor: 5,
    roomNumber: '11-502',
    category: 'AIR_CONDITIONER' as const,
    categoryLabel: 'Air Conditioner',
    title: 'Water leaking heavily from cassette AC unit over lecture desk 14',
    description:
      'Water leaking heavily from AC vent onto computer desk 14. Loud humming vibration sound since 9:00 AM lecture started.',
    photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    studentName: 'Praew Suk.',
    studentEmail: 'praew.suk@spu.ac.th',
    status: 'IN_PROGRESS' as const,
    urgency: 'URGENT' as const,
    urgencyTag: 'Urgent • Water Leakage',
    equipmentDetails: 'Daikin Cassette 36,000 BTU (Unit AC-01)',
    consumedParts: [
      { name: '1x Drain Pipe Flush Kit', qty: 1 },
      { name: '4x Rubber Damper Bushings', qty: 4 }
    ],
    safetyChecklist: {
      electricalSafe: true,
      areaCleaned: true,
      testPassed: true
    },
    resolutionProofPhotoUrl: AC_REPAIR_PROOF_PHOTO,
    accessToken: 'ac79e41b7194f8d2983b6e8a0021c45f',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subscribers: ['praew.suk@spu.ac.th'],
    upvotes: 12,
    events: []
  };

  const [activeStep, setActiveStep] = useState<number>(2); // 1: In Progress, 2: In Progress (On-site), 3: Resolved
  const [remarks, setRemarks] = useState(
    'Cleared clogged condensation drainage line and flushed drip tray. Replaced worn vibration damper rubber mount on fan motor. Unit tested running at 24°C for 20 minutes'
  );
  const [parts, setParts] = useState([
    '1x Drain Pipe Flush Kit',
    '4x Rubber Damper Bushings'
  ]);
  const [newPartName, setNewPartName] = useState('');
  const [isAddingPart, setIsAddingPart] = useState(false);

  const [checklist, setChecklist] = useState({
    electricalSafe: true,
    areaCleaned: true,
    testPassed: true
  });

  const [submitting, setSubmitting] = useState(false);

  const handleAddPart = () => {
    if (newPartName.trim()) {
      setParts([...parts, newPartName.trim()]);
      setNewPartName('');
      setIsAddingPart(false);
    }
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleSubmitResolution = () => {
    setSubmitting(true);
    setTimeout(() => {
      updateTicketStatus({
        ticketId: currentTicket.id,
        status: 'RESOLVED',
        note: remarks,
        proofPhotoUrl: AC_REPAIR_PROOF_PHOTO,
        technicianName: CURRENT_TECH.name,
        consumedParts: parts.map((p) => ({ name: p, qty: 1 })),
        safetyChecklist: checklist
      });

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}

      setSubmitting(false);
      onResolved();
    }, 500);
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-700 hover:text-spu-plum flex items-center gap-1"
        >
          ← Back to Queue
        </button>
        <span className="text-xs font-extrabold text-slate-900">
          Job Update & Resolution
        </span>
        <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200">
          <img
            src={CURRENT_TECH.avatarUrl}
            alt={CURRENT_TECH.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Ticket Header Box */}
      <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-900">
            {currentTicket.refNumber || 'TK-1083'} Ref: {currentTicket.id}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200">
            ● Urgent • Water Leakage
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-50 pb-2">
          <span className="flex items-center gap-1 font-semibold text-rose-600">
            <Clock className="w-3.5 h-3.5" />
            Elapsed: 53m 53s
          </span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Field Tech Online
          </span>
        </div>

        {/* Location & Equipment Info */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-pink-50 text-spu-pink flex items-center justify-center shrink-0 shadow-inner">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-spu-pink">
              MULTIMEDIA LAB
            </span>
            <div className="font-extrabold text-xs text-slate-900">
              Building 11, Fl. 5, Room 11-502
            </div>
            <div className="text-[11px] text-slate-500">
              {currentTicket.equipmentDetails || 'Daikin Cassette 36,000 BTU (Unit AC-01)'}
            </div>
          </div>
        </div>

        {/* Reporter info and initial photo quote */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">
              👤 {currentTicket.studentName || 'Praew Suk.'}
            </span>
            <span className="text-[11px] text-spu-pink font-semibold">
              {currentTicket.studentEmail}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 italic leading-snug">
            "{currentTicket.description}"
          </p>

          <div className="flex items-center gap-2 pt-1">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
              <img
                src={currentTicket.photoUrl}
                alt="Initial leak"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[10px] text-slate-500">
              <span className="font-bold text-slate-700 block">Original Leaking Unit</span>
              Desk 14 damage threat • Reported 09:12 AM
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Status Progression (Step 2 of 3) */}
      <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-black text-slate-900">
            Ticket Status Progression
          </h3>
          <span className="text-[11px] font-bold text-spu-pink">
            Step 2 of 3
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <button
            onClick={() => setActiveStep(1)}
            className={`p-2.5 rounded-2xl border transition-all ${
              activeStep === 1
                ? 'bg-[#3B0764] text-white border-[#3B0764] shadow-sm'
                : 'bg-slate-50 border-slate-100 text-slate-600'
            }`}
          >
            <div className="font-bold text-xs">In Progress</div>
            <div className="text-[9px] text-purple-200 mt-0.5">On-site Tech</div>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`p-2.5 rounded-2xl border transition-all ${
              activeStep === 2
                ? 'bg-[#3B0764] text-white border-[#3B0764] shadow-sm'
                : 'bg-slate-50 border-slate-100 text-slate-600'
            }`}
          >
            <div className="font-bold text-xs">Waiting Parts</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Stock check</div>
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`p-2.5 rounded-2xl border transition-all ${
              activeStep === 3
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 border-slate-100 text-slate-600'
            }`}
          >
            <div className="font-bold text-xs">Resolved</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Ready to close</div>
          </button>
        </div>
      </div>

      {/* Field Repair Evidence (Before / After) */}
      <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-xs text-slate-900">
              Field Repair Evidence
            </h3>
            <p className="text-[11px] text-slate-400">
              Provide certified verification photos
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-200">
            Before / After
          </span>
        </div>

        {/* Verification Inspection Photo Container */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video border border-slate-200 shadow-inner">
          <img
            src={AC_REPAIR_PROOF_PHOTO}
            alt="Post repair inspection"
            className="w-full h-full object-cover"
          />

          {/* Top-left overlay pill */}
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            POST-REPAIR INSPECTION
          </div>

          {/* Bottom-right verified status */}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-spu-purple/90 backdrop-blur-sm text-white text-[10px] font-extrabold flex items-center gap-1 shadow">
            <Check className="w-3 h-3 text-pink-300" />
            Dry & Operational
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <div>
            <span className="font-bold text-slate-700 block">
              after_repair_compressor_fixed.jpg
            </span>
            <span className="text-[10px] text-slate-400">
              Verified by Somchai K. (ID: TECH-609)
            </span>
          </div>
          <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button className="w-full py-2.5 px-4 rounded-2xl bg-pink-50 hover:bg-pink-100 text-spu-pink text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-pink-200">
          <Camera className="w-4 h-4" />
          Take Additional Angle / Proof
        </button>
      </div>

      {/* Technician Remarks & Action (Required) */}
      <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xs text-slate-900">
            Technician Remarks & Action
          </h3>
          <span className="text-[10px] font-bold text-rose-500">
            Required
          </span>
        </div>

        <textarea
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-spu-pink/20"
        />

        {/* Inventory & Spares Consumed */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-600 block">
            Inventory & Spares Consumed
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {parts.map((part, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-pink-50 border border-pink-200 text-spu-plum text-[11px] font-bold flex items-center gap-1.5"
              >
                <span>⚡ + {part}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePart(idx)}
                  className="text-pink-400 hover:text-pink-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}

            {isAddingPart ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="e.g. 1x Drain Tube"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="px-2 py-1 text-xs border rounded-lg"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="px-2 py-1 bg-spu-plum text-white rounded-lg text-xs"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingPart(true)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1"
              >
                + Add Part
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400">
            Deducted automatically from Sripatum Campus Central Depot.
          </p>
        </div>
      </div>

      {/* Safety & Handover Protocol Checklist */}
      <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2.5">
        <h3 className="font-black text-xs text-slate-900 mb-1">
          Safety & Handover Protocol
        </h3>

        {[
          { key: 'electricalSafe', label: 'Electrical wiring safety check completed' },
          { key: 'areaCleaned', label: 'Desk 14 workstation dried and sanitised' },
          { key: 'testPassed', label: 'Thermostat test run passed (24°C / 20 min)' }
        ].map((item) => {
          const checked = (checklist as any)[item.key];
          return (
            <label
              key={item.key}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  setChecklist({
                    ...checklist,
                    [item.key]: !checked
                  })
                }
                className="w-4 h-4 text-spu-plum rounded border-slate-300 focus:ring-spu-pink"
              />
              <span className="font-semibold">{item.label}</span>
            </label>
          );
        })}
      </div>

      {/* Final Action Button */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleSubmitResolution}
          disabled={submitting}
          className="w-full py-3.5 px-5 bg-gradient-to-r from-[#4A154B] via-[#3B0764] to-[#BE185D] hover:from-[#3B0764] hover:to-[#9D174D] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-spu active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Mail className="w-4 h-4" />
          {submitting ? 'Notifying student...' : 'Mark as Resolved & Send Email Alert'}
        </button>

        <p className="text-[10px] text-slate-400 text-center leading-tight">
          Instantly notifies <strong className="text-slate-600">{currentTicket.studentEmail}</strong> and SPU Facility Operations with certified before/after documentation.
        </p>

        {/* Bottom Save Draft & Handover Row */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={onBack}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Handover Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
