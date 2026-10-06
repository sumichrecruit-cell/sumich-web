import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobVacancy } from '../../types';
import {
  Briefcase,
  MapPin,
  Clock,
  Banknote,
  Search,
  CheckCircle2,
  Calendar,
  Users,
  ChevronRight,
  Shield,
  FileText,
  UserCheck
} from 'lucide-react';

export const CareersPage: React.FC = () => {
  const {
    vacancies,
    currentUser,
    setCurrentView,
    setJobAppModalOpen,
    setSelectedVacancyForApp,
    setAuthModalOpen,
    setAuthInitialMode,
    setAuthInitialRole,
    applications
  } = useApp();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [activeVacancyModal, setActiveVacancyModal] = useState<JobVacancy | null>(null);

  const departments = ['All', 'Guarding Operations', 'Corporate Division', 'Electronic Surveillance', 'Tactical Response'];

  const publishedVacancies = vacancies.filter(v => v.status === 'published');

  const filteredVacancies = publishedVacancies.filter(v => {
    const matchesDept = selectedDept === 'All' || v.department === selectedDept;
    const matchesKeyword = v.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                           v.location.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                           v.summary.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesDept && matchesKeyword;
  });

  const handleApplyClick = (vacancy: JobVacancy) => {
    setSelectedVacancyForApp(vacancy);
    setJobAppModalOpen(true);
    setActiveVacancyModal(null);
  };

  const userHasApplied = (vacancyId: string) => {
    if (!currentUser) return false;
    return applications.some(a => a.vacancyId === vacancyId && a.userId === currentUser.id);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Header */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-amber-500/30">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-semibold">
              <Shield className="w-4 h-4" />
              <span>Sumich Recruitment & Talent Acquisition</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Build Your Career in Professional Security
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Sumich Solutions Limited offers industry-leading training, fair compensation aligned with Kenyan labor laws, medical benefits, and progressive career advancement for dedicated men and women.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              {currentUser?.role === 'jobseeker' ? (
                <button
                  onClick={() => setCurrentView('seeker-dashboard')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open My Job Seeker Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthInitialMode('register');
                    setAuthInitialRole('jobseeker');
                    setAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Register as a Job Seeker</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedDept === dept
                    ? 'bg-slate-900 text-amber-400'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="Search by title, location..."
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Vacancies List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {filteredVacancies.length} Active Positions Open in Kenya
            </div>
            <span className="text-xs text-slate-400">Applications reviewed daily</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVacancies.map(vac => (
              <div
                key={vac.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                        {vac.department}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                        {vac.title}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-[11px] font-semibold">
                      {vac.vacanciesCount} Openings
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {vac.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{vac.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{vac.jobType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Banknote className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-slate-700">{vac.salaryRange}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Application Deadline: <strong className="text-slate-700">{new Date(vac.deadline).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveVacancyModal(vac)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1"
                  >
                    <span>View Requirements</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  </button>

                  {userHasApplied(vac.id) ? (
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(vac)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      APPLY NOW
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements & Criteria Explainer */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            General Eligibility Criteria for Sumich Security Officers
          </h3>
          <p className="text-xs text-slate-600 mb-6">
            In accordance with the Private Security Regulatory Authority (PSRA) standards, all applicants must meet the following mandatory baseline requirements:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Valid Kenya National Identity Card (Age 22 – 42 years)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Valid Certificate of Good Conduct (not older than 6 months)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>KCSE Certificate with minimum grade D+ and above</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Height requirement: Male 5ft 8in+, Female 5ft 5in+</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>PSRA Guard Force Number or registration receipt</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Two verifiable referees from reputable Kenyan institutions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Vacancy Modal */}
      {activeVacancyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-400 font-semibold uppercase">{activeVacancyModal.department}</div>
                <h3 className="text-xl font-bold">{activeVacancyModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVacancyModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-wrap gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>Location: <strong className="text-slate-900">{activeVacancyModal.location}</strong></div>
                <div>Job Type: <strong className="text-slate-900">{activeVacancyModal.jobType}</strong></div>
                <div>Salary: <strong className="text-slate-900">{activeVacancyModal.salaryRange}</strong></div>
                <div>Openings: <strong className="text-slate-900">{activeVacancyModal.vacanciesCount}</strong></div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Role Summary</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeVacancyModal.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Responsibilities</h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activeVacancyModal.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Qualifications & Requirements</h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activeVacancyModal.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveVacancyModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Close
                </button>
                <button
                  onClick={() => handleApplyClick(activeVacancyModal)}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm"
                >
                  APPLY FOR THIS VACANCY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
