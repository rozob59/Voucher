import React, { useState, useRef } from 'react';
import { AppSettings } from '../types';
import { Settings, Save, Download, Upload, Trash2, ShieldCheck, Check } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  trashCount: number;
  onSaveSettings: (settings: AppSettings) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => boolean;
  onOpenTrash: () => void;
  onOpenPackageManager: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  trashCount,
  onSaveSettings,
  onExportBackup,
  onImportBackup,
  onOpenTrash,
  onOpenPackageManager
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = onImportBackup(content);
          if (success) {
            alert('Backup successfully restored!');
          } else {
            alert('Failed to restore backup. Invalid JSON file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>সেটিংস এবং ব্যাকআপ (Settings & Offline Backup)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure business details, PDF layouts, and offline database JSON backups
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>১. বিজনেস এবং ওয়াইফাই তথ্য (Business Settings)</span>
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Settings Saved</span>
            </span>
          )}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Business / Organization Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">WiFi Network Name (SSID)</label>
            <input
              type="text"
              value={formData.wifiName}
              onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Support Hotline Number</label>
            <input
              type="text"
              value={formData.supportPhone}
              onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Currency Symbol</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none text-sm font-bold"
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="text-slate-300 font-semibold mb-1 block">Business Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Package Management Shortcut Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">প্যাকেজ সেটিংস (Package Settings)</h3>
          <p className="text-xs text-slate-400 mt-1">Configure preset pricing and validity days for vouchers</p>
        </div>
        <button
          onClick={onOpenPackageManager}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700"
        >
          Manage Packages
        </button>
      </div>

      {/* Offline Backup & Restore Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>২. লোকাল ব্যাকআপ এবং রিস্টোর (Offline Backup & Restore)</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          All data remains 100% stored locally on your device. Export a JSON backup file to save your data permanently or transfer to another phone.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Export JSON Backup */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <p className="text-xs font-bold text-white">Export Database Backup</p>
            <p className="text-[11px] text-slate-400">Save all vouchers, packages, and settings to a JSON file.</p>
            <button
              onClick={onExportBackup}
              className="w-full py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Backup</span>
            </button>
          </div>

          {/* Import JSON Restore */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <p className="text-xs font-bold text-white">Restore Database Backup</p>
            <p className="text-[11px] text-slate-400">Restore database vouchers from a previously exported JSON file.</p>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-sky-400" />
              <span>Select Backup File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trash Bin Shortcut */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>ট্র্যাশ বিন (Trash Bin)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            View and restore soft-deleted vouchers ({trashCount} item{trashCount === 1 ? '' : 's'})
          </p>
        </div>

        <button
          onClick={onOpenTrash}
          className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Open Trash ({trashCount})</span>
        </button>
      </div>
    </div>
  );
};
