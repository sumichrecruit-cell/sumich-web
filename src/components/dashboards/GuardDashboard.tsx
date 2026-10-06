import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveType, LeaveRequest } from '../../types';
import {
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  MapPin,
  Send,
  Plus,
  Printer,
  Eye,
  ChevronLeft,
  ChevronRight,
  Info,
  Radio,
  FileCheck2,
  Activity
} from 'lucide-react';
import { RecentActivityLog } from './RecentActivityLog';

export const GuardDashboard: React.FC = () => {
  const {
    currentUser,
    leaveRequests,
    submitLeaveRequest,
    notifications,
    markNotificationRead,
    openDocPreview,
    logUserActivity
  } = useApp();

  const [activeTab, setActiveTab] = useState<'leave-system' | 'activity' | 'overview' | 'incident-log' | 'notifications'>('leave-system');

  // Leave system sub-tabs: Form, Calendar, Tracking Table
  const [leaveSubTab, setLeaveSubTab] = useState<'request-form' | 'calendar-view' | 'status-table'>('status-table');

  // Filter leaves for this guard
  const myLeaves = leaveRequests.filter(l => l.guardId === currentUser?.id || l.guardName === currentUser?.name);

  // Time off request form state
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [reliefGuard, setReliefGuard] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Daily SITREP state
  const [incidentType, setIncidentType] = useState('Routine Shift Log');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [incidentSuccess, setIncidentSuccess] = useState(false);

  // Calendar state: October 2026 as standard base
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date(2026, 9, 1)); // Oct 2026

  // Calculate day difference
  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 1;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (e < s) return 1;
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!startDate || !endDate || !reason) {
      setFormError('Please select Start Date, End Date, and provide a valid reason.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setFormError('End Date cannot be earlier than Start Date.');
      return;
    }

    const daysCount = calculateDays(startDate, endDate);

    submitLeaveRequest({
      guardId: currentUser?.id || `usr-guard-${Date.now()}`,
      guardName: currentUser?.name || 'Guarding Personnel',
      guardServiceNumber: currentUser?.serviceNumber || 'SUM-GD-1042',
      deploymentSite: currentUser?.deploymentSite || 'Vision Plaza Commercial Complex',
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason,
      reliefGuard: reliefGuard || 'To be assigned by Field Duty Officer'
    });

    setFormSuccess(`Leave request for ${daysCount} day(s) submitted to Operations Command.`);
    setStartDate('');
    setEndDate('');
    setReason('');
    setReliefGuard('');
    setLeaveSubTab('status-table');
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDetails) return;
    setIncidentSuccess(true);

    logUserActivity({
      userId: currentUser?.id || 'usr-guard-01',
      action: 'Shift SITREP Logged',
      category: 'system',
      title: `Shift SITREP: ${incidentType}`,
      description: incidentDetails,
      status: 'completed',
      metadata: {
        sitrepCategory: incidentType,
        post: currentUser?.deploymentSite || 'Vision Plaza Gate'
      }
    });

    setIncidentDetails('');
    setTimeout(() => setIncidentSuccess(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded text-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-rose-800 font-bold bg-rose-100 px-2.5 py-0.5 rounded text-xs">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-amber-900 font-bold bg-amber-100 px-2.5 py-0.5 rounded text-xs">
            <Clock className="w-3 h-3 text-amber-700" />
            Pending Review
          </span>
        );
    }
  };

  const printLeaveSlip = (leave: LeaveRequest) => {
    logUserActivity({
      userId: leave.guardId,
      action: 'Clearance Pass Exported',
      category: 'leave',
      title: `Clearance Pass Exported: ${leave.leaveType}`,
      description: `Generated printable official clearance certificate for ${leave.startDate} to ${leave.endDate}.`,
      status: 'completed',
      metadata: {
        leaveId: leave.id,
        leaveType: leave.leaveType
      }
    });
    openDocPreview({
      title: `SUMICH SOLUTIONS - OFFICIAL LEAVE & OFF-DUTY CLEARANCE PASS`,
      applicantName: leave.guardName,
      fileName: `Leave_Pass_${leave.guardServiceNumber}_${leave.startDate}.pdf`,
      date: new Date().toLocaleDateString(),
      details: {
        guardServiceNo: leave.guardServiceNumber,
        deploymentSite: leave.deploymentSite,
        leaveCategory: leave.leaveType,
        period: `${leave.startDate} to ${leave.endDate} (${leave.daysCount} Days)`,
        status: leave.status.toUpperCase(),
        approvedBy: leave.approvedBy || 'Operations Director',
        reliefPersonnel: leave.reliefGuard || 'Assigned by Shift Supervisor'
      },
      content: `OFFICIAL LEAVE CLEARANCE CERTIFICATE
==================================================
This certifies that Security Officer ${leave.guardName} (Service No. ${leave.guardServiceNumber})
deployed at: ${leave.deploymentSite}
has been officially authorized for: ${leave.leaveType.toUpperCase()}
Effective Period: ${leave.startDate} to ${leave.endDate} (Total: ${leave.daysCount} Calendar Days).

Reason stated: ${leave.reason}
Relief Guard on Duty: ${leave.reliefGuard || 'Operational Roster Relief'}
Operations Directorate Remarks: ${leave.adminNotes || 'Approved under standard PSRA Kenyan Labor guidelines.'}

Officer must report back to duty on: ${new Date(new Date(leave.endDate).getTime() + 86400000).toISOString().split('T')[0]} at 06:00 Hours.
==================================================
Stamp of Operations & Duty Command: SUMICH SOLUTIONS LIMITED KENYA`
    });
  };

  // Calendar Generation Helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calYear = currentCalendarMonth.getFullYear();
  const calMonth = currentCalendarMonth.getMonth();
  const totalDays = daysInMonth(calYear, calMonth);
  const startDay = firstDayOfMonth(calYear, calMonth);
  const monthName = currentCalendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const isDateInLeave = (year: number, month: number, day: number) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return myLeaves.find(l => {
      const s = l.startDate;
      const e = l.endDate;
      return formatted >= s && formatted <= e;
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Guard Header Banner */}
        <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center border-2 border-white shadow">
              <Shield className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{currentUser?.name || 'Cpl. Peter Otieno'}</h1>
                <span className="text-xs bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded">
                  Active Guard Duty
                </span>
              </div>
              <div className="text-xs text-amber-400 font-mono mt-1">
                Service Force No: <strong className="text-white">{currentUser?.serviceNumber || 'SUM-GD-1042'}</strong>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Station: {currentUser?.deploymentSite || 'Vision Plaza Commercial Complex - Main Gate & Barrier'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('leave-system');
                setLeaveSubTab('request-form');
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>REQUEST TIME OFF / LEAVE</span>
            </button>
          </div>
        </div>

        {/* Primary Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('leave-system')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'leave-system' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Leave & Off-Duty Request System</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'activity' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Recent Activity Log</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Deployment & Shift Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('incident-log')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'incident-log' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Shift Incident SITREP Log</span>
          </button>
        </div>

        {/* 1. LEAVE & OFF-DUTY REQUEST MANAGEMENT SYSTEM (SPECIALLY REQUESTED) */}
        {activeTab === 'leave-system' && (
          <div className="space-y-6">
            {/* System Sub-Navigation */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
              <button
                onClick={() => setLeaveSubTab('status-table')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  leaveSubTab === 'status-table' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Status Tracking Table ({myLeaves.length})</span>
              </button>

              <button
                onClick={() => setLeaveSubTab('calendar-view')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  leaveSubTab === 'calendar-view' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Interactive Calendar View</span>
              </button>

              <button
                onClick={() => setLeaveSubTab('request-form')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  leaveSubTab === 'request-form' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Submit New Leave Form</span>
              </button>
            </div>

            {formSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* SUB-VIEW 1: STATUS TRACKING TABLE */}
            {leaveSubTab === 'status-table' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Leave & Off-Duty Applications Tracking
                    </h3>
                    <p className="text-xs text-slate-500">
                      Track approvals, rejection reasons, and print authorized leave pass certificates.
                    </p>
                  </div>
                  <button
                    onClick={() => setLeaveSubTab('request-form')}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs self-start"
                  >
                    + Request Time Off
                  </button>
                </div>

                {myLeaves.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500">
                    No leave or off-duty requests found. Click <strong>Submit New Leave Form</strong> to apply.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 uppercase border-y border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Leave Type</th>
                          <th className="px-4 py-3">Duration & Dates</th>
                          <th className="px-4 py-3">Days</th>
                          <th className="px-4 py-3">Relief Guard</th>
                          <th className="px-4 py-3">Reason</th>
                          <th className="px-4 py-3">Status Progress</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {myLeaves.map(leave => (
                          <tr key={leave.id} className="hover:bg-slate-50/70">
                            <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                              {leave.leaveType}
                            </td>
                            <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                              <div>{leave.startDate} to {leave.endDate}</div>
                              <div className="text-[10px] text-slate-400">
                                Applied: {new Date(leave.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                              {leave.daysCount} Day(s)
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">
                              {leave.reliefGuard || 'Field Roster Relief'}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate" title={leave.reason}>
                              {leave.reason}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              {getStatusBadge(leave.status)}
                              {leave.approvedBy && (
                                <div className="text-[10px] text-slate-500 mt-0.5">By: {leave.approvedBy}</div>
                              )}
                              {leave.adminNotes && (
                                <div className="text-[10px] text-amber-800 italic mt-0.5">"{leave.adminNotes}"</div>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              {leave.status === 'approved' && (
                                <button
                                  onClick={() => printLeaveSlip(leave)}
                                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded text-[11px] flex items-center gap-1 ml-auto"
                                  title="Print or Download Authorized Leave Clearance Pass"
                                >
                                  <Eye className="w-3 h-3 text-amber-400" />
                                  <span>View & Print Pass</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW 2: CALENDAR VIEW */}
            {leaveSubTab === 'calendar-view' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Leave & Off-Duty Roster Calendar
                    </h3>
                    <p className="text-xs text-slate-500">
                      Visual calendar showing your scheduled, approved, and pending time-off ranges.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentCalendarMonth(new Date(calYear, calMonth - 1, 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 min-w-[120px] text-center">
                      {monthName}
                    </span>
                    <button
                      onClick={() => setCurrentCalendarMonth(new Date(calYear, calMonth + 1, 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-7 bg-slate-100 text-center py-2 text-xs font-bold text-slate-700 border-b border-slate-200">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                  </div>

                  <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
                    {/* Blank leading slots */}
                    {[...Array(startDay)].map((_, idx) => (
                      <div key={`blank-${idx}`} className="h-24 bg-slate-50/50 p-2 text-slate-300"></div>
                    ))}

                    {/* Month Days */}
                    {[...Array(totalDays)].map((_, i) => {
                      const dayNumber = i + 1;
                      const activeLeave = isDateInLeave(calYear, calMonth, dayNumber);

                      let leaveBg = '';
                      let statusText = '';
                      if (activeLeave) {
                        if (activeLeave.status === 'approved') {
                          leaveBg = 'bg-emerald-50 border-emerald-300 text-emerald-900';
                          statusText = 'Approved';
                        } else if (activeLeave.status === 'rejected') {
                          leaveBg = 'bg-rose-50 border-rose-200 text-rose-900';
                          statusText = 'Rejected';
                        } else {
                          leaveBg = 'bg-amber-50 border-amber-300 text-amber-900';
                          statusText = 'Pending';
                        }
                      }

                      return (
                        <div
                          key={`day-${dayNumber}`}
                          className={`h-24 p-2 transition-colors relative flex flex-col justify-between ${
                            activeLeave ? `${leaveBg} border` : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{dayNumber}</span>
                            {activeLeave && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/80 shadow-2xs">
                                {statusText}
                              </span>
                            )}
                          </div>

                          {activeLeave && (
                            <div className="mt-1">
                              <div className="font-semibold text-[11px] truncate">{activeLeave.leaveType}</div>
                              <div className="text-[10px] opacity-80 truncate">{activeLeave.reason}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar Legend */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800">Legend:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span>Approved Off-Duty / Leave</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span>Pending Operations Review</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span>Rejected Request</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                    <span>Regular Guarding Roster</span>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: REQUEST TIME OFF FORM */}
            {leaveSubTab === 'request-form' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-2xl space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Submit Leave or Off-Duty Request
                  </h3>
                  <p className="text-xs text-slate-500">
                    All applications are automatically transmitted to the Mombasa Road Operations Directorate for relief officer scheduling.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleLeaveSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category of Leave <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={leaveType}
                        onChange={e => setLeaveType(e.target.value as LeaveType)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                      >
                        <option value="Annual Leave">Annual Leave (Statutory Vacation)</option>
                        <option value="Off-Duty Rotation">Off-Duty Rotation (Compensatory Rest)</option>
                        <option value="Compassionate Leave">Compassionate Leave (Family Emergency)</option>
                        <option value="Sick Leave">Sick Leave (Medical Treatment)</option>
                        <option value="Emergency Leave">Emergency Leave (Urgent Duty Exemption)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Start Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        End Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {startDate && endDate && (
                      <div className="sm:col-span-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold">
                        Total Duration: {calculateDays(startDate, endDate)} Calendar Day(s)
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Proposed Relief Guard / Shift Partner
                      </label>
                      <input
                        type="text"
                        value={reliefGuard}
                        onChange={e => setReliefGuard(e.target.value)}
                        placeholder="e.g. Guard Samuel Kiptoo (SUM-GD-1088) or Leave blank for Duty Officer assignment"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Reason for Leave / Off-Duty Application <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="State clearly the reason for absence, destination county if traveling, and emergency contact details..."
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setLeaveSubTab('status-table')}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-xs"
                    >
                      SUBMIT TO OPERATIONS
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 2. DEPLOYMENT & SHIFT OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Current Guarding Post
                </div>
                <h4 className="text-lg font-bold text-slate-900">Vision Plaza Commercial Complex</h4>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Zone: Mombasa Road Commercial Area</div>
                  <div>Station: Main Ingress Boom Barrier & Walkthrough Gate</div>
                  <div>Shift Hours: 06:00 Hours – 18:00 Hours (Day Roster)</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Supervisory Team
                </div>
                <h4 className="text-lg font-bold text-slate-900">Area Field Command</h4>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Patrol Officer: Inspector Julius Kiptanui</div>
                  <div>Emergency Radio Frequency: VHF Channel 4 (Sumich Base)</div>
                  <div>Patrol Car: Response Vehicle KDA 419P</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Equipment Issued
                </div>
                <h4 className="text-lg font-bold text-slate-900">Operational Kit</h4>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Electronic Patrol Wand: RFID Wand #W-88</div>
                  <div>Communication: Two-way VHF Handheld Radio</div>
                  <div>Protective Gear: High-Vis Reflective Vest & Whistle</div>
                </div>
              </div>
            </div>

            {/* Guard Activity Timeline on Overview */}
            <RecentActivityLog
              maxItems={3}
              onViewAll={() => setActiveTab('activity')}
              title="Recent Guarding & Duty Actions"
              subtitle="Audit log of your submitted leave forms, shift incident SITREPs, and operational clearances."
            />
          </div>
        )}

        {/* RECENT ACTIVITY FULL TAB */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <RecentActivityLog
              title="Guard & Officer Activity History"
              subtitle="Full chronological record of your duty assignments, leave requests, command approvals, incident SITREPs, and official passes."
              showFilters={true}
              showHeader={true}
            />
          </div>
        )}

        {/* 3. SHIFT INCIDENT SITREP LOG */}
        {activeTab === 'incident-log' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Guard Incident & SITREP Log</h3>
              <p className="text-xs text-slate-500">Transmit immediate incident observations directly to Vision Plaza 24/7 Command Room.</p>
            </div>

            {incidentSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                SITREP successfully transmitted to Command Desk!
              </div>
            )}

            <form onSubmit={handleIncidentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Category</label>
                <select
                  value={incidentType}
                  onChange={e => setIncidentType(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Routine Shift Log">Routine Shift Patrol - All Clear</option>
                  <option value="Unauthorized Ingress Attempt">Unauthorized Access Attempt</option>
                  <option value="Perimeter Fault">Perimeter Electric Fence / Barrier Malfunction</option>
                  <option value="Suspicious Vehicle">Suspicious Vehicle Loitering</option>
                  <option value="Medical Emergency">Medical First Aid Event</option>
                  <option value="Fire / Alarm Trigger">Fire Alarm or Sensor Activation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details & Actions Taken</label>
                <textarea
                  rows={4}
                  required
                  value={incidentDetails}
                  onChange={e => setIncidentDetails(e.target.value)}
                  placeholder="Report exact time, location on site, vehicle registration plate, or persons involved..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Situation Report</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
