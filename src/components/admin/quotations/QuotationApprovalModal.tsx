import React, { useState, useRef } from 'react';
import { FormalQuotation, User } from '../../../types';
import { formatKES } from '../../../utils/quotationUtils';
import {
  X,
  CheckCircle2,
  XCircle,
  Shield,
  PenTool,
  Stamp,
  Award,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface QuotationApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation: FormalQuotation;
  currentUser: User | null;
  onApprove: (comments?: string, signatureType?: any, signatureData?: string) => void;
  onReject: (reason: string) => void;
}

export const QuotationApprovalModal: React.FC<QuotationApprovalModalProps> = ({
  isOpen,
  onClose,
  quotation,
  currentUser,
  onApprove,
  onReject
}) => {
  const [comments, setComments] = useState(
    'Reviewed and approved in compliance with PSRA gazetted wage rates and technical security survey findings.'
  );
  const [rejectReason, setRejectReason] = useState('');
  const [mode, setMode] = useState<'approve' | 'reject'>('approve');
  const [signatureType, setSignatureType] = useState<'digital_seal' | 'canvas_draw'>('digital_seal');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    if (mode === 'approve') {
      let signatureData = '';
      if (signatureType === 'canvas_draw' && canvasRef.current && hasDrawn) {
        signatureData = canvasRef.current.toDataURL();
      }
      onApprove(comments, signatureType, signatureData);
      onClose();
    } else {
      if (!rejectReason.trim()) {
        alert('Please provide a reason for rejecting the quotation.');
        return;
      }
      onReject(rejectReason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {mode === 'approve' ? 'Authorize & Sign Quotation' : 'Reject Quotation'}
              </h3>
              <p className="text-xs text-slate-400">
                {quotation.quotationNumber} &middot; {quotation.companyName}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Summary Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Client: <strong className="text-slate-900">{quotation.companyName}</strong></span>
              <span className="font-mono">Ref: {quotation.quotationNumber}</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">{quotation.projectTitle}</div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs font-mono">
              <span className="text-slate-600">Quotation Total Value:</span>
              <span className="text-base font-black text-amber-800">{formatKES(quotation.grandTotal)}</span>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
            <button
              onClick={() => setMode('approve')}
              className={`pb-2 transition-colors flex items-center gap-1.5 ${
                mode === 'approve'
                  ? 'border-b-2 border-emerald-600 text-emerald-700'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Authorize</span>
            </button>

            <button
              onClick={() => setMode('reject')}
              className={`pb-2 transition-colors flex items-center gap-1.5 ${
                mode === 'reject'
                  ? 'border-b-2 border-rose-600 text-rose-700'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Reject / Request Changes</span>
            </button>
          </div>

          {mode === 'approve' ? (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                <strong>Signatory Credentials:</strong>{' '}
                {currentUser?.name || 'Kennedy Omondi'} (
                {currentUser?.subRole === 'super_admin' ? 'Managing Director & CEO' : 'Operations Officer'})
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Approval Comments & Internal Audit Notes</label>
                <textarea
                  rows={2}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Digital Seal vs Canvas Signature */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold">Authorization Signature Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="p-3 border rounded-xl flex items-center gap-2 cursor-pointer bg-white hover:bg-slate-50">
                    <input
                      type="radio"
                      name="sigType"
                      checked={signatureType === 'digital_seal'}
                      onChange={() => setSignatureType('digital_seal')}
                    />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <Stamp className="w-3.5 h-3.5 text-amber-600" />
                        <span>Corporate Digital Seal</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Official Sumich Seal</span>
                    </div>
                  </label>

                  <label className="p-3 border rounded-xl flex items-center gap-2 cursor-pointer bg-white hover:bg-slate-50">
                    <input
                      type="radio"
                      name="sigType"
                      checked={signatureType === 'canvas_draw'}
                      onChange={() => setSignatureType('canvas_draw')}
                    />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <PenTool className="w-3.5 h-3.5 text-amber-600" />
                        <span>Draw Signature</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Touch / Mouse Pad</span>
                    </div>
                  </label>
                </div>

                {signatureType === 'canvas_draw' && (
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Draw signature below:</span>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-amber-800 hover:text-amber-900 font-bold"
                      >
                        Clear Canvas
                      </button>
                    </div>
                    <canvas
                      ref={canvasRef}
                      width={480}
                      height={110}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full bg-white rounded-lg border border-slate-300 cursor-crosshair"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>
                  Rejecting this quotation will update its status to <strong>REJECTED</strong> and record your feedback in the audit log.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason for Rejection *</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Specify why this proposal is rejected (e.g. rate below gazetted minimums, client requested scope revision, etc.)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
              mode === 'approve'
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-rose-600 hover:bg-rose-500'
            }`}
          >
            {mode === 'approve' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Authorize Quotation</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>Confirm Rejection</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
