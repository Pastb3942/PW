import { Room, Ticket, User } from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'ROOM-SPU-11-502',
    building: 'Building 11',
    floor: 5,
    roomNumber: '11-502',
    name: 'Room 11-502 (Multimedia Lab)',
    qrToken: 'spu-bldg11-fl5-11502'
  },
  {
    id: 'ROOM-SPU-5-301',
    building: 'Building 5',
    floor: 3,
    roomNumber: '5-301',
    name: 'Room 5-301 (Faculty of Comm Arts)',
    qrToken: 'spu-bldg5-fl3-5301'
  },
  {
    id: 'ROOM-SPU-LIB-3',
    building: 'Central Library',
    floor: 3,
    roomNumber: '3rd Fl',
    name: '3rd Floor Quiet Zone',
    qrToken: 'spu-lib-fl3'
  },
  {
    id: 'ROOM-SPU-5-RESTROOM',
    building: 'Building 5',
    floor: 1,
    roomNumber: '1-Restroom',
    name: 'Main Restroom (Near Hall 5-101)',
    qrToken: 'spu-bldg5-fl1-restroom'
  },
  {
    id: 'ROOM-SPU-LIB-2B',
    building: 'Central Library',
    floor: 2,
    roomNumber: 'Zone B',
    name: '2nd Floor, Study Cubicles 12-18',
    qrToken: 'spu-lib-fl2-b'
  }
];

export const CURRENT_STUDENT: User = {
  id: 'STU-PRAEW',
  name: 'Praew Suk.',
  email: 'praew.suk@spu.ac.th',
  role: 'STUDENT',
  department: 'Sripatum University • Bangkhen',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const CURRENT_TECH: User = {
  id: 'TECH-609',
  name: 'Somchai K.',
  email: 'somchai.k@spu.ac.th',
  role: 'TECHNICIAN',
  department: 'Zone North (Bld 5, 11) • Senior AC & Electrical Specialist',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
};

export function createSamplePhoto(title: string, color: string, iconType: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.6"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#g)" rx="16"/>
    <rect x="20" y="20" width="560" height="360" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" rx="12" stroke-dasharray="6,6"/>
    <circle cx="300" cy="180" r="60" fill="rgba(255,255,255,0.2)"/>
    <text x="300" y="195" font-family="system-ui, sans-serif" font-size="44" text-anchor="middle" fill="#ffffff">${iconType}</text>
    <text x="300" y="270" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#ffffff">${title}</text>
    <text x="300" y="300" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.8)">SPU Facility Fix Photo Evidence</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const AC_LEAK_PHOTO = `https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80`;
export const AC_REPAIR_PROOF_PHOTO = `https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80`;
export const PROJECTOR_PHOTO = `https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80`;
export const CHAIR_PHOTO = `https://images.unsplash.com/photo-1580481077194-c18ec5bf1677?w=800&auto=format&fit=crop&q=80`;

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'SPU-8821',
    refNumber: 'TK-1083',
    accessToken: 'ac79e41b7194f8d2983b6e8a0021c45f',
    roomId: 'ROOM-SPU-11-502',
    roomName: 'Room 11-502 (Multimedia Lab)',
    building: 'Building 11',
    floor: 5,
    roomNumber: '11-502',
    category: 'AIR_CONDITIONER',
    categoryLabel: 'Air Conditioner',
    title: 'Water leaking heavily from cassette AC unit over lecture desk 14',
    description: 'Water leaking from AC vent onto computer desk 14. Loud humming vibration sound since 9:00 AM lecture started.',
    photoUrl: AC_LEAK_PHOTO,
    studentName: 'Praew Suk. (Student Rep)',
    studentEmail: 'praew.suk@spu.ac.th',
    status: 'IN_PROGRESS',
    urgency: 'URGENT',
    urgencyTag: 'SLA < 30m',
    assignedTechId: 'TECH-609',
    assignedTechName: 'Tech Somchai K.',
    techStatusNote: 'Working on drainage pipe flush & clearing drip tray.',
    workflowStep: 3,
    timeAgoText: 'Today, 10:15 AM',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    subscribers: ['praew.suk@spu.ac.th'],
    upvotes: 12,
    commentsCount: 3,
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
    events: [
      {
        id: 'LOG-1',
        ticketId: 'SPU-8821',
        actorType: 'STUDENT',
        actorName: 'Praew Suk.',
        action: 'Submitted via Room QR code',
        newStatus: 'PENDING',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'LOG-2',
        ticketId: 'SPU-8821',
        actorType: 'SYSTEM',
        actorName: 'Dispatcher',
        action: 'Assigned to Somchai K. (Zone North)',
        newStatus: 'ACKNOWLEDGED',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString()
      },
      {
        id: 'LOG-3',
        ticketId: 'SPU-8821',
        actorType: 'TECHNICIAN',
        actorName: 'Somchai K.',
        action: 'On site inspection started',
        newStatus: 'IN_PROGRESS',
        note: 'Cleared clogged condensation drainage line and flushed drip tray.',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      }
    ]
  },
  {
    id: 'SPU-8794',
    accessToken: 'e3b0c44298fc1c149afbf4c8996fb924',
    roomId: 'ROOM-SPU-5-301',
    roomName: 'Room 5-301',
    building: 'Building 5',
    floor: 3,
    roomNumber: '5-301',
    category: 'PROJECTOR_PC',
    categoryLabel: 'Projector / PC',
    title: 'Projector HDMI cable flickering violently and lamp blinking',
    description: 'HDMI ceiling feed flickering violet & blinking orange lamp code when plugged into instructor desk.',
    photoUrl: PROJECTOR_PHOTO,
    studentName: 'Dr. Anan (Faculty of Communication Arts)',
    studentEmail: 'anan.w@spu.ac.th',
    status: 'PENDING_REVIEW',
    urgency: 'NORMAL',
    urgencyTag: 'SLA 24h',
    workflowStep: 2,
    timeAgoText: 'Yesterday, 2:40 PM',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    subscribers: [],
    upvotes: 5,
    commentsCount: 1,
    events: [
      {
        id: 'LOG-10',
        ticketId: 'SPU-8794',
        actorType: 'STUDENT',
        actorName: 'Dr. Anan',
        action: 'Reported issue',
        newStatus: 'PENDING_REVIEW',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ]
  },
  {
    id: 'SPU-8650',
    accessToken: '11223344556677889900aabbccddeeff',
    roomId: 'ROOM-SPU-LIB-3',
    roomName: 'Central Library 3rd Floor Quiet Zone',
    building: 'Central Library',
    floor: 3,
    roomNumber: '3rd Fl',
    category: 'DESK_CHAIR',
    categoryLabel: 'Desk & Chair',
    title: 'Door handle loose & broken ergonomic study chair replaced',
    description: 'Broken hydraulic lift cylinder on ergonomic study chair replaced and quiet room door handle tightened.',
    photoUrl: CHAIR_PHOTO,
    studentName: 'Library Staff',
    studentEmail: 'library@spu.ac.th',
    status: 'RESOLVED',
    urgency: 'NORMAL',
    workflowStep: 4,
    timeAgoText: '24 Oct • Fixed by SPU Facility Team',
    resolutionNote: 'Hydraulic cylinder replaced with Class 4 gas lift. Door handle latch mechanism lubricated and secured.',
    resolutionProofPhotoUrl: CHAIR_PHOTO,
    resolvedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    subscribers: [],
    upvotes: 18,
    events: [
      {
        id: 'LOG-30',
        ticketId: 'SPU-8650',
        actorType: 'TECHNICIAN',
        actorName: 'Somchai K.',
        action: 'Fixed & Verified',
        newStatus: 'RESOLVED',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ]
  },
  {
    id: 'SPU-8824',
    accessToken: '778899aabbccddeeff00112233445566',
    roomId: 'ROOM-SPU-5-RESTROOM',
    roomName: 'Main Restroom (Near Hall 5-101)',
    building: 'Building 5',
    floor: 1,
    roomNumber: '1-Restroom',
    category: 'SANITARY',
    categoryLabel: 'Sanitary / Plumbing',
    title: 'Main shutoff valve overflow onto hallway tile',
    description: 'Main shutoff valve overflow onto hallway tile. Extreme slip hazard during class change.',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    studentName: 'Security Officer Kittipong',
    studentEmail: 'security@spu.ac.th',
    status: 'PENDING',
    urgency: 'CRITICAL',
    urgencyTag: 'SLIP HAZARD',
    workflowStep: 1,
    timeAgoText: '27m ago',
    createdAt: new Date(Date.now() - 1620000).toISOString(),
    updatedAt: new Date(Date.now() - 1620000).toISOString(),
    subscribers: [],
    upvotes: 8,
    events: []
  },
  {
    id: 'SPU-8815',
    accessToken: '55667788990011223344aabbccddeeff',
    roomId: 'ROOM-SPU-LIB-2B',
    roomName: '2nd Floor, Zone B (Study Cubicles 12-18)',
    building: 'Central Library',
    floor: 2,
    roomNumber: 'Zone B',
    category: 'LIGHTS_ELECTRICAL',
    categoryLabel: 'Lighting / Electrical',
    title: 'LED Driver 40W replaced, ballast testing in progress',
    description: 'Parts collected from Depot A: LED Driver 40W replaced, ballast testing in progress.',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    studentName: 'Somchai K.',
    studentEmail: 'somchai.k@spu.ac.th',
    status: 'IN_PROGRESS',
    urgency: 'NORMAL',
    urgencyTag: 'ASSIGNED TO YOU',
    workflowStep: 3,
    timeAgoText: 'Started 45m ago',
    createdAt: new Date(Date.now() - 2700000).toISOString(),
    updatedAt: new Date(Date.now() - 2700000).toISOString(),
    subscribers: [],
    upvotes: 3,
    events: []
  }
];
