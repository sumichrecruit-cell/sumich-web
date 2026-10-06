import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Briefcase, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const JobApplicationModal: React.FC = () => {
  const {
    jobAppModalOpen,
    setJobAppModalOpen,
    selectedVacancyForApp,
    submitApplication,
    currentUser,
    setAuthModalOpen,
    setAuthInitialMode,
    setAuthInitialRole
  } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    location: '',
    education: '',
    professionalQualifications: '',
    workExperience: '',
    positionAppliedFor: ''
  });

  const [cvFile, setCvFile] = useState<{ name: string; base64: string; type: string } | null>(null);
  const [docFile, setDocFile] = useState<{ name: string; base64: string; type: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (jobAppModalOpen) {
      setSubmitted(false);
      setError('');
      setFormData({
        fullName: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        idNumber: currentUser?.idNumber || '',
        location: currentUser?.location || 'Nairobi, Kenya',
        education: 'KCSE Certificate',
        professionalQualifications: 'PSRA Registration / Security Training Certificate',
        workExperience: '2 Years Guarding Experience',
        positionAppliedFor: selectedVacancyForApp?.title || 'Professional Security Guard'
      });
      // Default sample CV file for instant ease of testing
      setCvFile({
        name: `${currentUser?.name?.replace(/\s+/g, '_') || 'Applicant'}_Curriculum_Vitae.pdf`,
        base64: 'SAMPLE_PDF_DATA',
        type: 'application/pdf'
      });
      setDocFile({
        name: 'Certificate_Good_Conduct_2026.pdf',
        base64: 'SAMPLE_DOC_DATA',
        type: 'application/pdf'
      });
    }
  }, [jobAppModalOpen, selectedVacancyForApp, currentUser]);

  if (!jobAppModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isDoc = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (isDoc) {
        setDocFile({ name: file.name, base64, type: file.type });
      } else {
        setCvFile({ name: file.name, base64, type: file.type });
      }
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.idNumber || !formData.location || !formData.positionAppliedFor) {
      setError('Please fill in all mandatory application fields.');
      return;
    }

    if (!cvFile) {
      setError('Please attach your Curriculum Vitae (CV) in PDF, Word, or text format.');
      return;
    }

    const res = submitApplication({
      vacancyId: selectedVacancyForApp?.id || `vac-custom-${Date.now()}`,
      vacancyTitle: formData.positionAppliedFor,
      userId: currentUser?.id || `usr-guest-${Date.now()}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      idNumber: formData.idNumber,
      location: formData.location,
      education: formData.education,
      professionalQualifications: formData.professionalQualifications,
      workExperience: formData.workExperience,
      positionAppliedFor: formData.positionAppliedFor,
      cvFileName: cvFile.name,
      cvFileBase64: cvFile.base64,
      cvFileType: cvFile.type,
      supportingDocName: docFile?.name,
      supportingDocBase64: docFile?.base64
    });

    if (!res.success) {
      setError(res.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Sumich Recruitment Application</h3>
              <p className="text-xs text-slate-400">Position: {formData.positionAppliedFor}</p>
            </div>
          </div>
          <button
            onClick={() => setJobAppModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Application Submitted Successfully!</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you <strong className="text-slate-900">{formData.fullName}</strong>. Your application for <strong className="text-amber-600">{formData.positionAppliedFor}</strong> has been transmitted to the Sumich HR & Recruitment Directorate. Our vetting officers will review your qualifications and contact you.
              </p>

              {!currentUser && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 max-w-md mx-auto">
                  Tip: Register a free <strong>Job Seeker Account</strong> using your email (<code>{formData.email}</code>) to track your application progress in real-time!
                </div>
              )}

              <div className="pt-4 flex items-center justify-center gap-3">
                {!currentUser && (
                  <button
                    onClick={() => {
                      setJobAppModalOpen(false);
                      setAuthInitialMode('register');
                      setAuthInitialRole('jobseeker');
                      setAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 shadow-sm"
                  >
                    Create Job Seeker Account
                  </button>
                )}
                <button
                  onClick={() => setJobAppModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Kiprotich Cheruiyot"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. applicant@gmail.com"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0722 000 000"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    National ID / Passport Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.idNumber}
                    onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                    placeholder="e.g. 30192847"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Residential Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Embakasi / Nairobi East"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Highest Education Attainment <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.education}
                    onChange={e => setFormData({ ...formData, education: e.target.value })}
                    placeholder="e.g. KCSE Grade C- (2021)"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Qualifications / Certifications
                  </label>
                  <input
                    type="text"
                    value={formData.professionalQualifications}
                    onChange={e => setFormData({ ...formData, professionalQualifications: e.target.value })}
                    placeholder="e.g. PSRA Guard Force Registration, NYS Certificate, First Aid, Fire Safety..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Relevant Work Experience
                  </label>
                  <textarea
                    rows={2}
                    value={formData.workExperience}
                    onChange={e => setFormData({ ...formData, workExperience: e.target.value })}
                    placeholder="Briefly state previous security, military, guarding, or customer service experience..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* CV Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Curriculum Vitae (CV) <span className="text-rose-500">* (Max 5MB: PDF, DOC, DOCX)</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-amber-500 transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="cv-upload-input"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={e => handleFileUpload(e, false)}
                      className="hidden"
                    />
                    <label htmlFor="cv-upload-input" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <Upload className="w-5 h-5 text-slate-400" />
                      <div className="text-xs font-semibold text-slate-800">
                        {cvFile ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> {cvFile.name} (Attached)
                          </span>
                        ) : (
                          'Click to browse or upload your CV document'
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">Supported formats: PDF, DOCX, DOC (Up to 5MB)</span>
                    </label>
                  </div>
                </div>

                {/* Supporting Documents */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supporting Document (Certificate of Good Conduct, PSRA card, etc.)
                  </label>
                  <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>{docFile ? docFile.name : 'No file selected yet'}</span>
                    </div>
                    <label className="cursor-pointer px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold text-slate-800">
                      Browse File
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        onChange={e => handleFileUpload(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setJobAppModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-sm"
                >
                  SUBMIT APPLICATION
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
