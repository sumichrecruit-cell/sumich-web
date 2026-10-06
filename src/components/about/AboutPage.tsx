import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Award,
  Users,
  Target,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Radio,
  Car,
  HeartHandshake,
  Building2,
  FileCheck,
  Camera
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView, setQuoteModalOpen, setAppointmentModalOpen, setCallModalOpen, companyInfo } = useApp();

  const leadershipTeam = [
    {
      name: "Kennedy Omondi",
      role: "Managing Director & Chief Executive",
      bio: "Over 18 years in corporate risk governance and private security leadership in East Africa. Oversees operational excellence and strategic client partnerships.",
      badge: "Executive Directorate"
    },
    {
      name: "Major (Rtd) Daniel Kiprono",
      role: "Director of Operations & Tactical Command",
      bio: "Former Kenya Defence Forces officer with specialized counter-insurgency and tactical training. Leads field guard supervisory inspections and mobile rapid response teams.",
      badge: "Guarding Operations"
    },
    {
      name: "Beatrice Chebet",
      role: "Head of Recruitment, Vetting & PSRA Compliance",
      bio: "Oversees rigorous background intelligence vetting, Certificate of Good Conduct verification, and compliance with the Private Security Regulatory Authority (PSRA) statutory standards.",
      badge: "Compliance & HR"
    },
    {
      name: "Eng. Moses Mutinda",
      role: "Head of Electronic Surveillance & Control Room",
      bio: "Specialist in IP CCTV telemetry, AI motion detection, RFID patrol wand systems, and automated intruder alarm integration across the Mombasa Road corridor.",
      badge: "Surveillance Tech"
    }
  ];

  const coreValues = [
    {
      title: "Unyielding Integrity",
      desc: "Absolute honesty, zero tolerance for compromise, and strict background checks on every guard in our ranks.",
      icon: ShieldCheck
    },
    {
      title: "Vigilant Readiness",
      desc: "24/7 alertness, scheduled field supervisor check-ins, and electronic tour wand audits that prevent lapses.",
      icon: Eye
    },
    {
      title: "Professionalism & Etiquette",
      desc: "Crisp uniforms, courteous client reception skills, and respectful conflict de-escalation training.",
      icon: Users
    },
    {
      title: "Statutory & PSRA Compliance",
      desc: "Full adherence to government wage standards, fair labor practices, and regulatory force registration numbers.",
      icon: FileCheck
    },
    {
      title: "Customer Commitment",
      desc: "Tailored security planning, guaranteed sub-10 minute alarm response times, and transparent daily situation reports (SITREPs).",
      icon: HeartHandshake
    }
  ];

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-20 sm:py-28 border-b border-slate-800">
        {/* Background Subtle Geometric Pattern Overlay (No Photos) */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>PSRA Registered: PSRA/REG/KEN/2023/0488 &middot; Nairobi, Kenya</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              About {companyInfo.name ? (
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

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Founded on the pillars of military-grade discipline, technological surveillance, and ethical leadership, Sumich Solutions Limited has grown into one of Kenya’s most trustworthy private security and guarding companies.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center gap-2"
              >
                <span>REQUEST A SECURITY QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAppointmentModalOpen(true)}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <span>BOOK A SITE SURVEY</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORPORATE OVERVIEW & STORY */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Our Heritage & Presence
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-snug">
                Defending Kenyan Businesses, Communities & Critical Infrastructure
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Established and incorporated in the Republic of Kenya, <strong>SUMICH SOLUTIONS LIMITED</strong> operates from our headquarters at Vision Plaza, 3rd Floor, Office No. 17B on Mombasa Road, Nairobi.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                We recognized a critical gap in the Kenyan private security industry: clients were tired of disengaged guards, unmonitored night shifts, and generic excuses. Sumich was built to transform security from a passive presence into a proactive, technology-backed protective barrier.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                Today, we provide comprehensive manned guarding, electronic CCTV surveillance, mobile patrol units, access barrier control, and specialized VIP protection for corporate headquarters, industrial logistics yards along Mombasa Road, diplomatic residences, and gated housing estates.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-1">Corporate HQ</div>
                  <div className="text-slate-600">Vision Plaza, 3rd Floor, Suite 17B, Mombasa Road, Nairobi</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-1">Postal Address</div>
                  <div className="text-slate-600">P.O. Box 59140 - 00200, Nairobi, Kenya</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Regulatory Authorization</div>
                      <div className="text-sm font-extrabold text-white">Private Security Regulation Act</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    PSRA COMPLIANT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Gazetted Authority</div>
                    <div className="text-white font-bold text-xs mt-0.5">PSRA Kenya</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">Registration Class A</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Guard Welfare</div>
                    <div className="text-white font-bold text-xs mt-0.5">NSSF & SHIF Paid</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Gazetted Wage Compliant</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Personnel Vetting</div>
                    <div className="text-white font-bold text-xs mt-0.5">DCI Good Conduct</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">100% Fingerprint Vetted</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Patrol Monitoring</div>
                    <div className="text-white font-bold text-xs mt-0.5">Electronic RFID</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">Zero Sleep Lapses</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">National Headquarters</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">Vision Plaza Mombasa Rd</span>
                </div>
              </div>

              <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Shield className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">CORPORATE CERTIFICATION</div>
                      <div className="text-[11px] text-amber-500 font-semibold">Republic of Kenya</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    PSRA COMPLIANT
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Statutory License:</span>
                    <span className="font-mono font-bold text-amber-400">PSRA/REG/KEN/2023/0488</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">DCI Biometric Clearance:</span>
                    <span className="font-semibold text-emerald-400">100% Verified Personnel</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-2xl font-black text-amber-700">100%</div>
                  <div className="text-xs text-slate-700 font-semibold">PSRA Registered Force</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800">
                  <div className="text-2xl font-black text-amber-400">24/7/365</div>
                  <div className="text-xs text-slate-300 font-semibold">Command Operations Desk</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION, VISION & CORE VALUES */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Target className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-950">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To deliver uncompromising protection of lives, commercial assets, and peace of mind across Kenya through vetted, highly trained personnel, proactive field supervision, and rapid technological response.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Eye className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-950">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To be Kenya’s most dependable, ethically operated, and technologically integrated private security guarding provider—setting the benchmark for guard welfare, corporate trust, and rapid emergency intervention.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Our Foundation
              </div>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
                The Values That Guide Every Guard On Duty
              </h2>
              <p className="text-sm text-slate-600">
                These core principles govern our hiring, daily guard shift inspections, and executive decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{val.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. OPERATIONAL INFRASTRUCTURE & DISCIPLINE */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Operational Rigor
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Our 5-Pillar Operational Standard
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Security failures happen when accountability breaks down. Sumich Solutions employs a multi-tiered monitoring framework that guarantees vigilance throughout every 12-hour shift.
              </p>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">1. CID Biometric Vetting & Good Conduct</strong>
                    Every guard recruit is screened with the Directorate of Criminal Investigations (DCI) for police clearance and criminal background checks before onboarding.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">2. Electronic RFID Guard Tour Wands</strong>
                    Guards physically tap RFID checkpoints stationed around your compound perimeter every 30 to 45 minutes, creating verifiable electronic patrol logs.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">3. 24/7 Vision Plaza Operations Command Center</strong>
                    Continuous telemetry monitoring, radio dispatch, and direct telephone hotlines (0117 230 136 / 0735 229 229) coordinate tactical intervention day and night.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">4. Mobile Patrol Spot Inspections</strong>
                    Unannounced night visits by Area Field Supervisors with alcohol breathalyzers and uniform turnout inspections prevent complacency.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">5. Fair Labor & Guard Welfare Policy</strong>
                    We remunerate guards fairly and on time, with full statutory benefits (NSSF, SHIF/NHIF), ensuring loyal, honest, and motivated officers on your site.
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Infrastructure Showcase with Telemetry Consoles */}
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
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Zone A: Mombasa Rd</div>
                      <div className="text-emerald-400 font-bold mt-0.5">● FEED 1-08 OK</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Zone B: Industrial Area</div>
                      <div className="text-emerald-400 font-bold mt-0.5">● FEED 1-12 OK</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Zone C: Commercial Mall</div>
                      <div className="text-emerald-400 font-bold mt-0.5">● FEED 2-04 OK</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
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
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Unit Alpha-1 (HQ)</div>
                      <div className="text-emerald-400 font-bold mt-0.5">ON STANDBY</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Unit Bravo-2 (Airport)</div>
                      <div className="text-emerald-400 font-bold mt-0.5">ON PATROL</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Unit Charlie-3 (West)</div>
                      <div className="text-emerald-400 font-bold mt-0.5">ON PATROL</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
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

              <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Command Operations Fleet Status</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">24/7 ACTIVE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-white block mb-0.5">Surveillance Center</span>
                    <span className="text-slate-400">Vision Plaza 3rd Floor, Suite 17B, Mombasa Road.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-white block mb-0.5">Rapid Response Fleet</span>
                    <span className="text-slate-400">GPS-tracked vehicles across Nairobi & Industrial Area.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP & OPERATIONS DIRECTORS */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Executive Leadership
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Experienced Security Directors Leading the Way
            </h2>
            <p className="text-sm text-slate-600">
              Our executive team brings together decades of military discipline, corporate risk consulting, and technology integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((leader, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30">
                    {leader.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {leader.badge}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{leader.name}</h3>
                    <div className="text-xs font-semibold text-slate-500">{leader.role}</div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-14 text-slate-950 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="text-xs font-black uppercase tracking-widest text-slate-900">
                Partner with Kenya's Dedicated Security Provider
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Ready to Upgrade the Security of Your Premises?
              </h2>
              <p className="text-sm font-medium text-slate-900/90 leading-relaxed">
                Contact our headquarters at Vision Plaza on Mombasa Road today. We provide complimentary site risk assessments and tailored guarding proposals within 24 hours.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors shadow"
              >
                REQUEST A QUOTE
              </button>
              <button
                onClick={() => setAppointmentModalOpen(true)}
                className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                BOOK SITE SURVEY
              </button>
              <button
                onClick={() => setCallModalOpen(true)}
                className="px-6 py-3.5 bg-slate-900/10 hover:bg-slate-900/20 text-slate-950 font-bold rounded-xl text-xs transition-colors border border-slate-900/20"
              >
                CALL 0117 230 136
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
