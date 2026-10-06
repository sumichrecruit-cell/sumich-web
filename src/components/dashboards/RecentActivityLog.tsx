import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserActivity } from '../../types';
import {
  FileText,
  Calendar,
  Briefcase,
  ShieldCheck,
  MessageSquare,
  UserCheck,
  FileCheck2,
  Activity,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  Printer,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  RefreshCw,
  Building,
  MapPin,
  CalendarClock
} from 'lucide-react';

interface RecentActivityLogProps {
  userId?: string;
  title?: string;
  subtitle?: string;
  maxItems?: number;
  onViewAll?: () => void;
  showFilters?: boolean;
  showHeader?: boolean;
  compact?: boolean;
  onSelectAction?: (activity: UserActivity) => void;
}

export const RecentActivityLog: React.FC<RecentActivityLogProps> = ({
  userId,
  title = "Recent Activity & Action History",
  subtitle = "Real-time audit log of your submitted requests, status progressions, and official correspondences.",
  maxItems,
  onViewAll,
  showFilters = true,
  showHeader = true,
  compact = false,
  onSelectAction
}) => {
  const {
    currentUser,
    getUserActivities,
    openDocPreview,
    quotes,
    appointments,
    inquiries,
    applications,
    leaveRequests,
    setQuoteModalOpen,
    setAppointmentModalOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Retrieve user activities
  const userActivities = getUserActivities(userId);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    return userActivities
      .filter(act => {
        // Category filter
        if (selectedCategory !== 'all' && act.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = act.title.toLowerCase().includes(q);
          const matchDesc = act.description.toLowerCase().includes(q);
          const matchAction = act.action.toLowerCase().includes(q);
          const matchStatus = (act.status || '').toLowerCase().includes(q);
          const matchMeta = act.metadata
            ? Object.values(act.metadata).some(val => String(val).toLowerCase().includes(q))
            : false;
          return matchTitle || matchDesc || matchAction || matchStatus || matchMeta;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [userActivities, selectedCategory, searchQuery, sortOrder]);

  const displayedActivities = maxItems ? filteredActivities.slice(0, maxItems) : filteredActivities;

  // Format relative or absolute time
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getCategoryConfig = (category: UserActivity['category']) => {
    switch (category) {
      case 'quote':
        return {
          label: 'Quotation',
          icon: FileText,
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          border: 'border-amber-200'
        };
      case 'appointment':
        return {
          label: 'Appointment',
          icon: Calendar,
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200'
        };
      case 'application':
        return {
          label: 'Job Application',
          icon: Briefcase,
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          border: 'border-indigo-200'
        };
      case 'leave':
        return {
          label: 'Leave / Off-Duty',
          icon: ShieldCheck,
          bg: 'bg-emerald-100',
          text: 'text-emerald-800',
          border: 'border-emerald-200'
        };
      case 'inquiry':
        return {
          label: 'Inquiry',
          icon: MessageSquare,
          bg: 'bg-teal-100',
          text: 'text-teal-800',
          border: 'border-teal-200'
        };
      case 'profile':
        return {
          label: 'Profile / Account',
          icon: UserCheck,
          bg: 'bg-slate-100',
          text: 'text-slate-800',
          border: 'border-slate-200'
        };
      case 'document':
        return {
          label: 'Document',
          icon: FileCheck2,
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-200'
        };
      default:
        return {
          label: 'System',
          icon: Activity,
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200'
        };
    }
  };

  const renderStatusBadge = (status?: string) => {
    if (!status) return null;
    const s = status.toLowerCase();

    if (s === 'approved' || s === 'completed' || s === 'resolved' || s === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {status.toUpperCase().replace('_', ' ')}
        </span>
      );
    }
    if (s === 'scheduled' || s === 'active') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
          <CalendarClock className="w-3 h-3 text-blue-600" />
          {status.toUpperCase()}
        </span>
      );
    }
    if (s === 'under_review' || s === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3 text-amber-600" />
          {status.replace('_', ' ').toUpperCase()}
        </span>
      );
    }
    if (s === 'rejected' || s === 'cancelled' || s === 'closed') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-md">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          {status.toUpperCase()}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
        {status.toUpperCase()}
      </span>
    );
  };

  // Quick Action Handler based on activity context
  const handleActivityAction = (act: UserActivity) => {
    if (onSelectAction) {
      onSelectAction(act);
      return;
    }

    if (act.category === 'quote' && act.metadata?.quoteId) {
      const q = quotes.find(item => item.id === act.metadata?.quoteId);
      if (q) {
        openDocPreview({
          title: `OFFICIAL SUMICH QUOTATION SPECIFICATION & AUDIT RECORD`,
          applicantName: q.name,
          fileName: `Sumich_Quotation_${q.id}.pdf`,
          date: new Date(q.createdAt).toLocaleDateString(),
          details: {
            quoteReference: q.id,
            serviceType: q.serviceType,
            location: q.location,
            preferredStartDate: q.preferredDate,
            estimatedBudget: q.estimatedBudget || 'Under technical appraisal',
            status: q.status.toUpperCase(),
            adminRemarks: q.adminNotes || 'Site appraisal pending or ongoing'
          },
          content: `SUMICH SOLUTIONS LIMITED - OFFICIAL SECURITY SERVICES QUOTATION
================================================================================
Reference: ${q.id}
Date Generated: ${new Date(q.createdAt).toLocaleString()}
Client Name: ${q.name}
Organization / Estate: ${q.company || 'Private Client'}
Service Requested: ${q.serviceType}
Site Location: ${q.location}
Estimated Budget Allocation: ${q.estimatedBudget || 'Official estimate in preparation'}

SECURITY REQUIREMENTS & SPECIFICATIONS:
${q.securityRequirements}

STATUS & REMARKS:
Current Workflow Status: ${q.status.toUpperCase()}
Operations Notes: ${q.adminNotes || 'Under standard review by Sumich Estimators'}

================================================================================
Issued by: Commercial Operations Directorate, Sumich Solutions Limited Kenya`
        });
      }
    } else if (act.category === 'appointment' && act.metadata?.appointmentId) {
      const a = appointments.find(item => item.id === act.metadata?.appointmentId);
      if (a) {
        openDocPreview({
          title: `OFFICIAL CONSULTATION APPOINTMENT CONFIRMATION SLIP`,
          applicantName: a.name,
          fileName: `Appointment_${a.id}.pdf`,
          date: new Date(a.createdAt).toLocaleDateString(),
          details: {
            appointmentRef: a.id,
            purpose: a.purpose,
            scheduledDate: a.preferredDate,
            scheduledTime: a.preferredTime,
            venue: a.meetingLocation || 'Vision Plaza, 3rd Floor, Suite 17B, Mombasa Road',
            status: a.status.toUpperCase(),
            officerInCharge: a.adminNotes || 'Operations Management'
          },
          content: `SUMICH SOLUTIONS LIMITED - APPOINTMENT VERIFICATION SLIP
================================================================================
Reference: ${a.id}
Client: ${a.name} (${a.email} | ${a.phone})
Purpose: ${a.purpose}
Date & Time: ${a.preferredDate} at ${a.preferredTime}
Location: ${a.meetingLocation || 'Sumich HQ, Vision Plaza, Mombasa Road, Nairobi'}
Status: ${a.status.toUpperCase()}

Instructions:
Please present this verification slip upon arrival at our Vision Plaza offices.
For emergency rescheduling, contact 0735 229 229 or 0117 230 136.`
        });
      }
    } else if (act.category === 'application') {
      const app = applications.find(item => item.id === act.metadata?.applicationId || item.userId === act.userId);
      if (app) {
        openDocPreview({
          title: `JOB APPLICATION DOSSIER & PROGRESSION RECORD`,
          applicantName: app.fullName,
          fileName: `Application_${app.id}.pdf`,
          date: new Date(app.createdAt).toLocaleDateString(),
          details: {
            applicationId: app.id,
            positionAppliedFor: app.positionAppliedFor,
            idNumber: app.idNumber,
            status: app.status.toUpperCase(),
            cvDocument: app.cvFileName,
            interviewDate: app.interviewDate ? new Date(app.interviewDate).toLocaleDateString() : 'Pending Scheduling'
          },
          content: `SUMICH SOLUTIONS LIMITED - RECRUITMENT APPLICATION RECORD
================================================================================
Applicant: ${app.fullName}
National ID: ${app.idNumber}
Applied For: ${app.positionAppliedFor}
Date Submitted: ${new Date(app.createdAt).toLocaleString()}
Status: ${app.status.toUpperCase()}
Interview Date: ${app.interviewDate ? new Date(app.interviewDate).toLocaleString() : 'Not yet scheduled'}

Education: ${app.education}
Professional Qualifications: ${app.professionalQualifications}
Work Experience: ${app.workExperience}

Recruitment Remarks:
${app.adminNotes || 'Application credentials verified against Private Security Regulatory Authority (PSRA) standards.'}`
        });
      }
    } else if (act.category === 'leave') {
      const lev = leaveRequests.find(item => item.id === act.metadata?.leaveId);
      if (lev) {
        openDocPreview({
          title: `OFFICIAL LEAVE CLEARANCE & OFF-DUTY PASS`,
          applicantName: lev.guardName,
          fileName: `Leave_Pass_${lev.guardServiceNumber}_${lev.startDate}.pdf`,
          date: new Date().toLocaleDateString(),
          details: {
            guardServiceNo: lev.guardServiceNumber,
            deploymentSite: lev.deploymentSite,
            leaveCategory: lev.leaveType,
            period: `${lev.startDate} to ${lev.endDate} (${lev.daysCount} Days)`,
            status: lev.status.toUpperCase(),
            approvedBy: lev.approvedBy || 'Operations Directorate'
          },
          content: `SUMICH SOLUTIONS LIMITED - GUARDING FORCE CLEARANCE PASS
================================================================================
Officer: ${lev.guardName} (Service No. ${lev.guardServiceNumber})
Station Post: ${lev.deploymentSite}
Leave Type: ${lev.leaveType}
Effective Dates: ${lev.startDate} to ${lev.endDate} (${lev.daysCount} Days)
Status: ${lev.status.toUpperCase()}
Relief Personnel: ${lev.reliefGuard || 'Assigned by Field Supervisor'}
Remarks: ${lev.adminNotes || 'Authorized under PSRA Guard Force employment guidelines.'}`
        });
      }
    } else {
      // General action preview
      openDocPreview({
        title: `SUMICH SOLUTIONS - USER ACTIVITY RECORD`,
        applicantName: currentUser?.name || 'Account User',
        fileName: `Activity_${act.id}.pdf`,
        date: new Date(act.timestamp).toLocaleDateString(),
        details: {
          activityId: act.id,
          actionType: act.action,
          category: act.category.toUpperCase(),
          status: (act.status || 'LOGGED').toUpperCase(),
          timestamp: new Date(act.timestamp).toLocaleString()
        },
        content: `SUMICH SOLUTIONS LIMITED - AUDIT LOG TRANSCRIPT
================================================================================
Activity Title: ${act.title}
Action: ${act.action}
Category: ${act.category.toUpperCase()}
Status: ${(act.status || 'RECORDED').toUpperCase()}
Timestamp: ${new Date(act.timestamp).toLocaleString()}

Details:
${act.description}

Metadata Record:
${act.metadata ? JSON.stringify(act.metadata, null, 2) : 'No auxiliary metadata recorded.'}`
      });
    }
  };

  // Print full activity statement
  const handlePrintFullStatement = () => {
    const userName = currentUser?.name || 'Authorized User';
    const role = currentUser?.role.toUpperCase() || 'USER';
    const lines = filteredActivities.map(
      (a, i) =>
        `${i + 1}. [${new Date(a.timestamp).toLocaleString()}] [${a.category.toUpperCase()}] ${a.title}\n   Status: ${(a.status || 'N/A').toUpperCase()} | Action: ${a.action}\n   Details: ${a.description}\n`
    );

    openDocPreview({
      title: `OFFICIAL SUMICH PORTAL ACTIVITY & AUDIT STATEMENT`,
      applicantName: userName,
      fileName: `Sumich_Activity_Statement_${new Date().toISOString().split('T')[0]}.pdf`,
      date: new Date().toLocaleDateString(),
      details: {
        accountHolder: userName,
        accountRole: role,
        totalEntries: String(filteredActivities.length),
        generatedAt: new Date().toLocaleString(),
        auditCompliance: 'PSRA Data Integrity Verified'
      },
      content: `SUMICH SOLUTIONS LIMITED - VERIFIED USER ACTIVITY STATEMENT
================================================================================
Generated for: ${userName} (${role} PORTAL)
Generated on: ${new Date().toLocaleString()}
Total Recorded Events: ${filteredActivities.length}
System: Sumich Security Command & Portal Infrastructure (Vision Plaza, Nairobi)

================================================================================
HISTORICAL EVENT CHRONOLOGY:
================================================================================

${lines.join('\n')}

================================================================================
Official Stamp:
SUMICH SOLUTIONS LIMITED KENYA
Information Systems & Operations Directorate
Vision Plaza, 3rd Floor, Suite 17B, Mombasa Road, Nairobi`
    });
  };

  const categories = [
    { id: 'all', label: 'All Activities', count: userActivities.length },
    { id: 'quote', label: 'Quotations', count: userActivities.filter(a => a.category === 'quote').length },
    { id: 'appointment', label: 'Appointments', count: userActivities.filter(a => a.category === 'appointment').length },
    { id: 'application', label: 'Applications', count: userActivities.filter(a => a.category === 'application').length },
    { id: 'leave', label: 'Leave & Duty', count: userActivities.filter(a => a.category === 'leave').length },
    { id: 'inquiry', label: 'Inquiries', count: userActivities.filter(a => a.category === 'inquiry').length },
    { id: 'profile', label: 'Profile & Security', count: userActivities.filter(a => a.category === 'profile').length }
  ].filter(c => c.id === 'all' || c.count > 0);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 ${compact ? 'p-5' : 'p-6 sm:p-7'} space-y-6 shadow-xs`}>
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold border border-amber-500/20">
                <Activity className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                {filteredActivities.length} {filteredActivities.length === 1 ? 'event' : 'events'}
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrintFullStatement}
              title="Print official activity audit statement"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Audit Slip</span>
            </button>

            {maxItems && onViewAll && (
              <button
                onClick={onViewAll}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span>View Full Log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      {showFilters && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search past activities by service, keyword, or reference..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 hidden sm:inline">Sort:</span>
              <button
                onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
                className="px-2.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-amber-400 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity Timeline List */}
      {displayedActivities.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">No matching activities found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery
                ? `No action logs matched "${searchQuery}". Try clearing search filters.`
                : "You haven't performed any actions in this category yet. Submissions and status progressions will appear here automatically."}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedActivities.map((act, index) => {
            const config = getCategoryConfig(act.category);
            const IconComponent = config.icon;

            return (
              <div
                key={act.id}
                className="group relative bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-amber-400/60 rounded-xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Icon & Title */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl ${config.bg} ${config.text} ${config.border} border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {config.label}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-xs font-bold text-slate-700">{act.action}</span>
                        {renderStatusBadge(act.status)}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                        {act.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Timestamp & Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span title={new Date(act.timestamp).toLocaleString()}>
                        {formatTime(act.timestamp)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleActivityAction(act)}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-amber-100 rounded-md transition-colors flex items-center gap-1 border border-slate-200/60"
                      title="Inspect full audit record"
                    >
                      <span>View Record</span>
                      <ArrowUpRight className="w-3 h-3 text-amber-600" />
                    </button>
                  </div>
                </div>

                {/* Optional Metadata Row */}
                {act.metadata && Object.keys(act.metadata).length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
                    {act.metadata.quoteId && (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                        Quote Ref: {act.metadata.quoteId}
                      </span>
                    )}
                    {act.metadata.appointmentId && (
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono font-medium">
                        Apt Ref: {act.metadata.appointmentId}
                      </span>
                    )}
                    {act.metadata.applicationId && (
                      <span className="bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded font-mono font-medium">
                        App Ref: {act.metadata.applicationId}
                      </span>
                    )}
                    {act.metadata.leaveId && (
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-medium">
                        Leave Ref: {act.metadata.leaveId}
                      </span>
                    )}
                    {act.metadata.serviceType && (
                      <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-semibold">
                        {act.metadata.serviceType}
                      </span>
                    )}
                    {act.metadata.budget && (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                        {act.metadata.budget}
                      </span>
                    )}
                    {act.metadata.location && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {act.metadata.location}
                      </span>
                    )}
                    {act.metadata.preferredDate && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Date: {act.metadata.preferredDate} {act.metadata.preferredTime ? `@ ${act.metadata.preferredTime}` : ''}
                      </span>
                    )}
                    {act.metadata.interviewDate && (
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                        Interview: {new Date(act.metadata.interviewDate).toLocaleDateString()}
                      </span>
                    )}
                    {act.metadata.reliefGuard && (
                      <span className="text-slate-500 font-medium">
                        Relief: {act.metadata.reliefGuard}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer view all link when compact or maxItems */}
      {maxItems && onViewAll && filteredActivities.length > maxItems && (
        <div className="pt-2 text-center border-t border-slate-100">
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline inline-flex items-center gap-1"
          >
            <span>View all {filteredActivities.length} recent activity logs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
