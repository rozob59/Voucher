import React, { useState, useEffect } from 'react';
import { Voucher } from '../types';
import { User, Phone, Building2, MapPin, Smartphone, Hash, FileText, X, Check } from 'lucide-react';

interface UserEditModalProps {
  voucher: Voucher | null;
  onSave: (
    id: string,
    details: {
      userName?: string;
      userMobile?: string;
      shopName?: string;
      userAddress?: string;
      deviceName?: string;
      macAddress?: string;
      notes?: string;
    }
  ) => void;
  onClose: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ voucher, onSave, onClose }) => {
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [shopName, setShopName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (voucher) {
      setUserName(voucher.userName || '');
      setUserMobile(voucher.userMobile || '');
      setShopName(voucher.shopName || '');
      setUserAddress(voucher.userAddress || '');
      setDeviceName(voucher.deviceName || '');
      setMacAddress(voucher.macAddress || '');
      setNotes(voucher.notes || '');
    }
  }, [voucher]);

  if (!voucher) return null;

  const handleClear = () => {
    setUserName('');
    setUserMobile('');
    setShopName('');
    setUserAddress('');
    setDeviceName('');
    setMacAddress('');
    setNotes('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(voucher.id, {
      userName,
      userMobile,
      shopName,
      userAddress,
      deviceName,
      macAddress,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              <span>ইউজার ইনফরমেশন (User Details)</span>
            </h3>
            <p className="text-xs font-mono text-emerald-400 font-semibold mt-0.5">
              Code: {voucher.voucherCode}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>User Name (গ্রাহকের নাম)</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Rahim Ahmed"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mobile Number (মোবাইল নম্বর)</span>
            </label>
            <input
              type="text"
              value={userMobile}
              onChange={(e) => setUserMobile(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shop/Business Name</span>
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Rahim Telecom"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Address</span>
              </label>
              <input
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="e.g. Mirpur, Dhaka"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Device Name</span>
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g. Samsung A52"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-400" />
                <span>MAC Address</span>
              </label>
              <input
                type="text"
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
                placeholder="AA:BB:CC:11:22:33"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notes</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any internal note..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              Clear Fields
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save User Info</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
