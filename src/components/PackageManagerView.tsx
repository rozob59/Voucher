import React, { useState } from 'react';
import { VoucherPackage, AppSettings } from '../types';
import { Layers, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface PackageManagerViewProps {
  packages: VoucherPackage[];
  settings: AppSettings;
  onSavePackage: (pkg: VoucherPackage) => void;
  onDeletePackage: (id: string) => void;
}

export const PackageManagerView: React.FC<PackageManagerViewProps> = ({
  packages,
  settings,
  onSavePackage,
  onDeletePackage
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [description, setDescription] = useState('');

  const handleStartAdd = () => {
    setEditingId('NEW');
    setPackageName('');
    setPrice(100);
    setValidityDays(30);
    setDescription('');
  };

  const handleStartEdit = (pkg: VoucherPackage) => {
    setEditingId(pkg.id);
    setPackageName(pkg.packageName);
    setPrice(pkg.price);
    setValidityDays(pkg.validityDays);
    setDescription(pkg.description || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageName.trim()) return;

    const pkg: VoucherPackage = {
      id: editingId === 'NEW' ? `pkg-${Date.now()}` : (editingId as string),
      packageName: packageName.trim(),
      price: Number(price),
      validityDays: Number(validityDays),
      description: description.trim()
    };

    onSavePackage(pkg);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            <span>প্যাকেজ ম্যানেজমেন্ট (Package Manager)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create default internet packages for quick bulk voucher imports
          </p>
        </div>

        {editingId === null && (
          <button
            onClick={handleStartAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Package</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {editingId !== null && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-emerald-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>{editingId === 'NEW' ? '➕ Create New Package' : '✏️ Edit Package'}</span>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Package Name</label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g. 30 Days Unlimited"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Price ({settings.currency})</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="100"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Validity (Days)</label>
              <input
                type="number"
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                placeholder="30"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block text-xs">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. High speed monthly voucher"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow"
            >
              <Check className="w-4 h-4" />
              <span>Save Package</span>
            </button>
          </div>
        </form>
      )}

      {/* Package List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-bold text-white text-base">{pkg.packageName}</p>
              <p className="text-xs text-emerald-400 font-extrabold mt-0.5">
                {settings.currency} {pkg.price} &bull; {pkg.validityDays} Days
              </p>
              {pkg.description && (
                <p className="text-[11px] text-slate-400 mt-1">{pkg.description}</p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleStartEdit(pkg)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDeletePackage(pkg.id)}
                className="p-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
