import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  Settings,
  ArrowRight,
  Eye,
  Download,
  Printer,
  Upload,
  Plus,
  FileCheck,
  X,
  Calendar,
  MapPin,
  Banknote,
  Activity,
  FolderArchive
} from 'lucide-react';
import { RecentActivityLog } from './RecentActivityLog';
import { downloadUploadedFile, printUploadedFile } from '../../utils/fileHelpers';

export const JobSeekerDashboard: React.FC = () => {
  const {
    currentUser,
    applications,
    vacancies,
    notifications,
    markNotificationRead,
    setCurrentView,
    setJobAppModalOpen,
    setSelectedVacancyForApp,
    updateProfile,
    openDocPreview,
    uploadedDocuments,
    addUploadedDocument
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'applications' | 'jobs' | 'documents' | 'notifications' | 'settings'>('overview');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'credential' | 'cv' | 'other'>('credential');
  const [newDocFile, setNewDocFile] = useState<{ name: string; size: string; type: string; base64: string } | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState('');

  const myApplications = applications.filter(a => a.userId === currentUser?.id || a.email.toLowerCase() === currentUser?.email.toLowerCase());
  const myNotifications = notifications.filter(n => n.userId === currentUser?.id);

  // Documents matching current jobseeker
  const myUploadedDocs = uploadedDocuments.filter(d => 
    d.uploadedBy.toLowerCase().includes(currentUser?.name.toLowerCase() || '___none___') ||
    (currentUser?.id && d.relatedEntityId && myApplications.some(a => a.id === d.relatedEntityId))
  );

  const handleExtraFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadFeedback('File exceeds 5MB limit. Please choose a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      setNewDocFile({
        name: file.name,
        size: sizeStr,
        type: file.type || 'application/pdf',
        base64: reader.result as string
      });
      if (!newDocTitle) {
        setNewDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
      setUploadFeedback('');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveExtraDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocFile) {
      setUploadFeedback('Please select a document file.');
      return;
    }
    if (!newDocTitle.trim()) {
      setUploadFeedback('Please enter a document title.');
      return;
    }

    addUploadedDocument({
      name: newDocTitle.trim(),
      fileName: newDocFile.name,
      category: newDocCategory,
      fileDataUrl: newDocFile.base64,
      fileType: newDocFile.type,
      fileSize: newDocFile.size,
      uploadedBy: `${currentUser?.name || 'Job Seeker'} (Candidate)`,
      uploaderRole: 'jobseeker',
      description: `Uploaded candidate credential for vetting and deployment clearance.`,
      tags: ['Credential', 'Job Seeker', currentUser?.name || 'Applicant'],
      contentTranscript: `DOCUMENT: ${newDocTitle.trim()}
CANDIDATE: ${currentUser?.name}
NATIONAL ID: ${currentUser?.idNumber || 'Verified on file'}
PHONE: ${currentUser?.phone || 'Verified'}
DATE: ${new Date().toLocaleDateString()}
STATUS: Submitted to Sumich Solutions Limited HR Vetting Directorate.`
    });

    setUploadFeedback('Document uploaded successfully!');
    setTimeout(() => {
      setUploadModalOpen(false);
      setNewDocTitle('');
      setNewDocFile(null);
      setUploadFeedback('');
    }, 1200);
  };

  // Settings state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [idNumber, setIdNumber] = useState(currentUser?.idNumber || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, idNumber, location });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded text-xs">Shortlisted / Approved</span>;
      case 'under_review':
        return <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded text-xs">Under Review</span>;
      case 'rejected':
        return <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded text-xs">Not Selected</span>;
      default:
        return <span className="text-slate-700 font-bold bg-slate-100 px-2.5 py-0.5 rounded text-xs">Pending Review</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xl border border-amber-500/20">
              {currentUser?.name.charAt(0) || 'J'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{currentUser?.name}</h1>
                <span className="text-xs bg-amber-500/20 text-amber-900 font-bold px-2 py-0.5 rounded">
                  Job Seeker Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ID: {currentUser?.idNumber || 'N/A'} &middot; {currentUser?.location || 'Nairobi, Kenya'} &middot; {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('jobs')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-xs transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Briefcase className="w-4 h-4" />
            <span>BROWSE AVAILABLE OPENINGS</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'activity' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Recent Activity</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'applications' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>My Applications ({myApplications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'jobs' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Available Vacancies</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'documents' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Uploaded Documents</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'notifications' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications ({myNotifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Submitted Applications</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{myApplications.length}</div>
                <div className="text-[11px] text-amber-600 mt-1">
                  {myApplications.filter(a => a.status === 'under_review').length} under vetting
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Shortlisted / Approved</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
                  {myApplications.filter(a => a.status === 'approved').length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Invited for drills/interviews</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Open Job Openings</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                  {vacancies.filter(v => v.status === 'published').length}
                </div>
                <div className="text-[11px] text-blue-600 mt-1">Across Nairobi & Mombasa Rd</div>
              </div>
            </div>

            {/* Quick Applications list */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Application Progress & Status</h3>
              {myApplications.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  You haven't submitted any job applications yet.{' '}
                  <button onClick={() => setActiveTab('jobs')} className="text-amber-700 font-bold hover:underline">
                    Browse open vacancies
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myApplications.map(app => (
                    <div key={app.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div>
                          <div className="text-[11px] font-mono text-slate-400">Application ID: {app.id}</div>
                          <h4 className="text-sm font-bold text-slate-900">{app.positionAppliedFor}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(app.status)}
                          <span className="text-[11px] text-slate-400">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                        <div>Education: <strong className="text-slate-800">{app.education}</strong></div>
                        <div>CV Attached: <strong className="text-slate-800 font-mono">{app.cvFileName}</strong></div>
                        <div>Qualifications: <strong className="text-slate-800">{app.professionalQualifications}</strong></div>
                      </div>

                      {app.interviewDate && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Interview / Physical Drills Scheduled:</strong>{' '}
                            {new Date(app.interviewDate).toLocaleString()} at Sumich Headquarters, Vision Plaza.
                          </span>
                        </div>
                      )}

                      {app.adminNotes && (
                        <div className="p-2.5 bg-amber-50 text-amber-900 rounded-lg text-xs border border-amber-100">
                          <strong>Recruitment Directorate Note:</strong> {app.adminNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User-facing Recent Activity feed */}
            <RecentActivityLog
              maxItems={3}
              onViewAll={() => setActiveTab('activity')}
              title="Recent Recruitment Activities"
              subtitle="Timeline of your applications, verified credentials, and recruitment updates."
            />
          </div>
        )}

        {/* TAB: RECENT ACTIVITY (FULL LOG) */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <RecentActivityLog
              title="Job Seeker Activity & Application History"
              subtitle="Full chronological record of your job applications, document verification status, interview schedules, and profile changes."
              showFilters={true}
              showHeader={true}
            />
          </div>
        )}

        {/* TAB 2: MY APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Application History & Status Tracker</h3>
            {myApplications.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">No applications on record.</div>
            ) : (
              <div className="space-y-4">
                {myApplications.map(app => (
                  <div key={app.id} className="p-5 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">App Ref: {app.id}</span>
                      {getStatusBadge(app.status)}
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{app.positionAppliedFor}</h4>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Experience Summary: {app.workExperience}</div>
                      <div>Uploaded CV: <strong className="font-mono text-slate-800">{app.cvFileName}</strong></div>
                      {app.supportingDocName && (
                        <div>Supporting Document: <strong className="font-mono text-slate-800">{app.supportingDocName}</strong></div>
                      )}
                    </div>
                    {app.adminNotes && (
                      <div className="text-xs bg-amber-50 text-amber-900 p-3 rounded-lg border border-amber-200">
                        <strong>Recruiter Remarks:</strong> {app.adminNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AVAILABLE JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Available Vacancies at Sumich Solutions</h3>
              <button
                onClick={() => setCurrentView('careers')}
                className="text-xs text-amber-700 font-bold hover:underline"
              >
                Open Full Recruitment Portal &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vacancies.filter(v => v.status === 'published').map(vac => {
                const alreadyApplied = myApplications.some(a => a.vacancyId === vac.id);
                return (
                  <div key={vac.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-amber-700">{vac.department}</div>
                        <h4 className="text-sm font-bold text-slate-900">{vac.title}</h4>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {vac.jobType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{vac.summary}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="text-slate-500 font-medium">{vac.salaryRange}</div>
                      {alreadyApplied ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedVacancyForApp(vac);
                            setJobAppModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: UPLOADED DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-500" />
                  <span>My Verified Credentials & Uploaded Documents</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View, download, or print your verified candidate documents and recruitment dossiers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Document</span>
              </button>
            </div>

            {/* Document List */}
            <div className="space-y-4">
              {myApplications.length === 0 && myUploadedDocs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No documents uploaded yet</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Upload your CV, Police Clearance, or Security Certificate</p>
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="mt-3 px-3.5 py-1.5 bg-slate-900 text-amber-400 rounded-lg text-xs font-bold"
                  >
                    Upload Document
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Applications Documents */}
                  {myApplications.map(app => (
                    <React.Fragment key={app.id}>
                      {/* CV Card */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 border border-slate-800">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{app.cvFileName}</span>
                              <span className="px-2 py-0.2 bg-blue-100 text-blue-800 rounded text-[10px] font-bold uppercase">
                                Primary CV
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Applied for: <strong>{app.positionAppliedFor}</strong> &middot; Vetting: <span className="capitalize font-semibold text-amber-700">{app.status.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => openDocPreview({
                              title: `Curriculum Vitae - ${app.fullName}`,
                              applicantName: app.fullName,
                              fileName: app.cvFileName,
                              fileDataUrl: app.cvFileBase64,
                              fileType: app.cvFileType,
                              category: 'CURRICULUM VITAE',
                              content: `CANDIDATE DOSSIER: ${app.fullName}
NATIONAL ID: ${app.idNumber}
CONTACT: ${app.phone} | ${app.email}
LOCATION: ${app.location}
POSITION: ${app.positionAppliedFor}

EDUCATION:
${app.education}

PROFESSIONAL QUALIFICATIONS:
${app.professionalQualifications}

EXPERIENCE:
${app.workExperience}

Sumich Solutions Limited Recruitment Directorate Nairobi Kenya`,
                              details: {
                                idNumber: app.idNumber,
                                phone: app.phone,
                                email: app.email,
                                position: app.positionAppliedFor,
                                education: app.education
                              }
                            })}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="View Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => downloadUploadedFile({
                              fileDataUrl: app.cvFileBase64,
                              fileName: app.cvFileName,
                              content: `CANDIDATE DOSSIER: ${app.fullName}\nPOSITION: ${app.positionAppliedFor}\nID: ${app.idNumber}\nPHONE: ${app.phone}\nEDUCATION: ${app.education}\nEXPERIENCE: ${app.workExperience}`,
                              fileType: app.cvFileType
                            })}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Download File"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => printUploadedFile({
                              fileDataUrl: app.cvFileBase64,
                              fileName: app.cvFileName,
                              title: `Curriculum Vitae - ${app.fullName}`,
                              applicantName: app.fullName,
                              category: 'CURRICULUM VITAE',
                              content: `SUMICH SOLUTIONS CANDIDATE DOSSIER\nApplicant: ${app.fullName}\nID: ${app.idNumber}\nPhone: ${app.phone}\nPosition: ${app.positionAppliedFor}\nEducation: ${app.education}\nQualifications: ${app.professionalQualifications}`
                            })}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Print on Paper"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-600" />
                            <span>Print</span>
                          </button>
                        </div>
                      </div>

                      {/* Supporting Document Card (if attached) */}
                      {app.supportingDocName && (
                        <div className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">{app.supportingDocName}</span>
                                <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase">
                                  Police Clearance
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Verified Certificate of Good Conduct / Security Clearance
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => openDocPreview({
                                title: `Police Clearance / Credential - ${app.fullName}`,
                                applicantName: app.fullName,
                                fileName: app.supportingDocName!,
                                fileDataUrl: app.supportingDocBase64,
                                category: 'CREDENTIAL',
                                content: `DIRECTORATE OF CRIMINAL INVESTIGATIONS (DCI)\nPOLICE CLEARANCE CERTIFICATE\nSubject: ${app.fullName}\nNational ID: ${app.idNumber}\nRecord: NO CRIMINAL CONVICTIONS FOUND.\nStatus: Valid for official security deployment.`,
                                details: {
                                  candidate: app.fullName,
                                  idNumber: app.idNumber,
                                  fileReference: app.supportingDocName!
                                }
                              })}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="View Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => downloadUploadedFile({
                                fileDataUrl: app.supportingDocBase64,
                                fileName: app.supportingDocName!,
                                content: `DCI POLICE CLEARANCE CERTIFICATE\nHolder: ${app.fullName}\nStatus: Certified Clear`
                              })}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Download File"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => printUploadedFile({
                                fileDataUrl: app.supportingDocBase64,
                                fileName: app.supportingDocName!,
                                title: `Police Clearance Certificate - ${app.fullName}`,
                                applicantName: app.fullName,
                                category: 'CREDENTIAL',
                                content: `DCI POLICE CLEARANCE CERTIFICATE\nHolder: ${app.fullName}\nNational ID: ${app.idNumber}\nResult: NO RECORD FOUND (CERTIFIED CLEAN).`
                              })}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Print on Paper"
                            >
                              <Printer className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Print</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Extra Uploaded Documents */}
                  {myUploadedDocs.map(doc => (
                    <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                          <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                            <span className="px-2 py-0.2 bg-purple-100 text-purple-800 rounded text-[10px] font-bold uppercase">
                              {doc.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {doc.fileName} &middot; {doc.fileSize} &middot; {new Date(doc.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => openDocPreview({
                            title: doc.name,
                            applicantName: currentUser?.name || 'Applicant',
                            fileName: doc.fileName,
                            fileDataUrl: doc.fileDataUrl,
                            fileType: doc.fileType,
                            category: doc.category.toUpperCase(),
                            content: doc.contentTranscript || doc.description || `DOCUMENT: ${doc.name}`,
                            details: {
                              category: doc.category,
                              fileSize: doc.fileSize,
                              uploadedAt: new Date(doc.uploadedAt).toLocaleString()
                            }
                          })}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadUploadedFile({
                            fileDataUrl: doc.fileDataUrl,
                            fileName: doc.fileName,
                            content: doc.contentTranscript || doc.description
                          })}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => printUploadedFile({
                            fileDataUrl: doc.fileDataUrl,
                            fileName: doc.fileName,
                            title: doc.name,
                            applicantName: currentUser?.name || 'Candidate',
                            category: doc.category.toUpperCase(),
                            content: doc.contentTranscript || doc.description
                          })}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-600" />
                          <span>Print</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CANDIDATE EXTRA UPLOAD MODAL */}
            {uploadModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
                <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 my-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-500" />
                      <span>Upload Candidate Credential or Certificate</span>
                    </h3>
                    <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {uploadFeedback && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-semibold">
                      {uploadFeedback}
                    </div>
                  )}

                  <form onSubmit={handleSaveExtraDoc} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Select Document File <span className="text-rose-500">* (PDF, PNG, JPG up to 5MB)</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        onChange={handleExtraFileUpload}
                        required
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50"
                      />
                      {newDocFile && (
                        <p className="text-[11px] text-emerald-600 font-bold mt-1">
                          Attached: {newDocFile.name} ({newDocFile.size})
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Document Name / Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newDocTitle}
                        onChange={e => setNewDocTitle(e.target.value)}
                        placeholder="e.g., NYS Drills Certificate, KCSE Certificate"
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Document Type
                      </label>
                      <select
                        value={newDocCategory}
                        onChange={e => setNewDocCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="credential">Vetting Credential / Police Clearance</option>
                        <option value="cv">Updated Curriculum Vitae</option>
                        <option value="other">Academic or Training Certificate</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setUploadModalOpen(false)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm"
                      >
                        Save & Upload
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Recruitment Updates & Alerts</h3>
            {myNotifications.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">No recruitment notifications.</div>
            ) : (
              <div className="space-y-2">
                {myNotifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                      n.isRead ? 'bg-white border-slate-200' : 'bg-amber-50/40 border-amber-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                        <span>{n.title}</span>
                      </div>
                      <p className="text-xs text-slate-600">{n.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Job Seeker Profile Information</h3>
            {settingsSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">National ID / Passport Number</label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
