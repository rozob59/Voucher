import React from 'react';
import { Voucher, AppSettings } from '../types';
import { Copy, FileText, User, CheckCircle2, RotateCcw, Trash2, Share2, Scissors, Building2, Phone, Calendar } from 'lucide-react';

interface VoucherCardProps {
  voucher: Voucher;
  settings: AppSettings;
  isSelected?: boolean;
  isMultiSelectMode?: boolean;
  onToggleSelect?: (id: string) => void;
  onCopyFull: (voucher: Voucher) => void;
  onCopyCodeOnly: (code: string) => void;
  onDownloadPdf: (voucher: Voucher) => void;
  onOpenUserModal: (voucher: Voucher) => void;
  onToggleStatus: (id: string, currentStatus: Voucher['status']) => void;
  onDelete: (voucher: Voucher) => void;
  onShare: (voucher: Voucher) => void;
  onViewDetails: (voucher: Voucher) => void;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  settings,
  isSelected = false,
  isMultiSelectMode = false,
  onToggleSelect,
  onCopyFull,
  onCopyCodeOnly,
  onDownloadPdf,
  onOpenUserModal,
  onToggleStatus,
  onDelete,
  onShare,
  onViewDetails
}) => {
  const statusBadges = {
    AVAILABLE: {
      label: '🟢 Available',
      bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      dot: 'bg-emerald-500'
    },
    ASSIGNED: {
      label: '🟡 Assigned',
      bg: 'bg-amber-950/80 text-amber-300 border-amber-800',
      dot: 'bg-amber-500'
    },
    USED: {
      label: '🔴 USED',
      bg: 'bg-rose-950/80 text-rose-300 border-rose-800',
      dot: 'bg-rose-500'
    },
    EXPIRED: {
      label: '⚪ Expired',
      bg: 'bg-slate-800 text-slate-300 border-slate-700',
      dot: 'bg-slate-400'
    }
  };

  const currentBadge = statusBadges[voucher.status] || statusBadges.AVAILABLE;

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isMultiSelectMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect && onToggleSelect(voucher.id)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
          )}
          <span className="text-xs font-bold text-emerald-400 tracking-wider">
            {settings.businessName}
          </span>
        </div>

        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentBadge.bg}`}>
          {currentBadge.label}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3 flex-1 cursor-pointer" onClick={() => onViewDetails(voucher)}>
        {/* Voucher Code Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center group relative hover:border-emerald-700/50 transition-colors">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
            Voucher Code
          </p>
          <p className="text-lg font-mono font-bold text-white tracking-widest text-emerald-300">
            {voucher.voucherCode}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">Package</span>
            <span className="font-semibold text-slate-200">{voucher.packageName || 'Standard'}</span>
          </div>

          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">Price</span>
            <span className="font-bold text-emerald-400">{settings.currency} {voucher.price}</span>
          </div>
        </div>

        {/* User Info Section if Assigned or Used */}
        {(voucher.userName || voucher.userMobile || voucher.shopName) && (
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1 text-xs">
            {voucher.userName && (
              <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{voucher.userName}</span>
              </div>
            )}
            {voucher.userMobile && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{voucher.userMobile}</span>
              </div>
            )}
            {voucher.shopName && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{voucher.shopName}</span>
              </div>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-600" />
            <span>Validity: {voucher.validityDays} Days</span>
          </div>
          {voucher.usedDate && (
            <span className="text-rose-400 font-medium">
              Used: {new Date(voucher.usedDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="bg-slate-950/90 border-t border-slate-800 p-2 grid grid-cols-5 gap-1 text-[11px]">
        {/* Copy Full */}
        <button
          onClick={(e) => { e.stopPropagation(); onCopyFull(voucher); }}
          title="Copy Full Info"
          className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/80 text-slate-200 hover:text-emerald-300 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="text-[9px] mt-0.5">Copy</span>
        </button>

        {/* Copy Code Only */}
        <button
          onClick={(e) => { e.stopPropagation(); onCopyCodeOnly(voucher.voucherCode); }}
          title="Copy Code Only"
          className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/80 text-slate-200 hover:text-emerald-300 transition-colors"
        >
          <Scissors className="w-3.5 h-3.5" />
          <span className="text-[9px] mt-0.5">Code</span>
        </button>

        {/* Download PDF */}
        <button
          onClick={(e) => { e.stopPropagation(); onDownloadPdf(voucher); }}
          title="Download PDF"
          className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/80 text-slate-200 hover:text-emerald-300 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="text-[9px] mt-0.5">PDF</span>
        </button>

        {/* Edit User Details */}
        <button
          onClick={(e) => { e.stopPropagation(); onOpenUserModal(voucher); }}
          title="User Details"
          className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/80 text-slate-200 hover:text-emerald-300 transition-colors"
        >
          <User className="w-3.5 h-3.5" />
          <span className="text-[9px] mt-0.5">User</span>
        </button>

        {/* Toggle Used / Available */}
        {voucher.status === 'USED' ? (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStatus(voucher.id, 'USED'); }}
            title="Mark as Available"
            className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[9px] mt-0.5">Re-Avail</span>
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStatus(voucher.id, voucher.status); }}
            title="Mark as Used"
            className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[9px] mt-0.5">Mark Used</span>
          </button>
        )}
      </div>

      {/* Secondary Share & Delete Footer */}
      <div className="px-2 py-1 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[10px]">
        <button
          onClick={(e) => { e.stopPropagation(); onShare(voucher); }}
          className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
        >
          <Share2 className="w-3 h-3" />
          <span>Share</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(voucher); }}
          className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
