import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Building2,
  Home,
  Factory,
  UserCheck,
  CalendarCheck,
  KeyRound,
  Briefcase,
  Car,
  Camera,
  FileSearch,
  Navigation,
  BellRing,
  Award,
  CheckCircle2,
  ArrowRight,
  Filter
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, setQuoteModalOpen, setSelectedServiceForQuote, setAppointmentModalOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Physical Guarding', 'Electronic Security', 'Specialized Protection', 'Consultancy'];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-6 h-6" />;
      case 'Building2': return <Building2 className="w-6 h-6" />;
      case 'Home': return <Home className="w-6 h-6" />;
      case 'Factory': return <Factory className="w-6 h-6" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6" />;
      case 'CalendarCheck': return <CalendarCheck className="w-6 h-6" />;
      case 'KeyRound': return <KeyRound className="w-6 h-6" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6" />;
      case 'Car': return <Car className="w-6 h-6" />;
      case 'Camera': return <Camera className="w-6 h-6" />;
      case 'FileSearch': return <FileSearch className="w-6 h-6" />;
      case 'Navigation': return <Navigation className="w-6 h-6" />;
      case 'BellRing': return <BellRing className="w-6 h-6" />;
      case 'Award': return <Award className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  const filteredServices = services.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleRequestQuote = (serviceTitle: string) => {
    setSelectedServiceForQuote(serviceTitle);
    setQuoteModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-semibold">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Full Guarding & Security Portfolio &middot; PSRA Compliant</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Security & Guarding Services
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore our full range of professional security capabilities in Kenya. Click <strong>REQUEST A QUOTE</strong> on any service to automatically populate your customized proposal request.
            </p>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-amber-400'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(srv => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between p-7 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                    {getServiceIcon(srv.icon)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {srv.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {srv.fullDescription}
                  </p>
                </div>

                {/* Scope & Key Features */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Key Deliverables:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ideal for note */}
                <div className="p-3 rounded-lg bg-slate-50 text-[11px] text-slate-600">
                  <strong className="text-slate-800">Ideal For:</strong> {srv.idealFor}
                </div>
              </div>

              {/* Action Button: Opens Quote Form pre-filled with this service */}
              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleRequestQuote(srv.title)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>REQUEST A QUOTE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/30">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-bold">Require a Custom Mixed Security Package?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Combine manned guards, access barrier gates, canine night patrols, and 24/7 CCTV surveillance under one discounted monthly SLA.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleRequestQuote('Custom Integrated Security Package')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors whitespace-nowrap"
            >
              REQUEST CUSTOM QUOTE
            </button>
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors whitespace-nowrap"
            >
              Book Site Survey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
