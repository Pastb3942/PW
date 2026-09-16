import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, CheckCircle2, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { compressClientImage, CompressionResult, formatBytes } from '../../lib/compression';
import { createSamplePhoto } from '../../lib/mockData';

interface ImageCompressorDropzoneProps {
  onImageReady: (dataUrl: string) => void;
  categoryName?: string;
}

export const ImageCompressorDropzone: React.FC<ImageCompressorDropzoneProps> = ({
  onImageReady,
  categoryName = 'อุปกรณ์'
}) => {
  const [compressing, setCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, HEIC, WebP)');
      return;
    }

    setCompressing(true);
    try {
      const result = await compressClientImage(file, 1200, 1200, 0.75);
      setCompressionResult(result);
      setPreviewUrl(result.dataUrl);
      onImageReady(result.dataUrl);
    } catch (err) {
      console.error('Compression failed', err);
      alert('การประมวลผลรูปภาพขัดข้อง กรุณาลองใหม่อีกครั้ง');
    } finally {
      setCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUseSamplePhoto = () => {
    const sample = createSamplePhoto(`ภาพชำรุด: ${categoryName}`, '#dc2626', '📷');
    setPreviewUrl(sample);
    setCompressionResult({
      dataUrl: sample,
      originalSizeBytes: 4200000, // 4.2 MB simulated
      compressedSizeBytes: 184000, // 184 KB
      reductionPercentage: 96,
      width: 1200,
      height: 800,
      mimeType: 'image/webp'
    });
    onImageReady(sample);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setCompressionResult(null);
    onImageReady('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          รูปถ่ายหลักฐานจุดที่ชำรุด <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] text-brand-600 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          บีบอัดภาพอัตโนมัติฝั่งเบราว์เซอร์
        </span>
      </div>

      {previewUrl ? (
        <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-sm animate-fade-in">
          <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video max-h-56 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 transition-colors shadow-lg"
              title="ลบรูปภาพ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Compression Analytics Badge */}
          {compressionResult && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">บีบอัดสำเร็จ: </span>
                  <span className="line-through text-slate-400 mr-1">
                    {formatBytes(compressionResult.originalSizeBytes)}
                  </span>
                  ➔ <span className="font-extrabold text-emerald-700">{formatBytes(compressionResult.compressedSizeBytes)}</span>
                </div>
              </div>
              <span className="font-extrabold bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full text-[11px]">
                -{compressionResult.reductionPercentage}%
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-5 text-center transition-all bg-slate-50/50 hover:bg-brand-50/20 flex flex-col items-center justify-center min-h-[160px]"
        >
          {compressing ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-2" />
              <p className="text-xs font-bold text-slate-700">กำลังบีบอัดรูปภาพด้วย HTML5 Canvas...</p>
              <p className="text-[11px] text-slate-400 mt-0.5">ลดขนาดไฟล์เพื่อป้องกันการส่งข้อมูลล้มเหลว</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-brand-100/80 text-brand-600 flex items-center justify-center mb-3 shadow-inner">
                <Camera className="w-6 h-6" />
              </div>

              <p className="text-xs font-bold text-slate-800">
                ถ่ายภาพจากกล้องมือถือ หรือลากไฟล์มาวางที่นี่
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                รองรับ JPG, PNG, HEIC (ระบบจะแปลงเป็น WebP ขนาดกะทัดรัดทันที)
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
                {/* Mobile Direct Camera Input */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Camera className="w-4 h-4" />
                  เปิดกล้องถ่ายภาพ
                </button>

                {/* File picker */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  เลือกจากคลังภาพ
                </button>

                {/* Demo Mock Sample Photo Button */}
                <button
                  type="button"
                  onClick={handleUseSamplePhoto}
                  className="px-3 py-2 bg-slate-200/70 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  ใช้รูปตัวอย่างทดสอบ
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
