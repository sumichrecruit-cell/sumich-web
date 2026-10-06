import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FormalInvoice, PaymentReceipt } from '../../../types';
import { formatKES, numberToKenyanShillingsWords } from '../../../utils/quotationUtils';
import { downloadUploadedFile } from '../../../utils/fileHelpers';
import {
  FileText,
  DollarSign,
  Plus,
  Search,
  Filter,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  CreditCard,
  Building,
  Calendar,
  Trash2,
  Eye,
  X
} from 'lucide-react';

export const InvoiceManagementModule: React.FC = () => {
  const {
    formalInvoices,
    createFormalInvoice,
    updateFormalInvoice,
    recordInvoicePayment,
    deleteFormalInvoice,
    quotationBranding,
    users,
    currentUser
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<FormalInvoice | null>(null);
  const [isViewingInvoice, setIsViewingInvoice] = useState(false);

  // Record Payment Modal State
  const [paymentInvoiceId, setPaymentInvoiceId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentReceipt['paymentMethod']>('M-Pesa Paybill');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // New Invoice Modal State
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [clientCompany, setClientCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [invTitle, setInvTitle] = useState('Security Guarding Monthly Service Fee');
  const [invQty, setInvQty] = useState(2);
  const [invRate, setInvRate] = useState(38000);
  const [invUnit, setInvUnit] = useState('Guards/Month');

  // KPI Calculations
  const totalInvoices = formalInvoices.length;
  const totalBilled = formalInvoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalCollected = formalInvoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstanding = formalInvoices.reduce((acc, i) => acc + i.balanceDue, 0);
  const paidCount = formalInvoices.filter(i => i.paymentStatus === 'paid').length;
  const partialCount = formalInvoices.filter(i => i.paymentStatus === 'partially_paid').length;
  const unpaidCount = formalInvoices.filter(i => i.paymentStatus === 'unpaid').length;

  const filteredInvoices = formalInvoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPaymentModal = (inv: FormalInvoice) => {
    setPaymentInvoiceId(inv.id);
    setPaymentAmount(inv.balanceDue);
    setPaymentRef(`MPESA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
    setPaymentNotes('');
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInvoiceId || paymentAmount <= 0) return;

    recordInvoicePayment(paymentInvoiceId, {
      paymentDate: new Date().toISOString().split('T')[0],
      amount: Number(paymentAmount),
      paymentMethod,
      transactionReference: paymentRef || 'CASH-REC',
      recordedBy: currentUser ? currentUser.name : 'Accounts Desk',
      notes: paymentNotes
    });

    setPaymentInvoiceId(null);
  };

  const handleCreateNewInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompany.trim() || !contactName.trim()) return;

    const lineTotal = invQty * invRate;
    const tax = lineTotal * 0.16;
    const total = Math.round(lineTotal + tax);

    createFormalInvoice({
      companyName: clientCompany,
      contactPerson: contactName,
      clientName: contactName,
      email: clientEmail,
      phone: clientPhone,
      projectTitle: invTitle,
      items: [
        {
          id: `item-${Date.now()}`,
          description: invTitle,
          quantity: invQty,
          unit: invUnit,
          unitPrice: invRate,
          discountPercent: 0,
          taxPercent: 16,
          lineTotal
        }
      ],
      subtotal: lineTotal,
      taxTotal: tax,
      discountTotal: 0,
      grandTotal: total,
      amountPaid: 0,
      balanceDue: total,
      paymentStatus: 'unpaid'
    });

    setNewInvoiceOpen(false);
    setClientCompany('');
    setContactName('');
    setClientEmail('');
    setClientPhone('');
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Invoiced</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono tabular-nums">
            {formatKES(totalBilled)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{totalInvoices} issued invoices</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Payments Collected</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 font-mono tabular-nums">
            {formatKES(totalCollected)}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">{paidCount} fully settled</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Outstanding Balance</div>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1 font-mono tabular-nums">
            {formatKES(totalOutstanding)}
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5">{partialCount + unpaidCount} awaiting payment</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</div>
          <button
            onClick={() => setNewInvoiceOpen(true)}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Main List & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by invoice number, company, contact..."
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Statuses ({formalInvoices.length})</option>
              <option value="unpaid">Unpaid ({unpaidCount})</option>
              <option value="partially_paid">Partially Paid ({partialCount})</option>
              <option value="paid">Fully Paid ({paidCount})</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3.5">Invoice #</th>
                <th className="py-3 px-3.5">Client & Company</th>
                <th className="py-3 px-3.5">Project Reference</th>
                <th className="py-3 px-3.5">Issue & Due Date</th>
                <th className="py-3 px-3.5 text-right">Total (KES)</th>
                <th className="py-3 px-3.5 text-right">Paid</th>
                <th className="py-3 px-3.5 text-right">Balance Due</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No invoices matching current filter. Click "Create Invoice" or convert an approved quotation.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-amber-900 whitespace-nowrap">
                      {inv.invoiceNumber}
                      {inv.quotationNumber && (
                        <div className="text-[10px] text-slate-400 font-normal">
                          From: {inv.quotationNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900">{inv.companyName}</div>
                      <div className="text-[11px] text-slate-500">{inv.contactPerson}</div>
                    </td>
                    <td className="py-3 px-3.5 max-w-xs truncate text-slate-700">
                      {inv.projectTitle}
                    </td>
                    <td className="py-3 px-3.5 text-[11px] text-slate-600 font-mono whitespace-nowrap">
                      <div>Issued: {inv.issueDate}</div>
                      <div className="text-amber-700">Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatKES(inv.grandTotal)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-emerald-700 font-semibold whitespace-nowrap">
                      {formatKES(inv.amountPaid)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatKES(inv.balanceDue)}
                    </td>
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.paymentStatus === 'partially_paid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap space-x-1.5">
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => handleOpenPaymentModal(inv)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] transition-colors"
                        >
                          Record Payment
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsViewingInvoice(true);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded text-[11px] transition-colors"
                      >
                        View / Print
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                            deleteFormalInvoice(inv.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentInvoiceId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/40">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">Record Customer Payment</h3>
              </div>
              <button onClick={() => setPaymentInvoiceId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Amount (KES) *</label>
                <input
                  type="number"
                  min="1"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="M-Pesa Paybill">M-Pesa Paybill (400200)</option>
                  <option value="Bank Wire (RTGS/EFT)">Bank Wire (RTGS/EFT)</option>
                  <option value="Cheque">Cheque Deposit</option>
                  <option value="Cash Deposit">Direct Bank Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Transaction Ref / Receipt No. *</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={e => setPaymentRef(e.target.value)}
                  placeholder="e.g. QTF8912384"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes / Banking Memo</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Month 1 guard fees received via KCB"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPaymentInvoiceId(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Standalone Invoice Modal */}
      {newInvoiceOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/40">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">Create Direct Tax Invoice</h3>
              </div>
              <button onClick={() => setNewInvoiceOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewInvoice} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={e => setClientCompany(e.target.value)}
                    placeholder="e.g. Westlands Plaza Ltd"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Person *</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="accounts@client.co.ke"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="0722 000 000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Invoice Item Description *</label>
                <input
                  type="text"
                  value={invTitle}
                  onChange={e => setInvTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={invQty}
                    onChange={e => setInvQty(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit</label>
                  <input
                    type="text"
                    value={invUnit}
                    onChange={e => setInvUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rate (KES)</label>
                  <input
                    type="number"
                    value={invRate}
                    onChange={e => setInvRate(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-right"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatKES(invQty * invRate)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Kenyan VAT (16%):</span>
                  <span>{formatKES(invQty * invRate * 0.16)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 text-sm">
                  <span>Grand Total:</span>
                  <span className="text-amber-800">{formatKES(Math.round(invQty * invRate * 1.16))}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setNewInvoiceOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {isViewingInvoice && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="print:hidden bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/40">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">{selectedInvoice.invoiceNumber}</h3>
                  <p className="text-xs text-slate-400">{selectedInvoice.companyName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadUploadedFile({
                    fileName: `Sumich_Invoice_${selectedInvoice.invoiceNumber}.pdf`,
                    content: `SUMICH SOLUTIONS LIMITED - TAX INVOICE\nInvoice: ${selectedInvoice.invoiceNumber}\nClient: ${selectedInvoice.companyName} (${selectedInvoice.clientName})\nDate: ${selectedInvoice.issueDate}\nDue Date: ${selectedInvoice.dueDate}\nTotal: KES ${selectedInvoice.grandTotal.toLocaleString()}\nStatus: ${selectedInvoice.paymentStatus.toUpperCase()}`
                  })}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                  title="Download Official Tax Invoice"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setIsViewingInvoice(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-12 overflow-y-auto text-xs space-y-6">
              {/* Invoice Header */}
              <div className="border-b-2 border-amber-500 pb-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950">SUMICH SOLUTIONS LIMITED</h1>
                  <p className="text-xs font-semibold text-amber-700">“Your Security, Our Commitment.”</p>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Vision Plaza, 3rd Floor, Mombasa Road, Nairobi<br />
                    P.O. Box 59140 - 00200, Nairobi &middot; Tel: +254 117 230 136 / +254 735 229 229
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-1">
                    KRA PIN: <strong>{selectedInvoice.kraPin || 'P051928471Z'}</strong> &middot; VAT No: <strong>{selectedInvoice.vatNumber || '051928471-V'}</strong>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="inline-block px-3 py-1 rounded bg-slate-950 text-white font-mono font-bold text-sm">
                    TAX INVOICE
                  </div>
                  <div className="font-mono text-xs font-bold text-amber-800">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <div className="text-[11px] text-slate-600">Date: {selectedInvoice.issueDate}</div>
                  <div className="text-[11px] text-rose-700 font-bold">Due Date: {selectedInvoice.dueDate}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Billed To:</div>
                  <div className="font-bold text-slate-900 text-sm">{selectedInvoice.companyName}</div>
                  <div className="text-slate-700">{selectedInvoice.contactPerson}</div>
                  <div className="text-slate-600">{selectedInvoice.physicalAddress}</div>
                  <div className="text-slate-600">{selectedInvoice.email} &middot; {selectedInvoice.phone}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Service Reference:</div>
                  <div className="font-bold text-slate-900 text-sm">{selectedInvoice.projectTitle}</div>
                  {selectedInvoice.quotationNumber && (
                    <div className="text-[11px] text-slate-600 mt-1">
                      Based on formal quotation: <strong>{selectedInvoice.quotationNumber}</strong>
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500 mt-1">
                    PSRA Accredited Guarding Services &middot; 24/7 Monitoring
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedInvoice.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3 font-semibold text-slate-900">{it.description}</td>
                        <td className="py-3 px-3 text-center font-mono">{it.quantity}</td>
                        <td className="py-3 px-3 text-slate-600">{it.unit}</td>
                        <td className="py-3 px-3 text-right font-mono">{formatKES(it.unitPrice)}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-950">
                          {formatKES(it.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Payments */}
              <div className="grid grid-cols-2 gap-6 items-start font-mono">
                <div className="space-y-3 font-sans">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                    <strong className="block text-amber-950 font-bold mb-1">M-Pesa & Bank Remittance Instructions:</strong>
                    <div className="text-slate-700 text-[11px] space-y-0.5">
                      <div>Paybill: <strong>400200</strong> &middot; Account: <strong>{selectedInvoice.invoiceNumber}</strong></div>
                      <div>Bank: <strong>KCB Bank Kenya Ltd</strong> &middot; A/C: <strong>1289047820</strong></div>
                      <div>Branch: Kenyatta Avenue Branch Nairobi</div>
                    </div>
                  </div>

                  {selectedInvoice.payments.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <strong className="block text-slate-900 font-bold mb-1">Receipted Installments:</strong>
                      {selectedInvoice.payments.map((p, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-slate-600 py-0.5 border-b border-slate-200 last:border-none">
                          <span>{p.paymentDate} ({p.paymentMethod}) - Ref: {p.transactionReference}</span>
                          <span className="font-mono font-bold text-emerald-700">{formatKES(p.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatKES(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>VAT (16%):</span>
                    <span>{formatKES(selectedInvoice.taxTotal)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-950 border-t border-slate-300 pt-1">
                    <span>Grand Total:</span>
                    <span className="text-amber-800">{formatKES(selectedInvoice.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold pt-1">
                    <span>Amount Paid:</span>
                    <span>{formatKES(selectedInvoice.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-rose-800 border-t border-slate-200 pt-1">
                    <span>Balance Due:</span>
                    <span>{formatKES(selectedInvoice.balanceDue)}</span>
                  </div>
                </div>
              </div>

              {/* Sign-off */}
              <div className="border-t border-slate-200 pt-4 flex justify-between items-end text-[11px] text-slate-500">
                <div>
                  <div className="font-bold text-slate-900">SUMICH SOLUTIONS LIMITED</div>
                  <div>Finance & Accounts Department &middot; Vision Plaza HQ</div>
                </div>
                <div className="text-right font-mono">
                  Registered under PSRA Act 2016
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
