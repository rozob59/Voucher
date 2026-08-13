import React from 'react';
import { DashboardStats, Voucher, AppSettings, VoucherPackage } from '../types';
import { BarChart3, Banknote, Ticket, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ReportsViewProps {
  stats: DashboardStats;
  vouchers: Voucher[];
  packages: VoucherPackage[];
  settings: AppSettings;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  stats,
  vouchers,
  packages,
  settings
}) => {
  // Package breakdown
  const packageStats = packages.map((pkg) => {
    const matched = vouchers.filter((v) => v.packageName === pkg.packageName);
    const used = matched.filter((v) => v.status === 'USED');
    const revenue = used.reduce((sum, v) => sum + (v.price || 0), 0);

    return {
      name: pkg.packageName,
      total: matched.length,
      usedCount: used.length,
      revenue
    };
  });

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <span>রিপোর্ট এবং এ্যানালিটিক্স (Reports & Analytics)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Complete offline inventory statistics and revenue overview
        </p>
      </div>

      {/* Primary Revenue Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800 rounded-3xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Banknote className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
            <p className="text-3xl font-black text-emerald-400">
              {settings.currency} {stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculated from {stats.used} Used Vouchers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Potential Total Inventory Value</p>
            <p className="text-3xl font-black text-amber-300">
              {settings.currency} {stats.potentialRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Total {stats.total} Vouchers value in DB
            </p>
          </div>
        </div>
      </div>

      {/* Grid Status Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Vouchers</span>
            <Ticket className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats.total}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase">Available</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{stats.available}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-bold uppercase">Used</span>
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400">{stats.used}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Expired</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-300">{stats.expired}</p>
        </div>
      </div>

      {/* Package Performance Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <span>প্যাকেজভিত্তিক রিপোর্ট (Package Breakdown)</span>
        </h3>

        <div className="space-y-3">
          {packageStats.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <p className="font-bold text-white text-sm">{item.name}</p>
                <p className="text-slate-400 mt-0.5">
                  Total in DB: <span className="text-slate-200 font-semibold">{item.total}</span> &bull; Used:{' '}
                  <span className="text-rose-400 font-semibold">{item.usedCount}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Sales Revenue</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {settings.currency} {item.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
