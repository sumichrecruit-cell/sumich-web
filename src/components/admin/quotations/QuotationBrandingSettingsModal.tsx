import React, { useState, useRef } from 'react';
import { QuotationBrandingSettings } from '../../../types';
import { useApp } from '../../../context/AppContext';
import {
  X,
  Save,
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
  Shield,
  Eye,
  Type,
  Layout,
  Palette,
  Building,
  Download,
  Printer
} from 'lucide-react';
import { downloadUploadedFile, printUploadedFile } from '../../../utils/fileHelpers';

interface QuotationBrandingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: QuotationBrandingSettings;
  onSave: (updated: Partial<QuotationBrandingSettings>) => void;
}

export const QuotationBrandingSettingsModal: React.FC<QuotationBrandingSettingsModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSave
}) => {
  const { openDocPreview } = useApp();
  const [formData, setFormData] = useState<QuotationBrandingSettings>({ ...branding });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'logo_letterhead' | 'designer' | 'terms'>('identity');
  const [logoUploadError, setLogoUploadError] = useState('');
  const [letterheadUploadError, setLetterheadUploadError] = useState('');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const letterheadInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoUploadError('Logo file size must be less than 2MB.');
      return;
    }

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setLogoUploadError('Only PNG, JPG, or SVG images are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setFormData(prev => ({ ...prev, logoDataUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleLetterheadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLetterheadUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setLetterheadUploadError('Letterhead file size must be less than 4MB.');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setLetterheadUploadError('Only PNG or JPG image formats are supported for letterhead backgrounds.');
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setFormData(prev => ({ ...prev, letterheadDataUrl: result, useLetterhead: true }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Quotation Branding & Letterhead Customizer
              </h3>
              <p className="text-xs text-slate-400">
                Configure corporate identity, logo, letterhead styling, and default terms without code edits.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('identity')}
            className={`px-3.5 py-1.5 font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'identity' ? 'bg-slate-900 text-amber-400 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Company Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('logo_letterhead')}
            className={`px-3.5 py-1.5 font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'logo_letterhead' ? 'bg-slate-900 text-amber-400 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2. Logo & Letterhead</span>
          </button>

          <button
            onClick={() => setActiveTab('designer')}
            className={`px-3.5 py-1.5 font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'designer' ? 'bg-slate-900 text-amber-400 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>3. Quotation Designer & Typography</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3.5 py-1.5 font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'terms' ? 'bg-slate-900 text-amber-400 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>4. Terms & Signatures</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: COMPANY IDENTITY */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Motto / Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">PSRA Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="e.g. PSRA/REG/KEN/2023/0488"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">KRA PIN Number</label>
                  <input
                    type="text"
                    value={formData.kraPin}
                    onChange={e => setFormData({ ...formData, kraPin: e.target.value })}
                    placeholder="e.g. P051928471Z"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">VAT Certificate Number</label>
                  <input
                    type="text"
                    value={formData.vatNumber}
                    onChange={e => setFormData({ ...formData, vatNumber: e.target.value })}
                    placeholder="e.g. 051928471-V"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Telephone Numbers</label>
                  <input
                    type="text"
                    value={formData.telephone}
                    onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">24/7 Control Room Emergency Hotline</label>
                  <input
                    type="text"
                    value={formData.emergencyHotline}
                    onChange={e => setFormData({ ...formData, emergencyHotline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Physical Address (National HQ)</label>
                  <input
                    type="text"
                    value={formData.physicalAddress}
                    onChange={e => setFormData({ ...formData, physicalAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Postal Address</label>
                  <input
                    type="text"
                    value={formData.postalAddress}
                    onChange={e => setFormData({ ...formData, postalAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Website URL</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOGO & LETTERHEAD UPLOAD */}
          {activeTab === 'logo_letterhead' && (
            <div className="space-y-6">
              {/* Logo Section */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Company Logo</h4>
                    <p className="text-[11px] text-slate-500">
                      Upload your high-resolution corporate logo (PNG, JPG, or SVG). Max file size 2MB.
                    </p>
                  </div>
                  {formData.logoDataUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoDataUrl: undefined })}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                </div>

                {logoUploadError && (
                  <div className="text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                    {logoUploadError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Logo Preview Box */}
                  <div className="w-48 h-28 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center p-3 overflow-hidden">
                    {formData.logoDataUrl ? (
                      <img
                        src={formData.logoDataUrl}
                        alt="Logo Preview"
                        style={{ width: `${formData.logoWidthPx}px` }}
                        className="object-contain max-h-24"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <Shield className="w-8 h-8 mx-auto text-amber-500 mb-1" />
                        <span className="text-[10px]">Using Sumich Default Crest</span>
                      </div>
                    )}
                  </div>

                  {/* Logo Controls */}
                  <div className="space-y-3 flex-1 text-xs">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>{formData.logoDataUrl ? 'Replace Logo' : 'Upload Logo File'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openDocPreview({
                          title: 'Corporate Logo Crest',
                          applicantName: 'Sumich Solutions Limited',
                          fileName: 'Sumich_Corporate_Vector_Logo.svg',
                          fileDataUrl: formData.logoDataUrl,
                          category: 'BRANDING',
                          content: 'SUMICH SOLUTIONS LIMITED\nOfficial Logo Crest and Emblem'
                        })}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        title="View Full Logo"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-600" />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadUploadedFile({
                          fileDataUrl: formData.logoDataUrl,
                          fileName: 'Sumich_Corporate_Logo.svg',
                          content: 'Official Sumich Corporate Logo Asset'
                        })}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        title="Download Logo"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => printUploadedFile({
                          fileDataUrl: formData.logoDataUrl,
                          title: 'Official Corporate Logo Graphic Spec',
                          fileName: 'Sumich_Logo_Specification.pdf',
                          category: 'BRANDING',
                          content: 'SUMICH SOLUTIONS LIMITED\nOfficial Corporate Logo Vector'
                        })}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        title="Print Logo Spec"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-600" />
                        <span>Print</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          Logo Width: {formData.logoWidthPx}px
                        </label>
                        <input
                          type="range"
                          min="100"
                          max="260"
                          value={formData.logoWidthPx}
                          onChange={e => setFormData({ ...formData, logoWidthPx: Number(e.target.value) })}
                          className="w-full accent-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Logo Position</label>
                        <select
                          value={formData.logoPosition}
                          onChange={e => setFormData({ ...formData, logoPosition: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs"
                        >
                          <option value="left">Left Aligned</option>
                          <option value="center">Centered</option>
                          <option value="right">Right Aligned</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Letterhead Section */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Company Letterhead Graphic
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Upload an official pre-printed company letterhead banner (PNG or JPG). Max file size 4MB.
                    </p>
                  </div>
                  {formData.letterheadDataUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, letterheadDataUrl: undefined, useLetterhead: false })}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Letterhead</span>
                    </button>
                  )}
                </div>

                {letterheadUploadError && (
                  <div className="text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                    {letterheadUploadError}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      ref={letterheadInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleLetterheadUpload}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => letterheadInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-xs"
                      >
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>{formData.letterheadDataUrl ? 'Replace Letterhead' : 'Upload Letterhead Image'}</span>
                      </button>

                      {formData.letterheadDataUrl && (
                        <>
                          <button
                            type="button"
                            onClick={() => openDocPreview({
                              title: 'Official Letterhead Artwork',
                              applicantName: 'Sumich Solutions Limited',
                              fileName: 'Sumich_Official_Letterhead.png',
                              fileDataUrl: formData.letterheadDataUrl,
                              category: 'BRANDING',
                              content: 'SUMICH SOLUTIONS LIMITED\nOfficial Corporate Letterhead Banner'
                            })}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                            title="View Letterhead"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => downloadUploadedFile({
                              fileDataUrl: formData.letterheadDataUrl,
                              fileName: 'Sumich_Official_Letterhead.png',
                              content: 'Official Sumich Letterhead'
                            })}
                            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                            title="Download Letterhead"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => printUploadedFile({
                              fileDataUrl: formData.letterheadDataUrl,
                              title: 'Corporate Letterhead Stationery Spec',
                              fileName: 'Sumich_Letterhead_Spec.pdf',
                              category: 'BRANDING',
                              content: 'SUMICH SOLUTIONS LIMITED\nOfficial A4 Letterhead Stationery'
                            })}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                            title="Print Letterhead Spec"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-600" />
                            <span>Print</span>
                          </button>
                        </>
                      )}

                      <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer ml-auto">
                        <input
                          type="checkbox"
                          checked={formData.useLetterhead}
                          onChange={e => setFormData({ ...formData, useLetterhead: e.target.checked })}
                          className="rounded text-amber-500 focus:ring-amber-400"
                        />
                        <span>Enable Letterhead on Quotations</span>
                      </label>
                    </div>
                  </div>

                  {formData.letterheadDataUrl && (
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-600 mb-1">Letterhead Preview:</div>
                      <img
                        src={formData.letterheadDataUrl}
                        alt="Letterhead Preview"
                        className="max-h-24 w-full object-contain rounded border border-slate-100"
                      />
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <label className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name="letterheadMode"
                            checked={formData.letterheadMode === 'first_page'}
                            onChange={() => setFormData({ ...formData, letterheadMode: 'first_page' })}
                          />
                          <span>Show on First Page Only</span>
                        </label>
                        <label className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name="letterheadMode"
                            checked={formData.letterheadMode === 'all_pages'}
                            onChange={() => setFormData({ ...formData, letterheadMode: 'all_pages' })}
                          />
                          <span>Show on Every Quotation Page</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUOTATION DESIGNER */}
          {activeTab === 'designer' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-600" />
                    <span>Brand Accent Color</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.accentColor}
                      onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    {['#d97706', '#1e3a8a', '#059669', '#0f172a', '#b45309'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({ ...formData, accentColor: c })}
                        className="w-6 h-6 rounded-full border border-slate-300 shadow-xs"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-amber-600" />
                    <span>Quotation Font Family</span>
                  </label>
                  <select
                    value={formData.fontFamily}
                    onChange={e => setFormData({ ...formData, fontFamily: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Inter, sans-serif">Inter (Modern Clean Sans)</option>
                    <option value="Arial, sans-serif">Arial (Standard Corporate)</option>
                    <option value="Georgia, serif">Georgia (Traditional Executive Serif)</option>
                    <option value="Roboto, sans-serif">Roboto (Structured Technical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-amber-600" />
                    <span>Line Items Table Style</span>
                  </label>
                  <select
                    value={formData.tableStyle}
                    onChange={e => setFormData({ ...formData, tableStyle: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="modern">Modern (Dark Heading with Light Striping)</option>
                    <option value="bordered">Bordered Grid (Full Cell Borders)</option>
                    <option value="minimal">Minimal (Clean Dividers Only)</option>
                    <option value="tactical_striped">Tactical Striped (High-Contrast Security Style)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Page Margin Layout</label>
                  <select
                    value={formData.pageMargins}
                    onChange={e => setFormData({ ...formData, pageMargins: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="normal">Standard A4 Margins</option>
                    <option value="compact">Compact Margins (More items per page)</option>
                    <option value="spacious">Spacious Executive Margins</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Document Footer Notice</label>
                  <input
                    type="text"
                    value={formData.footerText}
                    onChange={e => setFormData({ ...formData, footerText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEFAULT TERMS & SIGNATURE */}
          {activeTab === 'terms' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Default Security Terms & Conditions (Auto-populated on new quotations)
                </label>
                <textarea
                  rows={4}
                  value={formData.defaultTerms}
                  onChange={e => setFormData({ ...formData, defaultTerms: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Default Payment Terms & Banking Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.defaultPaymentTerms}
                  onChange={e => setFormData({ ...formData, defaultPaymentTerms: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Default Special Site Mobilization Conditions
                </label>
                <textarea
                  rows={2}
                  value={formData.defaultSpecialConditions}
                  onChange={e => setFormData({ ...formData, defaultSpecialConditions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Authorized Signatory Full Name</label>
                  <input
                    type="text"
                    value={formData.authorizedSignatoryName}
                    onChange={e => setFormData({ ...formData, authorizedSignatoryName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Signatory Title / Designation</label>
                  <input
                    type="text"
                    value={formData.authorizedSignatoryTitle}
                    onChange={e => setFormData({ ...formData, authorizedSignatoryTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Default Template Saved Successfully!</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE DESIGN AS DEFAULT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
