import React from 'react';
import { Wifi, Smartphone, Trash2, ShieldCheck, Download } from 'lucide-react';

interface NavbarProps {
  businessName: string;
  wifiName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  trashCount: number;
  onOpenTrash: () => void;
  onExportBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  businessName,
  wifiName,
  activeTab,
  setActiveTab,
  trashCount,
  onOpenTrash,
  onExportBackup
}) => {
  return (
    <header className="bg-emerald-950/90 border-b border-emerald-800/50 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50 group-hover:bg-emerald-500 transition-colors">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-wide leading-tight">
                {businessName}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-800/80 text-emerald-200 rounded-full border border-emerald-700/50">
                Offline Manager
              </span>
            </div>
            <p className="text-xs text-emerald-300/80">
              Captive Portal Vouchers ({wifiName})
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Direct ZIP Download */}
          <a
            href="/rozob_wifi_aide_project.zip"
            download="rozob_wifi_aide_project.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow transition-all hover:scale-105"
            title="AIDE ready-to-run ZIP download"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">ZIP প্রজেক্ট</span>
          </a>

          {/* Export JSON Backup */}
          <button
            onClick={onExportBackup}
            title="Export Offline JSON Backup"
            className="p-2 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 rounded-lg transition-colors flex items-center gap-1 text-xs"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Backup</span>
          </button>

          {/* Trash shortcut */}
          <button
            onClick={onOpenTrash}
            title="Trash Bin"
            className="relative p-2 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-emerald-400" />
            {trashCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {trashCount}
              </span>
            )}
          </button>

          {/* Offline Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Offline</span>
          </div>
        </div>
      </div>
    </header>
  );
};
