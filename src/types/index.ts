export type EquipmentCategory =
  | 'AIR_CONDITIONER'
  | 'LIGHTS_ELECTRICAL'
  | 'SANITARY'
  | 'DESK_CHAIR'
  | 'PROJECTOR_PC'
  | 'OTHER_ISSUE'
  | 'PROJECTOR_AV'
  | 'ELECTRICAL_PLUGS'
  | 'FURNITURE'
  | 'LAB_COMPUTERS';

export type TicketStatus =
  | 'PENDING'
  | 'PENDING_REVIEW'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export type UrgencyLevel = 'NORMAL' | 'URGENT' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Room {
  id: string;
  building: string;
  floor: number;
  roomNumber: string;
  name: string;
  qrToken: string;
}

export interface TicketEventLog {
  id: string;
  ticketId: string;
  actorType: 'STUDENT' | 'TECHNICIAN' | 'ADMIN' | 'SYSTEM';
  actorName: string;
  action: string;
  oldStatus?: TicketStatus;
  newStatus?: TicketStatus;
  note?: string;
  proofPhotoUrl?: string;
  timestamp: string;
}

export interface InventoryItem {
  name: string;
  qty: number;
}

export interface Ticket {
  id: string;
  refNumber?: string;
  accessToken: string;
  roomId: string;
  roomName: string;
  building: string;
  floor: number;
  roomNumber: string;
  category: EquipmentCategory;
  categoryLabel?: string;
  title: string;
  description: string;
  photoUrl: string;
  studentName?: string;
  studentEmail: string;
  status: TicketStatus;
  urgency: UrgencyLevel;
  urgencyTag?: string;
  assignedTechId?: string;
  assignedTechName?: string;
  techStatusNote?: string;
  workflowStep?: number;
  resolutionNote?: string;
  resolutionProofPhotoUrl?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  timeAgoText?: string;
  subscribers: string[];
  upvotes: number;
  commentsCount?: number;
  equipmentDetails?: string;
  consumedParts?: InventoryItem[];
  safetyChecklist?: {
    electricalSafe: boolean;
    areaCleaned: boolean;
    testPassed: boolean;
  };
  events: TicketEventLog[];
}

export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  previewHtml: string;
  type: 'CONFIRMATION' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'SUBSCRIBER_ALERT';
  ticketId: string;
  ticketToken: string;
  sentAt: string;
  isRead: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TECHNICIAN' | 'ADMIN';
  department: string;
  avatarUrl?: string;
}
