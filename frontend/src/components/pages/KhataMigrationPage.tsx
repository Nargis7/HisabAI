import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Edit2,
  FileImage,
  RefreshCw
} from 'lucide-react';
import { Button } from '../common/Button';
import { KhataExtractedRow, Customer } from '../../types';
import { SAMPLE_KHATA_ROWS } from '../../data/mockData';

interface KhataMigrationPageProps {
  onImportRecords: (records: KhataExtractedRow[]) => void;
}

export const KhataMigrationPage: React.FC<KhataMigrationPageProps> = ({
  onImportRecords
}) => {
  const [stage, setStage] = useState<'upload' | 'processing' | 'review' | 'completed'>('upload');
  const [extractedRows, setExtractedRows] = useState<KhataExtractedRow[]>(SAMPLE_KHATA_ROWS);
  const [selectedPhotoName, setSelectedPhotoName] = useState('bahi_khata_diary_page_sep18.jpg');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const handleStartScan = () => {
    setStage('processing');
    setTimeout(() => {
      setStage('review');
    }, 1800);
  };

  const handleRowAction = (id: string, action: 'confirm' | 'reject') => {
    setExtractedRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: action === 'confirm' ? 'confirmed' : 'rejected'
          };
        }
        return r;
      })
    );
  };

  const handleConfirmAll = () => {
    setExtractedRows((prev) =>
      prev.map((r) => ({
        ...r,
        status: r.status === 'rejected' ? 'rejected' : 'confirmed'
      }))
    );
  };

  const handleImportToShop = () => {
    const confirmedOnly = extractedRows.filter((r) => r.status === 'confirmed' || r.status === 'pending_review');
    onImportRecords(confirmedOnly);
    setStage('completed');
  };

  const confirmedCount = extractedRows.filter((r) => r.status === 'confirmed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            AI Bahi-Khata Digitizer
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Bring your old khata with you.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Turn handwritten paper khatas into searchable, permanent shop memory.
        </p>
      </div>

      {/* Guided 4-Step Process Breadcrumb */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${stage === 'upload' ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
              1
            </span>
            <span className="font-semibold text-slate-800">Khata Photo</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${stage === 'processing' ? 'bg-indigo-600 text-white' : stage === 'review' || stage === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              2
            </span>
            <span className="font-semibold text-slate-800">AI Reads Records</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${stage === 'review' ? 'bg-indigo-600 text-white' : stage === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              3
            </span>
            <span className="font-semibold text-slate-800">Shopkeeper Review</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${stage === 'completed' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              4
            </span>
            <span className="font-semibold text-slate-800">Import to Memory</span>
          </div>
        </div>
      </div>

      {/* Stage 1: Upload / Sample selection */}
      {stage === 'upload' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div
            onClick={handleStartScan}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Upload Khata Photo or Drag & Drop
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
              Snap a clear picture of your Hindi or English handwritten paper diary page. HisabAI AI will parse names, amounts, and commitments.
            </p>

            <Button variant="primary" size="md">
              Select Khata Page Image
            </Button>
          </div>

          {/* Sample Scanned Khata Pages */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-600">
              <span>Or try sample handwritten ledger pages:</span>
              <span className="text-indigo-600 font-medium">Saved Ledger Scans</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={handleStartScan}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <FileImage className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">
                    Bahi_Khata_Ramesh_Amit_Diary.jpg
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Handwritten Hindi/English ledger (4 entries, ₹1,280 total)
                  </div>
                </div>
              </div>

              <div
                onClick={handleStartScan}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                  <FileImage className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">
                    Weekly_Grocery_Credit_Register.jpg
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Counter register slips (Chawal, Tel, Atta balance)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Processing / AI OCR scanning animation */}
      {stage === 'processing' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-1">
            HisabAI Vision Model Reading Handwritten Khata...
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Detecting Hindi script, extracting customer names (Ramesh, Amit, Suresh), amounts in ₹, and mapped promised due dates.
          </p>

          <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto mt-6 overflow-hidden">
            <div className="h-full bg-indigo-600 animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      )}

      {/* Stage 3: Review Table with Confirm / Edit / Reject */}
      {stage === 'review' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Extracted Khata Review Table
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review each entry before importing. <strong>Never silently import uncertain records.</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirmAll}
              >
                Confirm All
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleImportToShop}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Import to Shop Memory ({extractedRows.filter((r) => r.status !== 'rejected').length})
              </Button>
            </div>
          </div>

          {/* Review Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Handwritten Line (Raw)</th>
                  <th className="px-4 py-3">Customer Name</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Promised Due Date</th>
                  <th className="px-4 py-3">AI Confidence</th>
                  <th className="px-4 py-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {extractedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      row.status === 'confirmed'
                        ? 'bg-emerald-50/40'
                        : row.status === 'rejected'
                        ? 'bg-rose-50/30 opacity-60'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-slate-800 italic">
                      "{row.rawText}"
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div>{row.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">
                        {row.phoneEstimate}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-extrabold font-mono text-slate-900 text-sm">
                      ₹{row.amount}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {row.dueDate}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {row.confidenceScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRowAction(row.id, 'confirm')}
                          className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${
                            row.status === 'confirmed'
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                          title="Confirm record"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Confirm</span>
                        </button>
                        <button
                          onClick={() => handleRowAction(row.id, 'reject')}
                          className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${
                            row.status === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                          title="Reject record"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Reject</span>
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

      {/* Stage 4: Completed */}
      {stage === 'completed' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Khata Records Successfully Imported to Shop Memory!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
            All confirmed customer balances, items, and promised due dates are now searchable in HisabAI.
          </p>

          <Button
            variant="outline"
            size="md"
            onClick={() => setStage('upload')}
          >
            Migrate Another Khata Page
          </Button>
        </div>
      )}
    </div>
  );
};
