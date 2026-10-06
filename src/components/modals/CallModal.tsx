import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Phone, ShieldAlert, Clock, MapPin, Mail, ExternalLink } from 'lucide-react';

export const CallModal: React.FC = () => {
  const { callModalOpen, setCallModalOpen, companyInfo } = useApp();

  if (!callModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Contact Sumich Security Dispatch</h3>
              <p className="text-xs text-slate-400">Immediate telephone lines & 24/7 duty desk</p>
            </div>
          </div>
          <button
            onClick={() => setCallModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <div className="font-bold text-sm text-slate-900 mb-0.5">24/7 Emergency Rapid Response Hotline</div>
              Direct link to our Mombasa Road central alarm dispatch and mobile armed patrol coordinators.
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={`tel:${companyInfo.phones[0].replace(/\s+/g, '')}`}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-amber-500/20 text-slate-800 group-hover:text-amber-700 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Primary Operations Desk</div>
                  <div className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                    {companyInfo.phones[0]}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 group-hover:bg-amber-400">
                Call Now <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            <a
              href={`tel:${companyInfo.phones[1].replace(/\s+/g, '')}`}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-amber-500/20 text-slate-800 group-hover:text-amber-700 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Hotline & Rapid Response</div>
                  <div className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                    {companyInfo.phones[1]}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 group-hover:bg-amber-400">
                Call Now <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Office Hours: 8:00 AM – 5:00 PM (EAT) | Security Control Room: 24/7/365</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Vision Plaza, 3rd Floor, Suite 17B, Mombasa Road, Nairobi</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{companyInfo.email}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
