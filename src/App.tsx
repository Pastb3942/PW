import React, { useState, useEffect } from 'react';
import { ViewSwitcherBar } from './components/layout/ViewSwitcherBar';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { VirtualInboxModal } from './components/shared/VirtualInboxModal';
import { QrScannerModal } from './features/scanner/QrScannerModal';
import { HomeView } from './features/home/HomeView';
import { SubmissionFormView } from './features/reports/SubmissionFormView';
import { MyReportsView } from './features/tracking/MyReportsView';
import { TechnicianQueueView } from './features/technician/TechnicianQueueView';
import { JobResolutionView } from './features/technician/JobResolutionView';
import {
  getTickets,
  getEmailNotifications,
  subscribeToStore,
  markEmailsAsRead
} from './lib/storage';
import { Ticket, EmailNotification } from './types';
import { CURRENT_STUDENT, CURRENT_TECH } from './lib/mockData';

export function App() {
  const [tickets, setTickets] = useState<Ticket[]>(getTickets());
  const [emails, setEmails] = useState<EmailNotification[]>(getEmailNotifications());

  const [currentScreen, setCurrentScreen] = useState<'home' | 'submit' | 'track' | 'tech' | 'resolve'>('home');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>(tickets[0]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('ROOM-SPU-11-502');

  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      const freshTickets = getTickets();
      setTickets([...freshTickets]);
      setEmails([...getEmailNotifications()]);
      if (selectedTicket) {
        const updated = freshTickets.find((t) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    });
    return () => unsubscribe();
  }, [selectedTicket]);

  const handleOpenTicket = (ticketId: string) => {
    const found = tickets.find((t) => t.id === ticketId);
    if (found) setSelectedTicket(found);
    setCurrentScreen('track');
  };

  const handleOpenResolution = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCurrentScreen('resolve');
  };

  const handleRoomScanned = (roomId: string) => {
    setSelectedRoomId(roomId);
    setCurrentScreen('submit');
  };

  const unreadEmailCount = emails.filter((e) => !e.isRead).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col font-sans selection:bg-spu-pink selection:text-white">
      {/* Top Demo View Switcher Toolbar */}
      <ViewSwitcherBar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenMailbox={() => {
          setIsMailboxOpen(true);
          markEmailsAsRead();
        }}
        unreadEmailCount={unreadEmailCount}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-start justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
        {/* Device Container Frame (Matches the UI mockups in the screenshots) */}
        <div
          className={`w-full bg-slate-50 transition-all flex flex-col overflow-hidden ${
            isMobileFrame
              ? 'max-w-[420px] rounded-none sm:rounded-[2.5rem] shadow-2xl border-0 sm:border-[8px] sm:border-slate-800 my-0 sm:my-3 min-h-screen sm:min-h-[850px]'
              : 'max-w-4xl rounded-2xl shadow-xl border border-slate-200 my-4'
          }`}
        >
          {/* Mobile Screen Header */}
          {currentScreen !== 'tech' && currentScreen !== 'resolve' && (
            <MobileHeader
              title="ระบบแจ้งซ่อม SPU"
              subtitle={
                currentScreen === 'home'
                  ? 'หน้าหลัก'
                  : currentScreen === 'submit'
                  ? 'แบบฟอร์มแจ้งซ่อม'
                  : 'รายการแจ้งซ่อมของฉัน'
              }
              unreadCount={unreadEmailCount}
              onOpenMailbox={() => {
                setIsMailboxOpen(true);
                markEmailsAsRead();
              }}
              avatarUrl={CURRENT_STUDENT.avatarUrl}
              showBack={currentScreen === 'submit'}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {/* Screen Content */}
          <div className="flex-1 p-4 md:p-5 overflow-y-auto">
            {/* Screen 1: Reporting Hub (Home) */}
            {currentScreen === 'home' && (
              <HomeView
                tickets={tickets}
                onStartReport={(roomId) => {
                  if (roomId) setSelectedRoomId(roomId);
                  setCurrentScreen('submit');
                }}
                onOpenQrScanner={() => setIsQrScannerOpen(true)}
                onSelectTicket={handleOpenTicket}
                onViewAllReports={() => setCurrentScreen('track')}
              />
            )}

            {/* Screen 2: Issue Form (Submission) */}
            {currentScreen === 'submit' && (
              <SubmissionFormView
                initialRoomId={selectedRoomId}
                onOpenQrScanner={() => setIsQrScannerOpen(true)}
                onTicketSubmitted={(ticketId) => {
                  handleOpenTicket(ticketId);
                }}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {/* Screen 3: My Reports (Tracking) */}
            {currentScreen === 'track' && (
              <MyReportsView
                tickets={tickets}
                onSelectTicket={handleOpenTicket}
                onContactTech={(ticket) => handleOpenResolution(ticket)}
                onViewBeforeAfter={(ticket) => handleOpenResolution(ticket)}
              />
            )}

            {/* Screen 4: Technician Task Queue */}
            {currentScreen === 'tech' && (
              <TechnicianQueueView
                tickets={tickets}
                onOpenTicket={handleOpenTicket}
                onOpenResolution={handleOpenResolution}
                onRefresh={() => setTickets([...getTickets()])}
              />
            )}

            {/* Screen 5: Job Update & Resolution */}
            {currentScreen === 'resolve' && (
              <JobResolutionView
                ticket={selectedTicket}
                onBack={() => setCurrentScreen('tech')}
                onResolved={() => {
                  setTickets([...getTickets()]);
                  setCurrentScreen('track');
                }}
              />
            )}
          </div>

          {/* Mobile Bottom Navigation (Shown on Home & Tracking) */}
          {(currentScreen === 'home' || currentScreen === 'track') && (
            <MobileBottomNav
              currentView={currentScreen}
              onNavigate={(view) => setCurrentScreen(view as any)}
              onOpenQrScanner={() => setIsQrScannerOpen(true)}
              activeReportsCount={
                tickets.filter(
                  (t) =>
                    t.status === 'IN_PROGRESS' ||
                    t.status === 'PENDING' ||
                    t.status === 'PENDING_REVIEW'
                ).length
              }
            />
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onSelectRoom={handleRoomScanned}
      />

      {/* Virtual Mailbox Drawer (Nodemailer / Resend inspector) */}
      <VirtualInboxModal
        isOpen={isMailboxOpen}
        onClose={() => setIsMailboxOpen(false)}
        emails={emails}
        onSelectTicket={(ticketId) => handleOpenTicket(ticketId)}
      />
    </div>
  );
}

export default App;
