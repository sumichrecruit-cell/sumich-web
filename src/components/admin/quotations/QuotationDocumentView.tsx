import React, { useRef } from 'react';
import { FormalQuotation, QuotationBrandingSettings } from '../../../types';
import { formatKES } from '../../../utils/quotationUtils';
import { downloadUploadedFile } from '../../../utils/fileHelpers';
import {
  Printer,
  Download,
  Share2,
  Mail,
  CheckCircle2,
  Shield,
  Award,
  Building,
  Calendar,
  Clock,
  Phone,
  ArrowRight,
  FileCheck2,
  FileText
} from 'lucide-react';

interface QuotationDocumentViewProps {
  quotation: FormalQuotation;
  branding: QuotationBrandingSettings;
  onClose?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onSendEmail?: () => void;
  onConvertToInvoice?: () => void;
  canManageOperations?: boolean;
}

export const QuotationDocumentView: React.FC<QuotationDocumentViewProps> = ({
  quotation,
  branding,
  onClose,
  onEdit,
  onApprove,
  onSendEmail,
  onConvertToInvoice,
  canManageOperations = true
}) => {
  const documentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadgeClass = (status: FormalQuotation['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'accepted':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'pending_approval':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'expired':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="print:hidden bg-slate-900 text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{quotation.quotationNumber}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${getStatusBadgeClass(quotation.status)}`}>
                {quotation.status.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {quotation.companyName} &middot; Total: <strong className="text-amber-400">{formatKES(quotation.grandTotal)}</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onEdit && quotation.status === 'draft' && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Edit Quote
            </button>
          )}

          {onApprove && (quotation.status === 'draft' || quotation.status === 'pending_approval') && canManageOperations && (
            <button
              onClick={onApprove}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve & Sign</span>
            </button>
          )}

          {onSendEmail && (
            <button
              onClick={onSendEmail}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email to Client</span>
            </button>
          )}

          {onConvertToInvoice && (quotation.status === 'approved' || quotation.status === 'accepted') && !quotation.convertedToInvoiceId && canManageOperations && (
            <button
              onClick={onConvertToInvoice}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Convert to Invoice</span>
            </button>
          )}

          <button
            onClick={() => downloadUploadedFile({
              fileName: `Sumich_Quotation_${quotation.quotationNumber}.pdf`,
              content: `SUMICH SOLUTIONS LIMITED - OFFICIAL SECURITY QUOTATION\nQuotation Ref: ${quotation.quotationNumber}\nClient: ${quotation.companyName} (${quotation.clientName})\nDate: ${quotation.quotationDate}\nValid Until: ${quotation.expiryDate}\nGrand Total: KES ${quotation.grandTotal.toLocaleString()}\nStatus: ${quotation.status.toUpperCase()}`
            })}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            title="Download Quotation Document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print / PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* The Printable A4 Quotation Sheet */}
      <div
        ref={documentRef}
        className="bg-white text-slate-900 shadow-xl border border-slate-200 rounded-xl max-w-4xl mx-auto p-8 sm:p-12 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none text-xs leading-normal font-sans"
        style={{ fontFamily: branding.fontFamily || 'Inter, sans-serif' }}
      >
        {/* Letterhead Header Section */}
        {branding.useLetterhead && branding.letterheadDataUrl ? (
          <div className="mb-6 rounded-lg overflow-hidden border border-slate-100">
            <img
              src={branding.letterheadDataUrl}
              alt="Company Letterhead"
              className="w-full object-contain max-h-36"
            />
          </div>
        ) : (
          <div className="border-b-2 border-amber-500 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              {/* Logo & Corporate Crest */}
              <div className="flex items-center gap-3">
                {branding.logoDataUrl ? (
                  <img
                    src={branding.logoDataUrl}
                    alt={branding.companyName}
                    style={{ width: `${branding.logoWidthPx || 160}px` }}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-amber-500 text-slate-950 flex flex-col items-center justify-center shadow-md">
                    <Shield className="w-7 h-7 stroke-[2.2]" />
                    <span className="text-[8px] font-black tracking-tighter uppercase mt-0.5">SUMICH</span>
                  </div>
                )}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 leading-tight">
                    {branding.companyName}
                  </h1>
                  <p className="text-xs font-medium text-amber-700 tracking-wide font-display">
                    {branding.tagline}
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-semibold">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>PSRA Registration: {branding.registrationNumber || 'PSRA/REG/KEN/2023/0488'}</span>
                  </div>
                </div>
              </div>

              {/* Company Corporate Contact Block */}
              <div className="text-right text-[11px] text-slate-600 space-y-0.5 shrink-0 self-end sm:self-auto">
                <div className="font-bold text-slate-900 text-xs">National Headquarters:</div>
                <div>{branding.physicalAddress}</div>
                <div>{branding.postalAddress}</div>
                <div>Tel: {branding.telephone}</div>
                <div>Hotline: <strong className="text-slate-900">{branding.emergencyHotline}</strong></div>
                <div>Email: {branding.email} &middot; Web: {branding.website}</div>
                <div className="font-mono text-[10px] text-slate-500 pt-0.5">
                  KRA PIN: <strong>{branding.kraPin}</strong> &middot; VAT No: <strong>{branding.vatNumber}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950 text-white p-4 rounded-xl mb-6 print:bg-slate-950 print:text-white">
          <div>
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
              OFFICIAL SERVICE PROPOSAL & QUOTATION
            </div>
            <h2 className="text-lg font-black tracking-tight text-white uppercase">
              {quotation.projectTitle}
            </h2>
            <div className="text-[11px] text-slate-300">
              Template: <strong className="text-white capitalize">{quotation.templateType.replace('_', ' ')}</strong>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono shrink-0">
            <div className="text-xs font-bold text-amber-400">
              QTN NO: {quotation.quotationNumber}
            </div>
            <div className="text-[11px] text-slate-300">
              Date: <strong>{quotation.quotationDate}</strong>
            </div>
            <div className="text-[11px] text-amber-300">
              Valid Until: <strong>{quotation.expiryDate}</strong>
            </div>
          </div>
        </div>

        {/* Client & Service Scope Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              <span>Quotation Prepared For:</span>
            </div>
            <div className="font-extrabold text-sm text-slate-950">{quotation.companyName}</div>
            <div className="text-xs text-slate-700 font-semibold">{quotation.contactPerson}</div>
            <div className="text-[11px] text-slate-600 mt-1">{quotation.physicalAddress}</div>
            <div className="text-[11px] text-slate-600">{quotation.postalAddress}</div>
            <div className="text-[11px] text-slate-600 mt-1">
              Tel: <strong>{quotation.phone}</strong> &middot; Email: <strong>{quotation.email}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Project Scope & Executive Summary:</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {quotation.serviceDescription}
            </p>
            <div className="mt-2 text-[10px] text-slate-500 border-t border-slate-200 pt-1.5 flex items-center justify-between">
              <span>Class: <strong>PSRA Gazetted Service Level</strong></span>
              <span className="font-mono text-emerald-700 font-bold">24/7 Rapid Intercept Included</span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3">Service / Item Description</th>
                <th className="py-2.5 px-3 text-center w-16">Qty</th>
                <th className="py-2.5 px-3 w-28">Unit</th>
                <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
                <th className="py-2.5 px-3 text-center w-16">Disc %</th>
                <th className="py-2.5 px-3 text-center w-16">VAT</th>
                <th className="py-2.5 px-3 text-right w-32">Total (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {quotation.items.map((item, idx) => (
                <tr key={item.id || idx} className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                  <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{item.description}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold font-mono">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    {item.unit}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {formatKES(item.unitPrice)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500">
                    {item.discountPercent > 0 ? `${item.discountPercent}%` : '-'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500">
                    {item.taxPercent > 0 ? `${item.taxPercent}%` : '0%'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-slate-950">
                    {formatKES(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Amount in Words */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mb-6 items-start">
          {/* Left: Amount in Words & Notes */}
          <div className="sm:col-span-7 space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">
                Amount in Words (Kenyan Shillings):
              </div>
              <div className="text-xs font-extrabold text-slate-950 font-serif italic">
                “{quotation.amountInWords}”
              </div>
            </div>

            {quotation.notes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                <strong className="block text-slate-900 font-semibold mb-0.5">Operational Remarks:</strong>
                {quotation.notes}
              </div>
            )}
          </div>

          {/* Right: Subtotal, VAT, Grand Total Calculation */}
          <div className="sm:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatKES(quotation.subtotal)}</span>
            </div>

            {quotation.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Special Corporate Discount:</span>
                <span className="font-semibold">-{formatKES(quotation.discountTotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Kenyan VAT (16% Gazetted):</span>
              <span className="font-semibold text-slate-900">{formatKES(quotation.taxTotal)}</span>
            </div>

            <div className="border-t-2 border-slate-300 pt-2 flex justify-between text-sm sm:text-base font-black text-slate-950">
              <span className="font-sans">Grand Total:</span>
              <span className="text-amber-800 font-mono">{formatKES(quotation.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Terms, Conditions & Payment Instructions */}
        <div className="border-t border-slate-200 pt-4 mb-6 space-y-3 text-[11px] text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong className="block text-slate-900 font-bold mb-1 uppercase tracking-wider text-[10px]">
                1. Payment Terms & Banking Details
              </strong>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                <p>{quotation.paymentTerms || branding.defaultPaymentTerms}</p>
                <div className="font-mono text-[10px] text-slate-600 pt-1">
                  Bank: <strong>KCB Bank Kenya Ltd (Kenyatta Ave Branch)</strong> &middot; Account: <strong>1289047820</strong><br />
                  M-Pesa Corporate Paybill: <strong>400200</strong> &middot; Account Ref: <strong>{quotation.quotationNumber}</strong>
                </div>
              </div>
            </div>

            <div>
              <strong className="block text-slate-900 font-bold mb-1 uppercase tracking-wider text-[10px]">
                2. Deployment & Mobilization Terms
              </strong>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                <p>{quotation.deliveryTerms}</p>
                <p className="text-[10px] text-slate-500">{quotation.specialConditions}</p>
              </div>
            </div>
          </div>

          <div>
            <strong className="block text-slate-900 font-bold mb-1 uppercase tracking-wider text-[10px]">
              3. Regulatory Compliance & Statutory Undertakings
            </strong>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Sumich Solutions Limited guarantees 100% compliance with the Private Security Regulation Act No. 13 of 2016. All deployed personnel hold valid Police Certificates of Good Conduct, National Identity cards, and PSRA Guard Force numbers. Full statutory deductions (NSSF, SHIF/NHIF, WIBA) are borne by Sumich Solutions Limited.
            </p>
          </div>
        </div>

        {/* Authorization, Signatures & Digital Seal Block */}
        <div className="border-t-2 border-slate-200 pt-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
            {/* Sumich Authorized Signatory */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                For and on behalf of SUMICH SOLUTIONS LIMITED:
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 min-h-24 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-xs text-slate-950">
                      {quotation.approvalDetails?.approvedBy || branding.authorizedSignatoryName}
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold">
                      {quotation.approvalDetails?.approverRole || branding.authorizedSignatoryTitle}
                    </div>
                  </div>

                  {/* Digital Seal Graphic */}
                  <div className="w-16 h-16 rounded-full border-2 border-amber-600 border-dashed p-1 flex flex-col items-center justify-center text-center text-amber-700">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span className="text-[7px] font-bold leading-none mt-0.5 uppercase">OFFICIAL SEAL</span>
                    <span className="text-[6px] font-mono leading-none">PSRA 2023</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-1 mt-2 flex justify-between">
                  <span>Authorized Signature:</span>
                  <span>Date: {quotation.approvalDetails?.approvedAt ? new Date(quotation.approvalDetails.approvedAt).toLocaleDateString() : quotation.quotationDate}</span>
                </div>
              </div>
            </div>

            {/* Client Acceptance Block */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Client Confirmation & Acceptance:
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 min-h-24 flex flex-col justify-between">
                {quotation.clientResponse?.action === 'accepted' ? (
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accepted Electronically by Client</span>
                    </div>
                    <div className="text-xs text-slate-900 font-semibold mt-1">
                      {quotation.clientResponse.signedByName || quotation.contactPerson}
                    </div>
                    {quotation.clientResponse.comments && (
                      <div className="text-[10px] text-slate-500 italic mt-0.5">
                        “{quotation.clientResponse.comments}”
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs italic">
                    We accept the scope, terms, and charges set forth in this quotation.
                  </div>
                )}

                <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-1 mt-2 flex justify-between">
                  <span>Authorized Signature & Stamp:</span>
                  <span>
                    Date:{' '}
                    {quotation.clientResponse?.respondedAt
                      ? new Date(quotation.clientResponse.respondedAt).toLocaleDateString()
                      : '___________________'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Document Footer */}
        <div className="border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-1">
          <div>
            {branding.footerText}
          </div>
          <div>
            Ref: {quotation.quotationNumber} &middot; Page 1 of 1
          </div>
        </div>
      </div>
    </div>
  );
};
