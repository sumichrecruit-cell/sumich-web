import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AdminSubRole,
  UserRole,
  UserStatus,
  JobVacancy,
  LeaveStatus,
  QuoteStatus,
  AppointmentStatus,
  SecurityService,
  Testimonial
} from '../../types';
import {
  Shield,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
  MessageSquare,
  Newspaper,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Printer,
  Download,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  Phone,
  Mail,
  Building,
  Activity,
  Upload,
  Image as ImageIcon,
  Globe,
  Sparkles,
  Save,
  RotateCcw,
  FolderArchive,
  FileCheck
} from 'lucide-react';
import { SumichLogo } from '../common/SumichLogo';
import { RecentActivityLog } from '../dashboards/RecentActivityLog';
import { UploadedFilesManager } from './documents/UploadedFilesManager';
import { downloadUploadedFile, printUploadedFile } from '../../utils/fileHelpers';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    users,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    vacancies,
    addVacancy,
    updateVacancy,
    deleteVacancy,
    applications,
    updateApplicationStatus,
    quotes,
    updateQuoteStatus,
    appointments,
    updateAppointmentStatus,
    inquiries,
    respondInquiry,
    leaveRequests,
    updateLeaveRequestStatus,
    news,
    addNews,
    updateNews,
    deleteNews,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    services,
    updateService,
    addService,
    companyInfo,
    updateCompanyInfo,
    auditLogs,
    openDocPreview,
    setCurrentView,
    quotationBranding,
    updateQuotationBranding,
    uploadedDocuments
  } = useApp();

  // Role permissions check
  const subRole: AdminSubRole = currentUser?.subRole || 'super_admin';

  const canManageRecruitment = subRole === 'super_admin' || subRole === 'recruitment_officer';
  const canManageOperations = subRole === 'super_admin' || subRole === 'operations_officer';
  const canManageContent = subRole === 'super_admin' || subRole === 'content_manager';
  const canManageUsers = subRole === 'super_admin';

  // Navigation tab state
  const defaultTab = canManageRecruitment && !canManageOperations ? 'applications' : 'dashboard';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [auditViewMode, setAuditViewMode] = useState<'admin_audits' | 'user_activities'>('admin_audits');

  // Search & Filter state
  const [userSearch, setUserSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [quoteSearch, setQuoteSearch] = useState('');

  // Modals inside Admin
  const [newVacancyOpen, setNewVacancyOpen] = useState(false);
  const [newVacancy, setNewVacancy] = useState<Partial<JobVacancy>>({
    title: '',
    department: 'Guarding Operations',
    location: 'Nairobi / Mombasa Road',
    jobType: 'Shift-Based',
    salaryRange: 'KES 25,000 - KES 30,000',
    summary: '',
    responsibilities: [],
    requirements: [],
    status: 'published',
    deadline: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    vacanciesCount: 5
  });
  const [respInput, setRespInput] = useState('');
  const [reqInput, setReqInput] = useState('');

  // Quick reply modal
  const [replyInquiryId, setReplyInquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Quote pricing modal
  const [pricingQuoteId, setPricingQuoteId] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('KES 180,000 / month');
  const [quoteAdminNote, setQuoteAdminNote] = useState('');

  // Leave approval note modal
  const [leaveActionId, setLeaveActionId] = useState<string | null>(null);
  const [leaveStatusToSet, setLeaveStatusToSet] = useState<LeaveStatus>('approved');
  const [leaveReviewNote, setLeaveReviewNote] = useState('');

  // Interview scheduler modal
  const [scheduleAppId, setScheduleAppId] = useState<string | null>(null);
  const [interviewDate, setInterviewDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [scheduleNote, setScheduleNote] = useState('Report to Vision Plaza 3rd Floor at 09:00 AM for physical drills and document verification.');

  // KPI Calculations
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingApprovals = users.filter(u => u.status === 'pending').length;
  const openVacanciesCount = vacancies.filter(v => v.status === 'published').length;
  const totalApplications = applications.length;
  const pendingApps = applications.filter(a => a.status === 'pending' || a.status === 'under_review').length;
  const totalQuotes = quotes.length;
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;
  const upcomingApts = appointments.filter(a => a.status === 'scheduled' || a.status === 'pending').length;

  const handleCreateVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacancy.title || !newVacancy.summary) return;

    addVacancy({
      title: newVacancy.title || 'Security Role',
      department: newVacancy.department || 'Guarding Operations',
      location: newVacancy.location || 'Nairobi',
      jobType: newVacancy.jobType as any || 'Full-Time',
      salaryRange: newVacancy.salaryRange || 'Competitive',
      summary: newVacancy.summary || '',
      responsibilities: newVacancy.responsibilities && newVacancy.responsibilities.length > 0
        ? newVacancy.responsibilities
        : ['Execute perimeter security checks', 'Maintain visitor registers'],
      requirements: newVacancy.requirements && newVacancy.requirements.length > 0
        ? newVacancy.requirements
        : ['Valid Good Conduct Certificate', 'PSRA Registration'],
      status: newVacancy.status as any || 'published',
      deadline: newVacancy.deadline || '2026-12-31',
      vacanciesCount: Number(newVacancy.vacanciesCount) || 1
    });

    setNewVacancyOpen(false);
  };

  const handleConfirmQuotePricing = (quoteId: string) => {
    updateQuoteStatus(quoteId, 'under_review', quoteAdminNote, quotePrice);
    setPricingQuoteId(null);
    setQuoteAdminNote('');
  };

  const handleConfirmLeaveAction = (leaveId: string) => {
    updateLeaveRequestStatus(leaveId, leaveStatusToSet, leaveReviewNote);
    setLeaveActionId(null);
    setLeaveReviewNote('');
  };

  const handleConfirmScheduleInterview = (appId: string) => {
    updateApplicationStatus(appId, 'approved', scheduleNote, interviewDate);
    setScheduleAppId(null);
  };

  const handleSendInquiryReply = (inqId: string) => {
    if (!replyText) return;
    respondInquiry(inqId, replyText);
    setReplyInquiryId(null);
    setReplyText('');
  };

  // Website Branding, Logo & Content Customization state
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string>('');
  const [contentSuccessMessage, setContentSuccessMessage] = useState<string>('');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState<Partial<SecurityService>>({
    title: '',
    category: 'Physical Guarding',
    shortDescription: '',
    fullDescription: '',
    features: ['Vetted Officers', 'PSRA Compliant', '24/7 Operations'],
    idealFor: 'Commercial & Corporate Facilities',
    icon: 'Shield',
    active: true
  });
  const [featureInput, setFeatureInput] = useState('');
  const [newTestimonialModalOpen, setNewTestimonialModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    company: '',
    location: 'Nairobi',
    comment: '',
    rating: 5,
    active: true
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError('');
    setContentSuccessMessage('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo file size exceeds 2MB limit. Please upload an image smaller than 2MB.');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Unsupported format. Please upload PNG, JPG, or SVG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateCompanyInfo({ ...companyInfo, logoDataUrl: base64 });
        updateQuotationBranding({ logoDataUrl: base64 });
        setContentSuccessMessage('Company logo successfully uploaded and applied across the website, quotations, and letterheads!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetLogo = () => {
    updateCompanyInfo({ ...companyInfo, logoDataUrl: undefined });
    updateQuotationBranding({ logoDataUrl: undefined });
    setContentSuccessMessage('Reset to the official SUMICH Solutions security crest.');
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title || !newService.shortDescription) return;
    const created: SecurityService = {
      id: `srv-${Date.now()}`,
      title: newService.title,
      category: newService.category || 'Physical Guarding',
      shortDescription: newService.shortDescription,
      fullDescription: newService.fullDescription || newService.shortDescription,
      features: newService.features || ['PSRA Compliant', '24/7 Deployment'],
      idealFor: newService.idealFor || 'Commercial & Corporate Facilities',
      icon: newService.icon || 'Shield',
      active: true
    };
    addService(created);
    setNewServiceModalOpen(false);
    setNewService({
      title: '',
      category: 'Physical Guarding',
      shortDescription: '',
      fullDescription: '',
      features: ['Vetted Officers', 'PSRA Compliant', '24/7 Operations'],
      idealFor: 'Commercial & Corporate Facilities',
      icon: 'Shield',
      active: true
    });
    setContentSuccessMessage(`New service "${created.title}" added to the website!`);
  };

  const handleCreateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.comment) return;
    const created: Testimonial = {
      id: `test-${Date.now()}`,
      name: newTestimonial.name,
      role: newTestimonial.role || 'Managing Director',
      company: newTestimonial.company || 'Corporate Client',
      location: newTestimonial.location || 'Nairobi',
      comment: newTestimonial.comment,
      rating: newTestimonial.rating || 5,
      active: true
    };
    addTestimonial(created);
    setNewTestimonialModalOpen(false);
    setNewTestimonial({
      name: '',
      role: '',
      company: '',
      location: 'Nairobi',
      comment: '',
      rating: 5,
      active: true
    });
    setContentSuccessMessage(`Testimonial from ${created.name} published to the website!`);
  };

  return (
    <div className="bg-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Admin Header */}
        <div className="bg-slate-950 text-white rounded-2xl p-6 border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">SUMICH SECURE ADMINISTRATION</h1>
                <span className="text-[11px] bg-amber-500/20 text-amber-400 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  {currentUser?.subRole?.replace('_', ' ').toUpperCase() || 'SUPER ADMIN'}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Authenticated Admin: <strong className="text-slate-200">{currentUser?.name}</strong> &middot; {currentUser?.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Database Engine:</span>
            <span className="text-xs font-mono bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded border border-emerald-800 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Dynamic Persistence
            </span>
          </div>
        </div>

        {/* Role-Based Horizontal Navigation Bar */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
          {subRole === 'super_admin' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Dashboard KPIs</span>
            </button>
          )}

          {canManageUsers && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'users' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users ({users.length})</span>
            </button>
          )}

          {canManageRecruitment && (
            <>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'applications' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Job Applications ({applications.length})</span>
                {pendingApps > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px]">
                    {pendingApps}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('vacancies')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'vacancies' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Vacancies ({vacancies.length})</span>
              </button>
            </>
          )}

          {canManageOperations && (
            <>
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'quotes' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Quotations ({quotes.length})</span>
                {pendingQuotes > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px]">
                    {pendingQuotes}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'appointments' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Appointments ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('guard-leaves')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'guard-leaves' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Guard Leaves ({leaveRequests.length})</span>
                {pendingLeaves > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px]">
                    {pendingLeaves}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'inquiries' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquiries ({inquiries.length})</span>
                {pendingInquiries > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px]">
                    {pendingInquiries}
                  </span>
                )}
              </button>
            </>
          )}

          {canManageContent && (
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'content' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Content Management</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'documents' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>Uploaded Files ({uploadedDocuments.length})</span>
          </button>

          {subRole === 'super_admin' && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'audit' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Audit Logs ({auditLogs.length})</span>
            </button>
          )}
        </div>

        {/* 1. DASHBOARD KPIS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Total Users</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalUsers}</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">{activeUsers} active accounts</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Open Vacancies</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{openVacanciesCount}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Recruiting in Nairobi</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Job Applications</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalApplications}</div>
                <div className="text-[10px] text-amber-600 mt-0.5">{pendingApps} pending review</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Quotation Requests</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalQuotes}</div>
                <div className="text-[10px] text-amber-600 mt-0.5">{pendingQuotes} awaiting pricing</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Pending Guard Leaves</div>
                <div className="text-2xl font-bold text-amber-700 mt-1 tabular-nums">{pendingLeaves}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Requires operational relief</div>
              </div>
            </div>

            {/* Quick Actions & Recent Operational Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Pending Operational Inquiries & Quotes
                </h3>
                <div className="space-y-3">
                  {quotes.slice(0, 3).map(q => (
                    <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{q.company} &middot; {q.serviceType}</div>
                        <div className="text-slate-500">Contact: {q.name} ({q.phone})</div>
                      </div>
                      <span className="font-semibold text-amber-700 capitalize bg-amber-50 px-2 py-0.5 rounded">
                        {q.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Recent Administrative Audit Activity
                </h3>
                <div className="space-y-2 text-xs">
                  {auditLogs.slice(0, 4).map(log => (
                    <div key={log.id} className="p-2.5 rounded-lg border border-slate-100 flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-800">{log.action} <span className="font-normal text-slate-500">by {log.actorName}</span></div>
                        <div className="text-slate-600 text-[11px]">{log.details}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USER MANAGEMENT */}
        {activeTab === 'users' && canManageUsers && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Manage Registered Users & Role-Based Access</h3>
                <p className="text-xs text-slate-500">Approve, suspend, deactivate, or elevate permissions for portal users.</p>
              </div>
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search user by name, email, phone..."
                className="px-3.5 py-2 text-xs border border-slate-300 rounded-lg w-full sm:w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">User</th>
                    <th className="px-4 py-2.5">Role</th>
                    <th className="px-4 py-2.5">Sub-Role / Dept</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Registered</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                    .map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-500">{u.email} &middot; {u.phone}</div>
                        </td>
                        <td className="px-4 py-3 capitalize font-semibold text-slate-700">
                          {u.role}
                        </td>
                        <td className="px-4 py-3">
                          {u.role === 'admin' ? (
                            <select
                              value={u.subRole || 'super_admin'}
                              onChange={e => updateUserRole(u.id, 'admin', e.target.value as AdminSubRole)}
                              className="px-2 py-1 border border-slate-300 rounded text-xs bg-white font-medium"
                            >
                              <option value="super_admin">Super Admin</option>
                              <option value="recruitment_officer">Recruitment Officer</option>
                              <option value="operations_officer">Operations Officer</option>
                              <option value="content_manager">Content Manager</option>
                            </select>
                          ) : (
                            <span className="text-slate-500">{u.company || u.deploymentSite || 'Standard'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            u.status === 'active' ? 'bg-emerald-50 text-emerald-800' :
                            u.status === 'suspended' ? 'bg-rose-50 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                          {u.status === 'active' ? (
                            <button
                              onClick={() => updateUserStatus(u.id, 'suspended')}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[11px]"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => updateUserStatus(u.id, 'active')}
                              className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded font-semibold text-[11px]"
                            >
                              Activate
                            </button>
                          )}
                          {u.id !== currentUser?.id && (
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-semibold text-[11px]"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. JOB APPLICATIONS REVIEW (WITH PRINT & DOWNLOAD CV) */}
        {activeTab === 'applications' && canManageRecruitment && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Candidate Job Applications & CV Review</h3>
                <p className="text-xs text-slate-500">
                  Inspect candidate dossiers, verify police clearance, print CVs, and schedule interviews.
                </p>
              </div>
              <input
                type="text"
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                placeholder="Filter by applicant name, position..."
                className="px-3.5 py-2 text-xs border border-slate-300 rounded-lg w-full sm:w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Candidate</th>
                    <th className="px-4 py-2.5">Position</th>
                    <th className="px-4 py-2.5">Qualifications</th>
                    <th className="px-4 py-2.5">CV / Documents</th>
                    <th className="px-4 py-2.5">Vetting Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications
                    .filter(a => a.fullName.toLowerCase().includes(appSearch.toLowerCase()) || a.positionAppliedFor.toLowerCase().includes(appSearch.toLowerCase()))
                    .map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{app.fullName}</div>
                          <div className="text-[11px] text-slate-500">ID: {app.idNumber} &middot; {app.phone}</div>
                          <div className="text-[10px] text-slate-400">{app.location}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {app.positionAppliedFor}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="font-medium text-slate-800">{app.education}</div>
                          <div className="text-[11px] text-slate-500 truncate" title={app.professionalQualifications}>
                            {app.professionalQualifications}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap space-y-2">
                          {/* CV File Actions */}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-slate-500 font-bold truncate max-w-[120px]" title={app.cvFileName}>
                              {app.cvFileName}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openDocPreview({
                                  title: `CV - ${app.fullName} (${app.positionAppliedFor})`,
                                  applicantName: app.fullName,
                                  fileName: app.cvFileName,
                                  fileDataUrl: app.cvFileBase64,
                                  fileType: app.cvFileType,
                                  content: `OFFICIAL SUMICH RECRUITMENT DOSSIER
==============================================
CANDIDATE: ${app.fullName}
NATIONAL ID / PASSPORT: ${app.idNumber}
CONTACT PHONE: ${app.phone}
EMAIL ADDRESS: ${app.email}
RESIDENCE: ${app.location}
POSITION APPLIED FOR: ${app.positionAppliedFor}

EDUCATION:
${app.education}

PROFESSIONAL SECURITY QUALIFICATIONS:
${app.professionalQualifications}

PAST GUARDING & WORK EXPERIENCE:
${app.workExperience}

APPLICATION DATE: ${new Date(app.createdAt).toLocaleString()}
POLICE CLEARANCE: Good Conduct attached and verified.
==============================================
Sumich Solutions Limited - Recruitment Directorate Nairobi Kenya`,
                                  details: {
                                    idNumber: app.idNumber,
                                    phone: app.phone,
                                    email: app.email,
                                    position: app.positionAppliedFor,
                                    education: app.education
                                  }
                                })}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded flex items-center gap-0.5 text-[10px] cursor-pointer"
                                title="View CV in Document Viewer"
                              >
                                <Eye className="w-3 h-3 text-amber-600" />
                                <span>View</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => downloadUploadedFile({
                                  fileDataUrl: app.cvFileBase64,
                                  fileName: app.cvFileName,
                                  content: `CANDIDATE: ${app.fullName}\nPOSITION: ${app.positionAppliedFor}\nID: ${app.idNumber}\nPHONE: ${app.phone}\nEDUCATION: ${app.education}\nQUALIFICATIONS: ${app.professionalQualifications}`,
                                  fileType: app.cvFileType
                                })}
                                className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded flex items-center gap-0.5 text-[10px] cursor-pointer"
                                title="Download CV File"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => printUploadedFile({
                                  fileDataUrl: app.cvFileBase64,
                                  fileName: app.cvFileName,
                                  title: `Curriculum Vitae - ${app.fullName}`,
                                  applicantName: app.fullName,
                                  category: 'RECRUITMENT CV',
                                  content: `SUMICH SOLUTIONS RECRUITMENT DOSSIER\nCandidate: ${app.fullName}\nID: ${app.idNumber}\nPhone: ${app.phone}\nEducation: ${app.education}\nExperience: ${app.workExperience}`,
                                  details: {
                                    idNumber: app.idNumber,
                                    phone: app.phone,
                                    email: app.email,
                                    position: app.positionAppliedFor
                                  }
                                })}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center gap-0.5 text-[10px] cursor-pointer"
                                title="Print CV"
                              >
                                <Printer className="w-3 h-3 text-amber-600" />
                                <span>Print</span>
                              </button>
                            </div>
                          </div>

                          {/* Supporting Doc Actions (e.g. Police Clearance) */}
                          {app.supportingDocName && (
                            <div className="flex items-center gap-1 pt-1 border-t border-slate-100">
                              <span className="text-[10px] font-mono text-emerald-700 font-bold truncate max-w-[120px]" title={app.supportingDocName}>
                                {app.supportingDocName}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => openDocPreview({
                                    title: `Police Clearance / Credential - ${app.fullName}`,
                                    applicantName: app.fullName,
                                    fileName: app.supportingDocName!,
                                    fileDataUrl: app.supportingDocBase64,
                                    category: 'CREDENTIAL',
                                    content: `DIRECTORATE OF CRIMINAL INVESTIGATIONS (DCI)\nPOLICE CLEARANCE CERTIFICATE\nSubject: ${app.fullName}\nID: ${app.idNumber}\nResult: NO RECORD FOUND (CLEAN VETTING).`,
                                    details: {
                                      candidate: app.fullName,
                                      idNumber: app.idNumber,
                                      file: app.supportingDocName!
                                    }
                                  })}
                                  className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded flex items-center gap-0.5 text-[10px] cursor-pointer"
                                  title="View Certificate of Good Conduct"
                                >
                                  <Eye className="w-2.5 h-2.5 text-emerald-600" />
                                  <span>View</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadUploadedFile({
                                    fileDataUrl: app.supportingDocBase64,
                                    fileName: app.supportingDocName!,
                                    content: `DCI POLICE CLEARANCE CERTIFICATE\nHolder: ${app.fullName}\nStatus: Certified Valid`
                                  })}
                                  className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-0.5 text-[10px] cursor-pointer"
                                  title="Download Police Clearance"
                                >
                                  <Download className="w-2.5 h-2.5" />
                                  <span>Download</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => printUploadedFile({
                                    fileDataUrl: app.supportingDocBase64,
                                    fileName: app.supportingDocName!,
                                    title: `Police Clearance Certificate - ${app.fullName}`,
                                    applicantName: app.fullName,
                                    category: 'VETTING CERTIFICATE',
                                    content: `DIRECTORATE OF CRIMINAL INVESTIGATIONS\nPolice Clearance Certificate\nApplicant: ${app.fullName}\nID: ${app.idNumber}\nFingerprint Classification Verified.`
                                  })}
                                  className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center gap-0.5 text-[10px] cursor-pointer"
                                  title="Print Police Clearance"
                                >
                                  <Printer className="w-2.5 h-2.5 text-emerald-600" />
                                  <span>Print</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            app.status === 'approved' ? 'bg-emerald-50 text-emerald-800' :
                            app.status === 'under_review' ? 'bg-amber-50 text-amber-800' :
                            app.status === 'rejected' ? 'bg-rose-50 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {app.status.toUpperCase()}
                          </span>
                          {app.interviewDate && (
                            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                              Interview: {new Date(app.interviewDate).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setScheduleAppId(app.id);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                          >
                            Shortlist / Interview
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'rejected', 'Did not meet height or PSRA baseline criteria.')}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-semibold text-[11px]"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. VACANCIES MANAGEMENT */}
        {activeTab === 'vacancies' && canManageRecruitment && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Job Vacancy Postings</h3>
                <p className="text-xs text-slate-500">Create, publish, edit, or close guarding job listings.</p>
              </div>
              <button
                onClick={() => setNewVacancyOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Vacancy</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vacancies.map(v => (
                <div key={v.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-amber-700 uppercase">{v.department}</div>
                      <h4 className="text-sm font-bold text-slate-900">{v.title}</h4>
                      <div className="text-xs text-slate-500">{v.location} &middot; {v.salaryRange}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status === 'published' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {v.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{v.summary}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">Openings: <strong>{v.vacanciesCount}</strong></span>
                    <div className="space-x-2">
                      <button
                        onClick={() => updateVacancy(v.id, { status: v.status === 'published' ? 'closed' : 'published' })}
                        className="text-slate-700 hover:text-slate-900 font-semibold"
                      >
                        {v.status === 'published' ? 'Close Posting' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deleteVacancy(v.id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. QUOTATIONS MANAGEMENT */}
        {activeTab === 'quotes' && canManageOperations && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Manage Quotation Requests & SLA Proposals</h3>
                <p className="text-xs text-slate-500">Review client scope of works, calculate monthly guard fees, and send estimates.</p>
              </div>
              <input
                type="text"
                value={quoteSearch}
                onChange={e => setQuoteSearch(e.target.value)}
                placeholder="Search quotes by client, company..."
                className="px-3.5 py-2 text-xs border border-slate-300 rounded-lg w-full sm:w-64"
              />
            </div>

            <div className="space-y-4">
              {quotes
                .filter(q => q.company.toLowerCase().includes(quoteSearch.toLowerCase()) || q.name.toLowerCase().includes(quoteSearch.toLowerCase()))
                .map(q => (
                  <div key={q.id} className="p-5 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-[11px] font-mono text-slate-400">Ref: {q.id}</div>
                        <h4 className="text-base font-bold text-slate-900">{q.company} ({q.name})</h4>
                        <div className="text-xs text-slate-500">Service: <strong className="text-amber-800">{q.serviceType}</strong> &middot; Location: {q.location}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          q.status === 'approved' ? 'bg-emerald-50 text-emerald-800' :
                          q.status === 'under_review' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {q.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-700">
                          {q.estimatedBudget || 'Not Priced'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong>Client Requirements:</strong> {q.securityRequirements}
                      {q.message && <div className="mt-1 text-slate-500">Notes: {q.message}</div>}
                    </div>

                    {q.adminNotes && (
                      <div className="text-xs bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                        <strong>Operations Feedback:</strong> {q.adminNotes}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="text-slate-500">Contact: {q.phone} &middot; {q.email}</div>
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setPricingQuoteId(q.id);
                            setQuotePrice(q.estimatedBudget || 'KES 180,000 / month');
                            setQuoteAdminNote(q.adminNotes || 'Site survey conducted. Rate covers 24/7 manned guards with electronic wands.');
                          }}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                        >
                          Price / Quote Scope
                        </button>
                        <button
                          onClick={() => updateQuoteStatus(q.id, 'approved', 'Formal security agreement dispatched for signature.')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                        >
                          Approve Proposal
                        </button>
                        <button
                          onClick={() => updateQuoteStatus(q.id, 'closed', 'Contract finalised or archived.')}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 6. GUARD LEAVES & OFF-DUTY REQUEST MANAGEMENT (SPECIALLY REQUESTED) */}
        {activeTab === 'guard-leaves' && canManageOperations && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Guard Leave & Off-Duty Roster Approval</h3>
                <p className="text-xs text-slate-500">
                  Review time-off requests from security guards, assign relief officers, and issue official leave clearance passes.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {leaveRequests.map(leave => (
                <div key={leave.id} className="p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{leave.guardName}</h4>
                        <span className="font-mono text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                          {leave.guardServiceNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Station: {leave.deploymentSite}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        leave.status === 'approved' ? 'bg-emerald-50 text-emerald-800' :
                        leave.status === 'rejected' ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {leave.status.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {leave.daysCount} Calendar Day(s)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block">Leave Category:</span>
                      <span className="font-semibold text-slate-900">{leave.leaveType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Period:</span>
                      <span className="font-semibold text-slate-900">{leave.startDate} to {leave.endDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Relief Guard:</span>
                      <span className="font-semibold text-slate-900">{leave.reliefGuard || 'Not Assigned'}</span>
                    </div>
                  </div>

                  <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700">
                    <strong>Guard's Reason:</strong> {leave.reason}
                  </div>

                  {leave.adminNotes && (
                    <div className="text-xs bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                      <strong>Operations Approval Note:</strong> {leave.adminNotes} (Approved by: {leave.approvedBy})
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    {leave.status === 'approved' && (
                      <button
                        onClick={() => openDocPreview({
                          title: `LEAVE CLEARANCE PASS - ${leave.guardName}`,
                          applicantName: leave.guardName,
                          fileName: `Leave_Pass_${leave.guardServiceNumber}.pdf`,
                          content: `SUMICH SOLUTIONS LIMITED - OPERATIONS DIRECTORE
OFFICIAL LEAVE CLEARANCE SLIP
=========================================
Officer Name: ${leave.guardName}
Service No: ${leave.guardServiceNumber}
Deployment Post: ${leave.deploymentSite}
Leave Type: ${leave.leaveType}
Period: ${leave.startDate} to ${leave.endDate} (${leave.daysCount} Days)
Relief Officer: ${leave.reliefGuard || 'Operational Roster Shift'}
Approval Authority: ${leave.approvedBy || currentUser?.name || 'Operations Director'}
=========================================
Status: OFFICIAL CLEARANCE GRANTED`,
                          details: {
                            guardName: leave.guardName,
                            serviceNumber: leave.guardServiceNumber,
                            station: leave.deploymentSite,
                            dates: `${leave.startDate} to ${leave.endDate}`,
                            approvedBy: leave.approvedBy || 'Operations Directorate'
                          }
                        })}
                        className="px-3 py-1.5 bg-slate-900 text-amber-400 font-bold text-xs rounded hover:bg-slate-800 flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Leave Pass</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setLeaveActionId(leave.id);
                        setLeaveStatusToSet('approved');
                        setLeaveReviewNote('Approved. Relief guard notified and roster updated.');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded"
                    >
                      Approve Request
                    </button>

                    <button
                      onClick={() => {
                        setLeaveActionId(leave.id);
                        setLeaveStatusToSet('rejected');
                        setLeaveReviewNote('Denied due to critical VIP event deployment requirement on those dates.');
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded"
                    >
                      Reject Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. APPOINTMENTS MANAGEMENT */}
        {activeTab === 'appointments' && canManageOperations && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Manage Client Consultation Appointments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map(a => (
                <div key={a.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400">Ref: {a.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      a.status === 'scheduled' ? 'bg-blue-50 text-blue-800' :
                      a.status === 'completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {a.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{a.purpose}</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Client: <strong className="text-slate-800">{a.name}</strong> ({a.phone})</div>
                    <div>Schedule: <strong>{a.preferredDate} at {a.preferredTime}</strong></div>
                    <div>Location: {a.meetingLocation}</div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => updateAppointmentStatus(a.id, 'scheduled', 'Confirmed at Vision Plaza HQ.')}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
                    >
                      Confirm Scheduled
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(a.id, 'completed', 'Meeting concluded successfully.')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. INQUIRIES MANAGEMENT */}
        {activeTab === 'inquiries' && canManageOperations && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Client Inquiries & Direct Responses</h3>
            <div className="space-y-4">
              {inquiries.map(inq => (
                <div key={inq.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{inq.subject}</h4>
                      <div className="text-xs text-slate-500">From: {inq.name} ({inq.email} &middot; {inq.phone})</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      inq.status === 'resolved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {inq.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "{inq.message}"
                  </p>

                  {inq.response && (
                    <div className="text-xs bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-emerald-900">
                      <strong>Sumich Sent Response:</strong> {inq.response}
                    </div>
                  )}

                  <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setReplyInquiryId(inq.id);
                        setReplyText(inq.response || '');
                      }}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs"
                    >
                      {inq.response ? 'Edit Reply' : 'Reply to Client'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. CONTENT MANAGEMENT & WEBSITE BRANDING */}
        {activeTab === 'content' && canManageContent && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded border border-amber-500/30">
                    Live CMS & Brand Engine
                  </span>
                  <span className="text-xs text-slate-400">&middot; Instant Website Synchronization</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">Website Branding & Content Customization</h3>
                <p className="text-xs text-slate-500">
                  Upload your corporate logo and modify website identity, contact phone lines, services catalog, and client testimonials.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Preview Live Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Notification Alerts */}
            {contentSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{contentSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setContentSuccessMessage('')}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {logoError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{logoError}</span>
                </div>
                <button
                  onClick={() => setLogoError('')}
                  className="text-rose-700 hover:text-rose-900 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* SECTION 1: LOGO UPLOAD & BRANDING */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span>Company Logo & Brand Crest</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    This logo appears in the Website Navbar header, Footer, Client Portal, Formal Quotations, and Invoice letterheads.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Logo Preview Column */}
                <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-6 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    {companyInfo.logoDataUrl ? (
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                        Custom Logo Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full">
                        Default Crest Active
                      </span>
                    )}
                  </div>

                  <div className="my-2 p-2 max-w-[200px] max-h-[100px] flex items-center justify-center">
                    {companyInfo.logoDataUrl ? (
                      <img
                        src={companyInfo.logoDataUrl}
                        alt="Company Logo Preview"
                        className="max-h-24 max-w-full object-contain"
                      />
                    ) : (
                      <SumichLogo className="w-16 h-20" />
                    )}
                  </div>

                  <div className="text-[11px] font-medium text-slate-300 mt-2">
                    {companyInfo.name}
                  </div>
                  <div className="text-[10px] text-amber-400/80 uppercase tracking-wider">
                    {companyInfo.tagline}
                  </div>
                </div>

                {/* Upload & Actions Column */}
                <div className="lg:col-span-7 space-y-4">
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{companyInfo.logoDataUrl ? 'Replace Logo File' : 'Upload New Logo File'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openDocPreview({
                        title: 'Official Corporate Logo Crest',
                        applicantName: 'Sumich Solutions Limited',
                        fileName: 'Sumich_Corporate_Vector_Logo.svg',
                        fileDataUrl: companyInfo.logoDataUrl,
                        category: 'BRANDING',
                        content: `SUMICH SOLUTIONS LIMITED - CORPORATE LOGO
============================================================
Official Brand Symbol: Heraldic Security Shield, Soaring Vigilance Eagle, Sculpted "S" Monogram.
Registered with Kenya Registrar of Trademarks & PSRA compliance division.`
                      })}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="View High-Resolution Logo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadUploadedFile({
                        fileDataUrl: companyInfo.logoDataUrl,
                        fileName: 'Sumich_Corporate_Vector_Logo.svg',
                        content: 'Official Sumich Corporate Logo Asset'
                      })}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
                      title="Download Official Logo File"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => printUploadedFile({
                        fileDataUrl: companyInfo.logoDataUrl,
                        title: 'Corporate Brand Asset Sheet - Official Logo',
                        fileName: 'Sumich_Logo_Specification.pdf',
                        category: 'BRANDING',
                        content: `SUMICH SOLUTIONS LIMITED - OFFICIAL BRAND LOGO SHEET\nEntity: SUMICH SOLUTIONS LIMITED\nResolution: Master Vector Artwork\nLicensed by PSRA (PSRA/REG/KEN/2023/0488)`
                      })}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
                      title="Print Logo Specification"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-600" />
                      <span>Print</span>
                    </button>

                    {companyInfo.logoDataUrl && (
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Default</span>
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="font-semibold text-slate-700">Logo Upload Guidelines:</div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                      <li>Supported formats: <strong>PNG, JPG, JPEG, and SVG</strong> vector files.</li>
                      <li>Maximum upload file size: <strong>2 MB</strong>.</li>
                      <li>Transparent PNG or SVG graphics look best against both light backgrounds and the dark navigation bar.</li>
                      <li>Changes take effect immediately on both desktop and mobile views.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: COMPANY IDENTITY & LEGAL INFORMATION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-500" />
                    <span>Company Legal Identity & Accreditations</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Displayed in site headers, footers, licensing badges, quotations, and official paperwork.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Trade Name</label>
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={e => updateCompanyInfo({ ...companyInfo, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Tagline / Slogan</label>
                  <input
                    type="text"
                    value={companyInfo.tagline}
                    onChange={e => updateCompanyInfo({ ...companyInfo, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PSRA License Number</label>
                  <input
                    type="text"
                    value={companyInfo.psraLicenseNumber}
                    onChange={e => updateCompanyInfo({ ...companyInfo, psraLicenseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Registration Number</label>
                  <input
                    type="text"
                    value={companyInfo.registrationNumber || ''}
                    onChange={e => updateCompanyInfo({ ...companyInfo, registrationNumber: e.target.value })}
                    placeholder="e.g. CPR/2023/108422"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">KRA PIN Number</label>
                  <input
                    type="text"
                    value={companyInfo.kraPin || ''}
                    onChange={e => updateCompanyInfo({ ...companyInfo, kraPin: e.target.value })}
                    placeholder="e.g. P051928471Z"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">VAT Number</label>
                  <input
                    type="text"
                    value={companyInfo.vatNumber || ''}
                    onChange={e => updateCompanyInfo({ ...companyInfo, vatNumber: e.target.value })}
                    placeholder="e.g. 051928471-V"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: PHYSICAL ADDRESS & CONTACT CHANNELS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-500" />
                    <span>Headquarters & 24/7 Dispatch Contact Channels</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Controls telephone numbers on top emergency bar, homepage contact section, and emails.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={companyInfo.physicalAddress}
                    onChange={e => updateCompanyInfo({ ...companyInfo, physicalAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Postal Address</label>
                  <input
                    type="text"
                    value={companyInfo.postalAddress}
                    onChange={e => updateCompanyInfo({ ...companyInfo, postalAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Operations Telephone</label>
                  <input
                    type="text"
                    value={companyInfo.phones[0]}
                    onChange={e => {
                      const newPhones = [...companyInfo.phones];
                      newPhones[0] = e.target.value;
                      updateCompanyInfo({ ...companyInfo, phones: newPhones });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Secondary / 24/7 Hotline Phone</label>
                  <input
                    type="text"
                    value={companyInfo.phones[1]}
                    onChange={e => {
                      const newPhones = [...companyInfo.phones];
                      newPhones[1] = e.target.value;
                      updateCompanyInfo({ ...companyInfo, phones: newPhones });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={companyInfo.email}
                    onChange={e => updateCompanyInfo({ ...companyInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Website URL</label>
                  <input
                    type="text"
                    value={companyInfo.website || ''}
                    onChange={e => updateCompanyInfo({ ...companyInfo, website: e.target.value })}
                    placeholder="www.sumichsecurity.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">Working Hours & Operational Readiness</label>
                  <input
                    type="text"
                    value={companyInfo.workingHours}
                    onChange={e => updateCompanyInfo({ ...companyInfo, workingHours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: WEBSITE SERVICES CATALOG */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>Website Services Catalog ({services.length} Published)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    These services are featured in the homepage services grid, quotation requests, and services page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewServiceModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(s => (
                  <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{s.title}</span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                        {s.category}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">{s.shortDescription}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {s.features.slice(0, 3).map((f, idx) => (
                        <span key={idx} className="bg-white text-slate-600 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: CLIENT TESTIMONIALS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Attributable Client Testimonials ({testimonials.length})</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Shown in the client testimonials section of the website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewTestimonialModalOpen(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map(t => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.name} &middot; {t.role}</span>
                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-slate-500">{t.company} ({t.location})</div>
                    <p className="text-slate-700 italic">"{t.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. AUDIT LOGS */}
        {activeTab === 'audit' && subRole === 'super_admin' && (
          <div className="space-y-6">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
              <button
                onClick={() => setAuditViewMode('admin_audits')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  auditViewMode === 'admin_audits' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Administrative Audit Logs ({auditLogs.length})</span>
              </button>

              <button
                onClick={() => setAuditViewMode('user_activities')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  auditViewMode === 'user_activities' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Activity className="w-4 h-4 text-amber-400" />
                <span>User-Facing Recent Activity Logs</span>
              </button>
            </div>

            {auditViewMode === 'admin_audits' ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-slate-900">Administrative Audit & Action Log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase border-y border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">Timestamp</th>
                        <th className="px-4 py-2.5">Actor</th>
                        <th className="px-4 py-2.5">Action</th>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                            {log.actorName}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-amber-700 whitespace-nowrap">
                            {log.action}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                              {log.category}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-700 max-w-md truncate" title={log.details}>
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <RecentActivityLog
                title="Global Portal User Activity History"
                subtitle="Live audit feed of all quotes submitted, appointments booked, job applications filed, guard leave requests, and user events."
                showFilters={true}
                showHeader={true}
              />
            )}
          </div>
        )}

        {/* 11. UPLOADED DOCUMENTS & FILES REPOSITORY */}
        {activeTab === 'documents' && (
          <UploadedFilesManager />
        )}
      </div>

      {/* MODAL: CREATE VACANCY */}
      {newVacancyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl my-8 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Create & Publish Security Vacancy</h3>
              <button onClick={() => setNewVacancyOpen(false)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>
            <form onSubmit={handleCreateVacancy} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newVacancy.title}
                  onChange={e => setNewVacancy({ ...newVacancy, title: e.target.value })}
                  placeholder="e.g. Armed Escort Tactical Officer"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <select
                    value={newVacancy.department}
                    onChange={e => setNewVacancy({ ...newVacancy, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Guarding Operations">Guarding Operations</option>
                    <option value="Corporate Division">Corporate Division</option>
                    <option value="Electronic Surveillance">Electronic Surveillance</option>
                    <option value="Tactical Response">Tactical Response</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newVacancy.location}
                    onChange={e => setNewVacancy({ ...newVacancy, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newVacancy.salaryRange}
                    onChange={e => setNewVacancy({ ...newVacancy, salaryRange: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Openings Count</label>
                  <input
                    type="number"
                    value={newVacancy.vacanciesCount}
                    onChange={e => setNewVacancy({ ...newVacancy, vacanciesCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  required
                  value={newVacancy.summary}
                  onChange={e => setNewVacancy({ ...newVacancy, summary: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setNewVacancyOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRICING QUOTE */}
      {pricingQuoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Prepare Client Security Proposal</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Estimated Budget / Fee Structure</label>
                <input
                  type="text"
                  value={quotePrice}
                  onChange={e => setQuotePrice(e.target.value)}
                  placeholder="e.g. KES 220,000 / month (covers 8 guards + supervisor)"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Operations Feedback & Proposal Terms</label>
                <textarea
                  rows={3}
                  value={quoteAdminNote}
                  onChange={e => setQuoteAdminNote(e.target.value)}
                  placeholder="Notes explaining guard coverage, shift rotation, radio telemetry..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setPricingQuoteId(null)} className="px-3 py-1.5 border rounded-lg text-xs">Cancel</button>
              <button
                onClick={() => handleConfirmQuotePricing(pricingQuoteId)}
                className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                Send Proposal to Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LEAVE APPROVAL / REJECTION */}
      {leaveActionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {leaveStatusToSet === 'approved' ? 'Approve Guard Leave Request' : 'Reject Guard Leave Request'}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Supervisor Decision Remarks</label>
                <textarea
                  rows={3}
                  value={leaveReviewNote}
                  onChange={e => setLeaveReviewNote(e.target.value)}
                  placeholder="Provide relief shift instructions or rejection rationale..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setLeaveActionId(null)} className="px-3 py-1.5 border rounded-lg text-xs">Cancel</button>
              <button
                onClick={() => handleConfirmLeaveAction(leaveActionId)}
                className={`px-4 py-1.5 text-white font-bold rounded-lg text-xs ${
                  leaveStatusToSet === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {leaveStatusToSet === 'approved' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE INTERVIEW */}
      {scheduleAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Shortlist Candidate & Schedule Interview</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Interview / Drill Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Candidate Instructions</label>
                <textarea
                  rows={3}
                  value={scheduleNote}
                  onChange={e => setScheduleNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setScheduleAppId(null)} className="px-3 py-1.5 border rounded-lg text-xs">Cancel</button>
              <button
                onClick={() => handleConfirmScheduleInterview(scheduleAppId)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
              >
                Shortlist & Notify Candidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REPLY INQUIRY */}
      {replyInquiryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reply to Client Inquiry</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Sumich Official Response</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type response to be stored and notified to user..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setReplyInquiryId(null)} className="px-3 py-1.5 border rounded-lg text-xs">Cancel</button>
              <button
                onClick={() => handleSendInquiryReply(replyInquiryId)}
                className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: ADD NEW SERVICE */}
      {newServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Publish New Website Security Service</span>
              </h3>
              <button
                type="button"
                onClick={() => setNewServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newService.title}
                  onChange={e => setNewService({ ...newService, title: e.target.value })}
                  placeholder="e.g. Executive Close Protection & VIP Escort"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Service Category</label>
                <select
                  value={newService.category}
                  onChange={e => setNewService({ ...newService, category: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Physical Guarding">Physical Guarding</option>
                  <option value="Electronic Security">Electronic Security</option>
                  <option value="Specialized Protection">Specialized Protection</option>
                  <option value="Consultancy">Consultancy</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description (Appears on Website Card)</label>
                <input
                  type="text"
                  required
                  value={newService.shortDescription}
                  onChange={e => setNewService({ ...newService, shortDescription: e.target.value })}
                  placeholder="Concise 1-sentence value proposition for homepage grid"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Service Description</label>
                <textarea
                  rows={3}
                  value={newService.fullDescription}
                  onChange={e => setNewService({ ...newService, fullDescription: e.target.value })}
                  placeholder="Comprehensive scope of work, protocols, and deployment details..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Key Deliverables / Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    placeholder="e.g. Armed Backup Liaison"
                    className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim()) {
                        setNewService({
                          ...newService,
                          features: [...(newService.features || []), featureInput.trim()]
                        });
                        setFeatureInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-amber-400 font-bold rounded-lg text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {newService.features?.map((feat, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] flex items-center gap-1"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewService({
                            ...newService,
                            features: newService.features?.filter((_, idx) => idx !== i)
                          })
                        }
                        className="text-slate-400 hover:text-rose-600"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setNewServiceModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm"
                >
                  Publish Service to Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW TESTIMONIAL */}
      {newTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Add Client Testimonial</span>
              </h3>
              <button
                type="button"
                onClick={() => setNewTestimonialModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTestimonial} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Client Full Name</label>
                <input
                  type="text"
                  required
                  value={newTestimonial.name}
                  onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  placeholder="e.g. David Mutiso"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Designation / Role</label>
                  <input
                    type="text"
                    value={newTestimonial.role}
                    onChange={e => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                    placeholder="e.g. Logistics Director"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={newTestimonial.company}
                    onChange={e => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                    placeholder="e.g. Nairobi Logistics Hub"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={newTestimonial.location}
                  onChange={e => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                  placeholder="e.g. Mombasa Road Industrial Zone"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Client Testimonial Review</label>
                <textarea
                  rows={3}
                  required
                  value={newTestimonial.comment}
                  onChange={e => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                  placeholder="Share the client's attributable comments on Sumich services..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setNewTestimonialModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm"
                >
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
