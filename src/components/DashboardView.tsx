import React from 'react';
import { DashboardStats, Voucher, AppSettings } from '../types';
import { VoucherCard } from './VoucherCard';
import { 
  PlusCircle, 
  Ticket, 
  FileText, 
  Search, 
  Settings, 
  Banknote, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats;
  recentVouchers: Voucher[];
  settings: AppSettings;
  setActiveTab: (tab: string) => void;
  onOpenBulkImport: () => void;
  onExportAllPdf: () => void;
  onCopyFull: (voucher: Voucher) => void;
  onCopyCodeOnly: (code: string) => void;
  onDownloadPdf: (voucher: Voucher) => void;
  onOpenUserModal: (voucher: Voucher) => void;
  onToggleStatus: (id: string, currentStatus: Voucher['status']) => void;
  onDelete: (voucher: Voucher) => void;
  onShare: (voucher: Voucher) => void;
  onViewDetails: (voucher: Voucher) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentVouchers,
  settings,
  setActiveTab,
  onOpenBulkImport,
  onExportAllPdf,
  onCopyFull,
  onCopyCodeOnly,
  onDownloadPdf,
  onOpenUserModal,
  onToggleStatus,
  onDelete,
  onShare,
  onViewDetails
}) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ROZOB WiFi Captive Portal Manager</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            স্বাগতম (Welcome) to ROZOB WiFi
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
            Manage, organize, copy, share, and print Ruijie captive portal vouchers 100% offline.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Vouchers */}
        <div 
          onClick={() => setActiveTab('vouchers')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-600 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total</span>
            <Ticket className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{stats.total}</p>
          <p className="text-[11px] text-slate-400 mt-1">মোট ভাউচার</p>
        </div>

        {/* Available Vouchers */}
        <div 
          onClick={() => setActiveTab('vouchers')}
          className="bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.available}</p>
          <p className="text-[11px] text-emerald-300/80 mt-1">অ্যাভেলেবল ভাউচার</p>
        </div>

        {/* Assigned Vouchers */}
        <div 
          onClick={() => setActiveTab('vouchers')}
          className="bg-slate-900 border border-amber-900/60 hover:border-amber-500 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Assigned</span>
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400">{stats.assigned}</p>
          <p className="text-[11px] text-amber-300/80 mt-1">অ্যাসাইনড ইউজার</p>
        </div>

        {/* Used Vouchers */}
        <div 
          onClick={() => setActiveTab('vouchers')}
          className="bg-slate-900 border border-rose-900/60 hover:border-rose-500 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Used</span>
            <CheckCircle2 className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400">{stats.used}</p>
          <p className="text-[11px] text-rose-300/80 mt-1">ব্যবহৃত ভাউচার</p>
        </div>

        {/* Expired Vouchers */}
        <div 
          onClick={() => setActiveTab('vouchers')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-600 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] shadow-md group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Expired</span>
            <Clock className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-300">{stats.expired}</p>
          <p className="text-[11px] text-slate-400 mt-1">মেয়াদোত্তীর্ণ</p>
        </div>
      </div>

      {/* Main Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          onClick={onOpenBulkImport}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/80 transition-all active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          <span>➕ Bulk Add</span>
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 shadow transition-all active:scale-95"
        >
          <Ticket className="w-5 h-5 text-emerald-400" />
          <span>📋 Voucher List</span>
        </button>

        <button
          onClick={onExportAllPdf}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 shadow transition-all active:scale-95"
        >
          <FileText className="w-5 h-5 text-amber-400" />
          <span>📄 Export PDF</span>
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 shadow transition-all active:scale-95"
        >
          <Search className="w-5 h-5 text-sky-400" />
          <span>🔍 Search</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 shadow transition-all active:scale-95 col-span-2 sm:col-span-1"
        >
          <Settings className="w-5 h-5 text-slate-400" />
          <span>⚙️ Settings</span>
        </button>
      </div>

      {/* Revenue Financial Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Sales Revenue</p>
            <p className="text-2xl font-black text-emerald-400">
              {settings.currency} {stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400">From {stats.used} Used Vouchers</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Inventory Value</p>
            <p className="text-2xl font-black text-amber-300">
              {settings.currency} {stats.potentialRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400">Total {stats.total} Vouchers Value</p>
          </div>
        </div>
      </div>

      {/* Recent Vouchers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>সাম্প্রতিক ভাউচার (Recent Vouchers)</span>
            </h3>
            <p className="text-xs text-slate-400">Quick view of latest added or modified vouchers</p>
          </div>

          <button
            onClick={() => setActiveTab('vouchers')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>View All ({stats.total})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentVouchers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">No vouchers found in database.</p>
            <button
              onClick={onOpenBulkImport}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs inline-flex items-center gap-2 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Import First Vouchers</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentVouchers.slice(0, 6).map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                settings={settings}
                onCopyFull={onCopyFull}
                onCopyCodeOnly={onCopyCodeOnly}
                onDownloadPdf={onDownloadPdf}
                onOpenUserModal={onOpenUserModal}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                onShare={onShare}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
