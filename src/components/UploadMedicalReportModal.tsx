import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileTextIcon,
  ImageIcon,
  UploadCloudIcon,
  XIcon,
  FileCheckIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/Primitives';
import type { VaultReport } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName?: string;
  onReportUploaded?: (report: Omit<VaultReport, 'id'>) => void;
}

export function UploadMedicalReportModal({
  isOpen,
  onClose,
  patientId,
  patientName = 'Patient',
  onReportUploaded
}: UploadModalProps) {
  const { addReport, user } = useApp();
  const [reportTitle, setReportTitle] = useState('');
  const [reportKind, setReportKind] = useState<'Lab' | 'Imaging' | 'Prescription' | 'Medical Report (PDF/Pic)'>('Medical Report (PDF/Pic)');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: 'pdf' | 'image';
    url: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type.includes('pdf') || file.name.endsWith('.pdf');

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    const fakeUrl = URL.createObjectURL(file);

    setSelectedFile({
      name: file.name,
      size: `${sizeInMb} MB`,
      type: isPdf ? 'pdf' : 'image',
      url: fakeUrl
    });

    if (!reportTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setReportTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a PDF or Image file to upload');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const newReportData: Omit<VaultReport, 'id'> = {
        patientId,
        title: reportTitle.trim() || selectedFile.name,
        kind: reportKind,
        facility: user?.facility || 'Primary Health Centre',
        date: new Date().toISOString(),
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileUrl: selectedFile.url
      };

      addReport(newReportData);
      if (onReportUploaded) {
        onReportUploaded(newReportData);
      }

      toast.success('Medical Report Uploaded Successfully!', {
        description: `Attached ${selectedFile.name} to ${patientName}'s Health Vault.`
      });

      setIsUploading(false);
      setSelectedFile(null);
      setReportTitle('');
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400 ring-1 ring-brand-500/30">
                  <UploadCloudIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Upload Medical Report</h3>
                  <p className="text-xs text-slate-400">PDFs, Lab Scans, X-Rays & Medical Pictures</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4">
              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Select File (PDF or Image) <span className="text-rose-400">*</span>
                </label>

                {!selectedFile ? (
                  <label className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-6 text-center cursor-pointer transition-all hover:border-brand-500 hover:bg-slate-950">
                    <input
                      type="file"
                      accept=".pdf,image/*,.dcom"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform">
                      <UploadCloudIcon className="h-6 w-6" />
                    </span>
                    <p className="mt-3 text-xs font-bold text-slate-200">
                      Click or drag & drop medical file
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Supports PDF Documents, PNG, JPG, WEBP & Scans (Max 25MB)
                    </p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                        {selectedFile.type === 'pdf' ? (
                          <FileTextIcon className="h-5 w-5" />
                        ) : (
                          <ImageIcon className="h-5 w-5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white">{selectedFile.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {selectedFile.type.toUpperCase()} · {selectedFile.size}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400">
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Report Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Report / Document Title
                </label>
                <input
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs font-medium text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. ECG Scan Report / Blood Panel / Chest X-Ray"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </div>

              {/* Report Category */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Document Category
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { key: 'Lab', label: 'Lab Report' },
                    { key: 'Imaging', label: 'X-Ray / Scan' },
                    { key: 'Prescription', label: 'Prescription' },
                    { key: 'Medical Report (PDF/Pic)', label: 'General PDF/Pic' }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setReportKind(cat.key as any)}
                      className={`rounded-xl py-2 px-3 text-left transition-all border ${
                        reportKind === cat.key
                          ? 'border-brand-500 bg-brand-500/20 text-white font-bold'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                      }`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" disabled={isUploading || !selectedFile}>
                  {isUploading ? (
                    'Syncing to Vault…'
                  ) : (
                    <>
                      <FileCheckIcon className="h-4 w-4" /> Save to Health Vault
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
