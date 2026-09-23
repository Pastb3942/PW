import { Room, Ticket, EmailNotification, TicketStatus, UrgencyLevel, EquipmentCategory } from '../types';
import { INITIAL_ROOMS, INITIAL_TICKETS } from './mockData';

const TICKETS_STORAGE_KEY = 'spu_facility_fix_tickets_v3';
const ROOMS_STORAGE_KEY = 'spu_facility_fix_rooms_v3';
const EMAILS_STORAGE_KEY = 'spu_facility_fix_emails_v3';
const RECENT_TICKETS_KEY = 'spu_facility_fix_recent_v3';

export function initStorage(): void {
  if (!localStorage.getItem(TICKETS_STORAGE_KEY)) {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
  }
  if (!localStorage.getItem(ROOMS_STORAGE_KEY)) {
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(INITIAL_ROOMS));
  }
  if (!localStorage.getItem(EMAILS_STORAGE_KEY)) {
    const initialEmail: EmailNotification = {
      id: 'MAIL-SPU-01',
      to: 'praew.suk@spu.ac.th',
      subject: '[แจ้งซ่อม SPU] รหัส #SPU-8821: ช่างสมชาย การช่าง ถึงหน้างานแล้วที่ อาคาร 11 ชั้น 5 ห้อง 11-502',
      type: 'IN_PROGRESS',
      ticketId: 'SPU-8821',
      ticketToken: 'ac79e41b7194f8d2983b6e8a0021c45f',
      sentAt: new Date(Date.now() - 1800000).toISOString(),
      isRead: false,
      previewHtml: `
        <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 20px; border: 1px solid #fbcfe8; border-radius: 16px; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #3b0764, #be185d); color: white; padding: 16px; border-radius: 12px; text-align: center;">
            <h2 style="margin: 0; font-size: 18px;">ระบบแจ้งซ่อม SPU • อัปเดตสถานะ</h2>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">ช่างเทคนิคถึงหน้างานแล้ว</p>
          </div>
          <div style="padding: 16px 0; color: #334155; font-size: 13px; line-height: 1.6;">
            <p>เรียน คุณแพรว,</p>
            <p><strong>ช่างสมชาย การช่าง</strong> ได้เดินทางถึง <strong>อาคาร 11 ชั้น 5 ห้อง 11-502</strong> เพื่อดำเนินการแก้ไขรายการแจ้งซ่อม: <em>"น้ำแอร์หยดลงโต๊ะเรียนแถว 14 อย่างหนัก"</em> เรียบร้อยแล้ว</p>
            <div style="background: #fdf2f8; padding: 12px; border-radius: 8px; border-left: 4px solid #db2777; margin: 12px 0;">
              <strong>บันทึกจากช่าง:</strong> กำลังล้างทำความสะอาดท่อน้ำทิ้งและเคลียร์ถาดน้ำทิ้ง
            </div>
            <p style="text-align: center; margin-top: 20px;">
              <a href="#/track/SPU-8821" style="background: #3b0764; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">ดูสถานะติดตามงานแบบเรียลไทม์</a>
            </p>
          </div>
        </div>
      `
    };
    localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify([initialEmail]));
  }
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function getTickets(): Ticket[] {
  initStorage();
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function getTicketById(id: string): Ticket | undefined {
  const tickets = getTickets();
  return tickets.find((t) => t.id === id);
}

export function getRooms(): Room[] {
  initStorage();
  try {
    const raw = localStorage.getItem(ROOMS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function getRoomById(id: string): Room | undefined {
  const rooms = getRooms();
  return rooms.find((r) => r.id === id || r.qrToken === id);
}

export function checkDuplicateActiveTicket(roomId: string, category: EquipmentCategory): Ticket | undefined {
  const tickets = getTickets();
  return tickets.find(
    (t) =>
      t.roomId === roomId &&
      t.category === category &&
      (t.status === 'PENDING' || t.status === 'PENDING_REVIEW' || t.status === 'ACKNOWLEDGED' || t.status === 'IN_PROGRESS')
  );
}

export function generateAccessToken(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function getEmailNotifications(): EmailNotification[] {
  initStorage();
  try {
    const raw = localStorage.getItem(EMAILS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function markEmailsAsRead(): void {
  const emails = getEmailNotifications().map((m) => ({ ...m, isRead: true }));
  localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
  notifyListeners();
}

function dispatchSimulatedEmail(email: Omit<EmailNotification, 'id' | 'sentAt' | 'isRead'>) {
  const emails = getEmailNotifications();
  const newEmail: EmailNotification = {
    ...email,
    id: `MAIL-${Date.now().toString().slice(-4)}`,
    sentAt: new Date().toISOString(),
    isRead: false
  };
  emails.unshift(newEmail);
  localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
  notifyListeners();
}

export interface CreateTicketParams {
  roomId: string;
  category: EquipmentCategory;
  categoryLabel?: string;
  title: string;
  description: string;
  photoUrl: string;
  studentName?: string;
  studentEmail: string;
  urgency?: UrgencyLevel;
}

export function createTicket(params: CreateTicketParams): Ticket {
  const tickets = getTickets();
  const room = getRoomById(params.roomId) || {
    id: params.roomId,
    building: 'อาคาร 11',
    floor: 5,
    roomNumber: '11-502',
    name: 'ห้อง 11-502 (ห้องแล็บมัลติมีเดีย)',
    qrToken: ''
  };

  const ticketNumber = Math.floor(8830 + Math.random() * 50);
  const ticketId = `SPU-${ticketNumber}`;
  const accessToken = generateAccessToken();
  const now = new Date().toISOString();

  let urgency = params.urgency || 'NORMAL';
  const categoryLabelMap: Record<EquipmentCategory, string> = {
    AIR_CONDITIONER: 'เครื่องปรับอากาศ',
    LIGHTS_ELECTRICAL: 'ระบบไฟฟ้า / หลอดไฟ',
    SANITARY: 'สุขภัณฑ์ / ประปา',
    DESK_CHAIR: 'โต๊ะและเก้าอี้เรียน',
    PROJECTOR_PC: 'โปรเจกเตอร์ / โสตฯ',
    OTHER_ISSUE: 'ปัญหาอื่นๆ',
    PROJECTOR_AV: 'โปรเจกเตอร์ / โสตฯ',
    ELECTRICAL_PLUGS: 'ระบบไฟฟ้า / ปลั๊ก',
    FURNITURE: 'โต๊ะและเก้าอี้ / ครุภัณฑ์',
    LAB_COMPUTERS: 'คอมพิวเตอร์ห้องแล็บ'
  };

  const newTicket: Ticket = {
    id: ticketId,
    refNumber: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
    accessToken,
    roomId: room.id,
    roomName: room.name,
    building: room.building,
    floor: room.floor,
    roomNumber: room.roomNumber,
    category: params.category,
    categoryLabel: categoryLabelMap[params.category] || params.category,
    title: params.description.slice(0, 50) + (params.description.length > 50 ? '...' : ''),
    description: params.description,
    photoUrl: params.photoUrl,
    studentName: params.studentName || 'แพรว สุขสมบูรณ์',
    studentEmail: params.studentEmail,
    status: 'PENDING_REVIEW',
    urgency,
    urgencyTag: urgency === 'URGENT' ? 'ด่วนมาก • SLA < 30 นาที' : 'SLA 24 ชม.',
    workflowStep: 1,
    timeAgoText: 'เมื่อสักครู่',
    createdAt: now,
    updatedAt: now,
    subscribers: [params.studentEmail],
    upvotes: 1,
    commentsCount: 0,
    equipmentDetails: `${room.building}, ห้อง ${room.roomNumber}`,
    events: [
      {
        id: `LOG-${Date.now()}-1`,
        ticketId,
        actorType: 'STUDENT',
        actorName: params.studentName || 'แพรว สุขสมบูรณ์',
        action: 'ส่งเรื่องแจ้งซ่อมเรียบร้อย',
        newStatus: 'PENDING_REVIEW',
        timestamp: now
      }
    ]
  };

  tickets.unshift(newTicket);
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  saveRecentTicket(ticketId, accessToken);

  dispatchSimulatedEmail({
    to: params.studentEmail,
    ticketId,
    ticketToken: accessToken,
    type: 'CONFIRMATION',
    subject: `[แจ้งซ่อม SPU] ได้รับเรื่องแจ้งซ่อมแล้ว: #${ticketId} (${room.name})`,
    previewHtml: `
      <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 20px; border: 1px solid #fbcfe8; border-radius: 16px; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #3b0764, #be185d); color: white; padding: 16px; border-radius: 12px; text-align: center;">
          <h2 style="margin: 0; font-size: 18px;">บันทึกรายการคำร้อง #${ticketId} แล้ว</h2>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">ระยะเวลาตรวจสอบ: ~30 นาที</p>
        </div>
        <p style="margin-top: 16px; font-size: 13px; color: #334155;">
          สวัสดี คุณ${params.studentName || 'แพรว'}, ทางระบบได้รับเรื่องแจ้งซ่อมสำหรับ <strong>${room.name}</strong> เรียบร้อยแล้ว เจ้าหน้าที่ช่างเทคนิคจะเข้าพื้นที่โดยเร็วที่สุด
        </p>
      </div>
    `
  });

  notifyListeners();
  return newTicket;
}

export function claimTicket(ticketId: string, technicianName = 'ช่างสมชาย การช่าง', techId = 'TECH-609'): boolean {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
  if (ticketIndex === -1) return false;

  const ticket = tickets[ticketIndex];
  const now = new Date().toISOString();

  ticket.status = 'IN_PROGRESS';
  ticket.assignedTechId = techId;
  ticket.assignedTechName = technicianName;
  ticket.techStatusNote = 'ช่างเทคนิคได้รับมอบหมายงานและกำลังเดินทางไปยังห้องเป้าหมาย';
  ticket.workflowStep = 3;
  ticket.updatedAt = now;

  ticket.events.push({
    id: `LOG-${Date.now()}`,
    ticketId,
    actorType: 'TECHNICIAN',
    actorName: technicianName,
    action: 'รับงาน & เดินทางเข้าพื้นที่',
    oldStatus: ticket.status,
    newStatus: 'IN_PROGRESS',
    timestamp: now
  });

  tickets[ticketIndex] = ticket;
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));

  dispatchSimulatedEmail({
    to: ticket.studentEmail,
    ticketId,
    ticketToken: ticket.accessToken,
    type: 'ASSIGNED',
    subject: `[ช่าง SPU กำลังเข้าพื้นที่] #${ticketId}: ${technicianName} กำลังเดินทาง`,
    previewHtml: `
      <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 20px; border: 1px solid #fbcfe8; border-radius: 16px;">
        <h3 style="color: #3b0764; margin-top: 0;">ช่างเทคนิคกำลังเดินทางเข้าพื้นที่</h3>
        <p style="color: #334155; font-size: 13px;">${technicianName} ได้รับเรื่องรายการแจ้งซ่อมของคุณที่ ${ticket.roomName} แล้ว</p>
      </div>
    `
  });

  notifyListeners();
  return true;
}

export interface UpdateStatusParams {
  ticketId: string;
  status: TicketStatus;
  note?: string;
  proofPhotoUrl?: string;
  technicianName?: string;
  consumedParts?: { name: string; qty: number }[];
  safetyChecklist?: { electricalSafe: boolean; areaCleaned: boolean; testPassed: boolean };
}

export function updateTicketStatus(params: UpdateStatusParams): boolean {
  const tickets = getTickets();
  const index = tickets.findIndex((t) => t.id === params.ticketId);
  if (index === -1) return false;

  const ticket = tickets[index];
  const oldStatus = ticket.status;
  const now = new Date().toISOString();

  ticket.status = params.status;
  ticket.updatedAt = now;

  if (params.status === 'RESOLVED') {
    ticket.resolvedAt = now;
    ticket.workflowStep = 4;
    ticket.resolutionNote = params.note || ticket.resolutionNote;
    ticket.resolutionProofPhotoUrl = params.proofPhotoUrl || ticket.resolutionProofPhotoUrl;
    ticket.timeAgoText = 'เมื่อสักครู่ • ซ่อมเสร็จโดยทีมช่าง SPU';
    if (params.consumedParts) ticket.consumedParts = params.consumedParts;
    if (params.safetyChecklist) ticket.safetyChecklist = params.safetyChecklist;
  }

  ticket.events.push({
    id: `LOG-${Date.now()}`,
    ticketId: params.ticketId,
    actorType: 'TECHNICIAN',
    actorName: params.technicianName || 'ช่างสมชาย การช่าง',
    action: params.status === 'RESOLVED' ? 'บันทึกว่าซ่อมเสร็จสิ้นและรับรองผล' : `ปรับปรุงสถานะเป็น ${params.status}`,
    oldStatus,
    newStatus: params.status,
    note: params.note,
    proofPhotoUrl: params.proofPhotoUrl,
    timestamp: now
  });

  tickets[index] = ticket;
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));

  if (params.status === 'RESOLVED') {
    ticket.subscribers.forEach((email) => {
      dispatchSimulatedEmail({
        to: email,
        ticketId: ticket.id,
        ticketToken: ticket.accessToken,
        type: 'RESOLVED',
        subject: `[แจ้งซ่อม SPU] ซ่อมเสร็จสิ้น: ${ticket.title} (#${ticket.id})`,
        previewHtml: `
          <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 20px; border: 1px solid #bbf7d0; border-radius: 16px;">
            <div style="background: #15803d; color: white; padding: 14px; border-radius: 12px; text-align: center;">
              <h3 style="margin: 0;">การซ่อมแซมเสร็จสมบูรณ์ & รับรองผลแล้ว</h3>
            </div>
            <p style="font-size: 13px; color: #334155; margin-top: 14px;">
              ดำเนินการซ่อมเรียบร้อยแล้วที่ ${ticket.roomName} รายละเอียด: ${params.note || 'ทดสอบระบบและผ่านการตรวจสอบแล้ว'}
            </p>
          </div>
        `
      });
    });
  }

  notifyListeners();
  return true;
}

export function subscribeToTicket(ticketId: string, email: string): boolean {
  const tickets = getTickets();
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return false;

  if (!ticket.subscribers.includes(email)) {
    ticket.subscribers.push(email);
    ticket.upvotes += 1;
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
    saveRecentTicket(ticket.id, ticket.accessToken);
    notifyListeners();
  }
  return true;
}

export interface RecentTicketRef {
  id: string;
  token: string;
  timestamp: string;
}

export function saveRecentTicket(id: string, token: string): void {
  try {
    const raw = localStorage.getItem(RECENT_TICKETS_KEY);
    let list: RecentTicketRef[] = raw ? JSON.parse(raw) : [];
    list = list.filter((item) => item.id !== id);
    list.unshift({ id, token, timestamp: new Date().toISOString() });
    localStorage.setItem(RECENT_TICKETS_KEY, JSON.stringify(list.slice(0, 10)));
  } catch (e) {}
}

export function getRecentTickets(): RecentTicketRef[] {
  try {
    const raw = localStorage.getItem(RECENT_TICKETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
