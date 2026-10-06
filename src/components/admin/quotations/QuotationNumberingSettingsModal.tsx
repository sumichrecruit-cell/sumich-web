import React, { useState } from 'react';
import { QuotationNumberingConfig } from '../../../types';
import { generateNextQuotationNumber } from '../../../utils/quotationUtils';
import { X, Hash, Save, CheckCircle2, Shield, AlertCircle } from 'lucide-react';

interface QuotationNumberingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: QuotationNumberingConfig;
  onSave: (updated: Partial<QuotationNumberingConfig>) => void;
}

export const QuotationNumberingSettingsModal: React.FC<QuotationNumberingSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [prefix, setPrefix] = useState(config.prefix || 'SUMICH/QTN');
  const [yearFormat, setYearFormat] = useState<'YYYY' | 'YY' | 'NONE'>(config.yearFormat || 'YYYY');
  const [digits, setDigits] = useState<number>(config.digits || 4);
  const [nextNumber, setNextNumber] = useState<number>(config.nextNumber || 1);
  const [autoIncrement, setAutoIncrement] = useState<boolean>(config.autoIncrement !== false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const preview = generateNextQuotationNumber(prefix, yearFormat, digits, nextNumber);

  const handleSave = () => {
    onSave({
      prefix: prefix.trim().toUpperCase(),
      yearFormat,
      digits: Number(digits),
      nextNumber: Number(nextNumber),
      autoIncrement
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Quotation Numbering Scheme</h3>
              <p className="text-xs text-slate-400">Configure auto-generated sequence format.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Live Preview Box */}
          <div className="p-4 bg-slate-950 text-white rounded-xl border border-slate-800 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Generated Next Quotation Number Preview:
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 tracking-wider">
              {preview}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              Unique sequence &bull; Zero collision guarantee
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Quotation Prefix</label>
              <input
                type="text"
                value={prefix}
                onChange={e => setPrefix(e.target.value)}
                placeholder="e.g. SUMICH/QTN"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs uppercase"
              />
              <span className="text-[10px] text-slate-500">Official Sumich standard: SUMICH/QTN</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Year Part</label>
                <select
                  value={yearFormat}
                  onChange={e => setYearFormat(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="YYYY">YYYY (e.g. /2026)</option>
                  <option value="YY">YY (e.g. /26)</option>
                  <option value="NONE">No Year Part</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Digits Padding</label>
                <select
                  value={digits}
                  onChange={e => setDigits(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-mono"
                >
                  <option value={3}>3 Digits (001)</option>
                  <option value={4}>4 Digits (0001)</option>
                  <option value={5}>5 Digits (00001)</option>
                  <option value={6}>6 Digits (000001)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Next Sequence Counter</label>
              <input
                type="number"
                min="1"
                value={nextNumber}
                onChange={e => setNextNumber(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>

            <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={autoIncrement}
                onChange={e => setAutoIncrement(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span>Automatically increment sequence upon quotation creation</span>
            </label>
          </div>
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

          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Saved!</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
