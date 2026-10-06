import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { UploadedDocument, DocumentCategory } from '../../../types';
import {
  FileText,
  Upload,
  Download,
  Printer,
  Eye,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Shield,
  Image as ImageIcon,
  Clock,
  User,
  Plus,
  X,
  Grid,
  List,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { downloadUploadedFile, printUploadedFile } from '../../../utils/fileHelpers';

export const UploadedFilesManager: React.FC = () => {
  const {
    uploadedDocuments,
    addUploadedDocument,
    deleteUploadedDocument,
    openDocPreview,
    currentUser,
    companyInfo
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Upload Form State
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<DocumentCategory>('compliance');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [newDocTags, setNewDocTags] = useState('');
  const [uploadedFileObj, setUploadedFileObj] = useState<{
    name: string;
    size: string;
    type: string;
    base64?: string;
  } | null>(null);
  const [fileError, setFileError] = useState('');

  // Filtered Documents
  const filteredDocs = useMemo(() => {
    return uploadedDocuments.filter(doc => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.tags && doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [uploadedDocuments, searchQuery, selectedCategory]);

  // Statistics
  const stats = useMemo(() => {
    const total = uploadedDocuments.length;
    const cvs = uploadedDocuments.filter(d => d.category === 'cv').length;
    const creds = uploadedDocuments.filter(d => d.category === 'credential').length;
    const branding = uploadedDocuments.filter(d => d.category === 'branding').length;
    const compliance = uploadedDocuments.filter(d => d.category === 'compliance').length;
    const ops = uploadedDocuments.filter(d => d.category === 'operations' || d.category === 'financial').length;
    return { total, cvs, creds, branding, compliance, ops };
  }, [uploadedDocuments]);

  // File Upload Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10MB limit. Please upload a smaller file.');
      return;
    }

    setFileError('');
    const sizeInKb = (file.size / 1024).toFixed(0);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${sizeInKb} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFileObj({
        name: file.name,
        size: sizeStr,
        type: file.type || 'application/octet-stream',
        base64: reader.result as string
      });
      if (!newDocTitle) {
        // Auto-generate title from filename
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setNewDocTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileObj) {
      setFileError('Please select a file to upload.');
      return;
    }
    if (!newDocTitle.trim()) {
      setFileError('Please enter a document title.');
      return;
    }

    const tagsArray = newDocTags
      ? newDocTags.split(',').map(t => t.trim()).filter(Boolean)
      : [newDocCategory.toUpperCase()];

    addUploadedDocument({
      name: newDocTitle.trim(),
      fileName: uploadedFileObj.name,
      category: newDocCategory,
      fileDataUrl: uploadedFileObj.base64,
      fileType: uploadedFileObj.type,
      fileSize: uploadedFileObj.size,
      uploadedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System Administrator',
      uploaderRole: currentUser?.role || 'admin',
      description: newDocDescription.trim() || `Official document filed under ${newDocCategory}.`,
      tags: tagsArray,
      contentTranscript: `DOCUMENT: ${newDocTitle.trim()}
FILE NAME: ${uploadedFileObj.name}
CATEGORY: ${newDocCategory.toUpperCase()}
UPLOAD DATE: ${new Date().toLocaleString()}
SECURITY REGULATION: Registered under Sumich Solutions Limited document control.`
    });

    setStatusMessage({
      text: `Document "${newDocTitle}" successfully uploaded and indexed. Ready for viewing, download, and printing!`,
      type: 'success'
    });
    setTimeout(() => setStatusMessage(null), 4000);

    // Reset Form
    setNewDocTitle('');
    setNewDocDescription('');
    setNewDocTags('');
    setUploadedFileObj(null);
    setUploadModalOpen(false);
  };

  const handleDelete = (doc: UploadedDocument) => {
    if (window.confirm(`Are you sure you want to remove "${doc.name}" from the repository?`)) {
      const res = deleteUploadedDocument(doc.id);
      if (res.success) {
        setStatusMessage({ text: res.message, type: 'success' });
        setTimeout(() => setStatusMessage(null), 3000);
      }
    }
  };

  // Helper for opening in viewer
  const handleView = (doc: UploadedDocument) => {
    openDocPreview({
      title: doc.name,
      applicantName: doc.uploadedBy,
      fileName: doc.fileName,
      category: doc.category.toUpperCase(),
      fileDataUrl: doc.fileDataUrl,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      date: new Date(doc.uploadedAt).toLocaleDateString(),
      details: {
        documentId: doc.id,
        category: doc.category.toUpperCase(),
        fileSize: doc.fileSize,
        uploadedBy: doc.uploadedBy,
        uploadDate: new Date(doc.uploadedAt).toLocaleString(),
        fileType: doc.fileType
      },
      content: doc.contentTranscript || doc.description || `OFFICIAL REPOSITORY RECORD: ${doc.name}\nFile: ${doc.fileName}\nVerified by Sumich Solutions Limited Document Management System.`
    });
  };

  // Helper for direct download
  const handleDownload = (doc: UploadedDocument) => {
    downloadUploadedFile({
      fileDataUrl: doc.fileDataUrl,
      fileName: doc.fileName,
      content: doc.contentTranscript || doc.description,
      fileType: doc.fileType
    });
  };

  // Helper for direct print
  const handlePrint = (doc: UploadedDocument) => {
    printUploadedFile({
      fileDataUrl: doc.fileDataUrl,
      fileName: doc.fileName,
      title: doc.name,
      applicantName: doc.uploadedBy,
      category: doc.category.toUpperCase(),
      content: doc.contentTranscript || doc.description,
      details: {
        documentReference: doc.id,
        category: doc.category.toUpperCase(),
        fileSize: doc.fileSize,
        uploadedBy: doc.uploadedBy,
        uploadedDate: new Date(doc.uploadedAt).toLocaleString()
      }
    });
  };

  const getCategoryBadge = (cat: DocumentCategory) => {
    switch (cat) {
      case 'cv':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'credential':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'branding':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'compliance':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'operations':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'financial':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Central Document Management & File Registry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Official Uploaded Files & Credentials Repository
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Securely view, download, and print all organizational files—including candidate CVs, police clearance certificates, official logos, letterheads, regulatory licenses, and operational passes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Document</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Total Files</div>
            <div className="text-xl font-bold text-white tabular-nums mt-0.5">{stats.total}</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-blue-300 font-medium">Candidate CVs</div>
            <div className="text-xl font-bold text-blue-400 tabular-nums mt-0.5">{stats.cvs}</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-emerald-300 font-medium">Police & Vetting</div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">{stats.creds}</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-amber-300 font-medium">Brand & Logos</div>
            <div className="text-xl font-bold text-amber-400 tabular-nums mt-0.5">{stats.branding}</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-purple-300 font-medium">PSRA Compliance</div>
            <div className="text-xl font-bold text-purple-400 tabular-nums mt-0.5">{stats.compliance}</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-cyan-300 font-medium">Operations & Passes</div>
            <div className="text-xl font-bold text-cyan-400 tabular-nums mt-0.5">{stats.ops}</div>
          </div>
        </div>
      </div>

      {/* Notifications / Status Feedback */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="p-1 hover:bg-emerald-100 rounded text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Controls & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by filename, applicant, title or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'cv', label: 'CVs' },
            { id: 'credential', label: 'Credentials & Police' },
            { id: 'branding', label: 'Brand & Logos' },
            { id: 'compliance', label: 'Compliance' },
            { id: 'operations', label: 'Operations' },
            { id: 'financial', label: 'Contracts & SLA' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded text-xs font-medium ${
              viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Grid View"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs font-medium ${
              viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Table View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Files Display */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">No documents found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No files match your search "${searchQuery}". Try different keywords.`
              : 'No documents recorded in this category yet.'}
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload File Now</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => {
            const isImg = Boolean(
              (doc.fileDataUrl && doc.fileDataUrl.startsWith('data:image/')) ||
              doc.fileType.startsWith('image/') ||
              /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(doc.fileName)
            );

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top file meta */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shrink-0 border border-slate-800">
                        {isImg ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider mb-1 ${getCategoryBadge(
                            doc.category
                          )}`}
                        >
                          {doc.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {doc.name}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(doc)}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* File specs */}
                  <div className="bg-slate-50 rounded-xl p-3 text-[11px] space-y-1.5 border border-slate-100 my-3 font-mono">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>File:</span>
                      <strong className="text-slate-900 truncate max-w-[180px]">{doc.fileName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Size:</span>
                      <span className="text-slate-900 font-bold">{doc.fileSize}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Source:</span>
                      <span className="text-slate-800 font-sans truncate max-w-[180px]">{doc.uploadedBy}</span>
                    </div>
                  </div>

                  {doc.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                      {doc.description}
                    </p>
                  )}

                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {doc.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar: VIEW, DOWNLOAD, PRINT */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleView(doc)}
                    className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="View Full File in High-Res Modal"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Download Direct Binary File"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrint(doc)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Print Document on A4 Paper"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-600" />
                    <span className="sr-only sm:not-sr-only">Print</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Document Title</th>
                  <th className="px-4 py-3">File Name & Format</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Uploader / Subject</th>
                  <th className="px-4 py-3">Date & Size</th>
                  <th className="px-4 py-3 text-right">Actions (View / Download / Print)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{doc.description}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-slate-800 font-semibold">{doc.fileName}</div>
                      <div className="text-[10px] text-slate-400">{doc.fileType}</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getCategoryBadge(doc.category)}`}>
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{doc.uploadedBy}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{doc.uploaderRole}</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="text-slate-700">{new Date(doc.uploadedAt).toLocaleDateString()}</div>
                      <div className="font-mono text-[10px] text-slate-400">{doc.fileSize}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleView(doc)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="View Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(doc)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrint(doc)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Print Document"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-600" />
                          <span>Print</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer ml-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UPLOAD NEW DOCUMENT MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Upload New Document to Repository</h3>
                  <p className="text-xs text-slate-400">Add official files, credentials, or policies</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="p-6 space-y-4">
              {fileError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select File <span className="text-rose-500">* (PDF, PNG, JPG, SVG, DOC, DOCX up to 10MB)</span>
                </label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-5 text-center transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    id="doc-repo-upload"
                    accept=".pdf,.png,.jpg,.jpeg,.svg,.webp,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadedFileObj ? (
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">{uploadedFileObj.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {uploadedFileObj.size} &middot; {uploadedFileObj.type}
                      </div>
                      <span className="text-[10px] text-amber-600 font-semibold underline block pt-1">
                        Click or drag to replace file
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Click to browse or drop your document here
                      </div>
                      <div className="text-[11px] text-slate-500">
                        High-resolution scans, PDF credentials, and image certificates
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  placeholder="e.g., PSRA Regulatory Audit Certificate 2026"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={newDocCategory}
                    onChange={e => setNewDocCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
                  >
                    <option value="compliance">Compliance & Legal License</option>
                    <option value="credential">Vetting & Police Clearance</option>
                    <option value="cv">Recruitment & CV</option>
                    <option value="branding">Corporate Branding & Logos</option>
                    <option value="operations">Operations & Clearance Passes</option>
                    <option value="financial">Financial Contracts & SLA</option>
                    <option value="other">General Repository File</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Keywords / Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newDocTags}
                    onChange={e => setNewDocTags(e.target.value)}
                    placeholder="e.g. Audit, PSRA, Nairobi"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Summary / Notes
                </label>
                <textarea
                  value={newDocDescription}
                  onChange={e => setNewDocDescription(e.target.value)}
                  rows={2}
                  placeholder="Provide brief context on this document or verification remarks..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Footer action buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload & Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
