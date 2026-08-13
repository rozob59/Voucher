import React, { useState, useMemo } from 'react';
import { Voucher, AppSettings, VoucherPackage, VoucherStatus } from '../types';
import { VoucherCard } from './VoucherCard';
import { 
  Search, 
  SlidersHorizontal, 
  CheckSquare, 
  Square, 
  Copy, 
  Share2, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Ticket,
  Filter,
  X
} from 'lucide-react';

interface VoucherListViewProps {
  vouchers: Voucher[];
  packages: VoucherPackage[];
  settings: AppSettings;
  onCopyFull: (voucher: Voucher) => void;
  onCopyCodeOnly: (code: string) => void;
  onDownloadPdf: (voucher: Voucher) => void;
  onOpenUserModal: (voucher: Voucher) => void;
  onToggleStatus: (id: string, currentStatus: Voucher['status']) => void;
  onDelete: (voucher: Voucher) => void;
  onShare: (voucher: Voucher) => void;
  onViewDetails: (voucher: Voucher) => void;
  onBulkCopy: (selectedVouchers: Voucher[]) => void;
  onBulkShare: (selectedVouchers: Voucher[]) => void;
  onBulkExportPdf: (selectedVouchers: Voucher[]) => void;
  onBulkDelete: (selectedIds: string[]) => void;
  onBulkMarkUsed: (selectedIds: string[]) => void;
}

export const VoucherListView: React.FC<VoucherListViewProps> = ({
  vouchers,
  packages,
  settings,
  onCopyFull,
  onCopyCodeOnly,
  onDownloadPdf,
  onOpenUserModal,
  onToggleStatus,
  onDelete,
  onShare,
  onViewDetails,
  onBulkCopy,
  onBulkShare,
  onBulkExportPdf,
  onBulkDelete,
  onBulkMarkUsed
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState<'ALL' | VoucherStatus>('ALL');
  const [selectedPackage, setSelectedPackage] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'CODE' | 'STATUS' | 'USER'>('NEWEST');
  
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // Filter & Sort logic
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      // Status filter
      if (activeStatusTab !== 'ALL' && v.status !== activeStatusTab) {
        return false;
      }

      // Package filter
      if (selectedPackage !== 'ALL' && v.packageName !== selectedPackage) {
        return false;
      }

      // Search query (code, name, mobile, shop, mac)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const code = (v.voucherCode || '').toLowerCase();
        const name = (v.userName || '').toLowerCase();
        const mobile = (v.userMobile || '').toLowerCase();
        const shop = (v.shopName || '').toLowerCase();
        const mac = (v.macAddress || '').toLowerCase();

        return (
          code.includes(q) ||
          name.includes(q) ||
          mobile.includes(q) ||
          shop.includes(q) ||
          mac.includes(q)
        );
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime();
      }
      if (sortBy === 'OLDEST') {
        return new Date(a.createdDate || 0).getTime() - new Date(b.createdDate || 0).getTime();
      }
      if (sortBy === 'CODE') {
        return a.voucherCode.localeCompare(b.voucherCode);
      }
      if (sortBy === 'STATUS') {
        return a.status.localeCompare(b.status);
      }
      if (sortBy === 'USER') {
        return (a.userName || '').localeCompare(b.userName || '');
      }
      return 0;
    });
  }, [vouchers, activeStatusTab, selectedPackage, searchQuery, sortBy]);

  // Handle Multi-Select Toggles
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredVouchers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVouchers.map((v) => v.id));
    }
  };

  const selectedObjects = useMemo(() => {
    return vouchers.filter((v) => selectedIds.includes(v.id));
  }, [vouchers, selectedIds]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-emerald-400" />
            <span>ভাউচার লিস্ট (Voucher List)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Showing {filteredVouchers.length} of {vouchers.length} total vouchers
          </p>
        </div>

        {/* Multi-select Mode Button */}
        <button
          onClick={() => {
            setIsMultiSelectMode(!isMultiSelectMode);
            setSelectedIds([]);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            isMultiSelectMode
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          {isMultiSelectMode ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          <span>{isMultiSelectMode ? 'Exit Selection' : 'Multi-Select Mode'}</span>
        </button>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Voucher Code, User Name, Mobile, Shop, or MAC address..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-2xl pl-12 pr-10 py-3 text-white text-sm outline-none transition-colors shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'ALL', label: 'All', count: vouchers.length },
          { id: 'AVAILABLE', label: '🟢 Available', count: vouchers.filter(v => v.status === 'AVAILABLE').length },
          { id: 'ASSIGNED', label: '🟡 Assigned', count: vouchers.filter(v => v.status === 'ASSIGNED').length },
          { id: 'USED', label: '🔴 Used', count: vouchers.filter(v => v.status === 'USED').length },
          { id: 'EXPIRED', label: '⚪ Expired', count: vouchers.filter(v => v.status === 'EXPIRED').length }
        ].map((tab) => {
          const isActive = activeStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/50">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Package & Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs">
        {/* Package Dropdown Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-400 font-medium">Package:</span>
          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Packages</option>
            {packages.map((p) => (
              <option key={p.id} value={p.packageName}>
                {p.packageName} ({settings.currency}{p.price})
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-400 font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-emerald-500"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="CODE">Voucher Code</option>
            <option value="STATUS">Status</option>
            <option value="USER">User Name</option>
          </select>
        </div>
      </div>

      {/* Multi-Select Floating Action Bar */}
      {isMultiSelectMode && (
        <div className="bg-emerald-950 border border-emerald-800 p-3 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 text-emerald-200 hover:text-white font-semibold"
            >
              {selectedIds.length === filteredVouchers.length ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>Select All ({selectedIds.length})</span>
            </button>
            <span className="text-emerald-300 font-medium">
              {selectedIds.length} vouchers selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={selectedIds.length === 0}
              onClick={() => onBulkCopy(selectedObjects)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copy Selected</span>
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => onBulkShare(selectedObjects)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Share Selected</span>
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => onBulkExportPdf(selectedObjects)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Export PDF</span>
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => onBulkMarkUsed(selectedIds)}
              className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 font-semibold flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Mark Used</span>
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => onBulkDelete(selectedIds)}
              className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Voucher Grid */}
      {filteredVouchers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <p className="text-slate-400 text-sm font-medium">No vouchers matching your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVouchers.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              voucher={voucher}
              settings={settings}
              isSelected={selectedIds.includes(voucher.id)}
              isMultiSelectMode={isMultiSelectMode}
              onToggleSelect={handleToggleSelect}
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
  );
};
