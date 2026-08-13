import React, { useState, useMemo } from 'react';
import { VoucherPackage, AppSettings, BulkImportResult } from '../types';
import { LocalVoucherDB } from '../services/db';
import { PlusCircle, FileText, CheckCircle2, AlertTriangle, Layers, ArrowLeft } from 'lucide-react';

interface BulkImportViewProps {
  packages: VoucherPackage[];
  settings: AppSettings;
  onImportComplete: (importedCount: number) => void;
  onClose?: () => void;
}

export const BulkImportView: React.FC<BulkImportViewProps> = ({
  packages,
  settings,
  onImportComplete,
  onClose
}) => {
  const [rawInput, setRawInput] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    packages.length > 0 ? packages[0].id : ''
  );
  const [customPackageName, setCustomPackageName] = useState('30 Days Unlimited');
  const [customPrice, setCustomPrice] = useState<number>(100);
  const [customValidityDays, setCustomValidityDays] = useState<number>(30);
  const [useCustomPackage, setUseCustomPackage] = useState(false);

  // When package selection changes
  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const pkg = packages.find(p => p.id === pkgId);
    if (pkg) {
      setCustomPackageName(pkg.packageName);
      setCustomPrice(pkg.price);
      setCustomValidityDays(pkg.validityDays);
    }
  };

  // Live duplicate & valid code parsing
  const parseResult: BulkImportResult = useMemo(() => {
    return LocalVoucherDB.parseBulkImport(rawInput);
  }, [rawInput]);

  const handleImport = () => {
    if (parseResult.validNewCodes.length === 0) return;

    const pkgName = useCustomPackage
      ? customPackageName
      : packages.find(p => p.id === selectedPackageId)?.packageName || 'Standard';
    
    const price = useCustomPackage
      ? Number(customPrice)
      : packages.find(p => p.id === selectedPackageId)?.price || 100;
      
    const validity = useCustomPackage
      ? Number(customValidityDays)
      : packages.find(p => p.id === selectedPackageId)?.validityDays || 30;

    LocalVoucherDB.importBulkVouchers(parseResult.validNewCodes, pkgName, price, validity);
    onImportComplete(parseResult.validNewCodes.length);
    setRawInput('');
  };

  const sampleExample = `RZB-8K4M-72QP\nRZB-91XP-44KD\nRZB-72LM-83QW\nRZB-45KD-91PX\nRZB-82PL-44MN`;

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-emerald-400" />
            <span>বাল্ক ভাউচার ইমপোর্ট (Bulk Voucher Import)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Paste multiple Ruijie captive-portal voucher codes (one per line).
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}
      </div>

      {/* Package Selection Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>১. প্যাকেজ এবং রেট সিলেক্ট করুন (Package & Pricing)</span>
          </h3>

          <button
            type="button"
            onClick={() => setUseCustomPackage(!useCustomPackage)}
            className="text-xs font-semibold text-emerald-400 hover:underline"
          >
            {useCustomPackage ? 'Select Saved Package' : 'Custom Pricing'}
          </button>
        </div>

        {!useCustomPackage ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {packages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/50 shadow'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <p className="font-bold text-white text-sm">{pkg.packageName}</p>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-emerald-400 font-extrabold">
                      {settings.currency} {pkg.price}
                    </span>
                    <span className="text-slate-400">{pkg.validityDays} Days Validity</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Package Name</label>
              <input
                type="text"
                value={customPackageName}
                onChange={(e) => setCustomPackageName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                placeholder="e.g. 30 Days"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Price ({settings.currency})</label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                placeholder="100"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Validity (Days)</label>
              <input
                type="number"
                value={customValidityDays}
                onChange={(e) => setCustomValidityDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                placeholder="30"
              />
            </div>
          </div>
        )}
      </div>

      {/* Code Textarea Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>২. ভাউচার কোডগুলো পেস্ট করুন (Paste Codes)</span>
          </h3>

          <button
            onClick={() => setRawInput(sampleExample)}
            className="text-xs text-slate-400 hover:text-emerald-400 underline font-medium"
          >
            Load Sample
          </button>
        </div>

        <textarea
          rows={8}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder={`Paste Ruijie Voucher codes here...\nExample:\nRZB-8K4M-72QP\nRZB-91XP-44KD\nRZB-72LM-83QW`}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-mono text-sm leading-relaxed focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-y"
        />

        {/* Live Duplicate & Verification Stats */}
        {rawInput.trim().length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            {/* New Import Count */}
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-extrabold text-lg text-emerald-400 leading-tight">
                  {parseResult.validNewCodes.length}
                </p>
                <p className="text-[11px] text-emerald-300">নতুন ভাউচার (New)</p>
              </div>
            </div>

            {/* Duplicates Found */}
            <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-extrabold text-lg text-amber-400 leading-tight">
                  {parseResult.duplicateCodes.length}
                </p>
                <p className="text-[11px] text-amber-300">ডুপ্লিকেট কোড (Duplicates Skipped)</p>
              </div>
            </div>

            {/* Empty/Invalid */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-3">
              <Layers className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="font-extrabold text-lg text-slate-200 leading-tight">
                  {parseResult.emptyOrInvalidCount}
                </p>
                <p className="text-[11px] text-slate-400">খালি বা ভুল লাইন</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Duplicate Warning Preview Box */}
      {parseResult.duplicateCodes.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-4 text-xs space-y-2">
          <p className="font-bold text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>সতর্কতা: নিচের ডুপ্লিকেট ভাউচার কোডগুলো স্কিপ করা হবে (Duplicates):</span>
          </p>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto font-mono text-[11px] text-amber-200">
            {parseResult.duplicateCodes.map((dup, idx) => (
              <span key={idx} className="bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                {dup}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Confirm & Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          disabled={parseResult.validNewCodes.length === 0}
          onClick={handleImport}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-950/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>ইমপোর্ট করুন ({parseResult.validNewCodes.length} Vouchers)</span>
        </button>
      </div>
    </div>
  );
};
