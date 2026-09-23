import { Room, Ticket, User } from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'ROOM-SPU-11-502',
    building: 'อาคาร 11',
    floor: 5,
    roomNumber: '11-502',
    name: 'ห้อง 11-502 (ห้องแล็บมัลติมีเดีย)',
    qrToken: 'spu-bldg11-fl5-11502'
  },
  {
    id: 'ROOM-SPU-5-301',
    building: 'อาคาร 5',
    floor: 3,
    roomNumber: '5-301',
    name: 'ห้อง 5-301 (คณะนิเทศศาสตร์)',
    qrToken: 'spu-bldg5-fl3-5301'
  },
  {
    id: 'ROOM-SPU-LIB-3',
    building: 'หอสมุดกลาง',
    floor: 3,
    roomNumber: 'ชั้น 3',
    name: 'ชั้น 3 โซนพื้นที่อ่านหนังสือเงียบ',
    qrToken: 'spu-lib-fl3'
  },
  {
    id: 'ROOM-SPU-5-RESTROOM',
    building: 'อาคาร 5',
    floor: 1,
    roomNumber: 'ห้องน้ำ ชั้น 1',
    name: 'ห้องน้ำหลัก (ใกล้ห้องบรรยาย 5-101)',
    qrToken: 'spu-bldg5-fl1-restroom'
  },
  {
    id: 'ROOM-SPU-LIB-2B',
    building: 'หอสมุดกลาง',
    floor: 2,
    roomNumber: 'โซน B',
    name: 'ชั้น 2 โต๊ะอ่านหนังสือเดี่ยว 12-18',
    qrToken: 'spu-lib-fl2-b'
  }
];

export const CURRENT_STUDENT: User = {
  id: 'STU-PRAEW',
  name: 'แพรว สุขสมบูรณ์',
  email: 'praew.suk@spu.ac.th',
  role: 'STUDENT',
  department: 'มหาวิทยาลัยศรีปทุม • บางเขน',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const CURRENT_TECH: User = {
  id: 'TECH-609',
  name: 'สมชาย การช่าง',
  email: 'somchai.k@spu.ac.th',
  role: 'TECHNICIAN',
  department: 'โซนเหนือ (อาคาร 5, 11) • ผู้เชี่ยวชาญอาวุโสระบบแอร์และไฟฟ้า',
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
    <text x="300" y="300" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.8)">หลักฐานภาพถ่ายแจ้งซ่อม SPU</text>
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
    roomName: 'ห้อง 11-502 (ห้องแล็บมัลติมีเดีย)',
    building: 'อาคาร 11',
    floor: 5,
    roomNumber: '11-502',
    category: 'AIR_CONDITIONER',
    categoryLabel: 'เครื่องปรับอากาศ',
    title: 'น้ำแอร์หยดลงโต๊ะเรียนแถว 14 อย่างหนัก',
    description: 'น้ำแอร์หยดลงโต๊ะคอมพิวเตอร์แถว 14 มีเสียงสั่นดังผิดปกติตั้งแต่เริ่มเรียนช่วง 09:00 น.',
    photoUrl: AC_LEAK_PHOTO,
    studentName: 'แพรว สุขสมบูรณ์ (ตัวแทนนักศึกษา)',
    studentEmail: 'praew.suk@spu.ac.th',
    status: 'IN_PROGRESS',
    urgency: 'URGENT',
    urgencyTag: 'SLA < 30 นาที',
    assignedTechId: 'TECH-609',
    assignedTechName: 'ช่างสมชาย การช่าง',
    techStatusNote: 'กำลังล้างทำความสะอาดท่อน้ำทิ้งและเคลียร์ถาดน้ำทิ้ง',
    workflowStep: 3,
    timeAgoText: 'วันนี้ 10:15 น.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    subscribers: ['praew.suk@spu.ac.th'],
    upvotes: 12,
    commentsCount: 3,
    equipmentDetails: 'Daikin Cassette 36,000 BTU (เครื่อง AC-01)',
    consumedParts: [
      { name: 'ชุดอุปกรณ์แยงท่อน้ำทิ้ง 1 ชุด', qty: 1 },
      { name: 'ลูกยางกันสะเทือน 4 ตัว', qty: 4 }
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
        actorName: 'แพรว สุขสมบูรณ์',
        action: 'ส่งเรื่องแจ้งซ่อมผ่าน QR Code ประจำห้อง',
        newStatus: 'PENDING',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'LOG-2',
        ticketId: 'SPU-8821',
        actorType: 'SYSTEM',
        actorName: 'ระบบจ่ายงานอัตโนมัติ',
        action: 'มอบหมายงานให้ สมชาย การช่าง (โซนเหนือ)',
        newStatus: 'ACKNOWLEDGED',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString()
      },
      {
        id: 'LOG-3',
        ticketId: 'SPU-8821',
        actorType: 'TECHNICIAN',
        actorName: 'สมชาย การช่าง',
        action: 'ช่างเข้าตรวจสอบหน้างาน',
        newStatus: 'IN_PROGRESS',
        note: 'ล้างทำความสะอาดท่อน้ำทิ้งที่อุดตันและถาดน้ำทิ้ง',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      }
    ]
  },
  {
    id: 'SPU-8794',
    accessToken: 'e3b0c44298fc1c149afbf4c8996fb924',
    roomId: 'ROOM-SPU-5-301',
    roomName: 'ห้อง 5-301',
    building: 'อาคาร 5',
    floor: 3,
    roomNumber: '5-301',
    category: 'PROJECTOR_PC',
    categoryLabel: 'โปรเจกเตอร์ / โสตฯ',
    title: 'สายสัญญาณ HDMI โปรเจกเตอร์ภาพกระพริบและไฟเตือนหลอดภาพขึ้นสีส้ม',
    description: 'สายสัญญาณ HDMI บนเพดานภาพกระพริบสีม่วง ไฟส้มเตือนหลอดภาพกระพริบเมื่อเสียบโต๊ะอาจารย์',
    photoUrl: PROJECTOR_PHOTO,
    studentName: 'ดร.อนันต์ (คณะนิเทศศาสตร์)',
    studentEmail: 'anan.w@spu.ac.th',
    status: 'PENDING_REVIEW',
    urgency: 'NORMAL',
    urgencyTag: 'SLA 24 ชม.',
    workflowStep: 2,
    timeAgoText: 'เมื่อวานนี้ 14:40 น.',
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
        actorName: 'ดร.อนันต์',
        action: 'ส่งเรื่องแจ้งซ่อม',
        newStatus: 'PENDING_REVIEW',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ]
  },
  {
    id: 'SPU-8650',
    accessToken: '11223344556677889900aabbccddeeff',
    roomId: 'ROOM-SPU-LIB-3',
    roomName: 'หอสมุดกลาง ชั้น 3 โซนพื้นที่อ่านหนังสือเงียบ',
    building: 'หอสมุดกลาง',
    floor: 3,
    roomNumber: 'ชั้น 3',
    category: 'DESK_CHAIR',
    categoryLabel: 'โต๊ะและเก้าอี้เรียน',
    title: 'ลูกบิดประตูด้านในหลวม & เปลี่ยนโช้คเก้าอี้อ่านหนังสือที่ชำรุด',
    description: 'โช้คไฮดรอลิกเก้าอี้อ่านหนังสือปรับระดับไม่ได้ และขันยึดลูกบิดประตูด้านในให้แน่นหนา',
    photoUrl: CHAIR_PHOTO,
    studentName: 'เจ้าหน้าที่หอสมุด',
    studentEmail: 'library@spu.ac.th',
    status: 'RESOLVED',
    urgency: 'NORMAL',
    workflowStep: 4,
    timeAgoText: '24 ต.ค. • ซ่อมเสร็จโดยทีมช่าง SPU',
    resolutionNote: 'เปลี่ยนกระบอกโช้คไฮดรอลิก Class 4 ใหม่ หยอดน้ำมันหล่อลื่นและขันยึดกลไกลูกบิดประตูเรียบร้อย',
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
        actorName: 'สมชาย การช่าง',
        action: 'ซ่อมแซมและตรวจสอบเรียบร้อย',
        newStatus: 'RESOLVED',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ]
  },
  {
    id: 'SPU-8824',
    accessToken: '778899aabbccddeeff00112233445566',
    roomId: 'ROOM-SPU-5-RESTROOM',
    roomName: 'ห้องน้ำหลัก (ใกล้ห้องบรรยาย 5-101)',
    building: 'อาคาร 5',
    floor: 1,
    roomNumber: 'ห้องน้ำ ชั้น 1',
    category: 'SANITARY',
    categoryLabel: 'สุขภัณฑ์ / ประปา',
    title: 'วาล์วน้ำหลักรั่ว เอ่อล้นสู่พื้นทางเดิน',
    description: 'วาล์วน้ำหลักรั่ว เอ่อล้นสู่ทางเดิน เสี่ยงลื่นล้มอันตรายช่วงเปลี่ยนคาบเรียน',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    studentName: 'รปภ. กิตติพงษ์',
    studentEmail: 'security@spu.ac.th',
    status: 'PENDING',
    urgency: 'CRITICAL',
    urgencyTag: 'ระวังพื้นลื่น',
    workflowStep: 1,
    timeAgoText: '27 นาทีที่แล้ว',
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
    roomName: 'หอสมุดกลาง ชั้น 2 โซน B (โต๊ะอ่านหนังสือ 12-18)',
    building: 'หอสมุดกลาง',
    floor: 2,
    roomNumber: 'โซน B',
    category: 'LIGHTS_ELECTRICAL',
    categoryLabel: 'ระบบไฟฟ้า / แสงสว่าง',
    title: 'เปลี่ยน LED Driver 40W แล้ว อยู่ระหว่างทดสอบบัลลาสต์',
    description: 'เบิกอะไหล่จากคลัง A: เปลี่ยน LED Driver 40W แล้ว อยู่ระหว่างทดสอบบัลลาสต์',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    studentName: 'สมชาย การช่าง',
    studentEmail: 'somchai.k@spu.ac.th',
    status: 'IN_PROGRESS',
    urgency: 'NORMAL',
    urgencyTag: 'มอบหมายให้คุณ',
    workflowStep: 3,
    timeAgoText: 'เริ่มเมื่อ 45 นาทีที่แล้ว',
    createdAt: new Date(Date.now() - 2700000).toISOString(),
    updatedAt: new Date(Date.now() - 2700000).toISOString(),
    subscribers: [],
    upvotes: 3,
    events: []
  }
];
