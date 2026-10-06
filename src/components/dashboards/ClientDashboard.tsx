import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  Activity
} from 'lucide-react';
import { RecentActivityLog } from './RecentActivityLog';

export const ClientDashboard: React.FC = () => {
  const {
    currentUser,
    quotes,
    appointments,
    inquiries,
    notifications,
    markNotificationRead,
    setQuoteModalOpen,
    setAppointmentModalOpen,
    updateProfile,
    submitInquiry
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'quotes' | 'appointments' | 'inquiries' | 'notifications' | 'settings'>('overview');

  // Client-specific filtered records
  const clientQuotes = quotes.filter(q => q.userId === currentUser?.id || q.email.toLowerCase() === currentUser?.email.toLowerCase());
  const clientAppointments = appointments.filter(a => a.userId === currentUser?.id || a.email.toLowerCase() === currentUser?.email.toLowerCase());
  const clientInquiries = inquiries.filter(i => i.userId === currentUser?.id || i.email.toLowerCase() === currentUser?.email.toLowerCase());
  const clientNotifications = notifications.filter(n => n.userId === currentUser?.id);

  // Settings form state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Quick inquiry inside dashboard
  const [inqSubject, setInqSubject] = useState('');
  const [inqMessage, setInqMessage] = useState('');
  const [inqSent, setInqSent] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, company, location });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqSubject || !inqMessage || !currentUser) return;
    submitInquiry({
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      subject: inqSubject,
      message: inqMessage
    });
    setInqSubject('');
    setInqMessage('');
    setInqSent(true);
    setTimeout(() => setInqSent(false), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'resolved':
        return <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded text-xs">Approved</span>;
      case 'scheduled':
        return <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded text-xs">Scheduled</span>;
      case 'under_review':
        return <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded text-xs">Under Review</span>;
      case 'rejected':
      case 'cancelled':
      case 'closed':
        return <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded text-xs">{status.toUpperCase()}</span>;
      default:
        return <span className="text-slate-700 font-bold bg-slate-100 px-2.5 py-0.5 rounded text-xs">Pending</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xl border border-amber-500/20">
              {currentUser?.name.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{currentUser?.name}</h1>
                <span className="text-xs bg-amber-500/20 text-amber-900 font-bold px-2 py-0.5 rounded">
                  Client Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser?.company || 'Commercial Client'} &middot; {currentUser?.location || 'Nairobi, Kenya'} &middot; {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>REQUEST NEW QUOTE</span>
            </button>
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>BOOK APPOINTMENT</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
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
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'quotes' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Quotations ({clientQuotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'appointments' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments ({clientAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'inquiries' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>My Inquiries ({clientInquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'notifications' ? 'bg-slate-900 text-amber-400' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications ({clientNotifications.length})</span>
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
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Quotation Requests</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{clientQuotes.length}</div>
                <div className="text-[11px] text-amber-600 mt-1">
                  {clientQuotes.filter(q => q.status === 'pending' || q.status === 'under_review').length} in active review
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Upcoming Appointments</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                  {clientAppointments.filter(a => a.status === 'scheduled' || a.status === 'pending').length}
                </div>
                <div className="text-[11px] text-blue-600 mt-1">Site surveys & SLA meetings</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Submitted Inquiries</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{clientInquiries.length}</div>
                <div className="text-[11px] text-emerald-600 mt-1">
                  {clientInquiries.filter(i => i.status === 'resolved').length} resolved
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Unread Notifications</div>
                <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
                  {clientNotifications.filter(n => !n.isRead).length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Live status alerts</div>
              </div>
            </div>

            {/* Recent Quotations Quick View */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Recent Quotation Requests</h3>
                <button
                  onClick={() => setActiveTab('quotes')}
                  className="text-xs text-amber-700 font-bold hover:underline"
                >
                  View All Quotes &rarr;
                </button>
              </div>

              {clientQuotes.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  You haven't requested any security quotations yet. Click <strong>Request New Quote</strong> above.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase border-y border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">Service Requested</th>
                        <th className="px-4 py-2.5">Location</th>
                        <th className="px-4 py-2.5">Date Requested</th>
                        <th className="px-4 py-2.5">Estimated Budget</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clientQuotes.slice(0, 3).map(q => (
                        <tr key={q.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 font-semibold text-slate-900">{q.serviceType}</td>
                          <td className="px-4 py-3 text-slate-600">{q.location}</td>
                          <td className="px-4 py-3 text-slate-500">{new Date(q.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 font-mono font-medium text-slate-700">{q.estimatedBudget || 'Under appraisal'}</td>
                          <td className="px-4 py-3">{getStatusBadge(q.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Activity Log Section on Overview */}
            <RecentActivityLog
              maxItems={3}
              onViewAll={() => setActiveTab('activity')}
              title="Recent Activity Log"
              subtitle="Latest submissions, status changes, and service updates on your account."
            />
          </div>
        )}

        {/* TAB: RECENT ACTIVITY (FULL AUDIT TRAIL) */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <RecentActivityLog
              title="Complete Activity & Action History"
              subtitle="Comprehensive chronological audit log of all quotes requested, appointments booked, status updates, and communications."
              showFilters={true}
              showHeader={true}
            />
          </div>
        )}

        {/* TAB 2: MY QUOTATIONS */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Quotation Requests & Status Tracker</h3>
                <p className="text-xs text-slate-500">Review technical proposals, scope of works, and pricing provided by Sumich estimators.</p>
              </div>
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400"
              >
                + Request Another Quote
              </button>
            </div>

            {clientQuotes.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">No quotation requests found.</div>
            ) : (
              <div className="space-y-4">
                {clientQuotes.map(q => (
                  <div key={q.id} className="p-5 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-mono text-slate-400">Ref: {q.id}</div>
                        <h4 className="text-base font-bold text-slate-900">{q.serviceType}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(q.status)}
                        <span className="text-xs text-slate-400">Submitted: {new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Site Location:</span>
                        <span className="font-medium text-slate-800">{q.location}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Preferred Start Date:</span>
                        <span className="font-medium text-slate-800">{q.preferredDate || 'Immediate'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Estimated Proposal Amount:</span>
                        <span className="font-mono font-bold text-amber-700 text-sm">
                          {q.estimatedBudget || 'Site survey pending'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong>Security Requirements:</strong> {q.securityRequirements}
                    </div>

                    {q.adminNotes && (
                      <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900">
                        <strong className="block font-semibold mb-0.5">Sumich Operations Feedback:</strong>
                        {q.adminNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Security Consultation Appointments</h3>
                <p className="text-xs text-slate-500">Track meetings with our directors and technical site survey teams.</p>
              </div>
              <button
                onClick={() => setAppointmentModalOpen(true)}
                className="px-3.5 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800"
              >
                + Book New Appointment
              </button>
            </div>

            {clientAppointments.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">No scheduled appointments found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientAppointments.map(a => (
                  <div key={a.id} className="p-5 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">Ref: {a.id}</span>
                      {getStatusBadge(a.status)}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{a.purpose}</h4>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Date & Time: <strong className="text-slate-900">{a.preferredDate} at {a.preferredTime}</strong></div>
                      <div>Location: <strong className="text-slate-900">{a.meetingLocation}</strong></div>
                    </div>
                    {a.adminNotes && (
                      <div className="text-xs bg-blue-50 text-blue-900 p-2.5 rounded-lg border border-blue-100">
                        <strong>Meeting Details:</strong> {a.adminNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">My Inquiries History</h3>
              {clientInquiries.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No inquiries submitted yet.</div>
              ) : (
                <div className="space-y-4">
                  {clientInquiries.map(inq => (
                    <div key={inq.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{inq.subject}</h4>
                        {getStatusBadge(inq.status)}
                      </div>
                      <p className="text-xs text-slate-600">{inq.message}</p>
                      {inq.response && (
                        <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-900">
                          <strong>Sumich Response:</strong> {inq.response}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Submit New Inquiry</h3>
              {inqSent && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs">
                  Inquiry sent to operations desk!
                </div>
              )}
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={inqSubject}
                    onChange={e => setInqSubject(e.target.value)}
                    placeholder="e.g. CCTV expansion inquiry"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={inqMessage}
                    onChange={e => setInqMessage(e.target.value)}
                    placeholder="Type inquiry details here..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Notifications & Alerts</h3>
            {clientNotifications.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">No notifications to display.</div>
            ) : (
              <div className="space-y-2">
                {clientNotifications.map(n => (
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
            <h3 className="text-base font-bold text-slate-900">Client Profile & Settings</h3>
            {settingsSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Site / Office Location</label>
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
                Save Profile Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
