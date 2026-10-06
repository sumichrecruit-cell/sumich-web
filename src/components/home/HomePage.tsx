import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Phone,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  Users,
  Camera,
  Car,
  BellRing,
  Star,
  MapPin,
  Mail,
  Clock,
  Award,
  Send,
  Radio
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    setCurrentView,
    setQuoteModalOpen,
    setSelectedServiceForQuote,
    setAppointmentModalOpen,
    setCallModalOpen,
    companyInfo,
    testimonials,
    services,
    submitInquiry,
    currentUser
  } = useApp();

  const [inquiryData, setInquiryData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    subject: '',
    message: ''
  });
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email || !inquiryData.message) return;

    submitInquiry({
      userId: currentUser?.id,
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      subject: inquiryData.subject || 'General Security Inquiry',
      message: inquiryData.message
    });
    setInquirySent(true);
  };

  const featuredServices = services.slice(0, 6);

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        {/* Background Subtle Geometric Pattern Overlay (No Photos) */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Accreditation Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide">
                <Award className="w-4 h-4 text-amber-400" />
                <span>PSRA Registered & Certified Kenyan Security Guarding Provider</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  {companyInfo.name ? (
                    <>
                      {companyInfo.name.split(' ').slice(0, -1).join(' ')}{' '}
                      <span className="text-amber-500">{companyInfo.name.split(' ').slice(-1).join('')}</span>
                    </>
                  ) : (
                    <>SUMICH SOLUTIONS <span className="text-amber-500">LIMITED</span></>
                  )}
                </h1>
                <p className="text-xl sm:text-2xl font-medium text-amber-400 font-display">
                  “{companyInfo.tagline || 'Your Security, Our Commitment.'}”
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Kenya’s trusted provider of disciplined manned guarding, corporate defense, industrial asset protection, rapid alarm response, and 24/7 CCTV surveillance across Nairobi and the Mombasa Road commercial corridor.
              </p>

              {/* Hero Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedServiceForQuote('Security Guarding Services');
                    setQuoteModalOpen(true);
                  }}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 flex items-center gap-2"
                >
                  <span>REQUEST A QUOTE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#contact"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl text-sm transition-all backdrop-blur-xs flex items-center gap-2"
                >
                  <span>CONTACT US</span>
                </a>

                <button
                  onClick={() => setCallModalOpen(true)}
                  className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-900 border border-amber-500/40 text-amber-400 font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>CALL US: 0117 230 136</span>
                </button>
              </div>

              {/* Quick Proof Metrics */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-6 max-w-xl text-slate-300">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">24/7</div>
                  <div className="text-xs text-slate-400">Command Center</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">100%</div>
                  <div className="text-xs text-slate-400">PSRA Licensed</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">&lt;10 Min</div>
                  <div className="text-xs text-slate-400">Response Speed</div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Security Operations & Dispatch Command Console Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-7 space-y-6">
                {/* Top Badge & Live Indicator */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                      <Shield className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">SUMICH COMMAND HUB</div>
                      <div className="text-white font-extrabold text-sm sm:text-base">Vigilance & Tactical Operations</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE DISPATCH
                  </div>
                </div>

                {/* Operations Key Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mb-1">
                      <Radio className="w-3.5 h-3.5 text-amber-400" />
                      Two-Way VHF Network
                    </div>
                    <div className="text-white font-bold text-sm">156.800 MHz</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Encrypted Repeater Online</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mb-1">
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      Mobile Patrol SLA
                    </div>
                    <div className="text-white font-bold text-sm">&lt; 10 Minutes</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">Nairobi Rapid Intercept</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mb-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      PSRA Compliance
                    </div>
                    <div className="text-white font-bold text-sm">Class A Guarding</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Lic. PSRA/REG/KEN/2023/0488</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mb-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Perimeter Wand Tours
                    </div>
                    <div className="text-white font-bold text-sm">100% RFID Logged</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Zero Sleep Lapses</div>
                  </div>
                </div>

                {/* Headquarters Location Banner */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>Nairobi Command Operations & Dispatch Base</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-6">
                    Vision Plaza, 3rd Floor, Suite 17B, Mombasa Road. Immediate deployment coverage across Commercial, Industrial, and Diplomatic Zones.
                  </p>
                </div>

                {/* Action Button inside card */}
                <div className="pt-1">
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>DEPLOY VERIFIED GUARDS TO YOUR PREMISES</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SUMICH SOLUTIONS LIMITED */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                About Sumich Solutions Limited
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-snug">
                Pioneering Professional, Disciplined & Reliable Security Across Kenya
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Incorporated in the Republic of Kenya with headquarters at Vision Plaza on Mombasa Road, <strong>SUMICH SOLUTIONS LIMITED</strong> was founded on the bedrock of unyielding integrity, tactical vigilance, and client dedication.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                We bridge physical discipline with modern surveillance technology. From executive corporate towers in Nairobi to industrial manufacturing plants and gated residential communities, we deploy vetted personnel who take pride in upholding safety as a sacred trust.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <strong className="block text-slate-900 font-semibold mb-0.5">Strict Background Vetting</strong>
                    Certificate of Good Conduct & National Intelligence fingerprint clearance on all personnel.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <strong className="block text-slate-900 font-semibold mb-0.5">Electronic Patrol Tour Wands</strong>
                    RFID-logged perimeter checks ensure continuous supervisory accountability without sleep lapses.
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setCurrentView('about')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Learn More About Sumich</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentView('services')}
                  className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Explore Guarding Services</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => setAppointmentModalOpen(true)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-800 hover:border-slate-900 text-xs font-semibold rounded-lg transition-colors"
                >
                  Book Site Survey
                </button>
              </div>
            </div>

            {/* Corporate Guarding Showcase & Governance Card */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Shield className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Guard Quality Assurance</div>
                      <div className="text-sm font-extrabold text-white">Sumich Personnel Standards</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                    VETTED 100%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Good Conduct</span>
                    <span className="font-bold text-white text-xs">DCI Clearance</span>
                    <span className="text-[10px] text-amber-400 block mt-0.5">Biometrics Screened</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Drill Discipline</span>
                    <span className="font-bold text-white text-xs">Tactical Training</span>
                    <span className="text-[10px] text-amber-400 block mt-0.5">PSRA Curriculum</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patrol Wands</span>
                    <span className="font-bold text-white text-xs">RFID Logged</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Hourly Site Proof</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Turnout & Grooming</span>
                    <span className="font-bold text-white text-xs">Immaculate Uniform</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Corporate Standard</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300 font-medium">Uniformed Guard Force Strength</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">250+ Officers</span>
                </div>
              </div>

              <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-amber-400 stroke-[2.2]" />
                    <span className="font-bold text-white text-sm">SUMICH SOLUTIONS STANDARDS</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">PSRA/REG/KEN/2023/0488</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-0.5">PSRA Compliant</span>
                    <span className="text-slate-400">Strict adherence to gazetted wage & training laws.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-0.5">RFID Tour Wands</span>
                    <span className="text-slate-400">Continuous perimeter patrol verification.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              The Sumich Advantage
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Why Corporate & Residential Clients Choose Us
            </h2>
            <p className="text-sm text-slate-600">
              Security is not merely a uniform; it is an uncompromising standard of operational rigor, constant inspection, and lightning-fast incident escalation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">PSRA Licensed & Certified</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full compliance with the Private Security Regulatory Authority of Kenya (PSRA/REG/KEN/2023/0488). All guards hold registered force numbers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Vetted & Rigorously Trained</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recruits undergo biometric background checks, physical fitness tests, customer service etiquette, first aid, and basic firefighting.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Radio className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">24/7 Digital Operations Center</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stationed at Vision Plaza, our command room integrates live CCTV video telemetry, GPS guard tracking, and radio telemetry.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Car className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Mobile Tactical Patrols</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated motorized response vehicles and armed backup teams patrolling Nairobi and the Mombasa Road corridor day and night.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY SECURITY SERVICES */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Our Capabilities
              </div>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
                Comprehensive Security & Guarding Solutions
              </h2>
              <p className="text-sm text-slate-600">
                Tailored security packages designed to protect personnel, physical infrastructure, cargo, and sensitive information.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('services')}
              className="px-5 py-2.5 bg-slate-900 text-amber-400 hover:bg-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 self-start md:self-auto"
            >
              <span>View All 14 Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map(srv => (
              <div
                key={srv.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {srv.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.shortDescription}
                  </p>

                  <div className="pt-2 space-y-1.5">
                    {srv.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedServiceForQuote(srv.title);
                      setQuoteModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                  >
                    REQUEST A QUOTE
                  </button>

                  <button
                    onClick={() => setCurrentView('services')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3 text-amber-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SPOTLIGHT: 24/7 COMMAND CENTER & MOBILE PATROLS */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-semibold">
                <Camera className="w-4 h-4" />
                <span>Command & Control Center &middot; Vision Plaza 3rd Floor</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                24/7 Electronic Surveillance & Rapid Intervention
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Physical security is reinforced by real-time technology. From our central operations hub on Mombasa Road, specialized controllers continuously monitor high-definition CCTV feeds, investigate perimeter sensor activations, and maintain live radio contact with all deployed field guards.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">Active Alarm Dispatch:</strong> Emergency radio and automated telemetry immediately scramble mobile patrol vehicles to the scene.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">Daily SITREPs:</strong> Clients receive computerized daily situation reports detailing visitor counts, security wand logs, and incident logs.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">Police Liaison:</strong> Priority direct hotline and protocols established with Kenya National Police Service.
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedServiceForQuote('CCTV Monitoring & Surveillance');
                    setQuoteModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 shadow"
                >
                  REQUEST CCTV / ALARM QUOTE
                </button>
                <button
                  onClick={() => setCallModalOpen(true)}
                  className="px-5 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg hover:border-amber-400"
                >
                  Speak with Operations Officer
                </button>
              </div>
            </div>

            {/* Command Telemetry & Operations Monitoring Consoles */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Central CCTV Surveillance Matrix Console */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>CCTV Surveillance Matrix</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Zone A: Mombasa Rd</div>
                      <div className="text-emerald-400 font-bold mt-0.5">● FEED 1-08 OK</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Zone B: Industrial Area</div>
                      <div className="text-emerald-400 font-bold mt-0.5">● FEED 1-12 OK</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Zone C: Commercial Mall</div>
                      <div className="text-emerald-400 font-bold mt-0.5">● FEED 2-04 OK</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Zone D: Residential Est.</div>
                      <div className="text-emerald-400 font-bold mt-0.5">● FEED 2-16 OK</div>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                    <span>Central Video Wall</span>
                    <span className="text-amber-400 font-mono font-bold">Vision Plaza HQ</span>
                  </div>
                </div>

                {/* Mobile Tactical Patrol Fleet Telemetry Console */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      <Car className="w-4 h-4 text-amber-400" />
                      <span>Mobile Tactical Patrol Fleet</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">&lt;10 Min SLA</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Unit Alpha-1 (HQ)</div>
                      <div className="text-emerald-400 font-bold mt-0.5">ON STANDBY</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Unit Bravo-2 (Airport)</div>
                      <div className="text-emerald-400 font-bold mt-0.5">ON PATROL</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Unit Charlie-3 (West)</div>
                      <div className="text-emerald-400 font-bold mt-0.5">ON PATROL</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Unit Delta-4 (CBD)</div>
                      <div className="text-emerald-400 font-bold mt-0.5">ON STANDBY</div>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                    <span>GPS Telemetry Status</span>
                    <span className="text-emerald-400 font-mono font-bold">100% ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Live Telemetry Panel */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Vision Plaza Command Hub Active</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">24/7/365 Duty Desk</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">CCTV Feeds</span>
                    <span className="font-mono font-bold text-amber-400">100% LIVE</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Patrol Fleet</span>
                    <span className="font-mono font-bold text-white">&lt; 10 MINS</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">VHF Radio</span>
                    <span className="font-mono font-bold text-emerald-400">CH 4 BASE</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">RFID Tour Wands</span>
                    <span className="font-mono font-bold text-amber-400">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR COMMITMENT */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 rounded-3xl p-8 sm:p-12 lg:p-14 text-slate-950 relative overflow-hidden shadow-xl border border-amber-400/50">
            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-950 text-amber-400 text-xs font-black uppercase tracking-widest shadow-sm">
                Our Sacred Pledge
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-4xl font-black tracking-tight text-slate-950 max-w-3xl mx-auto leading-tight">
                Our Commitment: Guarding What Matters Most to You
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-950/85 leading-relaxed max-w-2xl mx-auto">
                At Sumich Solutions Limited, we operate under the solemn understanding that our guards protect human lives, commercial livelihoods, and irreplaceable assets. We commit to:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto text-left pt-2">
                <div className="bg-white/95 backdrop-blur-xs p-5 sm:p-6 rounded-2xl border border-amber-600/20 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="font-bold text-sm sm:text-base text-slate-950 mb-1.5">Zero Negligence Discipline</div>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">Regular supervisor visits, alcohol breathalyzer checks, and unannounced night reviews.</div>
                </div>
                <div className="bg-white/95 backdrop-blur-xs p-5 sm:p-6 rounded-2xl border border-amber-600/20 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="font-bold text-sm sm:text-base text-slate-950 mb-1.5">Fair Compensation & PSRA Adherence</div>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">We remunerate our guards in compliance with government gazettes, fostering loyalty and integrity.</div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="px-6 sm:px-7 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  REQUEST PROPOSAL FOR YOUR PREMISES
                </button>
                <button
                  onClick={() => setAppointmentModalOpen(true)}
                  className="px-6 sm:px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-xs hover:shadow-md border border-slate-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  SCHEDULE SITE RISK ASSESSMENT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLIENT TESTIMONIALS */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Attributable Client Testimonials
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Trusted by Kenyan Enterprises & Housing Communities
            </h2>
            <p className="text-sm text-slate-600">
              Read authentic feedback from estate committees, factory heads, and logistics managers who rely on Sumich Solutions daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="font-bold text-sm text-slate-900">{t.name}</div>
                  <div className="text-[11px] text-amber-700 font-semibold">{t.role}</div>
                  <div className="text-[11px] text-slate-500">{t.company} &middot; {t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION & CONTACT / INQUIRY SECTION */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information Overview */}
            <div className="space-y-6">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Contact Sumich Solutions Limited
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Secure Your Premises with Professionals Today
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you need immediate manned guards for an industrial facility along Mombasa Road, corporate security for an office park, or an urgent security risk assessment, our team is ready to respond.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 text-sm mb-0.5">Physical Corporate Headquarters</div>
                    <div className="text-slate-700">{companyInfo.physicalAddress}</div>
                    <div className="text-slate-500">{companyInfo.postalAddress}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 text-sm mb-0.5">Direct Phone Lines (24/7)</div>
                    <div className="font-mono text-slate-900 font-semibold text-sm">
                      {companyInfo.phones[0]} / {companyInfo.phones[1]}
                    </div>
                    <div className="text-amber-700 font-medium mt-0.5">Emergency Command Dispatch available 24/7</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 text-sm mb-0.5">Official Inquiries Email</div>
                    <a href={`mailto:${companyInfo.email}`} className="text-amber-700 font-mono hover:underline">
                      {companyInfo.email}
                    </a>
                    <div className="text-slate-500 mt-0.5">Guaranteed response within 2 hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Functional Inquiry Form */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Send a General Inquiry</h3>
              <p className="text-xs text-slate-500 mb-6">
                Have a question regarding guarding deployments, contracts, or rates? Drop our operations desk a note.
              </p>

              {inquirySent ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Inquiry Received</h4>
                  <p className="text-xs text-slate-600">
                    Thank you. We have logged your inquiry and an operations representative will reach back via email shortly.
                  </p>
                  <button
                    onClick={() => {
                      setInquirySent(false);
                      setInquiryData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryData.name}
                      onChange={e => setInquiryData({ ...inquiryData, name: e.target.value })}
                      placeholder="e.g. David Njoroge"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryData.email}
                        onChange={e => setInquiryData({ ...inquiryData, email: e.target.value })}
                        placeholder="e.g. david@client.co.ke"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={inquiryData.phone}
                        onChange={e => setInquiryData({ ...inquiryData, phone: e.target.value })}
                        placeholder="e.g. 0712 000 000"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject / Topic
                    </label>
                    <input
                      type="text"
                      value={inquiryData.subject}
                      onChange={e => setInquiryData({ ...inquiryData, subject: e.target.value })}
                      placeholder="e.g. Industrial Area Godown Guarding Rates"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message Details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={inquiryData.message}
                      onChange={e => setInquiryData({ ...inquiryData, message: e.target.value })}
                      placeholder="Please elaborate on your questions or security concerns..."
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND INQUIRY TO OPERATIONS</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
