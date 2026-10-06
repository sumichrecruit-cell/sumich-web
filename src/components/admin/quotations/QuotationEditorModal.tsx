import React, { useState, useEffect } from 'react';
import {
  FormalQuotation,
  QuotationLineItem,
  QuotationTemplateType,
  User,
  QuotationBrandingSettings
} from '../../../types';
import { formatKES, numberToKenyanShillingsWords } from '../../../utils/quotationUtils';
import {
  X,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Building,
  FileText,
  Calculator,
  Eye,
  Layers,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';
import { QuotationDocumentView } from './QuotationDocumentView';

interface QuotationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotationToEdit?: FormalQuotation | null;
  clients: User[];
  branding: QuotationBrandingSettings;
  onSave: (quotationData: Partial<FormalQuotation>, shouldApprove?: boolean) => void;
  nextQuotationNumber: string;
}

const COMMON_SECURITY_ITEMS = [
  {
    description: 'Day Shift Uniformed Security Officer (06:00 - 18:00 hrs) - PSRA Licensed & Vetted',
    unit: 'Guards/Month',
    unitPrice: 38000,
    taxPercent: 16
  },
  {
    description: 'Night Shift Tactical Security Officer (18:00 - 06:00 hrs) - Equipped with Wand & Baton',
    unit: 'Guards/Month',
    unitPrice: 42000,
    taxPercent: 16
  },
  {
    description: 'Canine (K9) Attack Dog & Certified Handler Patrol Team',
    unit: 'Team/Month',
    unitPrice: 55000,
    taxPercent: 16
  },
  {
    description: 'Executive Reception & Corporate Concierge Guard (Suit & Tie Uniform)',
    unit: 'Officers/Month',
    unitPrice: 48000,
    taxPercent: 16
  },
  {
    description: 'Resident Security Site Supervisor (Class A PSRA Certification)',
    unit: 'Supervisor/Month',
    unitPrice: 55000,
    taxPercent: 16
  },
  {
    description: 'Electronic RFID Patrol Tour Wand System & Cloud Attendance Logging',
    unit: 'Station/Month',
    unitPrice: 15000,
    taxPercent: 16
  },
  {
    description: 'Sub-10 Minute Rapid Mobile Intercept Response Standby (Vision Plaza Dispatch)',
    unit: 'Site SLA/Month',
    unitPrice: 20000,
    taxPercent: 16
  },
  {
    description: '24/7 Remote CCTV Video Wall Surveillance & Alarm Telemetry Monitoring',
    unit: 'Hub/Month',
    unitPrice: 35000,
    taxPercent: 16
  },
  {
    description: 'Automatic Vehicle Barrier & Biometric Gate Access Control Hardware Package',
    unit: 'Complete Set',
    unitPrice: 195000,
    taxPercent: 16
  }
];

export const QuotationEditorModal: React.FC<QuotationEditorModalProps> = ({
  isOpen,
  onClose,
  quotationToEdit,
  clients,
  branding,
  onSave,
  nextQuotationNumber
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [postalAddress, setPostalAddress] = useState('');

  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [projectTitle, setProjectTitle] = useState('Manned Guarding & Electronic Security SLA');
  const [serviceDescription, setServiceDescription] = useState(
    'Provision of professional uniformed guarding personnel, supervisory inspections, and emergency radio dispatch in strict adherence to PSRA gazetted standards.'
  );
  const [templateType, setTemplateType] = useState<QuotationTemplateType>('security_guarding');

  const [items, setItems] = useState<QuotationLineItem[]>([
    {
      id: 'item-1',
      description: 'Day Shift Security Officers (06:00 - 18:00 hrs) - PSRA Licensed',
      quantity: 2,
      unit: 'Guards/Month',
      unitPrice: 38000,
      discountPercent: 0,
      taxPercent: 16,
      lineTotal: 76000
    },
    {
      id: 'item-2',
      description: 'Night Shift Security Officers (18:00 - 06:00 hrs) - Tactical Patrol',
      quantity: 2,
      unit: 'Guards/Month',
      unitPrice: 42000,
      discountPercent: 0,
      taxPercent: 16,
      lineTotal: 84000
    }
  ]);

  const [paymentTerms, setPaymentTerms] = useState(branding.defaultPaymentTerms);
  const [deliveryTerms, setDeliveryTerms] = useState(
    'Mobilization of guard force within 48 hours of contract execution and issuance of an official Local Purchase Order (LPO).'
  );
  const [specialConditions, setSpecialConditions] = useState(branding.defaultSpecialConditions);
  const [notes, setNotes] = useState('Site risk appraisal conducted by Operations Directorate.');

  const [showLivePreview, setShowLivePreview] = useState(false);

  // Pre-fill on edit
  useEffect(() => {
    if (quotationToEdit) {
      setSelectedClientId(quotationToEdit.clientId || '');
      setCompanyName(quotationToEdit.companyName);
      setClientName(quotationToEdit.clientName);
      setContactPerson(quotationToEdit.contactPerson);
      setEmail(quotationToEdit.email);
      setPhone(quotationToEdit.phone);
      setPhysicalAddress(quotationToEdit.physicalAddress);
      setPostalAddress(quotationToEdit.postalAddress);
      setQuotationDate(quotationToEdit.quotationDate);
      setExpiryDate(quotationToEdit.expiryDate);
      setProjectTitle(quotationToEdit.projectTitle);
      setServiceDescription(quotationToEdit.serviceDescription);
      setTemplateType(quotationToEdit.templateType);
      setItems(quotationToEdit.items);
      setPaymentTerms(quotationToEdit.paymentTerms);
      setDeliveryTerms(quotationToEdit.deliveryTerms);
      setSpecialConditions(quotationToEdit.specialConditions);
      setNotes(quotationToEdit.notes);
    } else {
      // Reset form
      setSelectedClientId('');
      setCompanyName('');
      setClientName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setPhysicalAddress('');
      setPostalAddress('');
      setQuotationDate(new Date().toISOString().split('T')[0]);
      setExpiryDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
      setProjectTitle('Manned Guarding & Electronic Security SLA');
      setServiceDescription(
        'Provision of professional uniformed guarding personnel, supervisory inspections, and emergency radio dispatch in strict adherence to PSRA gazetted standards.'
      );
      setTemplateType('security_guarding');
      setItems([
        {
          id: `item-${Date.now()}-1`,
          description: 'Day Shift Security Officers (06:00 - 18:00 hrs) - PSRA Licensed',
          quantity: 2,
          unit: 'Guards/Month',
          unitPrice: 38000,
          discountPercent: 0,
          taxPercent: 16,
          lineTotal: 76000
        },
        {
          id: `item-${Date.now()}-2`,
          description: 'Night Shift Security Officers (18:00 - 06:00 hrs) - Tactical Patrol',
          quantity: 2,
          unit: 'Guards/Month',
          unitPrice: 42000,
          discountPercent: 0,
          taxPercent: 16,
          lineTotal: 84000
        }
      ]);
      setPaymentTerms(branding.defaultPaymentTerms);
      setDeliveryTerms('Mobilization of guard force within 48 hours of contract execution.');
      setSpecialConditions(branding.defaultSpecialConditions);
      setNotes('Site risk appraisal conducted by Operations Directorate.');
    }
  }, [quotationToEdit, isOpen, branding]);

  if (!isOpen) return null;

  // Handle client selection
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    const found = clients.find(c => c.id === clientId);
    if (found) {
      setClientName(found.name);
      setCompanyName(found.company || found.name);
      setContactPerson(found.name);
      setEmail(found.email);
      setPhone(found.phone);
      if (found.location) setPhysicalAddress(found.location);
    }
  };

  // Line item operations
  const handleAddItem = () => {
    const newItem: QuotationLineItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      description: 'Additional Security Item or Service',
      quantity: 1,
      unit: 'Units',
      unitPrice: 20000,
      discountPercent: 0,
      taxPercent: 16,
      lineTotal: 20000
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleAddPresetItem = (preset: typeof COMMON_SECURITY_ITEMS[0]) => {
    const newItem: QuotationLineItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      description: preset.description,
      quantity: 1,
      unit: preset.unit,
      unitPrice: preset.unitPrice,
      discountPercent: 0,
      taxPercent: preset.taxPercent,
      lineTotal: preset.unitPrice
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<QuotationLineItem>) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id === id) {
          const merged = { ...it, ...updates };
          const gross = merged.quantity * merged.unitPrice;
          const discount = gross * ((merged.discountPercent || 0) / 100);
          merged.lineTotal = gross - discount;
          return merged;
        }
        return it;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(it => it.id !== id));
  };

  // Calculations
  let subtotal = 0;
  let discountTotal = 0;
  let taxTotal = 0;

  items.forEach(it => {
    const gross = it.quantity * it.unitPrice;
    const disc = gross * ((it.discountPercent || 0) / 100);
    const afterDisc = gross - disc;
    const tax = afterDisc * ((it.taxPercent || 0) / 100);
    subtotal += afterDisc;
    discountTotal += disc;
    taxTotal += tax;
  });

  const grandTotal = Math.round(subtotal + taxTotal);
  const amountInWords = numberToKenyanShillingsWords(grandTotal);

  // Form submission
  const handleSubmit = (shouldApprove: boolean = false) => {
    if (!companyName.trim() || !contactPerson.trim() || items.length === 0) {
      alert('Please fill in client company details and at least one line item.');
      return;
    }

    const payload: Partial<FormalQuotation> = {
      clientId: selectedClientId || undefined,
      companyName,
      clientName: clientName || companyName,
      contactPerson,
      email,
      phone,
      physicalAddress: physicalAddress || 'Nairobi, Kenya',
      postalAddress: postalAddress || 'P.O. Box, Nairobi',
      quotationDate,
      expiryDate,
      projectTitle,
      serviceDescription,
      templateType,
      items,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      currency: 'KES',
      amountInWords,
      paymentTerms,
      deliveryTerms,
      specialConditions,
      notes,
      status: shouldApprove ? 'approved' : quotationToEdit ? quotationToEdit.status : 'draft'
    };

    onSave(payload, shouldApprove);
    onClose();
  };

  // Create temporary quotation object for live preview
  const previewQuotation: FormalQuotation = {
    id: quotationToEdit?.id || 'preview-qtn',
    quotationNumber: quotationToEdit?.quotationNumber || nextQuotationNumber,
    clientId: selectedClientId,
    clientName: clientName || 'Valued Client',
    companyName: companyName || 'Company Name',
    contactPerson: contactPerson || 'Contact Person',
    email,
    phone,
    physicalAddress: physicalAddress || 'Nairobi, Kenya',
    postalAddress: postalAddress || 'P.O. Box, Nairobi',
    quotationDate,
    expiryDate,
    projectTitle,
    serviceDescription,
    templateType,
    items,
    subtotal,
    discountTotal,
    taxTotal,
    grandTotal,
    currency: 'KES',
    amountInWords,
    paymentTerms,
    deliveryTerms,
    specialConditions,
    notes,
    status: quotationToEdit?.status || 'draft',
    approvalDetails: quotationToEdit?.approvalDetails,
    auditTrail: quotationToEdit?.auditTrail || [],
    createdAt: quotationToEdit?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {quotationToEdit ? 'Edit Quotation' : 'Create Formal Service Quotation'}
                </h3>
                <span className="font-mono text-xs text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {quotationToEdit?.quotationNumber || nextQuotationNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sumich Solutions Limited &middot; PSRA Accredited Service Quotation Generator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                showLivePreview ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showLivePreview ? 'Back to Editor' : 'Live A4 Preview'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {showLivePreview ? (
            <QuotationDocumentView quotation={previewQuotation} branding={branding} />
          ) : (
            <div className="space-y-6">
              {/* Template Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  Select Quotation Template Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'security_guarding', label: 'Security Guarding', sub: 'Manned & K9 Force' },
                    { id: 'corporate', label: 'Corporate & VIP', sub: 'Concierge & Multi-Site' },
                    { id: 'maintenance', label: 'Systems & CCTV', sub: 'Alarms & Barriers' },
                    { id: 'tender', label: 'Tender / RFP', sub: 'Institutional Bid' },
                    { id: 'standard', label: 'Standard Quote', sub: 'General Purpose' }
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setTemplateType(tmpl.id as QuotationTemplateType)}
                      className={`p-3 text-left rounded-xl border transition-all text-xs ${
                        templateType === tmpl.id
                          ? 'border-amber-500 bg-amber-50/80 text-amber-950 shadow-xs ring-1 ring-amber-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold">{tmpl.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{tmpl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Selection & Primary Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Client & Target Organization
                    </span>
                  </div>

                  {clients.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Pick Existing Client:</span>
                      <select
                        value={selectedClientId}
                        onChange={e => handleSelectClient(e.target.value)}
                        className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="">-- Choose Existing Client --</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.company || c.name} ({c.name})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Logistics Hub Ltd"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Contact Person *</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={e => setContactPerson(e.target.value)}
                      placeholder="e.g. Eng. James Mwangi"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. client@organization.co.ke"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 0722 000 111"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Physical Address / Deployment Site</label>
                    <input
                      type="text"
                      value={physicalAddress}
                      onChange={e => setPhysicalAddress(e.target.value)}
                      placeholder="e.g. Mombasa Road Logistics Park, Godown 14, Nairobi"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Postal Address</label>
                    <input
                      type="text"
                      value={postalAddress}
                      onChange={e => setPostalAddress(e.target.value)}
                      placeholder="e.g. P.O. Box 48900 - 00100, Nairobi"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Quotation Metadata: Dates & Scope Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Quotation Date</label>
                  <input
                    type="date"
                    value={quotationDate}
                    onChange={e => setQuotationDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Validity Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Project / Reference Title *</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={e => setProjectTitle(e.target.value)}
                    placeholder="e.g. Manned Guarding & Perimeter Patrol SLA"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-semibold mb-1">Service Scope & Executive Summary</label>
                  <textarea
                    rows={2}
                    value={serviceDescription}
                    onChange={e => setServiceDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="Brief description of the service scope, personnel counts, and deployment expectations."
                  />
                </div>
              </div>

              {/* Quick Preset Service Line Item Picker */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Quick Add Common Kenyan Security Services (1-Click Preset):
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SECURITY_ITEMS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetItem(preset)}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-950 border border-amber-300/80 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-amber-600" />
                      <span>{preset.description.split(' - ')[0]}</span>
                      <span className="font-mono text-slate-400">({formatKES(preset.unitPrice)})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Multiple Quotation Line Items Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-amber-600" />
                    Quotation Line Items & Service Pricing:
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] text-slate-500 font-medium">Item Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={e => handleUpdateItem(item.id, { description: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-[10px] text-slate-500 font-medium text-center">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleUpdateItem(item.id, { quantity: Number(e.target.value) || 1 })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 font-medium">Unit</label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={e => handleUpdateItem(item.id, { unit: e.target.value })}
                          placeholder="e.g. Guards/Mo"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 font-medium">Unit Price (KES)</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={e => handleUpdateItem(item.id, { unitPrice: Number(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-right text-xs font-mono"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-[10px] text-slate-500 font-medium text-center">Disc %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPercent}
                          onChange={e => handleUpdateItem(item.id, { discountPercent: Number(e.target.value) || 0 })}
                          className="w-full px-1 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-[10px] text-slate-500 font-medium text-center">VAT %</label>
                        <select
                          value={item.taxPercent}
                          onChange={e => handleUpdateItem(item.id, { taxPercent: Number(e.target.value) })}
                          className="w-full px-1 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                        >
                          <option value={16}>16%</option>
                          <option value={0}>0%</option>
                        </select>
                      </div>

                      <div className="sm:col-span-1 flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0">
                        <div className="sm:hidden font-mono font-bold text-slate-900">
                          {formatKES(item.lineTotal)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length <= 1}
                          className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded"
                          title="Delete line item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-Time Financial Totals Card */}
              <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                    Live Amount In Words (Kenyan Shillings)
                  </div>
                  <div className="text-xs font-serif italic text-slate-200">
                    “{amountInWords}”
                  </div>
                </div>

                <div className="sm:text-right space-y-1 font-mono text-xs">
                  <div className="text-slate-400">
                    Subtotal: <span className="text-white">{formatKES(subtotal)}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="text-emerald-400">
                      Discount: -{formatKES(discountTotal)}
                    </div>
                  )}
                  <div className="text-slate-400">
                    VAT (16%): <span className="text-white">{formatKES(taxTotal)}</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-amber-400 pt-1 border-t border-slate-800">
                    Grand Total: {formatKES(grandTotal)}
                  </div>
                </div>
              </div>

              {/* Terms, Conditions & Payment Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Payment Terms</label>
                  <textarea
                    rows={2}
                    value={paymentTerms}
                    onChange={e => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Deployment & Mobilization Terms</label>
                  <textarea
                    rows={2}
                    value={deliveryTerms}
                    onChange={e => setDeliveryTerms(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Special Site Conditions</label>
                  <textarea
                    rows={2}
                    value={specialConditions}
                    onChange={e => setSpecialConditions(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Internal Operations Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Finalize Quotation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
