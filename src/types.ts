export type VoucherStatus = 'AVAILABLE' | 'ASSIGNED' | 'USED' | 'EXPIRED';

export interface Voucher {
  id: string;
  voucherCode: string;
  packageName: string;
  price: number;
  validityDays: number;
  status: VoucherStatus;
  createdDate: string; // ISO date string
  assignedDate?: string;
  usedDate?: string;
  expiryDate?: string;
  userName?: string;
  userMobile?: string;
  userAddress?: string;
  shopName?: string;
  deviceName?: string;
  macAddress?: string;
  notes?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface VoucherPackage {
  id: string;
  packageName: string;
  price: number;
  validityDays: number;
  description?: string;
}

export interface AppSettings {
  businessName: string;
  wifiName: string;
  supportPhone: string;
  address: string;
  currency: string;
  vouchersPerPage: number; // default 4 for A4
  defaultPackageId: string;
}

export interface BulkImportResult {
  totalPasted: number;
  validNewCodes: string[];
  duplicateCodes: string[];
  emptyOrInvalidCount: number;
}

export interface DashboardStats {
  total: number;
  available: number;
  assigned: number;
  used: number;
  expired: number;
  totalRevenue: number;
  potentialRevenue: number;
}

export interface FilterOptions {
  searchQuery: string;
  status: 'ALL' | VoucherStatus;
  sortBy: 'NEWEST' | 'OLDEST' | 'CODE' | 'STATUS' | 'USER';
  packageFilter: string;
}
