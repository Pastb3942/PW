# Facility Fix & Report | Campus Facility Management

ระบบเว็บแอปพลิเคชันแจ้งซ่อมและจัดการสิ่งอำนวยความสะดวกภายในมหาวิทยาลัยแบบเรียลไทม์ (React, TypeScript, Tailwind CSS, Lucide Icons)

---

## 🌟 จุดเด่นและฟังก์ชันหลัก (Key Features)

1. **No-Login Reporting (แจ้งซ่อมทันทีโดยไม่ต้องสมัครสมาชิก)**
   - สแกน QR Code หน้าห้องเรียน หรือเข้าผ่านลิงก์ระบุห้อง เช่น `/?room_id=ROOM-ENG-304`
   - ระบบตรวจสอบและกรอกข้อมูลสถานที่ให้โดยอัตโนมัติ
   - ยืนยันสิทธิ์และติดตามสถานะผ่าน **Cryptographic Access Token**

2. **ระบบตรวจจับการแจ้งซ้ำ (Duplicate Prevention Engine)**
   - เมื่อเลือกห้องและประเภทอุปกรณ์ ระบบจะตรวจสอบคำร้องที่เปิดค้างอยู่ภายใน 24 ชม.
   - หากมีผู้อื่นแจ้งปัญหาแล้ว จะแสดงแบนเนอร์แจ้งเตือนพร้อมตัวเลือก **"กดติดตามเพื่อรับอีเมลแจ้งเตือนเมื่อซ่อมเสร็จ"** ป้องกันปัญหาการส่งซ้ำซ้อน

3. **Client-Side Image Compression (ระบบบีบอัดรูปถ่ายฝั่งไคลเอนต์)**
   - รองรับการเปิดกล้องมือถือถ่ายภาพโดยตรง (`capture="environment"`)
   - ใช้อัลกอริทึม HTML5 Canvas ย่อขนาดภาพความละเอียดสูง (5–12 MB) ให้เหลือประมาณ ~150–250 KB (WebP/JPEG) บนเบราว์เซอร์ทันทีก่อนส่ง เพื่อลดภาระเซิร์ฟเวอร์และแก้ปัญหา Payload Timeout บนเครือข่ายมือถือ

4. **Public Progress Timeline (ไทม์ไลน์ติดตามงานแบบเรียลไทม์)**
   - สเต็ปเปอร์แสดงความคืบหน้า 4 ขั้นตอน: `รอรับเรื่อง (Pending)` ➔ `รับเรื่องแล้ว (Acknowledged)` ➔ `กำลังซ่อม (In Progress)` ➔ `ซ่อมเสร็จสิ้น (Resolved)`
   - แสดงภาพถ่ายหลักฐานเปรียบเทียบ "ก่อนซ่อม (Before)" และ "หลังซ่อมเสร็จ (After Resolution Proof)"
   - บันทึก Audit Event Logs แจ้งประวัติการดำเนินงานอย่างโปร่งใส

5. **Technician Task Board (คิวงานช่างเทคนิค)**
   - จัดเรียงตามระดับความเร่งด่วน (`Critical`, `High`, `Medium`, `Low`) และอาคาร
   - ปุ่มกดรับงาน (Claim Task) อัปเดตสถานะอัตโนมัติ
   - หน้าต่างอัปโหลดภาพถ่ายหลักฐานหลังการซ่อมเสร็จพร้อมบันทึกงาน

6. **Admin & Analytics Portal (แดชบอร์ดสถิติผู้บริหาร)**
   - คำนวณระยะเวลาซ่อมเฉลี่ย **MTTR (Mean Time to Resolution)**
   - แผนภูมิวิเคราะห์อุปกรณ์ชำรุดซ้ำซาก (Equipment Failure Recurrence) 5 หมวดหมู่
   - ตารางแสดงจุดเสี่ยงและพื้นที่ที่เกิดปัญหาบ่อยที่สุด (Campus Hotspots)
   - ปุ่มส่งออกรายงานเป็นไฟล์ CSV

7. **Virtual Campus Mailbox (ระบบจำลองอีเมลอัตโนมัติ)**
   - จำลองการทำงานของ Nodemailer / Resend Transactional Emails
   - แจ้งเตือนอีเมลยืนยันรับเรื่อง, ช่างรับงาน, และแจ้งปิดงานพร้อมแนบรูปหลักฐาน
   - สามารถคลิกเปิดดูอีเมล HTML และกดลิงก์เข้าดูสถานะงานได้ทันที

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Framework**: React 19 + Vite 6 + TypeScript
- **Styling**: Tailwind CSS 3.4 (Custom Design Tokens, Responsive 360px+ Safe)
- **Icons**: Lucide React
- **Animations & FX**: Canvas Confetti, Keyframe Animations
- **State & Storage**: Reactive Storage Event Emitter + LocalStorage Persistence

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Quickstart)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รัน Development Server
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่: `http://localhost:5173/`

### 3. รันการทดสอบ Business Logic & Email Flow
```bash
npm run test:flow
```

### 4. บิลด์สำหรับ Production
```bash
npm run build
```

---

## 📱 การทดสอบผ่านโทรศัพท์มือถือ (Mobile Test)

- แอปรองรับหน้าจอทุกขนาดตั้งแต่ **360px ขึ้นไป** พร้อมแถบนำทางด้านล่าง (Mobile Bottom Navigation)
- ทดสอบสแกน QR ด้วยการกดปุ่ม **"สแกน QR"** หรือจำลองเข้าผ่าน URL:
  - `http://localhost:5173/?room_id=ROOM-ENG-304` (ห้อง 304 วิศวะ)
  - `http://localhost:5173/?room_id=ROOM-COM-405` (ห้องแล็บ AI 405)
