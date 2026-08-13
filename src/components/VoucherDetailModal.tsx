import React from 'react';
import { Voucher, AppSettings } from '../types';
import { 
  X, 
  Copy, 
  Share2, 
  FileText, 
  User, 
  CheckCircle2, 
  RotateCcw, 
  Trash2, 
  Calendar, 
  Clock, 
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  Smartphone,
  Hash,
  Tag
} from 'lucide-react';

interface VoucherDetailModalProps {
  voucher: Voucher | null;
  settings: AppSettings;
  onClose: () => void;
  onCopyFull: (voucher: Voucher) => void;
  onDownloadPdf: (voucher: Voucher) => void;
  onOpenUserModal: (voucher: Voucher) => void;
  onToggleStatus: (id: string, currentStatus: Voucher['status']) => void;
  onDelete: (voucher: Voucher) => void;
  onShare: (voucher: Voucher) => void;
}

export const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({
  voucher,
  settings,
  onClose,
  onCopyFull,
  onDownloadPdf,
  onOpenUserModal,
  onToggleStatus,
  onDelete,
  onShare
}) => {
  if (!voucher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              ভাউচার ডিটেইলস (Voucher Details)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Voucher Display Header Box */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-950 border border-emerald-800/80 rounded-2xl p-5 text-center space-y-2">
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold">
              {settings.businessName} ({settings.wifiName})
            </p>
            <p className="text-3xl font-mono font-extrabold text-white tracking-widest">
              {voucher.voucherCode}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-300">
              <span>Status: {voucher.status}</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Package</span>
              <span className="font-bold text-white text-sm">{voucher.packageName}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Price</span>
              <span className="font-bold text-emerald-400 text-sm">{settings.currency} {voucher.price}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block mb-0.5">Validity</span>
              <span className="font-bold text-white text-sm">{voucher.validityDays} Days</span>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5 mb-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Timeline Logs</span>
            </h4>

            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Created Date:</span>
                <span className="font-medium">{new Date(voucher.createdDate).toLocaleString()}</span>
              </div>
              {voucher.assignedDate && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Date:</span>
                  <span className="font-medium">{new Date(voucher.assignedDate).toLocaleString()}</span>
                </div>
              )}
              {voucher.usedDate && (
                <div className="flex justify-between">
                  <span className="text-rose-400">Used Date:</span>
                  <span className="font-medium text-rose-300">{new Date(voucher.usedDate).toLocaleString()}</span>
                </div>
              )}
              {voucher.expiryDate && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Calculated Expiry:</span>
                  <span className="font-medium">{new Date(voucher.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Customer Information</span>
              </h4>

              <button
                onClick={() => { onClose(); onOpenUserModal(voucher); }}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Edit User
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <span className="text-slate-500 block">Name:</span>
                <p className="font-semibold text-white">{voucher.userName || 'Not Assigned'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Mobile:</span>
                <p className="font-semibold text-white font-mono">{voucher.userMobile || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Shop/Business:</span>
                <p className="font-semibold text-white">{voucher.shopName || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Address:</span>
                <p className="font-semibold text-white">{voucher.userAddress || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Device:</span>
                <p className="font-semibold text-white">{voucher.deviceName || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">MAC Address:</span>
                <p className="font-semibold text-white font-mono">{voucher.macAddress || 'N/A'}</p>
              </div>
            </div>

            {voucher.notes && (
              <div className="pt-2 border-t border-slate-900">
                <span className="text-slate-500 block mb-0.5">Notes:</span>
                <p className="text-slate-300 italic">{voucher.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
          <button
            onClick={() => onCopyFull(voucher)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex flex-col items-center justify-center gap-1"
          >
            <Copy className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px]">Copy</span>
          </button>

          <button
            onClick={() => onShare(voucher)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex flex-col items-center justify-center gap-1"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span className="text-[10px]">Share</span>
          </button>

          <button
            onClick={() => onDownloadPdf(voucher)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex flex-col items-center justify-center gap-1"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">PDF</span>
          </button>

          <button
            onClick={() => { onClose(); onOpenUserModal(voucher); }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex flex-col items-center justify-center gap-1"
          >
            <User className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px]">User</span>
          </button>

          {voucher.status === 'USED' ? (
            <button
              onClick={() => { onToggleStatus(voucher.id, 'USED'); onClose(); }}
              className="p-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-200 font-semibold flex flex-col items-center justify-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-[10px]">Re-Avail</span>
            </button>
          ) : (
            <button
              onClick={() => { onToggleStatus(voucher.id, voucher.status); onClose(); }}
              className="p-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 font-semibold flex flex-col items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              <span className="text-[10px]">Mark Used</span>
            </button>
          )}

          <button
            onClick={() => { onDelete(voucher); onClose(); }}
            className="p-2.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-white font-semibold flex flex-col items-center justify-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[10px]">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
