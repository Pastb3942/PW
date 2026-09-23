import React, { useState } from 'react';
import { Ticket, Room } from '../../types';
import {
  LayoutDashboard,
  ClipboardList,
  QrCode,
  Users2,
  Settings,
  Search,
  Download,
  Plus,
  Bell,
  LogOut,
  Calendar,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  Smile,
  AlertTriangle,
  Zap,
  MoreVertical,
  ChevronDown,
  Printer,
  Sparkles,
  ShieldCheck,
  Send,
  X,
  FileSpreadsheet,
  Check,
  Eye,
  Building
} from 'lucide-react';
import { CURRENT_ADMIN } from '../../lib/mockData';

interface AdminDashboardProps {
  tickets: Ticket[];
  rooms: Room[];
  onOpenTicket?: (ticketId: string) => void;
  onLogoutOrSwitch?: () => void;
}

type AdminSidebarTab = 'dashboard' | 'tickets' | 'qr' | 'techs' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tickets,
  rooms,
  onOpenTicket,
  onLogoutOrSwitch
}) => {
  const [activeTab, setActiveTab] = useState<AdminSidebarTab>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('ตุลาคม 2567 (Oct 2024)');
  const [selectedBuilding, setSelectedBuilding] = useState('ทุกอาคาร (All Buildings)');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isSlaReportModalOpen, setIsSlaReportModalOpen] = useState(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED'>('ALL');

  // Dispatch Form State
  const [dispatchRoomId, setDispatchRoomId] = useState(rooms[0]?.id || 'ROOM-SPU-11-502');
  const [dispatchTitle, setDispatchTitle] = useState('');
  const [dispatchTech, setDispatchTech] = useState('สมชาย การช่าง (โซนเหนือ)');
  const [dispatchUrgent, setDispatchUrgent] = useState(true);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Active tickets count
  const activeTicketsCount = tickets.filter(
    (t) => t.status === 'PENDING' || t.status === 'PENDING_REVIEW' || t.status === 'IN_PROGRESS' || t.status === 'ACKNOWLEDGED'
  ).length;

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Ticket ID,Room,Building,Category,Status,Urgency,Created At,Resolved At,Student Email\n'];
    const rows = tickets.map((t) =>
      `"${t.id}","${t.roomName}","${t.building}","${t.category}","${t.status}","${t.urgency}","${t.createdAt}","${t.resolvedAt || '-'}","${t.studentEmail}"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spu-facility-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchTitle.trim()) return;
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setIsDispatchModalOpen(false);
      setDispatchTitle('');
    }, 1500);
  };

  // Filtered tickets for Ticket Management tab
  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (ticketStatusFilter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS' || t.status === 'ACKNOWLEDGED';
    if (ticketStatusFilter === 'PENDING') return t.status === 'PENDING' || t.status === 'PENDING_REVIEW';
    if (ticketStatusFilter === 'RESOLVED') return t.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col min-h-[920px] font-sans antialiased">
      {/* Top Universal Header Bar */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
        {/* Brand & Campus Ops */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-spu-purple via-spu-magenta to-pink-500 text-white flex items-center justify-center shadow-md font-black text-lg tracking-wider">
              SPU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-tight">
                  UniLoop SPU
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase tracking-wide">
                  Admin Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
                Campus Facilities Ops • ฝ่ายบริหารจัดการอาคาร
              </p>
            </div>
          </div>
        </div>

        {/* Center Search & Campus Filter */}
        <div className="hidden lg:flex items-center gap-2 flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาอาคาร, หมายเลขใบงาน, หรือช่าง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-spu-pink/30 text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors">
            <Building2 className="w-3.5 h-3.5 text-spu-purple" />
            <span>บางเขน Main Campus • ภาคเรียนที่ 1/2567</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Right CTA Actions & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shadow-sm"
            title="ส่งออกข้อมูลเป็น CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* Create Dispatch Button */}
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-spu-purple hover:bg-purple-950 text-white font-extrabold text-xs transition-all shadow-md shadow-purple-950/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">+ Create Dispatch</span>
            <span className="sm:hidden">จ่ายงาน</span>
          </button>

          {/* Notification Bell */}
          <div className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-spu-pink ring-2 ring-white" />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <img
              src={CURRENT_ADMIN.avatarUrl}
              alt="Praew"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-100 shadow-sm"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">Praew</div>
              <div className="text-[10px] text-slate-400 font-medium">Operations Director</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Menu (เมนูภาษาไทย) */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-3 sm:p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              เมนูหลักภาษาไทย (Admin Menu)
            </div>

            {/* Menu 1: Dashboard & Analytics */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-spu-purple' : 'text-slate-400'}`} />
                <span>แดชบอร์ด & สถิติวิเคราะห์</span>
              </div>
            </button>

            {/* Menu 2: Ticket Management */}
            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tickets'
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ClipboardList className={`w-4 h-4 ${activeTab === 'tickets' ? 'text-spu-pink' : 'text-slate-400'}`} />
                <span>จัดการใบงานแจ้งซ่อม</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 text-pink-700">
                {activeTicketsCount || 14} Active
              </span>
            </button>

            {/* Menu 3: Room QR Generator */}
            <button
              onClick={() => setActiveTab('qr')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'qr'
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <QrCode className={`w-4 h-4 ${activeTab === 'qr' ? 'text-spu-purple' : 'text-slate-400'}`} />
                <span>สร้าง QR Code ประจำห้อง</span>
              </div>
            </button>

            {/* Menu 4: Technicians & Zones */}
            <button
              onClick={() => setActiveTab('techs')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'techs'
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users2 className={`w-4 h-4 ${activeTab === 'techs' ? 'text-spu-purple' : 'text-slate-400'}`} />
                <span>ช่างเทคนิค & โซนพื้นที่</span>
              </div>
            </button>

            {/* Menu 5: Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-spu-purple' : 'text-slate-400'}`} />
                <span>ตั้งค่าระบบ</span>
              </div>
            </button>
          </div>

          {/* Bottom Sidebar User Card */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 font-black text-xs flex items-center justify-center shrink-0">
                  SPU
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">Facilities Director</div>
                  <div className="text-[10px] text-slate-400 truncate">Sripatum Univ.</div>
                </div>
              </div>
              {onLogoutOrSwitch && (
                <button
                  onClick={onLogoutOrSwitch}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
                  title="สลับสิทธิ์ / ออกจากโหมด Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* TAB 1: DASHBOARD & ANALYTICS (The Screenshot View) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Title Section */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-black uppercase text-pink-600 tracking-wider">
                      OPERATIONAL INTELLIGENCE
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sync • อัปเดตล่าสุด 2 นาทีที่แล้ว
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Campus Facility Operations & Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
                    ภาพรวมแบบเรียลไทม์ของการคัดกรองงานแจ้งซ่อม ประสิทธิภาพงานช่าง และความสมบูรณ์ของโครงสร้างพื้นฐานทั่วมหาวิทยาลัยศรีปทุม (Sripatum University)
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>เดือนนี้ (ต.ค. 2567)</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>ทุกอาคารในวิทยาเขต</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>

                  <button
                    onClick={() => setIsSlaReportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-spu-purple hover:bg-purple-950 text-white text-xs font-bold shadow-md shadow-purple-950/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Generate SLA Report</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI Card 1: Total Reports This Month */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500">รายงานทั้งหมดเดือนนี้</div>
                      <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">142</div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Sparkline curve & Badge */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-700 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      +12%
                    </span>
                    {/* SVG Sparkline */}
                    <svg className="w-24 h-6 text-pink-500" viewBox="0 0 100 25" fill="none">
                      <path
                        d="M2 18 Q 20 22, 35 15 T 65 10 T 98 4"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      18 เคสด่วนพิเศษ
                    </span>
                    <span>เทียบ 127 ใน ก.ย.</span>
                  </div>
                </div>

                {/* KPI Card 2: Resolution Rate */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500">อัตราการปิดงานสำเร็จ</div>
                      <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">88.5%</div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Trend badge */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      +3.2%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                    <div className="bg-spu-purple h-full rounded-full" style={{ width: '88.5%' }} />
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>ปิดงานแล้ว 126 จาก 142 งาน</span>
                    <span className="font-bold text-slate-700">เป้าหมาย: 85%</span>
                  </div>
                </div>

                {/* KPI Card 3: Avg. Repair Time (MTTR) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500">ระยะเวลาเฉลี่ยในการซ่อม (MTTR)</div>
                      <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">3.4 ชม.</div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-700">
                      -45 นาที
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">เร็วกว่าเกณฑ์ SLA ไตรมาส 2</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="text-purple-700 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      คัดกรองด่วน: 48 นาที
                    </span>
                    <span>เกณฑ์ SLA: &lt; 4 ชม.</span>
                  </div>
                </div>

                {/* KPI Card 4: Satisfaction Score */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500">คะแนนความพึงพอใจ</div>
                      <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight flex items-baseline gap-1">
                        4.7 <span className="text-sm font-normal text-slate-400">/ 5.0</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
                      <Smile className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Stars & Feedback */}
                  <div className="mt-3 flex items-center gap-1 text-pink-500 text-sm">
                    {'★★★★★'}
                    <span className="text-[11px] text-slate-500 ml-1.5 font-medium">
                      พึงพอใจ 96%
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>จากผู้ประเมิน 118 ราย</span>
                    <span className="font-bold text-pink-600">SPU Quality Standard</span>
                  </div>
                </div>
              </div>

              {/* Bottom 2 Major Panels: Problem Hotspots & Issues by Category */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Panel: Problem Hotspots by Building (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-800" />
                      <div>
                        <h2 className="font-black text-slate-900 text-sm sm:text-base">
                          จุดแจ้งซ่อมบ่อยตามอาคาร (Problem Hotspots by Building)
                        </h2>
                        <p className="text-[11px] text-slate-400">
                          สถิติการกระจายตัวของใบงานซ่อมบำรุงในแต่ละอาคารประจำเดือนนี้
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                      5 โซนวิทยาเขต
                    </span>
                  </div>

                  {/* Hotspots List */}
                  <div className="space-y-4 pt-2">
                    {/* Item 1: Building 11 */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">อาคาร 11 • Multimedia & Tech Lab</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-pink-100 text-pink-700 uppercase">
                            HIGH DENSITY
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <span>เฉลี่ย 2.8 ชม.</span>
                          <span className="font-bold text-slate-800">48 งาน (34%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-spu-purple h-full rounded-full" style={{ width: '34%' }} />
                      </div>
                    </div>

                    {/* Item 2: Building 9 */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">อาคาร 9 • Engineering Complex</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <span>เฉลี่ย 3.1 ชม.</span>
                          <span className="font-bold text-slate-800">32 งาน (23%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-purple-700 h-full rounded-full" style={{ width: '23%' }} />
                      </div>
                    </div>

                    {/* Item 3: Building 5 */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">อาคาร 5 • Communication Arts Studio</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <span>เฉลี่ย 2.5 ชม.</span>
                          <span className="font-bold text-slate-800">26 งาน (18%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-pink-600 h-full rounded-full" style={{ width: '18%' }} />
                      </div>
                    </div>

                    {/* Item 4: Central Library */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">หอสมุดกลาง & ศูนย์การเรียนรู้ (Central Library)</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <span>เฉลี่ย 1.9 ชม.</span>
                          <span className="font-bold text-slate-800">21 งาน (15%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-purple-900 h-full rounded-full" style={{ width: '15%' }} />
                      </div>
                    </div>

                    {/* Item 5: Student Union */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">ศูนย์กิจกรรมนักศึกษา & โรงอาหารกลาง</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <span>เฉลี่ย 4.2 ชม.</span>
                          <span className="font-bold text-slate-800">15 งาน (10%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-slate-400 h-full rounded-full" style={{ width: '10%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Issues by Category (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-black text-slate-900 text-sm sm:text-base">
                        ประเภทปัญหาที่แจ้งซ่อม (Issues by Category)
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        สัดส่วนการรายงานปัญหาตามประเภทอุปกรณ์
                      </p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
                  </div>

                  {/* SVG Donut Chart with Center Text */}
                  <div className="py-2 flex items-center justify-center relative">
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="14" fill="none" />
                      {/* Segment 1: HVAC 42% (circumference ~ 238.76, 42% = 100.28) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#be185d"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray="100.3 238.8"
                        strokeDashoffset="0"
                      />
                      {/* Segment 2: Electrical 28% (66.85) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#3b0764"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray="66.8 238.8"
                        strokeDashoffset="-100.3"
                      />
                      {/* Segment 3: Furniture 18% (43.0) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#ec4899"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray="43.0 238.8"
                        strokeDashoffset="-167.1"
                      />
                      {/* Segment 4: Sanitary & Misc 12% (28.6) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#cbd5e1"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray="28.6 238.8"
                        strokeDashoffset="-210.1"
                      />
                    </svg>

                    {/* Donut Center Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">142</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Total issues</span>
                    </div>
                  </div>

                  {/* Legend Grid (2x2) */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#be185d] shrink-0" />
                        <span className="text-slate-700 font-semibold truncate">HVAC / แอร์</span>
                      </div>
                      <span className="font-extrabold text-slate-900 ml-1">42% (60)</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b0764] shrink-0" />
                        <span className="text-slate-700 font-semibold truncate">ระบบไฟฟ้า</span>
                      </div>
                      <span className="font-extrabold text-slate-900 ml-1">28% (40)</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899] shrink-0" />
                        <span className="text-slate-700 font-semibold truncate">โต๊ะและเก้าอี้</span>
                      </div>
                      <span className="font-extrabold text-slate-900 ml-1">18% (26)</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] shrink-0" />
                        <span className="text-slate-700 font-semibold truncate">สุขภัณฑ์ / อื่นๆ</span>
                      </div>
                      <span className="font-extrabold text-slate-900 ml-1">12% (16)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TICKET MANAGEMENT (จัดการใบงานแจ้งซ่อม) */}
          {activeTab === 'tickets' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">จัดการใบงานแจ้งซ่อม (Ticket Management)</h2>
                  <p className="text-xs text-slate-500">
                    ติดตามและมอบหมายงานแจ้งซ่อมทั้งหมดแบบเรียลไทม์ ({tickets.length} รายการในระบบ)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ส่งออก CSV</span>
                  </button>
                  <button
                    onClick={() => setIsDispatchModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-spu-purple text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ จ่ายงานด่วน</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
                {[
                  { id: 'ALL', label: 'ทั้งหมด', count: tickets.length },
                  {
                    id: 'IN_PROGRESS',
                    label: 'กำลังซ่อมแซม',
                    count: tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'ACKNOWLEDGED').length
                  },
                  {
                    id: 'PENDING',
                    label: 'รอดำเนินการ',
                    count: tickets.filter((t) => t.status === 'PENDING' || t.status === 'PENDING_REVIEW').length
                  },
                  {
                    id: 'RESOLVED',
                    label: 'ซ่อมเสร็จแล้ว',
                    count: tickets.filter((t) => t.status === 'RESOLVED').length
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTicketStatusFilter(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      ticketStatusFilter === item.id
                        ? 'bg-spu-purple text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        ticketStatusFilter === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tickets Table / List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {filteredTickets.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      ไม่พบรายการแจ้งซ่อมตามเงื่อนไขที่เลือก
                    </div>
                  ) : (
                    filteredTickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-700 text-xs shrink-0">
                            #{t.id.slice(-4)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 truncate">{t.title}</span>
                              {t.urgency === 'URGENT' || t.urgency === 'CRITICAL' ? (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-700">
                                  ด่วน
                                </span>
                              ) : null}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>{t.roomName}</span>
                              <span>•</span>
                              <span>{t.categoryLabel || t.category}</span>
                              <span>•</span>
                              <span>ช่าง: {t.assignedTechName || 'ยังไม่ระบุ'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              t.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : t.status === 'IN_PROGRESS'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {t.status === 'RESOLVED'
                              ? 'ซ่อมเสร็จสิ้น'
                              : t.status === 'IN_PROGRESS'
                              ? 'กำลังซ่อม'
                              : 'รอดำเนินการ'}
                          </span>

                          {onOpenTicket && (
                            <button
                              onClick={() => onOpenTicket(t.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              <span>ดูเคส</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROOM QR GENERATOR (สร้าง QR Code ประจำห้อง) */}
          {activeTab === 'qr' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-xl font-black text-slate-900">สร้าง QR Code ประจำห้อง (Room QR Generator)</h2>
                <p className="text-xs text-slate-500">
                  ดาวน์โหลดหรือสั่งพิมพ์ QR Code สำหรับติดประจำห้องเรียนและสิ่งอำนวยความสะดวกใน SPU
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {room.building}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">ชั้น {room.floor}</span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-2">{room.name}</h3>
                      <p className="text-[11px] text-slate-400">รหัสห้อง: {room.roomNumber}</p>
                    </div>

                    {/* QR Preview Box */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-spu-purple" />
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-2">{room.qrToken}</div>
                    </div>

                    <button
                      onClick={() => alert(`พิมพ์ QR Code สำหรับ: ${room.name}`)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>สั่งพิมพ์ป้ายสแกนแจ้งซ่อม</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TECHNICIANS & ZONES (ช่างเทคนิค & โซนพื้นที่) */}
          {activeTab === 'techs' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-xl font-black text-slate-900">ช่างเทคนิค & โซนพื้นที่ (Technicians & Zones)</h2>
                <p className="text-xs text-slate-500">
                  ทีมช่างวิศวกรรมบำรุงรักษาประจำวิทยาเขตบางเขน และสถานะกำลังปฏิบัติงาน
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'ช่างสมชาย การช่าง',
                    role: 'หัวหน้าทีมช่างระบบปรับอากาศและไฟฟ้า',
                    zone: 'โซนเหนือ (อาคาร 5, 11)',
                    activeJobs: 3,
                    completedJobs: 42,
                    status: 'กำลังเข้าซ่อมหน้างาน'
                  },
                  {
                    name: 'ช่างวิชัย โชคอำนวย',
                    role: 'ช่างเทคนิคระบบประปาและสุขภัณฑ์',
                    zone: 'โซนกลาง (หอสมุดกลาง, โรงอาหาร)',
                    activeJobs: 1,
                    completedJobs: 38,
                    status: 'พร้อมรับงาน'
                  },
                  {
                    name: 'ช่างอนุชา สิทธิชัย',
                    role: 'ช่างซ่อมบำรุงโสตทัศนูปกรณ์ & คอมพิวเตอร์',
                    zone: 'โซนใต้ (อาคาร 9, อาคารกิจกรรม)',
                    activeJobs: 2,
                    completedJobs: 29,
                    status: 'กำลังเข้าซ่อมหน้างาน'
                  },
                  {
                    name: 'ช่างประเสริฐ กลิ่นหอม',
                    role: 'ช่างไม้ ครุภัณฑ์และประตูหน้าต่าง',
                    zone: 'ทุกอาคารในวิทยาเขต',
                    activeJobs: 0,
                    completedJobs: 17,
                    status: 'พร้อมรับงาน'
                  }
                ].map((tech, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{tech.name}</h3>
                        <p className="text-xs text-slate-500">{tech.role}</p>
                        <p className="text-[11px] text-spu-purple font-semibold mt-1">📍 {tech.zone}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          tech.status === 'พร้อมรับงาน' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tech.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="bg-slate-50 p-2 rounded-xl text-center">
                        <div className="text-slate-400 text-[10px]">งานที่ค้างซ่อม</div>
                        <div className="font-black text-slate-900 text-base">{tech.activeJobs} งาน</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl text-center">
                        <div className="text-slate-400 text-[10px]">งานที่ปิดแล้วเดือนนี้</div>
                        <div className="font-black text-emerald-600 text-base">{tech.completedJobs} งาน</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS (ตั้งค่าระบบ) */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-fade-in max-w-2xl">
              <div>
                <h2 className="text-xl font-black text-slate-900">ตั้งค่าระบบ (Settings)</h2>
                <p className="text-xs text-slate-500">
                  กำหนดค่าเกณฑ์มาตรฐานการบริการ (SLA) และการแจ้งเตือนงานด่วน
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800">เกณฑ์เป้าหมาย SLA การปิดงานทั่วไป</label>
                  <p className="text-[11px] text-slate-400">ระยะเวลาสูงสุดที่ช่างควรปิดงานสำหรับคำร้องทั่วไป</p>
                  <select className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                    <option>ภายใน 4 ชั่วโมง (มาตรฐานมหาวิทยาลัย)</option>
                    <option>ภายใน 8 ชั่วโมง</option>
                    <option>ภายใน 24 ชั่วโมง</option>
                  </select>
                </div>

                <div className="space-y-1 pt-3 border-t border-slate-100">
                  <label className="text-xs font-extrabold text-slate-800">เกณฑ์ตอบสนองคำร้องด่วนพิเศษ (Urgent SLA)</label>
                  <p className="text-[11px] text-slate-400">เวลาตอบรับและส่งช่างเข้าจุดสำหรับเคสน้ำรั่วหรือไฟฟ้าลัดวงจร</p>
                  <select className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                    <option>ภายใน 30 นาที</option>
                    <option>ภายใน 45 นาที</option>
                    <option>ภายใน 1 ชั่วโมง</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">ส่งอีเมลแจ้งเตือนผู้บริหารเมื่อมีเคสด่วน</div>
                    <div className="text-[11px] text-slate-400">แจ้งเตือนอัตโนมัติไปยัง praew.director@spu.ac.th</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-spu-purple rounded" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DISPATCH MODAL (+ Create Dispatch) */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-spu-purple flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">สร้างใบสั่งงานด่วน (+ Create Dispatch)</h3>
                  <p className="text-[11px] text-slate-400">มอบหมายงานไปยังช่างเทคนิคประจำโซนทันที</p>
                </div>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {dispatchSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">มอบหมายงานสำเร็จแล้ว!</h4>
                <p className="text-xs text-slate-500">ระบบได้แจ้งเตือนช่างเทคนิคและอัปเดตลงคิวงานแล้ว</p>
              </div>
            ) : (
              <form onSubmit={handleCreateDispatchSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">สถานที่ / ห้องเรียน</label>
                  <select
                    value={dispatchRoomId}
                    onChange={(e) => setDispatchRoomId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.building} - {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">รายละเอียดงานที่ต้องดำเนินการ</label>
                  <textarea
                    rows={3}
                    placeholder="เช่น ตรวจสอบแอร์น้ำหยด หรือเปลี่ยนหลอดไฟห้องเรียนด่วน..."
                    value={dispatchTitle}
                    onChange={(e) => setDispatchTitle(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">มอบหมายให้ช่างเทคนิค</label>
                  <select
                    value={dispatchTech}
                    onChange={(e) => setDispatchTech(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800"
                  >
                    <option>สมชาย การช่าง (โซนเหนือ - แอร์และไฟฟ้า)</option>
                    <option>วิชัย โชคอำนวย (โซนกลาง - ประปาและสุขภัณฑ์)</option>
                    <option>อนุชา สิทธิชัย (โซนใต้ - โสตทัศนูปกรณ์)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="urgentCheck"
                    checked={dispatchUrgent}
                    onChange={(e) => setDispatchUrgent(e.target.checked)}
                    className="w-4 h-4 text-spu-purple rounded"
                  />
                  <label htmlFor="urgentCheck" className="text-slate-700 font-bold">
                    กำหนดเป็นเคสด่วนพิเศษ (Urgent SLA &lt; 30 นาที)
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-spu-purple hover:bg-purple-950 text-white font-extrabold shadow-md shadow-purple-950/20"
                  >
                    ออกใบสั่งงาน
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SLA REPORT MODAL */}
      {isSlaReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-spu-purple flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">สรุปรายงาน SLA มหาวิทยาลัยศรีปทุม</h3>
                  <p className="text-[11px] text-slate-400">ประจำภาคเรียนที่ 1/2567 (เดือนตุลาคม)</p>
                </div>
              </div>
              <button
                onClick={() => setIsSlaReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100">
                <div className="font-bold text-spu-purple text-xs">ภาพรวมความสำเร็จด้านบริการ</div>
                <div className="text-slate-700 mt-1">
                  อัตราการปิดงานสำเร็จตามกำหนด SLA อยู่ที่ <strong>88.5%</strong> (สูงกว่าเป้าหมายมหาวิทยาลัยที่ตั้งไว้ 85%) โดยมีระยะเวลาเฉลี่ย (MTTR) อยู่ที่ <strong>3.4 ชั่วโมง</strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">สถิติแยกตามประเภทงานซ่อม:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400">เครื่องปรับอากาศ (HVAC)</div>
                    <div className="font-black text-slate-800">SLA บรรลุ 91%</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400">ระบบไฟฟ้า & หลอดไฟ</div>
                    <div className="font-black text-slate-800">SLA บรรลุ 89%</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400">โสตทัศนูปกรณ์ & จอภาพ</div>
                    <div className="font-black text-slate-800">SLA บรรลุ 84%</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400">ประปาและสุขภัณฑ์</div>
                    <div className="font-black text-slate-800">SLA บรรลุ 94%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsSlaReportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                ปิด
              </button>
              <button
                onClick={() => {
                  handleExportCSV();
                  setIsSlaReportModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-spu-purple text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดรายงานฉบับเต็ม (CSV)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
