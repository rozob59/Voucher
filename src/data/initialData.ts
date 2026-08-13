import { VoucherPackage, AppSettings, Voucher } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  businessName: 'ROZOB WiFi',
  wifiName: 'ROZOB-WIFI-FREE',
  supportPhone: '01321786059',
  address: 'Dhaka, Bangladesh',
  currency: '৳',
  vouchersPerPage: 4,
  defaultPackageId: 'pkg-30'
};

export const DEFAULT_PACKAGES: VoucherPackage[] = [
  {
    id: 'pkg-30',
    packageName: '30 Days Unlimited',
    price: 100,
    validityDays: 30,
    description: '30-day high speed internet access voucher'
  },
  {
    id: 'pkg-15',
    packageName: '15 Days Standard',
    price: 60,
    validityDays: 15,
    description: '15-day internet access voucher'
  },
  {
    id: 'pkg-7',
    packageName: '7 Days Weekly',
    price: 40,
    validityDays: 7,
    description: '7-day internet access voucher'
  },
  {
    id: 'pkg-1',
    packageName: '1 Day Express',
    price: 10,
    validityDays: 1,
    description: '24-hour quick internet voucher'
  }
];

export const SAMPLE_VOUCHERS: Voucher[] = [
  {
    id: 'v-101',
    voucherCode: 'RZB-8K4M-72QP',
    packageName: '30 Days Unlimited',
    price: 100,
    validityDays: 30,
    status: 'AVAILABLE',
    createdDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 28 * 86400000).toISOString()
  },
  {
    id: 'v-102',
    voucherCode: 'RZB-91XP-44KD',
    packageName: '30 Days Unlimited',
    price: 100,
    validityDays: 30,
    status: 'ASSIGNED',
    createdDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    assignedDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 25 * 86400000).toISOString(),
    userName: 'Rahim Ahmed',
    userMobile: '01712345678',
    shopName: 'Rahim Telecom',
    userAddress: 'Mirpur-10, Dhaka',
    deviceName: 'Samsung Galaxy A52',
    macAddress: 'AA:BB:CC:11:22:33',
    notes: 'Paid cash in full'
  },
  {
    id: 'v-103',
    voucherCode: 'RZB-72LM-83QW',
    packageName: '15 Days Standard',
    price: 60,
    validityDays: 15,
    status: 'USED',
    createdDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    assignedDate: new Date(Date.now() - 9 * 86400000).toISOString(),
    usedDate: new Date(Date.now() - 9 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    userName: 'Kabir Hossain',
    userMobile: '01898765432',
    shopName: 'Kabir Store',
    userAddress: 'Uttara, Dhaka',
    deviceName: 'Redmi Note 10',
    macAddress: '12:34:56:78:9A:BC',
    notes: 'Activated on site'
  },
  {
    id: 'v-104',
    voucherCode: 'RZB-45KD-91PX',
    packageName: '7 Days Weekly',
    price: 40,
    validityDays: 7,
    status: 'EXPIRED',
    createdDate: new Date(Date.now() - 40 * 86400000).toISOString(),
    assignedDate: new Date(Date.now() - 38 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() - 31 * 86400000).toISOString(),
    userName: 'Tanvir Alam',
    userMobile: '01555666777',
    shopName: 'Tanvir Cyber',
    userAddress: 'Dhanmondi, Dhaka'
  },
  {
    id: 'v-105',
    voucherCode: 'RZB-82PL-44MN',
    packageName: '30 Days Unlimited',
    price: 100,
    validityDays: 30,
    status: 'AVAILABLE',
    createdDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 29 * 86400000).toISOString()
  }
];
