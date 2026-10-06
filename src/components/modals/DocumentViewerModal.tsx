import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Download,
  FileText,
  CheckCircle2,
  Shield,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Image as ImageIcon,
  Award,
  FileCheck,
  Share2
} from 'lucide-react';
import { SumichLogo } from '../common/SumichLogo';
import { downloadUploadedFile, printUploadedFile } from '../../utils/fileHelpers';

export const DocumentViewerModal: React.FC = () => {
  const { docViewerModalOpen, setDocViewerModalOpen, activeDocPreview } = useApp();
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handlePrint = useCallback(() => {
    if (!activeDocPreview) return;
    printUploadedFile({
      fileDataUrl: activeDocPreview.fileDataUrl,
      fileName: activeDocPreview.fileName,
      title: activeDocPreview.title,
      content: activeDocPreview.content,
      applicantName: activeDocPreview.applicantName,
      details: activeDocPreview.details,
      category: activeDocPreview.category
    });
  }, [activeDocPreview]);

  const handleDownload = useCallback(() => {
    if (!activeDocPreview) return;
    downloadUploadedFile({
      fileDataUrl: activeDocPreview.fileDataUrl,
      fileName: activeDocPreview.fileName,
      content: activeDocPreview.content,
      fileType: activeDocPreview.fileType
    });
  }, [activeDocPreview]);

  // Auto-print support if requested
  useEffect(() => {
    if (docViewerModalOpen && activeDocPreview?.autoPrint) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [docViewerModalOpen, activeDocPreview, handlePrint]);

  // Keyboard shortcut listeners (Esc to close, Ctrl+P to print)
  useEffect(() => {
    if (!docViewerModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDocViewerModalOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [docViewerModalOpen, handlePrint, setDocViewerModalOpen]);

  if (!docViewerModalOpen || !activeDocPreview) return null;

  const isImage = Boolean(
    (activeDocPreview.fileDataUrl && activeDocPreview.fileDataUrl.startsWith('data:image/')) ||
    (activeDocPreview.fileType && activeDocPreview.fileType.startsWith('image/')) ||
    /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(activeDocPreview.fileName)
  );

  const isPdf = Boolean(
    (activeDocPreview.fileDataUrl && activeDocPreview.fileDataUrl.startsWith('data:application/pdf')) ||
    (activeDocPreview.fileType === 'application/pdf') ||
    /\.pdf$/i.test(activeDocPreview.fileName)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Action Bar (hidden when printing) */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold truncate">{activeDocPreview.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="truncate">{activeDocPreview.applicantName}</span>
                <span>&middot;</span>
                <span className="font-mono text-amber-400 text-[11px] truncate">{activeDocPreview.fileName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isImage && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg text-xs mr-2 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 px-1">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer shadow-sm"
              title="Print Document to A4"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Download Uploaded File"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>

            <button
              type="button"
              onClick={() => setDocViewerModalOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body (Printable Area) */}
        <div className="p-6 sm:p-8 overflow-y-auto print-area bg-white text-slate-900 flex-1">
          {/* Official Letterhead Header for Print / Dossiers */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 border border-amber-500/40 p-1">
                <SumichLogo className="w-8 h-9" />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-slate-950 leading-tight">
                  SUMICH SOLUTIONS LIMITED
                </div>
                <div className="text-xs text-amber-600 font-bold uppercase tracking-wider">
                  Security & Guarding Services &middot; Nairobi, Kenya
                </div>
                <div className="text-[11px] text-slate-500">
                  PSRA Certified: PSRA/REG/KEN/2023/0488 &middot; Reg: CPR/2023/108422
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 space-y-0.5">
              <div className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                {activeDocPreview.category || 'Official Document Archive'}
              </div>
              <div>File: <strong className="text-slate-900 font-mono">{activeDocPreview.fileName}</strong></div>
              <div>Date: {activeDocPreview.date || new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* VIEW MODE 1: Actual Image (e.g. Certificates, Photo IDs, Logos, Letterheads) */}
          {isImage && activeDocPreview.fileDataUrl ? (
            <div className="space-y-6">
              <div className="bg-slate-950/5 border border-slate-200 rounded-2xl p-4 sm:p-8 text-center overflow-auto flex items-center justify-center min-h-[300px]">
                <img
                  src={activeDocPreview.fileDataUrl}
                  alt={activeDocPreview.title}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
                  className="max-h-[60vh] max-w-full object-contain mx-auto rounded-lg shadow-md border border-slate-200 transition-transform duration-200"
                />
              </div>

              {/* Verified Metadata Summary */}
              {activeDocPreview.details && Object.keys(activeDocPreview.details).length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                  <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Associated Metadata</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(activeDocPreview.details).map(([label, val]) => (
                      <div key={label}>
                        <span className="text-slate-500 capitalize">{label.replace(/([A-Z])/g, ' $1')}:</span>
                        <div className="font-semibold text-slate-900">{val || 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : isPdf && activeDocPreview.fileDataUrl && activeDocPreview.fileDataUrl.startsWith('data:application/pdf') ? (
            /* VIEW MODE 2: Embedded PDF Viewer */
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100">
                <iframe
                  src={activeDocPreview.fileDataUrl}
                  title={activeDocPreview.title}
                  className="w-full h-[65vh] border-0"
                />
              </div>
            </div>
          ) : (
            /* VIEW MODE 3: Formatted Candidate Dossier / Document Transcript */
            <div className="space-y-6">
              {/* Candidate Info Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Applicant Verified Profile Credentials</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Full Legal Name:</span>
                    <div className="font-bold text-slate-900 text-sm">{activeDocPreview.applicantName}</div>
                  </div>
                  {activeDocPreview.details && Object.entries(activeDocPreview.details).map(([label, val]) => (
                    <div key={label}>
                      <span className="text-slate-500 capitalize">{label.replace(/([A-Z])/g, ' $1')}:</span>
                      <div className="font-semibold text-slate-900">{val || 'Not provided'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Transcript / Curriculum Vitae */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider text-xs flex items-center justify-between">
                  <span>Document Transcript / Curriculum Vitae</span>
                  <span className="text-[11px] text-slate-400 font-normal">Verified by HR Vetting System</span>
                </h4>
                <div className="whitespace-pre-wrap font-sans text-xs bg-slate-50/70 p-5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-mono">
                  {activeDocPreview.content}
                </div>
              </div>
            </div>
          )}

          {/* Official Signoff stamp & accreditation footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <div className="font-bold text-slate-800">SUMICH SOLUTIONS LIMITED KENYA</div>
              <div>Private Security Regulatory Authority License: <strong className="font-mono text-slate-700">PSRA/REG/KEN/2023/0488</strong></div>
              <div>Headquarters: Vision Plaza, 3rd Floor, Mombasa Road, Nairobi</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">Authorized Human Resources & Records</div>
              <div className="text-amber-700 font-semibold text-[11px]">Vetting & Verification Division</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">SHA-256 Verified Digital Record</div>
            </div>
          </div>
        </div>

        {/* Modal footer (hidden when printing) */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span className="font-semibold text-slate-800">{activeDocPreview.fileName}</span>
            <span>&middot;</span>
            <span className="text-slate-500">Ready for viewing, download, or printing</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-500" />
              <span>Print A4</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={() => setDocViewerModalOpen(false)}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ml-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
