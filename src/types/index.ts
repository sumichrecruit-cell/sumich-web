export type UserRole = 'client' | 'jobseeker' | 'guard' | 'admin';

export type AdminSubRole = 'super_admin' | 'recruitment_officer' | 'operations_officer' | 'content_manager';

export type UserStatus = 'active' | 'pending' | 'suspended' | 'deactivated';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subRole?: AdminSubRole;
  status: UserStatus;
  phone: string;
  idNumber?: string;
  serviceNumber?: string; // For guards (e.g. SUM-GD-1042)
  deploymentSite?: string; // For guards
  company?: string; // For clients
  location?: string;
  avatar?: string;
  createdAt: string;
}

export type QuoteStatus = 'pending' | 'under_review' | 'approved' | 'closed';

export interface QuoteRequest {
  id: string;
  userId?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  serviceType: string;
  location: string;
  preferredDate: string;
  securityRequirements: string;
  message?: string;
  estimatedBudget?: string;
  status: QuoteStatus;
  adminNotes?: string;
  createdAt: string;
}

export type AppointmentStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  purpose: string;
  message?: string;
  meetingLocation?: string;
  status: AppointmentStatus;
  adminNotes?: string;
  createdAt: string;
}

export type InquiryStatus = 'pending' | 'under_review' | 'resolved';

export interface Inquiry {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  response?: string;
  createdAt: string;
}

export type VacancyStatus = 'published' | 'closed' | 'draft';

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: 'Full-Time' | 'Contract' | 'Shift-Based';
  salaryRange: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  status: VacancyStatus;
  deadline: string;
  vacanciesCount: number;
  createdAt: string;
}

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface JobApplication {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  location: string;
  education: string;
  professionalQualifications: string;
  workExperience: string;
  positionAppliedFor: string;
  cvFileName: string;
  cvFileBase64?: string;
  cvFileType?: string;
  supportingDocName?: string;
  supportingDocBase64?: string;
  supportingDocType?: string;
  status: ApplicationStatus;
  adminNotes?: string;
  interviewDate?: string;
  createdAt: string;
}

export interface DocPreview {
  title: string;
  applicantName: string;
  content: string;
  fileName: string;
  type?: string;
  date?: string;
  details?: Record<string, string>;
  fileDataUrl?: string;
  fileType?: string;
  fileSize?: string;
  category?: string;
  autoPrint?: boolean;
}

export type DocumentCategory =
  | 'cv'
  | 'credential'
  | 'branding'
  | 'financial'
  | 'operations'
  | 'compliance'
  | 'other';

export interface UploadedDocument {
  id: string;
  name: string;
  fileName: string;
  category: DocumentCategory;
  fileDataUrl?: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  uploaderRole?: string;
  relatedEntityId?: string;
  description?: string;
  tags?: string[];
  contentTranscript?: string;
}

export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Compassionate Leave' | 'Off-Duty Rotation' | 'Emergency Leave';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  guardId: string;
  guardName: string;
  guardServiceNumber: string;
  deploymentSite: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  reliefGuard?: string;
  status: LeaveStatus;
  adminNotes?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface SecurityService {
  id: string;
  title: string;
  category: 'Physical Guarding' | 'Electronic Security' | 'Specialized Protection' | 'Consultancy';
  shortDescription: string;
  fullDescription: string;
  features: string[];
  idealFor: string;
  icon: string;
  active: boolean;
}

export interface NewsUpdate {
  id: string;
  title: string;
  category: 'Company News' | 'Security Advisory' | 'Community' | 'Compliance';
  summary: string;
  content: string;
  author: string;
  publishedDate: string;
  status: 'published' | 'draft';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  comment: string;
  rating: number;
  active: boolean;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  category: 'User' | 'Vacancy' | 'Application' | 'Quotation' | 'Appointment' | 'Leave' | 'Content' | 'Auth';
  details: string;
  timestamp: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  category: 'quote' | 'appointment' | 'application' | 'leave' | 'inquiry' | 'profile' | 'document' | 'system';
  title: string;
  description: string;
  status?: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'quote' | 'appointment' | 'application' | 'leave' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  logoDataUrl?: string;
  phones: string[];
  emergencyHotline: string;
  email: string;
  physicalAddress: string;
  postalAddress: string;
  psraLicenseNumber: string;
  workingHours: string;
  registrationNumber?: string;
  kraPin?: string;
  vatNumber?: string;
  website?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    swiftCode: string;
    mpesaPaybill: string;
    mpesaAccount: string;
  };
  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export type FormalQuotationStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export type QuotationTemplateType =
  | 'standard'
  | 'security_guarding'
  | 'corporate'
  | 'tender'
  | 'maintenance';

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string; // e.g. 'Guards/Month', 'Hours', 'Units', 'Site/Month', 'System'
  unitPrice: number;
  discountPercent: number;
  taxPercent: number; // e.g. 16 for Kenyan VAT, or 0
  lineTotal: number;
}

export interface QuotationAuditEntry {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  details: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface FormalQuotation {
  id: string;
  quotationNumber: string; // e.g. SUMICH/QTN/2026/0001
  clientId?: string;
  clientName: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  physicalAddress: string;
  postalAddress: string;
  quotationDate: string;
  expiryDate: string;
  projectTitle: string;
  serviceDescription: string;
  templateType: QuotationTemplateType;
  items: QuotationLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string; // 'KES'
  amountInWords: string;
  paymentTerms: string;
  deliveryTerms: string;
  specialConditions: string;
  notes: string;
  status: FormalQuotationStatus;
  approvalDetails?: {
    approvedBy: string;
    approverRole: string;
    approvedAt: string;
    comments?: string;
    signatureType: 'digital_seal' | 'canvas_draw' | 'uploaded_image';
    signatureData?: string;
  };
  clientResponse?: {
    action: 'accepted' | 'rejected';
    respondedAt: string;
    comments?: string;
    signedByName?: string;
  };
  sentHistory?: {
    sentAt: string;
    sentTo: string;
    cc?: string;
    subject: string;
    message: string;
  }[];
  auditTrail: QuotationAuditEntry[];
  isArchived?: boolean;
  convertedToInvoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoicePaymentStatus =
  | 'unpaid'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface PaymentReceipt {
  id: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'M-Pesa Paybill' | 'Bank Wire (RTGS/EFT)' | 'Cheque' | 'Cash Deposit';
  transactionReference: string;
  recordedBy: string;
  notes?: string;
  createdAt: string;
}

export interface FormalInvoice {
  id: string;
  invoiceNumber: string; // e.g. SUMICH/INV/2026/0001
  quotationId?: string;
  quotationNumber?: string;
  clientId?: string;
  clientName: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  physicalAddress: string;
  postalAddress: string;
  issueDate: string;
  dueDate: string;
  projectTitle: string;
  items: QuotationLineItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  amountInWords: string;
  paymentStatus: InvoicePaymentStatus;
  paymentTerms: string;
  notes: string;
  kraPin?: string;
  vatNumber?: string;
  payments: PaymentReceipt[];
  sentHistory?: {
    sentAt: string;
    sentTo: string;
    subject: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface QuotationBrandingSettings {
  companyName: string;
  tagline: string;
  registrationNumber: string;
  kraPin: string;
  vatNumber: string;
  physicalAddress: string;
  postalAddress: string;
  telephone: string;
  emergencyHotline: string;
  email: string;
  website: string;
  logoDataUrl?: string; // base64 or SVG
  logoPosition: 'left' | 'center' | 'right';
  logoWidthPx: number;
  useLetterhead: boolean;
  letterheadDataUrl?: string;
  letterheadMode: 'first_page' | 'all_pages';
  letterheadBackgroundFit: 'cover' | 'contain';
  accentColor: string; // default '#d97706' (amber-600)
  fontFamily: 'Inter, sans-serif' | 'Arial, sans-serif' | 'Georgia, serif' | 'Roboto, sans-serif';
  tableStyle: 'modern' | 'minimal' | 'bordered' | 'tactical_striped';
  pageMargins: 'normal' | 'compact' | 'spacious';
  footerText: string;
  defaultTerms: string;
  defaultPaymentTerms: string;
  defaultSpecialConditions: string;
  authorizedSignatoryName: string;
  authorizedSignatoryTitle: string;
  signatorySignatureUrl?: string;
  companyStampUrl?: string;
}

export interface QuotationNumberingConfig {
  prefix: string; // 'SUMICH/QTN'
  yearFormat: 'YYYY' | 'YY' | 'NONE';
  digits: number; // 4 -> 0001
  nextNumber: number;
  autoIncrement: boolean;
}

export interface InvoiceNumberingConfig {
  prefix: string; // 'SUMICH/INV'
  yearFormat: 'YYYY' | 'YY' | 'NONE';
  digits: number; // 4 -> 0001
  nextNumber: number;
  autoIncrement: boolean;
}

