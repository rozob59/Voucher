import React from 'react';
import { Voucher } from '../types';
import { Trash2, RotateCcw, X, AlertTriangle } from 'lucide-react';

interface TrashBinModalProps {
  trashVouchers: Voucher[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyTrash: () => void;
  onClose: () => void;
}

export const TrashBinModal: React.FC<TrashBinModalProps> = ({
  trashVouchers,
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white">
              ট্র্যাশ বিন (Trash Bin)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-800">
              {trashVouchers.length} Items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {trashVouchers.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-medium">Trash bin is completely empty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-end">
                <button
                  onClick={onEmptyTrash}
                  className="px-3 py-1.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Empty Entire Trash</span>
                </button>
              </div>

              {trashVouchers.map((v) => (
                <div
                  key={v.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-mono font-bold text-white text-sm">{v.voucherCode}</p>
                    <p className="text-slate-400 mt-0.5">
                      {v.packageName} &bull; ৳{v.price} &bull; Deleted:{' '}
                      {v.deletedAt ? new Date(v.deletedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRestore(v.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>

                    <button
                      onClick={() => onPermanentDelete(v.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Forever</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
