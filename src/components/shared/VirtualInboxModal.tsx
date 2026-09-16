import React, { useState } from 'react';
import { EmailNotification } from '../../types';
import { Mail, X, ExternalLink, Check, Trash2, Bell } from 'lucide-react';

interface VirtualInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: EmailNotification[];
  onSelectTicket: (ticketId: string, token: string) => void;
  onClearAll?: () => void;
}

export const VirtualInboxModal: React.FC<VirtualInboxModalProps> = ({
  isOpen,
  onClose,
  emails,
  onSelectTicket
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(emails[0] || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-indigo-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Mail className="w-5 h-5 text-brand-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Virtual Campus Mailbox (จำลองอีเมลมหาวิทยาลัย)</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  {emails.length} ฉบับ
                </span>
              </div>
              <p className="text-xs text-brand-100">
                ระบบจำลองการส่งอีเมลจริงด้วย Nodemailer / Resend เพื่อแจ้งเตือนนักศึกษาและช่างเทคนิค
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Email List Sidebar */}
          <div className="w-full md:w-80 border-r border-slate-200 overflow-y-auto bg-slate-50/50 max-h-56 md:max-h-none">
            {emails.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">ยังไม่มีอีเมลแจ้งเตือน</p>
                <p className="text-xs mt-1">เมื่อมีการแจ้งซ่อมหรืออัปเดตงาน อีเมลจะมาแสดงที่นี่</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {emails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1 ${
                        isSelected ? 'bg-brand-50 border-l-4 border-brand-600' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-medium text-slate-700 truncate max-w-[170px]">
                          ถึง: {email.to}
                        </span>
                        <span>{new Date(email.sentAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="font-semibold text-xs text-slate-800 line-clamp-1">
                        {email.subject}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          #{email.ticketId}
                        </span>
                        <span className="text-[10px] text-brand-600 font-medium">
                          {email.type}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Email Detail / HTML View */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {selectedEmail ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Email Header Info */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70">
                  <div className="text-base font-bold text-slate-900 mb-2">
                    {selectedEmail.subject}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-600">
                    <div><strong className="text-slate-500">ผู้ส่ง:</strong> กองอาคารสถานที่ (no-reply@facility.university.edu)</div>
                    <div><strong className="text-slate-500">ผู้รับ:</strong> {selectedEmail.to}</div>
                    <div><strong className="text-slate-500">เวลาส่ง:</strong> {new Date(selectedEmail.sentAt).toLocaleString('th-TH')}</div>
                    <div><strong className="text-slate-500">รหัสคำร้อง:</strong> #{selectedEmail.ticketId}</div>
                  </div>

                  {/* Direct Action Button to view ticket without login */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        onSelectTicket(selectedEmail.ticketId, selectedEmail.ticketToken);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      เปิดหน้าติดตามสถานะแบบ No-Login ทันที
                    </button>
                  </div>
                </div>

                {/* Render HTML content safely */}
                <div className="flex-1 p-5 overflow-y-auto bg-slate-100/50">
                  <div
                    className="email-render-container"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.previewHtml }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
                เลือกอีเมลจากรายการทางซ้ายเพื่อดูเนื้อหา
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>จำลองการเชื่อมต่อ Nodemailer SMTP / Resend Webhook API</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
