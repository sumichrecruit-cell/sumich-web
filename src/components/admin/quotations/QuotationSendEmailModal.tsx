import React, { useState } from 'react';
import { FormalQuotation } from '../../../types';
import { formatKES } from '../../../utils/quotationUtils';
import {
  X,
  Mail,
  Send,
  Paperclip,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Shield
} from 'lucide-react';

interface QuotationSendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation: FormalQuotation;
  onSend: (emailDetails: { to: string; cc?: string; subject: string; message: string }) => void;
}

export const QuotationSendEmailModal: React.FC<QuotationSendEmailModalProps> = ({
  isOpen,
  onClose,
  quotation,
  onSend
}) => {
  const [to, setTo] = useState(quotation.email || '');
  const [cc, setCc] = useState('operations@sumichsecurity.com');
  const [subject, setSubject] = useState(
    `SUMICH SOLUTIONS LIMITED - Formal Quotation ${quotation.quotationNumber} (${quotation.companyName})`
  );
  const [message, setMessage] = useState(
    `Dear ${quotation.contactPerson},\n\n` +
      `Thank you for considering SUMICH SOLUTIONS LIMITED as your preferred security and guarding services partner.\n\n` +
      `We have completed the security scope evaluation for "${quotation.projectTitle}". Please find attached our formal service quotation Ref: ${quotation.quotationNumber} amounting to ${formatKES(quotation.grandTotal)}.\n\n` +
      `As a fully licensed and compliant PSRA guarding provider (PSRA/REG/KEN/2023/0488), we assure you of disciplined, vetted personnel, electronic RFID patrol monitoring, and sub-10 minute rapid response intervention from our Vision Plaza command hub on Mombasa Road.\n\n` +
      `This quotation is valid until ${quotation.expiryDate}.\n\n` +
      `You may review and accept this proposal directly through your Sumich Client Portal or by returning an authorized copy.\n\n` +
      `Yours sincerely,\n` +
      `Sales & Operations Directorate\n` +
      `SUMICH SOLUTIONS LIMITED\n` +
      `Vision Plaza, 3rd Floor, Mombasa Road, Nairobi\n` +
      `Tel: +254 117 230 136 / +254 735 229 229`
  );

  const [copiedLink, setCopiedLink] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const secureLink = `${window.location.origin}/#quote-${quotation.quotationNumber}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(secureLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim()) {
      alert('Recipient email address is required.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      onSend({ to, cc, subject, message });
      setIsSending(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Email Quotation to Client</h3>
              <p className="text-xs text-slate-400">
                Direct client delivery with attached PDF & portal verification link.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSend} className="p-6 space-y-4 text-xs">
          {/* Secure Client Link Generator */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-amber-950 block">Direct Client Portal Link:</span>
              <span className="text-[11px] font-mono text-amber-800 truncate block max-w-md">
                {secureLink}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-white text-slate-900 border border-amber-300 rounded-lg font-bold text-[11px] hover:bg-amber-100 flex items-center gap-1.5 shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">To: Recipient Email *</label>
              <input
                type="email"
                value={to}
                onChange={e => setTo(e.target.value)}
                placeholder="client@company.co.ke"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">CC: Internal Copy</label>
              <input
                type="text"
                value={cc}
                onChange={e => setCc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Email Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Message Body *</label>
            <textarea
              rows={8}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
              required
            />
          </div>

          {/* Attachment Pill */}
          <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <Paperclip className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-slate-800">Attached:</span>
            <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              {quotation.quotationNumber.replace(/\//g, '_')}_Official_Quotation.pdf
            </span>
            <span className="text-[10px] text-slate-400 font-mono">({formatKES(quotation.grandTotal)})</span>
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Sending Quotation...' : 'Send Quotation Email'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
