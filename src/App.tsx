import React, { useState, useEffect, useCallback } from 'react';
import { Voucher, VoucherPackage, AppSettings, DashboardStats } from './types';
import { LocalVoucherDB } from './services/db';
import { VoucherPdfService } from './services/pdf';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { VoucherListView } from './components/VoucherListView';
import { BulkImportView } from './components/BulkImportView';
import { PackageManagerView } from './components/PackageManagerView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';

import { UserEditModal } from './components/UserEditModal';
import { VoucherDetailModal } from './components/VoucherDetailModal';
import { TrashBinModal } from './components/TrashBinModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Database State
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [trashVouchers, setTrashVouchers] = useState<Voucher[]>([]);
  const [packages, setPackages] = useState<VoucherPackage[]>([]);
  const [settings, setSettings] = useState<AppSettings>(LocalVoucherDB.getSettings());
  const [stats, setStats] = useState<DashboardStats>(LocalVoucherDB.getStats());

  // Modals & Popups State
  const [userModalVoucher, setUserModalVoucher] = useState<Voucher | null>(null);
  const [detailModalVoucher, setDetailModalVoucher] = useState<Voucher | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load latest data from LocalVoucherDB
  const refreshData = useCallback(() => {
    const active = LocalVoucherDB.getActiveVouchers();
    const trash = LocalVoucherDB.getTrashVouchers();
    const pkgs = LocalVoucherDB.getPackages();
    const setts = LocalVoucherDB.getSettings();
    const st = LocalVoucherDB.getStats();

    setVouchers(active);
    setTrashVouchers(trash);
    setPackages(pkgs);
    setSettings(setts);
    setStats(st);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      id: Date.now().toString(),
      type,
      message
    });
  };

  // One-Click Copy Full Info
  const handleCopyFull = (v: Voucher) => {
    const text = [
      settings.businessName,
      '',
      `Voucher: ${v.voucherCode}`,
      `Package: ${v.packageName}`,
      `Price: ${settings.currency} ${v.price}`,
      `Validity: ${v.validityDays} Days`,
      `Status: ${v.status}`,
      v.userName ? `User: ${v.userName}` : '',
      v.userMobile ? `Mobile: ${v.userMobile}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text);
    showToast('success', 'Voucher copied.');
  };

  // Copy Code Only
  const handleCopyCodeOnly = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('success', `Voucher code copied: ${code}`);
  };

  // Download Single PDF
  const handleDownloadPdf = (v: Voucher) => {
    try {
      VoucherPdfService.generateSingleVoucherPdf(v, settings);
      showToast('success', `PDF generated for ${v.voucherCode}`);
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to generate PDF.');
    }
  };

  // Export Bulk PDF
  const handleExportAllPdf = (customList?: Voucher[]) => {
    const listToExport = customList && customList.length > 0 ? customList : vouchers;
    if (listToExport.length === 0) {
      showToast('info', 'No vouchers available to export.');
      return;
    }

    try {
      VoucherPdfService.generateBulkPdf(listToExport, settings);
      showToast('success', `Exported ${listToExport.length} vouchers to PDF.`);
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to generate bulk PDF.');
    }
  };

  // Toggle Status (e.g. Mark as Used / Mark as Available)
  const handleToggleStatus = (id: string, currentStatus: Voucher['status']) => {
    if (currentStatus === 'USED') {
      if (window.confirm('Mark this voucher as AVAILABLE again?')) {
        LocalVoucherDB.updateStatus(id, 'AVAILABLE');
        refreshData();
        showToast('info', 'Status updated to AVAILABLE.');
      }
    } else {
      if (window.confirm('Are you sure you want to mark this voucher as USED?')) {
        LocalVoucherDB.updateStatus(id, 'USED');
        refreshData();
        showToast('success', 'Voucher marked as USED.');
      }
    }
  };

  // Single Delete (Soft Delete)
  const handleDeleteVoucher = (v: Voucher) => {
    if (window.confirm(`Delete voucher ${v.voucherCode}? It can be restored from Trash Bin.`)) {
      LocalVoucherDB.deleteVoucher(v.id);
      refreshData();
      showToast('info', 'Voucher moved to Trash.');
    }
  };

  // Share Voucher via Web Share API or Clipboard Fallback
  const handleShareVoucher = async (v: Voucher) => {
    const text = `${settings.businessName} WiFi Voucher: ${v.voucherCode} | Package: ${v.packageName} | Price: ${settings.currency}${v.price}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${settings.businessName} Voucher`,
          text: text
        });
      } catch (e) {
        // Share dismissed or not allowed
      }
    } else {
      navigator.clipboard.writeText(text);
      showToast('info', 'Voucher share text copied to clipboard.');
    }
  };

  // Bulk Operations
  const handleBulkCopy = (selected: Voucher[]) => {
    const codes = selected.map(v => v.voucherCode).join('\n');
    navigator.clipboard.writeText(codes);
    showToast('success', `Copied ${selected.length} voucher codes.`);
  };

  const handleBulkShare = (selected: Voucher[]) => {
    const text = selected.map(v => `${v.voucherCode} (${v.packageName})`).join('\n');
    if (navigator.share) {
      navigator.share({ title: 'Selected Vouchers', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('info', 'Copied selected vouchers text.');
    }
  };

  const handleBulkDelete = (selectedIds: string[]) => {
    if (window.confirm(`Delete ${selectedIds.length} selected vouchers?`)) {
      LocalVoucherDB.bulkDelete(selectedIds);
      refreshData();
      showToast('info', `Moved ${selectedIds.length} vouchers to Trash.`);
    }
  };

  const handleBulkMarkUsed = (selectedIds: string[]) => {
    if (window.confirm(`Mark ${selectedIds.length} selected vouchers as USED?`)) {
      LocalVoucherDB.bulkUpdateStatus(selectedIds, 'USED');
      refreshData();
      showToast('success', `Marked ${selectedIds.length} vouchers as USED.`);
    }
  };

  // User details save handler
  const handleSaveUserDetails = (id: string, details: any) => {
    LocalVoucherDB.saveUserDetails(id, details);
    refreshData();
    showToast('success', 'User details saved successfully.');
  };

  // Backup handlers
  const handleExportBackup = () => {
    const json = LocalVoucherDB.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rozob_wifi_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Offline JSON backup downloaded.');
  };

  const handleImportBackup = (jsonStr: string) => {
    const ok = LocalVoucherDB.importBackupJSON(jsonStr);
    if (ok) {
      refreshData();
      showToast('success', 'Database backup restored.');
    }
    return ok;
  };

  // Package Management Handlers
  const handleSavePackage = (pkg: VoucherPackage) => {
    LocalVoucherDB.savePackage(pkg);
    refreshData();
    showToast('success', `Package "${pkg.packageName}" saved.`);
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm('Delete this package preset?')) {
      LocalVoucherDB.deletePackage(id);
      refreshData();
      showToast('info', 'Package deleted.');
    }
  };

  // Settings Save Handler
  const handleSaveSettings = (newSettings: AppSettings) => {
    LocalVoucherDB.saveSettings(newSettings);
    refreshData();
    showToast('success', 'Application settings updated.');
  };

  // Trash Bin Handlers
  const handleRestoreTrash = (id: string) => {
    LocalVoucherDB.restoreVoucher(id);
    refreshData();
    showToast('success', 'Voucher restored from trash.');
  };

  const handlePermanentDelete = (id: string) => {
    if (window.confirm('Permanently delete this voucher? This cannot be undone.')) {
      LocalVoucherDB.permanentDelete(id);
      refreshData();
      showToast('info', 'Voucher permanently deleted.');
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Empty entire trash bin permanently?')) {
      LocalVoucherDB.emptyTrash();
      refreshData();
      showToast('info', 'Trash bin emptied.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Fixed Header */}
      <Navbar
        businessName={settings.businessName}
        wifiName={settings.wifiName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        trashCount={trashVouchers.length}
        onOpenTrash={() => setIsTrashOpen(true)}
        onExportBackup={handleExportBackup}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            recentVouchers={vouchers}
            settings={settings}
            setActiveTab={setActiveTab}
            onOpenBulkImport={() => setActiveTab('import')}
            onExportAllPdf={() => handleExportAllPdf()}
            onCopyFull={handleCopyFull}
            onCopyCodeOnly={handleCopyCodeOnly}
            onDownloadPdf={handleDownloadPdf}
            onOpenUserModal={setUserModalVoucher}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteVoucher}
            onShare={handleShareVoucher}
            onViewDetails={setDetailModalVoucher}
          />
        )}

        {activeTab === 'vouchers' && (
          <VoucherListView
            vouchers={vouchers}
            packages={packages}
            settings={settings}
            onCopyFull={handleCopyFull}
            onCopyCodeOnly={handleCopyCodeOnly}
            onDownloadPdf={handleDownloadPdf}
            onOpenUserModal={setUserModalVoucher}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteVoucher}
            onShare={handleShareVoucher}
            onViewDetails={setDetailModalVoucher}
            onBulkCopy={handleBulkCopy}
            onBulkShare={handleBulkShare}
            onBulkExportPdf={handleExportAllPdf}
            onBulkDelete={handleBulkDelete}
            onBulkMarkUsed={handleBulkMarkUsed}
          />
        )}

        {activeTab === 'import' && (
          <BulkImportView
            packages={packages}
            settings={settings}
            onImportComplete={(count) => {
              refreshData();
              showToast('success', `Successfully imported ${count} vouchers.`);
              setActiveTab('vouchers');
            }}
            onClose={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'packages' && (
          <PackageManagerView
            packages={packages}
            settings={settings}
            onSavePackage={handleSavePackage}
            onDeletePackage={handleDeletePackage}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            stats={stats}
            vouchers={vouchers}
            packages={packages}
            settings={settings}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            trashCount={trashVouchers.length}
            onSaveSettings={handleSaveSettings}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onOpenTrash={() => setIsTrashOpen(true)}
            onOpenPackageManager={() => setActiveTab('packages')}
          />
        )}
      </main>

      {/* Bottom Mobile Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modal Dialogs */}
      {userModalVoucher && (
        <UserEditModal
          voucher={userModalVoucher}
          onSave={handleSaveUserDetails}
          onClose={() => setUserModalVoucher(null)}
        />
      )}

      {detailModalVoucher && (
        <VoucherDetailModal
          voucher={detailModalVoucher}
          settings={settings}
          onClose={() => setDetailModalVoucher(null)}
          onCopyFull={handleCopyFull}
          onDownloadPdf={handleDownloadPdf}
          onOpenUserModal={setUserModalVoucher}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteVoucher}
          onShare={handleShareVoucher}
        />
      )}

      {isTrashOpen && (
        <TrashBinModal
          trashVouchers={trashVouchers}
          onRestore={handleRestoreTrash}
          onPermanentDelete={handlePermanentDelete}
          onEmptyTrash={handleEmptyTrash}
          onClose={() => setIsTrashOpen(false)}
        />
      )}

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
