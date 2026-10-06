import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { SumichLogo } from '../common/SumichLogo';

export const Footer: React.FC = () => {
  const { setCurrentView, setQuoteModalOpen, setCallModalOpen, setAuthModalOpen, setAuthInitialMode, companyInfo } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Corporate Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 p-1 overflow-hidden">
                {companyInfo?.logoDataUrl ? (
                  <img
                    src={companyInfo.logoDataUrl}
                    alt={companyInfo.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <SumichLogo className="w-6 h-7" />
                )}
              </div>
              <div>
                <div className="text-lg font-bold text-white tracking-tight">{companyInfo.name}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">
                  {companyInfo.tagline}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Kenya’s premier private security company providing licensed manned guarding, electronic surveillance, corporate security, and tactical rapid response.
            </p>
            <div className="pt-2 text-xs text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>PSRA Registered & Certified: <strong className="text-amber-400 font-mono">PSRA/REG/KEN/2023/0488</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-500/30 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('careers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Careers & Recruitment
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAuthInitialMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Register Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setQuoteModalOpen(true);
                  }}
                  className="text-amber-400 font-semibold hover:text-amber-300 transition-colors text-left"
                >
                  Request a Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services Preview */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-500/30 pb-2">
              Key Guarding Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Manned Guarding & Patrols</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Corporate & Reception Security</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Commercial & Industrial Security</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>CCTV Surveillance & Control Center</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Access Control & Parking Management</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Alarm Rapid Response & VIP Escort</span>
              </li>
            </ul>
          </div>

          {/* Contact & Physical Office */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-500/30 pb-2">
              Headquarters
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Vision Plaza, 3rd Floor, Suite 17B</div>
                  <div className="text-xs text-slate-400">Mombasa Road, Nairobi, Kenya</div>
                  <div className="text-xs text-slate-400">P.O. Box 59140 - 00200, Nairobi</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <button
                    onClick={() => setCallModalOpen(true)}
                    className="hover:text-amber-400 font-mono text-xs block text-left"
                  >
                    0117 230 136 / 0735 229 229
                  </button>
                  <span className="text-[10px] text-amber-500/90 font-medium">24/7 Operations Hotline</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="hover:text-amber-400 text-xs text-slate-300 font-mono"
                >
                  {companyInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2026 Sumich Solutions Limited. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms & Conditions</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-300 cursor-pointer">PSRA Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
