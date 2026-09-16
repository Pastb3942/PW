import React, { useState } from 'react';
import { Ticket } from '../../types';
import {
  QrCode,
  Search,
  SlidersHorizontal,
  Megaphone,
  X,
  Camera,
  ThumbsUp,
  MessageSquare,
  Clock,
  Building2,
  AirVent,
  Lightbulb,
  Wrench,
  Video,
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  tickets: Ticket[];
  onStartReport: (roomId?: string, category?: string) => void;
  onOpenQrScanner: () => void;
  onSelectTicket: (ticketId: string, token: string) => void;
  onViewAllReports?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  tickets,
  onStartReport,
  onOpenQrScanner,
  onSelectTicket,
  onViewAllReports
}) => {
  const [showAlert, setShowAlert] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuickBldg, setSelectedQuickBldg] = useState<string | null>(null);

  const activeReportsCount = tickets.filter(
    (t) => t.status === 'IN_PROGRESS' || t.status === 'PENDING' || t.status === 'PENDING_REVIEW'
  ).length;

  return (
    <div className="space-y-4 pb-4 animate-fade-in">
      {/* Greeting & University Location */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
            Hello, Praew! <span>🖐️</span>
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <span className="text-spu-pink">📍</span> Sripatum University • Bangkhen
          </p>
        </div>

        {/* 2 Active Badge */}
        <div className="px-3 py-1 rounded-full bg-spu-lightPink text-spu-pink text-xs font-bold flex items-center gap-1.5 border border-spu-borderPink">
          <span className="w-2 h-2 rounded-full bg-spu-pink"></span>
          {activeReportsCount} Active
        </div>
      </div>

      {/* Campus Alert Banner */}
      {showAlert && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/80 relative shadow-sm">
          <button
            onClick={() => setShowAlert(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 pr-4">
            <div className="w-8 h-8 rounded-xl bg-spu-plum text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Megaphone className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-spu-plum bg-white/80 px-2 py-0.5 rounded-md">
                  CAMPUS ALERT
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Oct 28</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                AC Maintenance: Bldg 11 (Fl. 4-8)
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                Scheduled overhaul this Saturday. Please report pre-existing cooling leaks ahead of time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Report via Room QR Hero Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#3B0764] via-[#4A154B] to-[#2E0249] text-white p-5 text-center shadow-spu relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-spu-pink/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* QR Icon in rounded square with pink badge */}
        <div className="relative inline-block mb-2">
          <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-3 shadow-inner" style={{ width: '3.5rem', height: '3.5rem' }}>
            <QrCode className="w-7 h-7 text-pink-200" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-spu-pink flex items-center justify-center text-[9px] font-black text-white ring-2 ring-[#3B0764]">
            ✓
          </span>
        </div>

        <h2 className="text-base font-extrabold text-white tracking-tight">
          Quick Report via Room QR
        </h2>
        <p className="text-[11px] text-purple-200/90 mt-1 max-w-xs mx-auto leading-relaxed">
          Scan barcode stickers on lecture desks, projectors, or entrance doors to auto-fill location.
        </p>

        <button
          onClick={onOpenQrScanner}
          className="mt-4 w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#DB2777] to-[#BE185D] hover:from-[#BE185D] hover:to-[#9D174D] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-glow-pink active:scale-[0.98] transition-all"
        >
          <Camera className="w-4 h-4" />
          Open QR Scanner
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search building, floor, or room..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-pink/20 focus:border-spu-pink shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <button className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[11px] font-extrabold text-slate-400 tracking-wider mr-1">
          QUICK:
        </span>
        {['Bldg 11', 'Bldg 5', 'Central Library', 'Cafeteria'].map((bldg) => {
          const isSelected = selectedQuickBldg === bldg;
          return (
            <button
              key={bldg}
              onClick={() => setSelectedQuickBldg(isSelected ? null : bldg)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap text-[11px] transition-all ${
                isSelected
                  ? 'bg-spu-plum text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {bldg}
            </button>
          );
        })}
      </div>

      {/* Issue Categories Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-900">
            Issue Categories
          </h3>
          <button
            onClick={() => onStartReport()}
            className="text-[11px] font-bold text-spu-pink hover:underline"
          >
            Browse all
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {[
            { id: 'AIR_CONDITIONER', label: 'Air Cond.', icon: AirVent },
            { id: 'LIGHTS_ELECTRICAL', label: 'Electrical', icon: Lightbulb },
            { id: 'SANITARY', label: 'Sanitary', icon: Wrench },
            { id: 'PROJECTOR_PC', label: 'Class AV', icon: Video }
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onStartReport(undefined, cat.id)}
                className="p-3 bg-white hover:bg-pink-50/50 border border-slate-100 hover:border-pink-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all group active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-spu-lightPink text-slate-600 group-hover:text-spu-pink flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-900 leading-none truncate w-full text-center">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Campus Reports Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
            Recent Campus Reports <span className="text-spu-pink">•</span>
          </h3>
          <button
            onClick={onViewAllReports}
            className="text-[11px] font-bold text-spu-pink flex items-center hover:underline"
          >
            See All ({tickets.length}) <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="space-y-2">
          {tickets.slice(0, 3).map((ticket) => {
            const isInProgress = ticket.status === 'IN_PROGRESS';
            const isResolved = ticket.status === 'RESOLVED';
            const isPending = ticket.status === 'PENDING' || ticket.status === 'PENDING_REVIEW';

            return (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket.id, ticket.accessToken)}
                className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 text-spu-pink flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {ticket.category === 'AIR_CONDITIONER' && '❄️'}
                      {ticket.category === 'PROJECTOR_PC' && '📽️'}
                      {ticket.category === 'DESK_CHAIR' && '🪑'}
                      {ticket.category === 'SANITARY' && '🚿'}
                      {ticket.category === 'LIGHTS_ELECTRICAL' && '💡'}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {ticket.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {ticket.building}, Room {ticket.roomNumber}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge Pill */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap ${
                      isInProgress
                        ? 'bg-spu-lightPink text-spu-pink'
                        : isResolved
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    ● {isInProgress ? 'In Progress' : isResolved ? 'Resolved' : 'Pending'}
                  </span>
                </div>

                {/* Footer Info: Timestamp, Likes, Comments */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ticket.timeAgoText || 'Today'}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium hover:text-spu-pink">
                      <ThumbsUp className="w-3 h-3" />
                      {ticket.upvotes}
                    </span>
                    {ticket.commentsCount !== undefined && (
                      <span className="flex items-center gap-1 font-medium">
                        <MessageSquare className="w-3 h-3" />
                        {ticket.commentsCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
