import { Room, Ticket, EmailNotification, TicketStatus, UrgencyLevel, EquipmentCategory } from '../types';
import { INITIAL_ROOMS, INITIAL_TICKETS } from './mockData';

const TICKETS_STORAGE_KEY = 'spu_facility_fix_tickets_v2';
const ROOMS_STORAGE_KEY = 'spu_facility_fix_rooms_v2';
const EMAILS_STORAGE_KEY = 'spu_facility_fix_emails_v2';
const RECENT_TICKETS_KEY = 'spu_facility_fix_recent_v2';

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
      subject: '[SPU Facility Fix] Ticket #SPU-8821: Tech Somchai K. is on site at Bldg 11, Room 11-502',
      type: 'IN_PROGRESS',
      ticketId: 'SPU-8821',
      ticketToken: 'ac79e41b7194f8d2983b6e8a0021c45f',
      sentAt: new Date(Date.now() - 1800000).toISOString(),
      isRead: false,
      previewHtml: `
        <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 20px; border: 1px solid #fbcfe8; border-radius: 16px; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #3b0764, #be185d); color: white; padding: 16px; border-radius: 12px; text-align: center;">
            <h2 style="margin: 0; font-size: 18px;">SPU Facility Fix • Update</h2>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Technician On Site</p>
          </div>
          <div style="padding: 16px 0; color: #334155; font-size: 13px; line-height: 1.6;">
            <p>Hello Praew,</p>
            <p><strong>Tech Somchai K.</strong> has arrived at <strong>Building 11, Floor 5, Room 11-502</strong> to address your report: <em>"Water leaking heavily from cassette AC unit"</em>.</p>
            <div style="background: #fdf2f8; padding: 12px; border-radius: 8px; border-left: 4px solid #db2777; margin: 12px 0;">
              <strong>Technician Note:</strong> Working on drainage pipe flush & clearing drip tray.
            </div>
            <p style="text-align: center; margin-top: 20px;">
              <a href="#/track/SPU-8821" style="background: #3b0764; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Live Progress Tracker</a>
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
    building: 'Building 11',
    floor: 5,
    roomNumber: '11-502',
    name: 'Room 11-502 (Multimedia Lab)',
    qrToken: ''
  };

  const ticketNumber = Math.floor(8830 + Math.random() * 50);
  const ticketId = `SPU-${ticketNumber}`;
  const accessToken = generateAccessToken();
  const now = new Date().toISOString();

  let urgency = params.urgency || 'NORMAL';
  const categoryLabelMap: Record<EquipmentCategory, string> = {
    AIR_CONDITIONER: 'Air Conditioner',
    LIGHTS_ELECTRICAL: 'Lights / Electrical',
    SANITARY: 'Sanitary / Plumbing',
    DESK_CHAIR: 'Desk & Chair',
    PROJECTOR_PC: 'Projector / PC',
    OTHER_ISSUE: 'Other Issue',
    PROJECTOR_AV: 'Projector / AV',
    ELECTRICAL_PLUGS: 'Electrical / Plugs',
    FURNITURE: 'Desk & Chair',
    LAB_COMPUTERS: 'Lab Computers'
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
    studentName: params.studentName || 'Praew Suk.',
    studentEmail: params.studentEmail,
    status: 'PENDING_REVIEW',
    urgency,
    urgencyTag: urgency === 'URGENT' ? 'URGENT • SLA < 30m' : 'SLA 24h',
    workflowStep: 1,
    timeAgoText: 'Just now',
    createdAt: now,
    updatedAt: now,
    subscribers: [params.studentEmail],
    upvotes: 1,
    commentsCount: 0,
    equipmentDetails: `${room.building}, Room ${room.roomNumber}`,
    events: [
      {
        id: `LOG-${Date.now()}-1`,
        ticketId,
        actorType: 'STUDENT',
        actorName: params.studentName || 'Praew Suk.',
        action: 'Submitted issue report',
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
    subject: `[SPU Facility Fix] Ticket Received: #${ticketId} (${room.name})`,
    previewHtml: `
      <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 20px; border: 1px solid #fbcfe8; border-radius: 16px; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #3b0764, #be185d); color: white; padding: 16px; border-radius: 12px; text-align: center;">
          <h2 style="margin: 0; font-size: 18px;">Ticket #${ticketId} Logged</h2>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Estimated review: ~30 mins</p>
        </div>
        <p style="margin-top: 16px; font-size: 13px; color: #334155;">
          Hello ${params.studentName || 'Praew'}, we have received your report for <strong>${room.name}</strong>. Our facility technician will be dispatched promptly.
        </p>
      </div>
    `
  });

  notifyListeners();
  return newTicket;
}

export function claimTicket(ticketId: string, technicianName = 'Tech Somchai K.', techId = 'TECH-609'): boolean {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
  if (ticketIndex === -1) return false;

  const ticket = tickets[ticketIndex];
  const now = new Date().toISOString();

  ticket.status = 'IN_PROGRESS';
  ticket.assignedTechId = techId;
  ticket.assignedTechName = technicianName;
  ticket.techStatusNote = 'Technician assigned and dispatched to room.';
  ticket.workflowStep = 3;
  ticket.updatedAt = now;

  ticket.events.push({
    id: `LOG-${Date.now()}`,
    ticketId,
    actorType: 'TECHNICIAN',
    actorName: technicianName,
    action: 'Accepted & Dispatched',
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
    subject: `[SPU Tech Dispatched] #${ticketId}: ${technicianName} is en route`,
    previewHtml: `
      <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 20px; border: 1px solid #fbcfe8; border-radius: 16px;">
        <h3 style="color: #3b0764; margin-top: 0;">Technician Dispatched</h3>
        <p style="color: #334155; font-size: 13px;">${technicianName} has claimed your report for ${ticket.roomName}.</p>
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
    ticket.timeAgoText = 'Just now • Fixed by SPU Facility Team';
    if (params.consumedParts) ticket.consumedParts = params.consumedParts;
    if (params.safetyChecklist) ticket.safetyChecklist = params.safetyChecklist;
  }

  ticket.events.push({
    id: `LOG-${Date.now()}`,
    ticketId: params.ticketId,
    actorType: 'TECHNICIAN',
    actorName: params.technicianName || 'Tech Somchai K.',
    action: params.status === 'RESOLVED' ? 'Marked as Resolved & Certified' : `Status updated to ${params.status}`,
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
        subject: `[SPU Facility Fix] Resolved: ${ticket.title} (#${ticket.id})`,
        previewHtml: `
          <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 20px; border: 1px solid #bbf7d0; border-radius: 16px;">
            <div style="background: #15803d; color: white; padding: 14px; border-radius: 12px; text-align: center;">
              <h3 style="margin: 0;">Issue Resolved & Certified</h3>
            </div>
            <p style="font-size: 13px; color: #334155; margin-top: 14px;">
              Repair completed at ${ticket.roomName}. Remarks: ${params.note || 'Tested and verified operational.'}
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
