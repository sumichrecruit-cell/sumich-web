import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  AdminSubRole,
  UserStatus,
  CompanyInfo,
  SecurityService,
  JobVacancy,
  JobApplication,
  QuoteRequest,
  Appointment,
  Inquiry,
  LeaveRequest,
  LeaveStatus,
  Testimonial,
  NewsUpdate,
  AuditLog,
  Notification,
  UserActivity,
  FormalQuotation,
  FormalInvoice,
  QuotationAuditEntry,
  InvoicePaymentStatus,
  QuotationBrandingSettings,
  QuotationNumberingConfig,
  InvoiceNumberingConfig,
  PaymentReceipt,
  DocPreview,
  UploadedDocument
} from '../types';
import {
  INITIAL_COMPANY_INFO,
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_VACANCIES,
  INITIAL_APPLICATIONS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_QUOTES,
  INITIAL_APPOINTMENTS,
  INITIAL_INQUIRIES,
  INITIAL_TESTIMONIALS,
  INITIAL_NEWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER_ACTIVITIES,
  INITIAL_FORMAL_QUOTATIONS,
  INITIAL_FORMAL_INVOICES,
  INITIAL_QUOTATION_BRANDING,
  INITIAL_QUOTATION_NUMBERING,
  INITIAL_INVOICE_NUMBERING,
  INITIAL_UPLOADED_DOCUMENTS
} from '../data/initialData';
import {
  numberToKenyanShillingsWords,
  generateNextQuotationNumber,
  generateNextInvoiceNumber
} from '../utils/quotationUtils';

interface AppContextType {
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;

  // Active Auth & User
  currentUser: User | null;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  register: (userData: Partial<User> & { password?: string }) => { success: boolean; message?: string };
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;

  // Company Information
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: CompanyInfo) => void;

  // Services
  services: SecurityService[];
  updateService: (id: string, updates: Partial<SecurityService>) => void;
  addService: (service: SecurityService) => void;

  // Quotations
  quotes: QuoteRequest[];
  submitQuote: (quote: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>) => QuoteRequest;
  updateQuoteStatus: (id: string, status: QuoteRequest['status'], adminNotes?: string, estimatedBudget?: string) => void;

  // Appointments
  appointments: Appointment[];
  bookAppointment: (apt: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status'], adminNotes?: string) => void;

  // Inquiries
  inquiries: Inquiry[];
  submitInquiry: (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => Inquiry;
  respondInquiry: (id: string, response: string) => void;

  // Vacancies
  vacancies: JobVacancy[];
  addVacancy: (vacancy: Omit<JobVacancy, 'id' | 'createdAt'>) => void;
  updateVacancy: (id: string, updates: Partial<JobVacancy>) => void;
  deleteVacancy: (id: string) => void;

  // Applications
  applications: JobApplication[];
  submitApplication: (appData: Omit<JobApplication, 'id' | 'status' | 'createdAt'>) => { success: boolean; message: string };
  updateApplicationStatus: (id: string, status: JobApplication['status'], adminNotes?: string, interviewDate?: string) => void;

  // Leave & Off-Duty System (Guard Portal)
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => LeaveRequest;
  updateLeaveRequestStatus: (id: string, status: LeaveStatus, adminNotes?: string) => void;

  // Users Management
  users: User[];
  updateUserStatus: (id: string, status: UserStatus) => void;
  updateUserRole: (id: string, role: UserRole, subRole?: AdminSubRole) => void;
  deleteUser: (id: string) => void;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (test: Testimonial) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // News
  news: NewsUpdate[];
  addNews: (newsItem: NewsUpdate) => void;
  updateNews: (id: string, updates: Partial<NewsUpdate>) => void;
  deleteNews: (id: string) => void;

  // Audit Logs & Notifications
  auditLogs: AuditLog[];
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;

  // User-Facing Recent Activity History
  activities: UserActivity[];
  logUserActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => UserActivity;
  getUserActivities: (userId?: string) => UserActivity[];
  clearUserActivities: (userId?: string) => void;

  // Quotation Management System
  formalQuotations: FormalQuotation[];
  createFormalQuotation: (data: Partial<FormalQuotation>) => FormalQuotation;
  updateFormalQuotation: (id: string, updates: Partial<FormalQuotation>) => void;
  deleteFormalQuotation: (id: string) => { success: boolean; message: string };
  duplicateFormalQuotation: (id: string) => FormalQuotation;
  approveFormalQuotation: (id: string, comments?: string, signatureType?: any, signatureData?: string) => void;
  rejectFormalQuotation: (id: string, comments: string) => void;
  sendFormalQuotation: (id: string, emailDetails: { to: string; cc?: string; subject: string; message: string }) => void;
  clientRespondQuotation: (id: string, response: { action: 'accepted' | 'rejected'; comments?: string; signedByName?: string }) => void;
  archiveFormalQuotation: (id: string, isArchived: boolean) => void;
  convertQuotationToInvoice: (quotationId: string) => FormalInvoice;

  // Quotation Branding & Letterhead
  quotationBranding: QuotationBrandingSettings;
  updateQuotationBranding: (settings: Partial<QuotationBrandingSettings>) => void;

  // Quotation Numbering Config
  quotationNumbering: QuotationNumberingConfig;
  updateQuotationNumbering: (config: Partial<QuotationNumberingConfig>) => void;

  // Invoice Management System
  formalInvoices: FormalInvoice[];
  createFormalInvoice: (data: Partial<FormalInvoice>) => FormalInvoice;
  updateFormalInvoice: (id: string, updates: Partial<FormalInvoice>) => void;
  recordInvoicePayment: (invoiceId: string, payment: Omit<PaymentReceipt, 'id' | 'createdAt'>) => void;
  deleteFormalInvoice: (id: string) => { success: boolean; message: string };
  invoiceNumbering: InvoiceNumberingConfig;
  updateInvoiceNumbering: (config: Partial<InvoiceNumberingConfig>) => void;

  // Modals
  quoteModalOpen: boolean;
  setQuoteModalOpen: (open: boolean) => void;
  selectedServiceForQuote: string;
  setSelectedServiceForQuote: (srv: string) => void;

  appointmentModalOpen: boolean;
  setAppointmentModalOpen: (open: boolean) => void;

  callModalOpen: boolean;
  setCallModalOpen: (open: boolean) => void;

  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authInitialMode: 'signin' | 'register';
  setAuthInitialMode: (mode: 'signin' | 'register') => void;
  authInitialRole: UserRole;
  setAuthInitialRole: (role: UserRole) => void;

  jobAppModalOpen: boolean;
  setJobAppModalOpen: (open: boolean) => void;
  selectedVacancyForApp: JobVacancy | null;
  setSelectedVacancyForApp: (v: JobVacancy | null) => void;

  docViewerModalOpen: boolean;
  setDocViewerModalOpen: (open: boolean) => void;
  activeDocPreview: DocPreview | null;
  openDocPreview: (doc: DocPreview) => void;

  // Uploaded Documents & File Repository
  uploadedDocuments: UploadedDocument[];
  addUploadedDocument: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => UploadedDocument;
  deleteUploadedDocument: (id: string) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | null>(null);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`sumich_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage ${key}:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`sumich_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error writing localStorage ${key}:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => loadStorage('company', INITIAL_COMPANY_INFO));
  const [users, setUsers] = useState<User[]>(() => loadStorage('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = loadStorage<User | null>('currentUser', null);
    if (savedUser) return savedUser;
    // Default to visitor/logged out or null
    return null;
  });

  const [services, setServices] = useState<SecurityService[]>(() => loadStorage('services', INITIAL_SERVICES));
  const [vacancies, setVacancies] = useState<JobVacancy[]>(() => loadStorage('vacancies', INITIAL_VACANCIES));
  const [applications, setApplications] = useState<JobApplication[]>(() => loadStorage('applications', INITIAL_APPLICATIONS));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => loadStorage('leaves', INITIAL_LEAVE_REQUESTS));
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => loadStorage('quotes', INITIAL_QUOTES));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadStorage('appointments', INITIAL_APPOINTMENTS));
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => loadStorage('inquiries', INITIAL_INQUIRIES));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadStorage('testimonials', INITIAL_TESTIMONIALS));
  const [news, setNews] = useState<NewsUpdate[]>(() => loadStorage('news', INITIAL_NEWS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStorage('auditLogs', INITIAL_AUDIT_LOGS));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadStorage('notifications', INITIAL_NOTIFICATIONS));
  const [activities, setActivities] = useState<UserActivity[]>(() => loadStorage('userActivities', INITIAL_USER_ACTIVITIES));

  // Formal Quotation & Invoicing System State
  const [formalQuotations, setFormalQuotations] = useState<FormalQuotation[]>(() =>
    loadStorage('formalQuotations', INITIAL_FORMAL_QUOTATIONS)
  );
  const [quotationBranding, setQuotationBranding] = useState<QuotationBrandingSettings>(() =>
    loadStorage('quotationBranding', INITIAL_QUOTATION_BRANDING)
  );
  const [quotationNumbering, setQuotationNumbering] = useState<QuotationNumberingConfig>(() =>
    loadStorage('quotationNumbering', INITIAL_QUOTATION_NUMBERING)
  );
  const [formalInvoices, setFormalInvoices] = useState<FormalInvoice[]>(() =>
    loadStorage('formalInvoices', INITIAL_FORMAL_INVOICES)
  );
  const [invoiceNumbering, setInvoiceNumbering] = useState<InvoiceNumberingConfig>(() =>
    loadStorage('invoiceNumbering', INITIAL_INVOICE_NUMBERING)
  );

  // Uploaded Documents & File Repository
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>(() =>
    loadStorage('uploadedDocuments', INITIAL_UPLOADED_DOCUMENTS)
  );

  // Modal States
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState('Security Guarding Services');
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'register'>('signin');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('client');
  const [jobAppModalOpen, setJobAppModalOpen] = useState(false);
  const [selectedVacancyForApp, setSelectedVacancyForApp] = useState<JobVacancy | null>(null);
  const [docViewerModalOpen, setDocViewerModalOpen] = useState(false);
  const [activeDocPreview, setActiveDocPreview] = useState<DocPreview | null>(null);

  // Sync to localStorage
  useEffect(() => saveStorage('company', companyInfo), [companyInfo]);
  useEffect(() => saveStorage('users', users), [users]);
  useEffect(() => saveStorage('currentUser', currentUser), [currentUser]);
  useEffect(() => saveStorage('services', services), [services]);
  useEffect(() => saveStorage('vacancies', vacancies), [vacancies]);
  useEffect(() => saveStorage('applications', applications), [applications]);
  useEffect(() => saveStorage('leaves', leaveRequests), [leaveRequests]);
  useEffect(() => saveStorage('quotes', quotes), [quotes]);
  useEffect(() => saveStorage('appointments', appointments), [appointments]);
  useEffect(() => saveStorage('inquiries', inquiries), [inquiries]);
  useEffect(() => saveStorage('testimonials', testimonials), [testimonials]);
  useEffect(() => saveStorage('news', news), [news]);
  useEffect(() => saveStorage('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => saveStorage('notifications', notifications), [notifications]);
  useEffect(() => saveStorage('userActivities', activities), [activities]);
  useEffect(() => saveStorage('formalQuotations', formalQuotations), [formalQuotations]);
  useEffect(() => saveStorage('quotationBranding', quotationBranding), [quotationBranding]);
  useEffect(() => saveStorage('quotationNumbering', quotationNumbering), [quotationNumbering]);
  useEffect(() => saveStorage('formalInvoices', formalInvoices), [formalInvoices]);
  useEffect(() => saveStorage('invoiceNumbering', invoiceNumbering), [invoiceNumbering]);
  useEffect(() => saveStorage('uploadedDocuments', uploadedDocuments), [uploadedDocuments]);

  const logAudit = (action: string, category: AuditLog['category'], details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId: currentUser ? currentUser.id : 'system',
      actorName: currentUser ? currentUser.name : 'Public Visitor',
      action,
      category,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const notifyUser = (userId: string, title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const logUserActivity = (data: Omit<UserActivity, 'id' | 'timestamp'>): UserActivity => {
    const newActivity: UserActivity = {
      ...data,
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
    return newActivity;
  };

  const getUserActivities = (userId?: string) => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return [];
    return activities.filter(a => a.userId === targetId);
  };

  const clearUserActivities = (userId?: string) => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return;
    setActivities(prev => prev.filter(a => a.userId !== targetId));
  };

  // Auth Methods
  const login = (email: string) => {
    const found = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, message: 'Account not found with this email. Please check your credentials or register.' };
    }
    if (found.status === 'suspended' || found.status === 'deactivated') {
      return { success: false, message: `Your account has been ${found.status}. Please contact Sumich administration.` };
    }
    setCurrentUser(found);
    logAudit('User Login', 'Auth', `${found.name} signed in successfully.`);
    logUserActivity({
      userId: found.id,
      action: 'Account Sign In',
      category: 'profile',
      title: 'Portal Access Authenticated',
      description: `Signed in as ${found.name} (${found.role.toUpperCase()}).`,
      status: 'completed'
    });

    // Route appropriately based on user role
    if (found.role === 'admin') {
      setCurrentView('admin-portal');
    } else if (found.role === 'client') {
      setCurrentView('client-dashboard');
    } else if (found.role === 'jobseeker') {
      setCurrentView('seeker-dashboard');
    } else if (found.role === 'guard') {
      setCurrentView('guard-dashboard');
    }

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      logAudit('User Logout', 'Auth', `${currentUser.name} logged out.`);
    }
    setCurrentUser(null);
    setCurrentView('home');
  };

  const register = (userData: Partial<User>) => {
    const emailExists = users.some(u => u.email.trim().toLowerCase() === (userData.email || '').trim().toLowerCase());
    if (emailExists) {
      return { success: false, message: 'An account with this email address already exists. Please sign in instead.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email || '',
      role: userData.role || 'client',
      subRole: userData.subRole,
      status: userData.role === 'guard' ? 'active' : 'active',
      phone: userData.phone || '',
      idNumber: userData.idNumber,
      serviceNumber: userData.serviceNumber || (userData.role === 'guard' ? `SUM-GD-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      deploymentSite: userData.deploymentSite || (userData.role === 'guard' ? 'Mombasa Road Commercial Station' : undefined),
      company: userData.company,
      location: userData.location || 'Nairobi, Kenya',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    logAudit('User Registration', 'User', `New ${newUser.role} account registered: ${newUser.name} (${newUser.email}).`);
    logUserActivity({
      userId: newUser.id,
      action: 'Account Registration',
      category: 'profile',
      title: 'Sumich Portal Account Created',
      description: `Welcome to Sumich Solutions! Your ${newUser.role} credentials are active.`,
      status: 'completed'
    });

    notifyUser(
      newUser.id,
      'Welcome to Sumich Solutions Limited',
      `Welcome ${newUser.name}! Your account is active. Explore our guarding services and portal tools.`,
      'system'
    );

    if (newUser.role === 'admin') setCurrentView('admin-portal');
    else if (newUser.role === 'client') setCurrentView('client-dashboard');
    else if (newUser.role === 'jobseeker') setCurrentView('seeker-dashboard');
    else if (newUser.role === 'guard') setCurrentView('guard-dashboard');

    return { success: true };
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'admin') setCurrentView('admin-portal');
      else if (user.role === 'client') setCurrentView('client-dashboard');
      else if (user.role === 'jobseeker') setCurrentView('seeker-dashboard');
      else if (user.role === 'guard') setCurrentView('guard-dashboard');
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    logAudit('Profile Update', 'User', `${currentUser.name} updated their profile settings.`);
    logUserActivity({
      userId: currentUser.id,
      action: 'Profile Settings Updated',
      category: 'profile',
      title: 'Profile Information Updated',
      description: 'Modified personal and corporate contact details in profile settings.',
      status: 'completed'
    });
  };

  // Quotation Management
  const submitQuote = (data: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>) => {
    const newQuote: QuoteRequest = {
      ...data,
      id: `quot-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setQuotes(prev => [newQuote, ...prev]);

    logAudit('Quotation Submitted', 'Quotation', `New quotation request received from ${data.name} for ${data.serviceType}.`);

    if (data.userId) {
      notifyUser(
        data.userId,
        'Quotation Request Received',
        `Your quote request for ${data.serviceType} has been received. Our security estimator will review it shortly.`,
        'quote'
      );
      logUserActivity({
        userId: data.userId,
        action: 'Quotation Request Submitted',
        category: 'quote',
        title: `Quotation Requested: ${data.serviceType}`,
        description: `Submitted quotation request for ${data.serviceType} at ${data.location}. Preferred start: ${data.preferredDate}.`,
        status: 'pending',
        metadata: {
          quoteId: newQuote.id,
          serviceType: data.serviceType,
          location: data.location,
          budget: data.estimatedBudget || 'Under appraisal'
        }
      });
    }
    return newQuote;
  };

  const updateQuoteStatus = (id: string, status: QuoteRequest['status'], adminNotes?: string, estimatedBudget?: string) => {
    setQuotes(prev =>
      prev.map(q => {
        if (q.id === id) {
          const updated = {
            ...q,
            status,
            ...(adminNotes !== undefined ? { adminNotes } : {}),
            ...(estimatedBudget !== undefined ? { estimatedBudget } : {})
          };
          if (q.userId) {
            notifyUser(
              q.userId,
              `Quotation Status: ${status.toUpperCase().replace('_', ' ')}`,
              `Your quotation request for ${q.serviceType} is now ${status.replace('_', ' ')}. ${adminNotes ? `Note: ${adminNotes}` : ''}`,
              'quote'
            );
            logUserActivity({
              userId: q.userId,
              action: 'Quotation Status Updated',
              category: 'quote',
              title: `Quotation ${status.toUpperCase().replace('_', ' ')}: ${q.serviceType}`,
              description: `Status updated to ${status.replace('_', ' ')}.${adminNotes ? ` Note: ${adminNotes}` : ''}${estimatedBudget ? ` Budget: ${estimatedBudget}` : ''}`,
              status,
              metadata: {
                quoteId: q.id,
                serviceType: q.serviceType,
                budget: estimatedBudget || q.estimatedBudget || 'N/A'
              }
            });
          }
          return updated;
        }
        return q;
      })
    );
    logAudit('Quotation Status Updated', 'Quotation', `Quotation ${id} status set to ${status}.`);
  };

  // Appointment Management
  const bookAppointment = (data: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApt, ...prev]);
    logAudit('Appointment Booked', 'Appointment', `Appointment scheduled by ${data.name} for ${data.preferredDate}.`);

    if (data.userId) {
      notifyUser(
        data.userId,
        'Appointment Request Pending',
        `Your appointment booking for ${data.preferredDate} at ${data.preferredTime} has been submitted for confirmation.`,
        'appointment'
      );
      logUserActivity({
        userId: data.userId,
        action: 'Appointment Booked',
        category: 'appointment',
        title: `Appointment Booked: ${data.purpose}`,
        description: `Scheduled consultation for ${data.preferredDate} at ${data.preferredTime}.`,
        status: 'pending',
        metadata: {
          appointmentId: newApt.id,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          venue: data.meetingLocation || 'Sumich Operations HQ'
        }
      });
    }
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status'], adminNotes?: string) => {
    setAppointments(prev =>
      prev.map(a => {
        if (a.id === id) {
          const updated = {
            ...a,
            status,
            ...(adminNotes !== undefined ? { adminNotes } : {})
          };
          if (a.userId) {
            notifyUser(
              a.userId,
              `Appointment ${status.toUpperCase()}`,
              `Your security appointment on ${a.preferredDate} has been ${status}. ${adminNotes ? `Admin notes: ${adminNotes}` : ''}`,
              'appointment'
            );
            logUserActivity({
              userId: a.userId,
              action: 'Appointment Status Updated',
              category: 'appointment',
              title: `Appointment ${status.toUpperCase()}: ${a.purpose}`,
              description: `Appointment on ${a.preferredDate} marked as ${status}.${adminNotes ? ` Details: ${adminNotes}` : ''}`,
              status,
              metadata: {
                appointmentId: a.id,
                preferredDate: a.preferredDate
              }
            });
          }
          return updated;
        }
        return a;
      })
    );
    logAudit('Appointment Updated', 'Appointment', `Appointment ${id} marked as ${status}.`);
  };

  // Inquiry Management
  const submitInquiry = (data: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
    const newInq: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setInquiries(prev => [newInq, ...prev]);
    logAudit('Client Inquiry', 'Content', `New inquiry from ${data.name}: ${data.subject}.`);
    if (data.userId) {
      logUserActivity({
        userId: data.userId,
        action: 'Inquiry Submitted',
        category: 'inquiry',
        title: `Inquiry Submitted: ${data.subject}`,
        description: data.message.length > 80 ? `${data.message.substring(0, 80)}...` : data.message,
        status: 'pending',
        metadata: {
          inquiryId: newInq.id,
          subject: data.subject
        }
      });
    }
    return newInq;
  };

  const respondInquiry = (id: string, response: string) => {
    setInquiries(prev =>
      prev.map(inq => {
        if (inq.id === id) {
          if (inq.userId) {
            notifyUser(
              inq.userId,
              `Reply to Inquiry: ${inq.subject}`,
              `Sumich Solutions has responded to your inquiry: "${response}"`,
              'system'
            );
            logUserActivity({
              userId: inq.userId,
              action: 'Inquiry Response Received',
              category: 'inquiry',
              title: `Inquiry Resolved: ${inq.subject}`,
              description: `Sumich client team replied: "${response}"`,
              status: 'resolved',
              metadata: {
                inquiryId: inq.id,
                subject: inq.subject
              }
            });
          }
          return { ...inq, response, status: 'resolved' };
        }
        return inq;
      })
    );
    logAudit('Inquiry Response', 'Content', `Replied to inquiry ${id}.`);
  };

  // Vacancy Management
  const addVacancy = (vData: Omit<JobVacancy, 'id' | 'createdAt'>) => {
    const newVac: JobVacancy = {
      ...vData,
      id: `vac-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setVacancies(prev => [newVac, ...prev]);
    logAudit('Vacancy Created', 'Vacancy', `Published new vacancy: ${newVac.title}.`);
  };

  const updateVacancy = (id: string, updates: Partial<JobVacancy>) => {
    setVacancies(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
    logAudit('Vacancy Updated', 'Vacancy', `Updated vacancy ${id}.`);
  };

  const deleteVacancy = (id: string) => {
    setVacancies(prev => prev.filter(v => v.id !== id));
    logAudit('Vacancy Removed', 'Vacancy', `Removed vacancy ${id}.`);
  };

  // Job Applications
  const submitApplication = (appData: Omit<JobApplication, 'id' | 'status' | 'createdAt'>) => {
    const alreadyApplied = applications.some(
      a => a.vacancyId === appData.vacancyId && (a.userId === appData.userId || a.email.toLowerCase() === appData.email.toLowerCase())
    );

    if (alreadyApplied) {
      return { success: false, message: 'You have already submitted an application for this vacancy. Duplicate submissions are not allowed.' };
    }

    const newApp: JobApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    logAudit('Application Submitted', 'Application', `${appData.fullName} applied for ${appData.positionAppliedFor}.`);

    notifyUser(
      appData.userId,
      'Application Submitted Successfully',
      `Your application for ${appData.positionAppliedFor} was received. Application ID: ${newApp.id}`,
      'application'
    );

    logUserActivity({
      userId: appData.userId,
      action: 'Job Application Submitted',
      category: 'application',
      title: `Applied: ${appData.positionAppliedFor}`,
      description: `Submitted application dossier for ${appData.positionAppliedFor}. Document: ${appData.cvFileName}.`,
      status: 'pending',
      metadata: {
        applicationId: newApp.id,
        position: appData.positionAppliedFor,
        vacancyId: appData.vacancyId,
        cvFileName: appData.cvFileName
      }
    });

    // Automatically index uploaded files into uploadedDocuments repository
    if (appData.cvFileName) {
      const cvDoc: UploadedDocument = {
        id: `doc-${Date.now()}-cv`,
        name: `Curriculum Vitae - ${appData.fullName}`,
        fileName: appData.cvFileName,
        category: 'cv',
        fileDataUrl: appData.cvFileBase64,
        fileType: appData.cvFileType || 'application/pdf',
        fileSize: '1.2 MB',
        uploadedAt: new Date().toISOString(),
        uploadedBy: `${appData.fullName} (Job Seeker)`,
        uploaderRole: 'jobseeker',
        relatedEntityId: newApp.id,
        description: `Candidate CV submitted for ${appData.positionAppliedFor}.`,
        tags: ['CV', 'Recruitment', appData.positionAppliedFor, appData.fullName],
        contentTranscript: `CANDIDATE: ${appData.fullName}
ID NUMBER: ${appData.idNumber}
PHONE: ${appData.phone}
EMAIL: ${appData.email}
LOCATION: ${appData.location}
EDUCATION: ${appData.education}
QUALIFICATIONS: ${appData.professionalQualifications}
EXPERIENCE: ${appData.workExperience}`
      };
      setUploadedDocuments(prev => [cvDoc, ...prev]);
    }

    if (appData.supportingDocName) {
      const suppDoc: UploadedDocument = {
        id: `doc-${Date.now()}-supp`,
        name: `Supporting Credential - ${appData.fullName}`,
        fileName: appData.supportingDocName,
        category: 'credential',
        fileDataUrl: appData.supportingDocBase64,
        fileType: appData.supportingDocType || 'application/pdf',
        fileSize: '890 KB',
        uploadedAt: new Date().toISOString(),
        uploadedBy: `${appData.fullName} (Job Seeker)`,
        uploaderRole: 'jobseeker',
        relatedEntityId: newApp.id,
        description: `Police Clearance or Academic Credential for ${appData.fullName}.`,
        tags: ['Credential', 'Police Clearance', 'Vetting', appData.fullName]
      };
      setUploadedDocuments(prev => [suppDoc, ...prev]);
    }

    return { success: true, message: 'Application submitted successfully! You can track its status in your dashboard.' };
  };

  const updateApplicationStatus = (id: string, status: JobApplication['status'], adminNotes?: string, interviewDate?: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === id) {
          const updated = {
            ...app,
            status,
            ...(adminNotes !== undefined ? { adminNotes } : {}),
            ...(interviewDate !== undefined ? { interviewDate } : {})
          };
          notifyUser(
            app.userId,
            `Application Status: ${status.toUpperCase()}`,
            `Your application for ${app.positionAppliedFor} is now ${status.replace('_', ' ')}. ${adminNotes ? `Notes: ${adminNotes}` : ''} ${interviewDate ? `Interview scheduled: ${new Date(interviewDate).toLocaleDateString()}` : ''}`,
            'application'
          );
          logUserActivity({
            userId: app.userId,
            action: 'Application Status Updated',
            category: 'application',
            title: `Application ${status.toUpperCase().replace('_', ' ')}: ${app.positionAppliedFor}`,
            description: `Application status moved to ${status.replace('_', ' ')}.${interviewDate ? ` Interview scheduled for ${new Date(interviewDate).toLocaleDateString()}.` : ''}${adminNotes ? ` Note: ${adminNotes}` : ''}`,
            status,
            metadata: {
              applicationId: app.id,
              position: app.positionAppliedFor,
              interviewDate: interviewDate || ''
            }
          });
          return updated;
        }
        return app;
      })
    );
    logAudit('Application Status Updated', 'Application', `Application ${id} status set to ${status}.`);
  };

  // Leave & Off-Duty Request Management for Guards (Specially Requested)
  const submitLeaveRequest = (reqData: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => {
    const newLeave: LeaveRequest = {
      ...reqData,
      id: `lev-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
    logAudit('Leave Request', 'Leave', `${reqData.guardName} (${reqData.guardServiceNumber}) applied for ${reqData.daysCount} days of ${reqData.leaveType}.`);

    notifyUser(
      reqData.guardId,
      'Leave Request Submitted',
      `Your ${reqData.leaveType} application for ${reqData.startDate} to ${reqData.endDate} (${reqData.daysCount} days) is pending review by Operations Directorate.`,
      'leave'
    );

    logUserActivity({
      userId: reqData.guardId,
      action: 'Leave Request Submitted',
      category: 'leave',
      title: `Leave Request: ${reqData.leaveType} (${reqData.daysCount} Days)`,
      description: `Applied for ${reqData.daysCount} days of ${reqData.leaveType} (${reqData.startDate} to ${reqData.endDate}). Reason: ${reqData.reason}`,
      status: 'pending',
      metadata: {
        leaveId: newLeave.id,
        leaveType: reqData.leaveType,
        startDate: reqData.startDate,
        endDate: reqData.endDate,
        reliefGuard: reqData.reliefGuard || 'To be assigned'
      }
    });

    return newLeave;
  };

  const updateLeaveRequestStatus = (id: string, status: LeaveStatus, adminNotes?: string) => {
    setLeaveRequests(prev =>
      prev.map(lev => {
        if (lev.id === id) {
          const approverName = currentUser ? currentUser.name : 'Operations Officer';
          const updated: LeaveRequest = {
            ...lev,
            status,
            approvedBy: approverName,
            ...(adminNotes !== undefined ? { adminNotes } : {})
          };
          notifyUser(
            lev.guardId,
            `Leave Request ${status.toUpperCase()}`,
            `Your request for ${lev.leaveType} (${lev.startDate} to ${lev.endDate}) has been ${status.toUpperCase()} by ${approverName}. ${adminNotes ? `Admin notes: ${adminNotes}` : ''}`,
            'leave'
          );
          logUserActivity({
            userId: lev.guardId,
            action: 'Leave Request Status Updated',
            category: 'leave',
            title: `Leave ${status.toUpperCase()}: ${lev.leaveType}`,
            description: `Request for ${lev.leaveType} (${lev.startDate} to ${lev.endDate}) was ${status.toUpperCase()} by ${approverName}.${adminNotes ? ` Remarks: ${adminNotes}` : ''}`,
            status,
            metadata: {
              leaveId: lev.id,
              leaveType: lev.leaveType,
              approvedBy: approverName
            }
          });
          return updated;
        }
        return lev;
      })
    );
    logAudit('Leave Approval Action', 'Leave', `Leave request ${id} updated to ${status}.`);
  };

  // User Management
  const updateUserStatus = (id: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, status } : u)));
    logAudit('User Status Change', 'User', `User ${id} status changed to ${status}.`);
  };

  const updateUserRole = (id: string, role: UserRole, subRole?: AdminSubRole) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, role, subRole } : u)));
    logAudit('User Role Change', 'User', `User ${id} role changed to ${role}${subRole ? ` (${subRole})` : ''}.`);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    logAudit('User Deleted', 'User', `Deleted user ${id}.`);
  };

  // Content Management
  const updateCompanyInfo = (info: CompanyInfo) => {
    setCompanyInfo(info);
    logAudit('Company Info Updated', 'Content', `Updated company contact and details.`);
  };

  const updateService = (id: string, updates: Partial<SecurityService>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logAudit('Service Updated', 'Content', `Updated service details for ${id}.`);
  };

  const addService = (service: SecurityService) => {
    setServices(prev => [...prev, service]);
    logAudit('Service Added', 'Content', `Added new service: ${service.title}.`);
  };

  const addTestimonial = (test: Testimonial) => {
    setTestimonials(prev => [...prev, test]);
    logAudit('Testimonial Added', 'Content', `Added client testimonial from ${test.name}.`);
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    logAudit('Testimonial Updated', 'Content', `Updated testimonial ${id}.`);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    logAudit('Testimonial Deleted', 'Content', `Removed testimonial ${id}.`);
  };

  const addNews = (newsItem: NewsUpdate) => {
    setNews(prev => [newsItem, ...prev]);
    logAudit('News Published', 'Content', `Published news: ${newsItem.title}.`);
  };

  const updateNews = (id: string, updates: Partial<NewsUpdate>) => {
    setNews(prev => prev.map(n => (n.id === id ? { ...n, ...updates } : n)));
    logAudit('News Updated', 'Content', `Updated news item ${id}.`);
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
    logAudit('News Deleted', 'Content', `Deleted news item ${id}.`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const unreadCount = currentUser ? notifications.filter(n => n.userId === currentUser.id && !n.isRead).length : 0;

  const openDocPreview = (doc: DocPreview) => {
    setActiveDocPreview(doc);
    setDocViewerModalOpen(true);
  };

  const addUploadedDocument = (docData: Omit<UploadedDocument, 'id' | 'uploadedAt'>): UploadedDocument => {
    const newDoc: UploadedDocument = {
      ...docData,
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      uploadedAt: new Date().toISOString()
    };
    setUploadedDocuments(prev => [newDoc, ...prev]);
    logAudit('Document Uploaded', 'Content', `Uploaded document: ${newDoc.name} (${newDoc.fileName}).`);
    return newDoc;
  };

  const deleteUploadedDocument = (id: string) => {
    const docToDelete = uploadedDocuments.find(d => d.id === id);
    if (!docToDelete) {
      return { success: false, message: 'Document not found.' };
    }
    setUploadedDocuments(prev => prev.filter(d => d.id !== id));
    logAudit('Document Deleted', 'Content', `Deleted uploaded document: ${docToDelete.name} (${docToDelete.fileName}).`);
    return { success: true, message: `Document "${docToDelete.name}" successfully removed.` };
  };

  // Quotation Management System Operations
  const createFormalQuotation = (data: Partial<FormalQuotation>): FormalQuotation => {
    const qtnNumber = data.quotationNumber || generateNextQuotationNumber(
      quotationNumbering.prefix,
      quotationNumbering.yearFormat,
      quotationNumbering.digits,
      quotationNumbering.nextNumber
    );

    const items = data.items || [];
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    const computedItems = items.map(item => {
      const gross = item.quantity * item.unitPrice;
      const discount = gross * ((item.discountPercent || 0) / 100);
      const afterDiscount = gross - discount;
      const tax = afterDiscount * ((item.taxPercent || 0) / 100);
      const lineTotal = afterDiscount;
      subtotal += lineTotal;
      discountTotal += discount;
      taxTotal += tax;
      return {
        ...item,
        lineTotal
      };
    });

    const grandTotal = Math.round(subtotal + taxTotal);
    const amountInWords = numberToKenyanShillingsWords(grandTotal);

    const now = new Date().toISOString();
    const actorName = currentUser ? currentUser.name : 'System Administrator';
    const actorRole = currentUser?.subRole || currentUser?.role || 'Admin';

    const newQuotation: FormalQuotation = {
      id: `qtn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      quotationNumber: qtnNumber,
      clientId: data.clientId,
      clientName: data.clientName || 'Valued Client',
      companyName: data.companyName || 'Corporate Client',
      contactPerson: data.contactPerson || data.clientName || 'Client Representative',
      email: data.email || '',
      phone: data.phone || '',
      physicalAddress: data.physicalAddress || 'Nairobi, Kenya',
      postalAddress: data.postalAddress || 'P.O. Box, Nairobi',
      quotationDate: data.quotationDate || new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      projectTitle: data.projectTitle || 'Security Guarding & Tactical Surveillance Proposal',
      serviceDescription: data.serviceDescription || 'Supply of professional security services in compliance with PSRA regulations.',
      templateType: data.templateType || 'standard',
      items: computedItems,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      currency: 'KES',
      amountInWords,
      paymentTerms: data.paymentTerms || quotationBranding.defaultPaymentTerms,
      deliveryTerms: data.deliveryTerms || 'Immediate deployment upon contract execution.',
      specialConditions: data.specialConditions || quotationBranding.defaultSpecialConditions,
      notes: data.notes || '',
      status: data.status || 'draft',
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          action: data.status === 'approved' ? 'Quotation Created & Approved' : 'Quotation Created as Draft',
          actorName,
          actorRole,
          timestamp: now,
          details: `Quotation ${qtnNumber} created for ${data.companyName || data.clientName}. Total value: KES ${grandTotal.toLocaleString()}`
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    setFormalQuotations(prev => [newQuotation, ...prev]);

    if (quotationNumbering.autoIncrement) {
      setQuotationNumbering(prev => ({
        ...prev,
        nextNumber: prev.nextNumber + 1
      }));
    }

    logAudit('Quotation Created', 'Quotation', `Created formal quotation ${qtnNumber} for ${newQuotation.companyName}.`);

    if (data.clientId) {
      logUserActivity({
        userId: data.clientId,
        action: 'Formal Quotation Prepared',
        category: 'quote',
        title: `Quotation Prepared: ${qtnNumber}`,
        description: `Sumich operations generated formal quotation ${qtnNumber} (${newQuotation.projectTitle}) for KES ${grandTotal.toLocaleString()}.`,
        status: newQuotation.status,
        metadata: {
          quotationId: newQuotation.id,
          quotationNumber: qtnNumber,
          grandTotal: String(grandTotal)
        }
      });
    }

    return newQuotation;
  };

  const updateFormalQuotation = (id: string, updates: Partial<FormalQuotation>) => {
    setFormalQuotations(prev =>
      prev.map(q => {
        if (q.id === id) {
          let items = updates.items || q.items;
          let subtotal = 0;
          let discountTotal = 0;
          let taxTotal = 0;

          const computedItems = items.map(item => {
            const gross = item.quantity * item.unitPrice;
            const discount = gross * ((item.discountPercent || 0) / 100);
            const afterDiscount = gross - discount;
            const tax = afterDiscount * ((item.taxPercent || 0) / 100);
            const lineTotal = afterDiscount;
            subtotal += lineTotal;
            discountTotal += discount;
            taxTotal += tax;
            return {
              ...item,
              lineTotal
            };
          });

          const grandTotal = Math.round(subtotal + taxTotal);
          const amountInWords = numberToKenyanShillingsWords(grandTotal);

          const actorName = currentUser ? currentUser.name : 'System Administrator';
          const actorRole = currentUser?.subRole || currentUser?.role || 'Admin';
          const now = new Date().toISOString();

          const newAudit: QuotationAuditEntry = {
            id: `aud-${Date.now()}`,
            action: 'Quotation Updated',
            actorName,
            actorRole,
            timestamp: now,
            details: `Quotation details or line items modified by ${actorName}.`
          };

          return {
            ...q,
            ...updates,
            items: computedItems,
            subtotal,
            discountTotal,
            taxTotal,
            grandTotal,
            amountInWords,
            auditTrail: [newAudit, ...(q.auditTrail || [])],
            updatedAt: now
          };
        }
        return q;
      })
    );
    logAudit('Quotation Updated', 'Quotation', `Updated quotation ${id}.`);
  };

  const deleteFormalQuotation = (id: string): { success: boolean; message: string } => {
    const target = formalQuotations.find(q => q.id === id);
    if (!target) return { success: false, message: 'Quotation not found.' };

    const isSuperAdmin = currentUser?.subRole === 'super_admin';
    if (target.status !== 'draft' && !isSuperAdmin) {
      return {
        success: false,
        message: 'Only Draft quotations can be deleted. Approved or finalized quotations require Super Admin authority.'
      };
    }

    setFormalQuotations(prev => prev.filter(q => q.id !== id));
    logAudit('Quotation Deleted', 'Quotation', `Deleted quotation ${target.quotationNumber} (${target.companyName}).`);
    return { success: true, message: `Quotation ${target.quotationNumber} deleted successfully.` };
  };

  const duplicateFormalQuotation = (id: string): FormalQuotation => {
    const source = formalQuotations.find(q => q.id === id);
    if (!source) throw new Error('Quotation not found');

    const nextSeq = quotationNumbering.nextNumber;
    const newNumber = generateNextQuotationNumber(
      quotationNumbering.prefix,
      quotationNumbering.yearFormat,
      quotationNumbering.digits,
      nextSeq
    );

    const now = new Date().toISOString();
    const actorName = currentUser ? currentUser.name : 'System Administrator';

    const cloned: FormalQuotation = {
      ...source,
      id: `qtn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      quotationNumber: newNumber,
      status: 'draft',
      quotationDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      approvalDetails: undefined,
      clientResponse: undefined,
      sentHistory: [],
      isArchived: false,
      convertedToInvoiceId: undefined,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          action: 'Quotation Duplicated',
          actorName,
          actorRole: currentUser?.subRole || 'Admin',
          timestamp: now,
          details: `Duplicated from existing quotation ${source.quotationNumber}. New reference: ${newNumber}.`
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    setFormalQuotations(prev => [cloned, ...prev]);
    if (quotationNumbering.autoIncrement) {
      setQuotationNumbering(prev => ({ ...prev, nextNumber: prev.nextNumber + 1 }));
    }

    logAudit('Quotation Duplicated', 'Quotation', `Duplicated ${source.quotationNumber} into new draft ${newNumber}.`);
    return cloned;
  };

  const approveFormalQuotation = (
    id: string,
    comments?: string,
    signatureType: 'digital_seal' | 'canvas_draw' | 'uploaded_image' = 'digital_seal',
    signatureData?: string
  ) => {
    const actorName = currentUser ? currentUser.name : 'Kennedy Omondi';
    const actorRole = currentUser?.subRole === 'super_admin' ? 'Managing Director & CEO' : 'Operations Director';
    const now = new Date().toISOString();

    setFormalQuotations(prev =>
      prev.map(q => {
        if (q.id === id) {
          const audit: QuotationAuditEntry = {
            id: `aud-${Date.now()}`,
            action: 'Quotation Approved',
            actorName,
            actorRole,
            timestamp: now,
            details: `Formally reviewed and approved by ${actorName}. ${comments ? `Remarks: ${comments}` : ''}`,
            previousStatus: q.status,
            newStatus: 'approved'
          };

          if (q.clientId) {
            notifyUser(
              q.clientId,
              'Quotation Approved & Available',
              `Your quotation ${q.quotationNumber} for ${q.projectTitle} has been authorized and is ready for your review.`,
              'quote'
            );
            logUserActivity({
              userId: q.clientId,
              action: 'Quotation Approved by Management',
              category: 'quote',
              title: `Quotation Approved: ${q.quotationNumber}`,
              description: `Quotation ${q.quotationNumber} (${q.companyName}) has been officially authorized by ${actorName}.`,
              status: 'approved',
              metadata: {
                quotationId: q.id,
                quotationNumber: q.quotationNumber
              }
            });
          }

          return {
            ...q,
            status: 'approved',
            approvalDetails: {
              approvedBy: actorName,
              approverRole: actorRole,
              approvedAt: now,
              comments: comments || 'Approved for client dispatch.',
              signatureType,
              signatureData: signatureData || quotationBranding.signatorySignatureUrl
            },
            auditTrail: [audit, ...(q.auditTrail || [])],
            updatedAt: now
          };
        }
        return q;
      })
    );

    logAudit('Quotation Approved', 'Quotation', `Quotation ${id} approved by ${actorName}.`);
  };

  const rejectFormalQuotation = (id: string, comments: string) => {
    const actorName = currentUser ? currentUser.name : 'Operations Reviewer';
    const now = new Date().toISOString();

    setFormalQuotations(prev =>
      prev.map(q => {
        if (q.id === id) {
          const audit: QuotationAuditEntry = {
            id: `aud-${Date.now()}`,
            action: 'Quotation Rejected',
            actorName,
            actorRole: currentUser?.subRole || 'Admin',
            timestamp: now,
            details: `Quotation rejected. Reason: ${comments}`,
            previousStatus: q.status,
            newStatus: 'rejected'
          };
          return {
            ...q,
            status: 'rejected',
            auditTrail: [audit, ...(q.auditTrail || [])],
            updatedAt: now
          };
        }
        return q;
      })
    );
    logAudit('Quotation Rejected', 'Quotation', `Quotation ${id} marked rejected. Reason: ${comments}`);
  };

  const sendFormalQuotation = (
    id: string,
    emailDetails: { to: string; cc?: string; subject: string; message: string }
  ) => {
    const now = new Date().toISOString();
    const actorName = currentUser ? currentUser.name : 'Sales Operations Desk';

    setFormalQuotations(prev =>
      prev.map(q => {
        if (q.id === id) {
          const audit: QuotationAuditEntry = {
            id: `aud-${Date.now()}`,
            action: 'Quotation Dispatched to Client',
            actorName,
            actorRole: currentUser?.subRole || 'Admin',
            timestamp: now,
            details: `Formal quotation PDF emailed to ${emailDetails.to}${emailDetails.cc ? ` (CC: ${emailDetails.cc})` : ''}. Subject: "${emailDetails.subject}"`,
            previousStatus: q.status,
            newStatus: 'sent'
          };

          const newHistory = [
            ...(q.sentHistory || []),
            {
              sentAt: now,
              sentTo: emailDetails.to,
              cc: emailDetails.cc,
              subject: emailDetails.subject,
              message: emailDetails.message
            }
          ];

          if (q.clientId) {
            notifyUser(
              q.clientId,
              'New Quotation Dispatched',
              `Quotation ${q.quotationNumber} has been dispatched to your email (${emailDetails.to}). Review online in your client portal.`,
              'quote'
            );
            logUserActivity({
              userId: q.clientId,
              action: 'Quotation Received',
              category: 'quote',
              title: `Formal Quotation Sent: ${q.quotationNumber}`,
              description: `Quotation ${q.quotationNumber} was delivered to ${emailDetails.to}.`,
              status: 'sent',
              metadata: {
                quotationId: q.id,
                quotationNumber: q.quotationNumber
              }
            });
          }

          return {
            ...q,
            status: 'sent',
            sentHistory: newHistory,
            auditTrail: [audit, ...(q.auditTrail || [])],
            updatedAt: now
          };
        }
        return q;
      })
    );

    logAudit('Quotation Emailed', 'Quotation', `Sent quotation ${id} to ${emailDetails.to}.`);
  };

  const clientRespondQuotation = (
    id: string,
    response: { action: 'accepted' | 'rejected'; comments?: string; signedByName?: string }
  ) => {
    const now = new Date().toISOString();
    const clientName = response.signedByName || currentUser?.name || 'Authorized Client Representative';

    setFormalQuotations(prev =>
      prev.map(q => {
        if (q.id === id) {
          const status = response.action === 'accepted' ? 'accepted' : 'rejected';
          const audit: QuotationAuditEntry = {
            id: `aud-${Date.now()}`,
            action: response.action === 'accepted' ? 'Quotation Accepted by Client' : 'Quotation Declined by Client',
            actorName: clientName,
            actorRole: 'Client Representative',
            timestamp: now,
            details: `Client submitted electronic response (${response.action.toUpperCase()}). Comments: ${response.comments || 'No comments provided.'}`,
            previousStatus: q.status,
            newStatus: status
          };

          users.filter(u => u.role === 'admin').forEach(adminUser => {
            notifyUser(
              adminUser.id,
              `Quotation ${response.action.toUpperCase()}: ${q.quotationNumber}`,
              `${q.companyName} (${clientName}) has ${response.action.toUpperCase()} quotation ${q.quotationNumber} (KES ${q.grandTotal.toLocaleString()}).`,
              'quote'
            );
          });

          if (q.clientId) {
            logUserActivity({
              userId: q.clientId,
              action: `Quotation ${response.action === 'accepted' ? 'Accepted' : 'Declined'}`,
              category: 'quote',
              title: `Quotation ${response.action.toUpperCase()}: ${q.quotationNumber}`,
              description: `You have electronically ${response.action} quotation ${q.quotationNumber} for ${q.companyName}.`,
              status,
              metadata: {
                quotationId: q.id,
                quotationNumber: q.quotationNumber,
                comments: response.comments || ''
              }
            });
          }

          return {
            ...q,
            status,
            clientResponse: {
              action: response.action,
              respondedAt: now,
              comments: response.comments,
              signedByName: clientName
            },
            auditTrail: [audit, ...(q.auditTrail || [])],
            updatedAt: now
          };
        }
        return q;
      })
    );

    logAudit('Client Quotation Response', 'Quotation', `Client ${response.action} quotation ${id}.`);
  };

  const archiveFormalQuotation = (id: string, isArchived: boolean) => {
    setFormalQuotations(prev =>
      prev.map(q => (q.id === id ? { ...q, isArchived, updatedAt: new Date().toISOString() } : q))
    );
    logAudit('Quotation Archive Status', 'Quotation', `Quotation ${id} archive status set to ${isArchived}.`);
  };

  const convertQuotationToInvoice = (quotationId: string): FormalInvoice => {
    const qtn = formalQuotations.find(q => q.id === quotationId);
    if (!qtn) throw new Error('Quotation not found');

    const invNumber = generateNextInvoiceNumber(
      invoiceNumbering.prefix,
      invoiceNumbering.yearFormat,
      invoiceNumbering.digits,
      invoiceNumbering.nextNumber
    );

    const now = new Date().toISOString();
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const newInvoice: FormalInvoice = {
      id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      invoiceNumber: invNumber,
      quotationId: qtn.id,
      quotationNumber: qtn.quotationNumber,
      clientId: qtn.clientId,
      clientName: qtn.clientName,
      companyName: qtn.companyName,
      contactPerson: qtn.contactPerson,
      email: qtn.email,
      phone: qtn.phone,
      physicalAddress: qtn.physicalAddress,
      postalAddress: qtn.postalAddress,
      issueDate: today,
      dueDate,
      projectTitle: qtn.projectTitle,
      items: qtn.items,
      subtotal: qtn.subtotal,
      taxTotal: qtn.taxTotal,
      discountTotal: qtn.discountTotal,
      grandTotal: qtn.grandTotal,
      amountPaid: 0,
      balanceDue: qtn.grandTotal,
      currency: 'KES',
      amountInWords: qtn.amountInWords,
      paymentStatus: 'unpaid',
      paymentTerms: qtn.paymentTerms,
      notes: `Generated from accepted quotation ${qtn.quotationNumber}.`,
      kraPin: quotationBranding.kraPin,
      vatNumber: quotationBranding.vatNumber,
      payments: [],
      createdAt: now,
      updatedAt: now
    };

    setFormalInvoices(prev => [newInvoice, ...prev]);

    setFormalQuotations(prev =>
      prev.map(q => (q.id === quotationId ? { ...q, convertedToInvoiceId: newInvoice.id } : q))
    );

    if (invoiceNumbering.autoIncrement) {
      setInvoiceNumbering(prev => ({ ...prev, nextNumber: prev.nextNumber + 1 }));
    }

    logAudit('Invoice Created From Quotation', 'Quotation', `Generated invoice ${invNumber} from quotation ${qtn.quotationNumber}.`);
    return newInvoice;
  };

  const createFormalInvoice = (data: Partial<FormalInvoice>): FormalInvoice => {
    const invNumber = data.invoiceNumber || generateNextInvoiceNumber(
      invoiceNumbering.prefix,
      invoiceNumbering.yearFormat,
      invoiceNumbering.digits,
      invoiceNumbering.nextNumber
    );

    const items = data.items || [];
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    const computedItems = items.map(item => {
      const gross = item.quantity * item.unitPrice;
      const discount = gross * ((item.discountPercent || 0) / 100);
      const afterDiscount = gross - discount;
      const tax = afterDiscount * ((item.taxPercent || 0) / 100);
      const lineTotal = afterDiscount;
      subtotal += lineTotal;
      discountTotal += discount;
      taxTotal += tax;
      return { ...item, lineTotal };
    });

    const grandTotal = Math.round(subtotal + taxTotal);
    const amountPaid = data.amountPaid || 0;
    const balanceDue = grandTotal - amountPaid;
    const paymentStatus: InvoicePaymentStatus =
      balanceDue <= 0 ? 'paid' : amountPaid > 0 ? 'partially_paid' : 'unpaid';

    const now = new Date().toISOString();
    const newInvoice: FormalInvoice = {
      id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      invoiceNumber: invNumber,
      quotationId: data.quotationId,
      quotationNumber: data.quotationNumber,
      clientId: data.clientId,
      clientName: data.clientName || 'Client Name',
      companyName: data.companyName || 'Company Name',
      contactPerson: data.contactPerson || data.clientName || 'Contact Person',
      email: data.email || '',
      phone: data.phone || '',
      physicalAddress: data.physicalAddress || 'Nairobi, Kenya',
      postalAddress: data.postalAddress || 'P.O. Box, Nairobi',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      projectTitle: data.projectTitle || 'Security Services Invoice',
      items: computedItems,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      amountPaid,
      balanceDue,
      currency: 'KES',
      amountInWords: numberToKenyanShillingsWords(grandTotal),
      paymentStatus,
      paymentTerms: data.paymentTerms || quotationBranding.defaultPaymentTerms,
      notes: data.notes || '',
      kraPin: data.kraPin || quotationBranding.kraPin,
      vatNumber: data.vatNumber || quotationBranding.vatNumber,
      payments: data.payments || [],
      createdAt: now,
      updatedAt: now
    };

    setFormalInvoices(prev => [newInvoice, ...prev]);
    if (invoiceNumbering.autoIncrement) {
      setInvoiceNumbering(prev => ({ ...prev, nextNumber: prev.nextNumber + 1 }));
    }

    logAudit('Invoice Created', 'Quotation', `Created formal invoice ${invNumber} for ${newInvoice.companyName}.`);
    return newInvoice;
  };

  const updateFormalInvoice = (id: string, updates: Partial<FormalInvoice>) => {
    setFormalInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          const items = updates.items || inv.items;
          let subtotal = 0;
          let discountTotal = 0;
          let taxTotal = 0;

          const computedItems = items.map(item => {
            const gross = item.quantity * item.unitPrice;
            const discount = gross * ((item.discountPercent || 0) / 100);
            const afterDiscount = gross - discount;
            const tax = afterDiscount * ((item.taxPercent || 0) / 100);
            const lineTotal = afterDiscount;
            subtotal += lineTotal;
            discountTotal += discount;
            taxTotal += tax;
            return { ...item, lineTotal };
          });

          const grandTotal = Math.round(subtotal + taxTotal);
          const amountPaid = updates.amountPaid !== undefined ? updates.amountPaid : inv.amountPaid;
          const balanceDue = grandTotal - amountPaid;
          const paymentStatus: InvoicePaymentStatus =
            balanceDue <= 0 ? 'paid' : amountPaid > 0 ? 'partially_paid' : 'unpaid';

          return {
            ...inv,
            ...updates,
            items: computedItems,
            subtotal,
            discountTotal,
            taxTotal,
            grandTotal,
            amountPaid,
            balanceDue,
            paymentStatus,
            amountInWords: numberToKenyanShillingsWords(grandTotal),
            updatedAt: new Date().toISOString()
          };
        }
        return inv;
      })
    );
    logAudit('Invoice Updated', 'Quotation', `Updated invoice ${id}.`);
  };

  const recordInvoicePayment = (
    invoiceId: string,
    payment: Omit<PaymentReceipt, 'id' | 'createdAt'>
  ) => {
    const now = new Date().toISOString();
    const newReceipt: PaymentReceipt = {
      ...payment,
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now
    };

    setFormalInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          const newPayments = [...inv.payments, newReceipt];
          const newAmountPaid = newPayments.reduce((acc, p) => acc + p.amount, 0);
          const newBalanceDue = Math.max(0, inv.grandTotal - newAmountPaid);
          const newStatus: InvoicePaymentStatus =
            newBalanceDue <= 0 ? 'paid' : 'partially_paid';

          if (inv.clientId) {
            notifyUser(
              inv.clientId,
              'Payment Receipt Acknowledged',
              `Payment of KES ${payment.amount.toLocaleString()} (Ref: ${payment.transactionReference}) received for invoice ${inv.invoiceNumber}. Remaining balance: KES ${newBalanceDue.toLocaleString()}.`,
              'quote'
            );
          }

          return {
            ...inv,
            payments: newPayments,
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue,
            paymentStatus: newStatus,
            updatedAt: now
          };
        }
        return inv;
      })
    );

    logAudit('Invoice Payment Recorded', 'Quotation', `Recorded payment of KES ${payment.amount} for invoice ${invoiceId}. Ref: ${payment.transactionReference}`);
  };

  const deleteFormalInvoice = (id: string): { success: boolean; message: string } => {
    const target = formalInvoices.find(i => i.id === id);
    if (!target) return { success: false, message: 'Invoice not found.' };

    const isSuperAdmin = currentUser?.subRole === 'super_admin';
    if (target.paymentStatus === 'paid' && !isSuperAdmin) {
      return { success: false, message: 'Paid invoices cannot be deleted without Super Admin authorization.' };
    }

    setFormalInvoices(prev => prev.filter(i => i.id !== id));
    logAudit('Invoice Deleted', 'Quotation', `Deleted invoice ${target.invoiceNumber}.`);
    return { success: true, message: `Invoice ${target.invoiceNumber} deleted successfully.` };
  };

  const updateQuotationBranding = (settings: Partial<QuotationBrandingSettings>) => {
    setQuotationBranding(prev => ({ ...prev, ...settings }));
    logAudit('Quotation Branding Updated', 'Content', 'Quotation letterhead and branding settings updated.');
  };

  const updateQuotationNumbering = (config: Partial<QuotationNumberingConfig>) => {
    setQuotationNumbering(prev => ({ ...prev, ...config }));
    logAudit('Quotation Numbering Config Updated', 'Content', 'Quotation numbering format updated.');
  };

  const updateInvoiceNumbering = (config: Partial<InvoiceNumberingConfig>) => {
    setInvoiceNumbering(prev => ({ ...prev, ...config }));
    logAudit('Invoice Numbering Config Updated', 'Content', 'Invoice numbering format updated.');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        login,
        logout,
        register,
        switchUser,
        updateProfile,
        companyInfo,
        updateCompanyInfo,
        services,
        updateService,
        addService,
        quotes,
        submitQuote,
        updateQuoteStatus,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        inquiries,
        submitInquiry,
        respondInquiry,
        vacancies,
        addVacancy,
        updateVacancy,
        deleteVacancy,
        applications,
        submitApplication,
        updateApplicationStatus,
        leaveRequests,
        submitLeaveRequest,
        updateLeaveRequestStatus,
        users,
        updateUserStatus,
        updateUserRole,
        deleteUser,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        news,
        addNews,
        updateNews,
        deleteNews,
        auditLogs,
        notifications,
        markNotificationRead,
        unreadCount,

        activities,
        logUserActivity,
        getUserActivities,
        clearUserActivities,

        // Quotations
        formalQuotations,
        createFormalQuotation,
        updateFormalQuotation,
        deleteFormalQuotation,
        duplicateFormalQuotation,
        approveFormalQuotation,
        rejectFormalQuotation,
        sendFormalQuotation,
        clientRespondQuotation,
        archiveFormalQuotation,
        convertQuotationToInvoice,
        quotationBranding,
        updateQuotationBranding,
        quotationNumbering,
        updateQuotationNumbering,

        // Invoices
        formalInvoices,
        createFormalInvoice,
        updateFormalInvoice,
        recordInvoicePayment,
        deleteFormalInvoice,
        invoiceNumbering,
        updateInvoiceNumbering,

        quoteModalOpen,
        setQuoteModalOpen,
        selectedServiceForQuote,
        setSelectedServiceForQuote,
        appointmentModalOpen,
        setAppointmentModalOpen,
        callModalOpen,
        setCallModalOpen,
        authModalOpen,
        setAuthModalOpen,
        authInitialMode,
        setAuthInitialMode,
        authInitialRole,
        setAuthInitialRole,
        jobAppModalOpen,
        setJobAppModalOpen,
        selectedVacancyForApp,
        setSelectedVacancyForApp,
        docViewerModalOpen,
        setDocViewerModalOpen,
        activeDocPreview,
        openDocPreview,

        // Uploaded Documents
        uploadedDocuments,
        addUploadedDocument,
        deleteUploadedDocument
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
