import { Voucher, VoucherPackage, AppSettings, DashboardStats, BulkImportResult } from '../types';
import { DEFAULT_PACKAGES, DEFAULT_SETTINGS, SAMPLE_VOUCHERS } from '../data/initialData';

const VOUCHERS_KEY = 'rozob_vouchers_db_v1';
const PACKAGES_KEY = 'rozob_packages_db_v1';
const SETTINGS_KEY = 'rozob_settings_db_v1';

export class LocalVoucherDB {
  // Initialize storage if empty
  public static init() {
    if (!localStorage.getItem(VOUCHERS_KEY)) {
      localStorage.setItem(VOUCHERS_KEY, JSON.stringify(SAMPLE_VOUCHERS));
    }
    if (!localStorage.getItem(PACKAGES_KEY)) {
      localStorage.setItem(PACKAGES_KEY, JSON.stringify(DEFAULT_PACKAGES));
    }
    if (!localStorage.getItem(SETTINGS_KEY)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  // Get Settings
  public static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  // Save Settings
  public static saveSettings(settings: AppSettings): AppSettings {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  }

  // Get Packages
  public static getPackages(): VoucherPackage[] {
    try {
      const data = localStorage.getItem(PACKAGES_KEY);
      return data ? JSON.parse(data) : DEFAULT_PACKAGES;
    } catch {
      return DEFAULT_PACKAGES;
    }
  }

  // Save Package
  public static savePackage(pkg: VoucherPackage): VoucherPackage[] {
    const packages = this.getPackages();
    const index = packages.findIndex(p => p.id === pkg.id);
    if (index >= 0) {
      packages[index] = pkg;
    } else {
      packages.unshift(pkg);
    }
    localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
    return packages;
  }

  // Delete Package
  public static deletePackage(id: string): VoucherPackage[] {
    const packages = this.getPackages().filter(p => p.id !== id);
    localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
    return packages;
  }

  // Get all raw vouchers with auto-expiry check
  public static getAllVouchers(): Voucher[] {
    try {
      const data = localStorage.getItem(VOUCHERS_KEY);
      const vouchers: Voucher[] = data ? JSON.parse(data) : SAMPLE_VOUCHERS;
      const now = new Date().getTime();

      let modified = false;
      const updated = vouchers.map(v => {
        if (v.isDeleted) return v;
        // Calculate expiry if not explicitly set
        if (!v.expiryDate && v.createdDate && v.validityDays) {
          const created = new Date(v.createdDate).getTime();
          v.expiryDate = new Date(created + v.validityDays * 86400000).toISOString();
          modified = true;
        }

        // Auto check if expired
        if (v.status !== 'USED' && v.expiryDate) {
          const expiryTime = new Date(v.expiryDate).getTime();
          if (now > expiryTime && v.status !== 'EXPIRED') {
            v.status = 'EXPIRED';
            modified = true;
          }
        }
        return v;
      });

      if (modified) {
        localStorage.setItem(VOUCHERS_KEY, JSON.stringify(updated));
      }

      return updated;
    } catch {
      return SAMPLE_VOUCHERS;
    }
  }

  // Get active vouchers (not soft deleted)
  public static getActiveVouchers(): Voucher[] {
    return this.getAllVouchers().filter(v => !v.isDeleted);
  }

  // Get deleted vouchers in trash
  public static getTrashVouchers(): Voucher[] {
    return this.getAllVouchers().filter(v => v.isDeleted);
  }

  // Add / Save Voucher
  public static saveVoucher(voucher: Voucher): Voucher[] {
    const vouchers = this.getAllVouchers();
    const index = vouchers.findIndex(v => v.id === voucher.id);
    if (index >= 0) {
      vouchers[index] = voucher;
    } else {
      vouchers.unshift(voucher);
    }
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    return vouchers;
  }

  // Parse Bulk Import
  public static parseBulkImport(rawText: string): BulkImportResult {
    const lines = rawText.split(/\r?\n/);
    const validCodesSet = new Set<string>();
    const duplicateInInputSet = new Set<string>();
    let emptyOrInvalidCount = 0;

    const existingVouchers = this.getAllVouchers();
    const existingCodes = new Set(existingVouchers.map(v => v.voucherCode.trim().toUpperCase()));

    for (let line of lines) {
      const code = line.trim().toUpperCase();
      if (!code) {
        emptyOrInvalidCount++;
        continue;
      }

      // Check if duplicate in existing database or duplicate in current input
      if (existingCodes.has(code) || validCodesSet.has(code)) {
        duplicateInInputSet.add(code);
      } else {
        validCodesSet.add(code);
      }
    }

    return {
      totalPasted: lines.length,
      validNewCodes: Array.from(validCodesSet),
      duplicateCodes: Array.from(duplicateInInputSet),
      emptyOrInvalidCount
    };
  }

  // Execute Bulk Import
  public static importBulkVouchers(
    codes: string[],
    packageName: string,
    price: number,
    validityDays: number
  ): Voucher[] {
    const vouchers = this.getAllVouchers();
    const nowISO = new Date().toISOString();
    const expiryISO = new Date(Date.now() + validityDays * 86400000).toISOString();

    const newVouchers: Voucher[] = codes.map((code, idx) => ({
      id: `v-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      voucherCode: code,
      packageName,
      price,
      validityDays,
      status: 'AVAILABLE',
      createdDate: nowISO,
      expiryDate: expiryISO
    }));

    const updated = [...newVouchers, ...vouchers];
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(updated));
    return updated;
  }

  // Mark status (e.g. USED or AVAILABLE)
  public static updateStatus(id: string, status: Voucher['status']): Voucher[] {
    const vouchers = this.getAllVouchers();
    const v = vouchers.find(item => item.id === id);
    if (v) {
      v.status = status;
      if (status === 'USED') {
        v.usedDate = new Date().toISOString();
      } else if (status === 'AVAILABLE') {
        v.usedDate = undefined;
      } else if (status === 'ASSIGNED') {
        v.assignedDate = new Date().toISOString();
      }
      localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    }
    return vouchers;
  }

  // Bulk status update
  public static bulkUpdateStatus(ids: string[], status: Voucher['status']): Voucher[] {
    const vouchers = this.getAllVouchers();
    const now = new Date().toISOString();
    vouchers.forEach(v => {
      if (ids.includes(v.id)) {
        v.status = status;
        if (status === 'USED') v.usedDate = now;
        if (status === 'ASSIGNED') v.assignedDate = now;
      }
    });
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    return vouchers;
  }

  // Soft delete (Move to Trash)
  public static deleteVoucher(id: string): Voucher[] {
    const vouchers = this.getAllVouchers();
    const v = vouchers.find(item => item.id === id);
    if (v) {
      v.isDeleted = true;
      v.deletedAt = new Date().toISOString();
      localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    }
    return vouchers;
  }

  // Bulk soft delete
  public static bulkDelete(ids: string[]): Voucher[] {
    const vouchers = this.getAllVouchers();
    const now = new Date().toISOString();
    vouchers.forEach(v => {
      if (ids.includes(v.id)) {
        v.isDeleted = true;
        v.deletedAt = now;
      }
    });
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    return vouchers;
  }

  // Restore from trash
  public static restoreVoucher(id: string): Voucher[] {
    const vouchers = this.getAllVouchers();
    const v = vouchers.find(item => item.id === id);
    if (v) {
      v.isDeleted = false;
      v.deletedAt = undefined;
      localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    }
    return vouchers;
  }

  // Permanently delete from trash
  public static permanentDelete(id: string): Voucher[] {
    const vouchers = this.getAllVouchers().filter(v => v.id !== id);
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    return vouchers;
  }

  // Empty trash
  public static emptyTrash(): Voucher[] {
    const vouchers = this.getAllVouchers().filter(v => !v.isDeleted);
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    return vouchers;
  }

  // Save User Details on Voucher
  public static saveUserDetails(
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
  ): Voucher[] {
    const vouchers = this.getAllVouchers();
    const v = vouchers.find(item => item.id === id);
    if (v) {
      v.userName = details.userName;
      v.userMobile = details.userMobile;
      v.shopName = details.shopName;
      v.userAddress = details.userAddress;
      v.deviceName = details.deviceName;
      v.macAddress = details.macAddress;
      v.notes = details.notes;

      if (v.status === 'AVAILABLE' && (details.userName || details.userMobile)) {
        v.status = 'ASSIGNED';
        v.assignedDate = new Date().toISOString();
      }
      localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    }
    return vouchers;
  }

  // Calculate Dashboard Statistics
  public static getStats(): DashboardStats {
    const active = this.getActiveVouchers();
    let available = 0;
    let assigned = 0;
    let used = 0;
    let expired = 0;
    let totalRevenue = 0;
    let potentialRevenue = 0;

    active.forEach(v => {
      potentialRevenue += (v.price || 0);
      if (v.status === 'AVAILABLE') available++;
      else if (v.status === 'ASSIGNED') assigned++;
      else if (v.status === 'USED') {
        used++;
        totalRevenue += (v.price || 0);
      } else if (v.status === 'EXPIRED') expired++;
    });

    return {
      total: active.length,
      available,
      assigned,
      used,
      expired,
      totalRevenue,
      potentialRevenue
    };
  }

  // Export Complete Backup JSON
  public static exportBackupJSON(): string {
    const backup = {
      app: 'ROZOB WiFi Voucher Manager',
      exportDate: new Date().toISOString(),
      vouchers: this.getAllVouchers(),
      packages: this.getPackages(),
      settings: this.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  }

  // Import Backup JSON
  public static importBackupJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data && Array.isArray(data.vouchers)) {
        localStorage.setItem(VOUCHERS_KEY, JSON.stringify(data.vouchers));
        if (Array.isArray(data.packages)) {
          localStorage.setItem(PACKAGES_KEY, JSON.stringify(data.packages));
        }
        if (data.settings) {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Backup import error:', e);
      return false;
    }
  }
}

LocalVoucherDB.init();
