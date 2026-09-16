import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, X, Check, Building2, Search } from 'lucide-react';
import { getRooms } from '../../lib/storage';
import { Room } from '../../types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (roomId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose, onSelectRoom }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'sample'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rooms = getRooms();

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable', err);
      setCameraError('ไม่สามารถเปิดกล้องได้ (กรุณาอนุญาตการเข้าถึงกล้อง หรือเลือกห้องทดสอบด้านล่าง)');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            <h3 className="font-bold text-base">สแกน QR Code ประจำห้องเรียน</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'camera'
                ? 'bg-white text-brand-600 border-b-2 border-brand-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            เปิดกล้องสแกน
          </button>
          <button
            onClick={() => setActiveTab('sample')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'sample'
                ? 'bg-white text-brand-600 border-b-2 border-brand-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            เลือกห้องทดสอบ (Quick Test)
          </button>
        </div>

        {/* Tab 1: Camera Live Scanner */}
        {activeTab === 'camera' && (
          <div className="p-4 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[280px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
              {!cameraError ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* QR Scanning Target Grid Animation */}
                  <div className="absolute inset-8 border-2 border-brand-400/80 rounded-lg pointer-events-none">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-brand-400"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-brand-400"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-brand-400"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-brand-400"></div>
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse"></div>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-rose-300 text-xs">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
                  <p>{cameraError}</p>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 text-center mt-3">
              จัดวาง QR Code ประจำห้องเรียนให้อยู่ในกรอบ หรือกดเลือกห้องจำลองด้านล่าง
            </p>

            {/* Quick action buttons for demo simulation */}
            <div className="w-full mt-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                จำลองผลการสแกนทันที (Demo Shortcuts):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSelectRoom('ROOM-ENG-304');
                    onClose();
                  }}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-all text-left truncate"
                >
                  📍 ห้อง 304 (วิศวะ)
                </button>
                <button
                  onClick={() => {
                    onSelectRoom('ROOM-COM-405');
                    onClose();
                  }}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-all text-left truncate"
                >
                  📍 ห้อง 405 (ศูนย์คอม)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sample Room Picker */}
        {activeTab === 'sample' && (
          <div className="p-4 max-h-[380px] overflow-y-auto">
            {/* Search / Manual Input */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="พิมพ์เลขห้อง เช่น 304, 201, 102..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="space-y-2">
              {rooms
                .filter(
                  (r) =>
                    !manualCode ||
                    r.name.toLowerCase().includes(manualCode.toLowerCase()) ||
                    r.roomNumber.includes(manualCode) ||
                    r.building.toLowerCase().includes(manualCode.toLowerCase())
                )
                .map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      onSelectRoom(room.id);
                      onClose();
                    }}
                    className="w-full p-3 text-left bg-slate-50 hover:bg-brand-50 hover:border-brand-300 border border-slate-200 rounded-xl transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-800 group-hover:text-brand-700">
                        {room.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {room.building} • ชั้น {room.floor}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-brand-600 bg-white px-2 py-1 rounded border border-brand-100 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      เลือกห้องนี้
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};
