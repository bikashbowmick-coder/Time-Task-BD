
export type UserRole = 'user' | 'admin';

export interface UserPaymentMethod {
  id: string;
  methodName: string;
  accountName: string;
  accountNumber: string;
  isConfigured: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  balance: number;
  totalEarnings: number;
  avatar?: string;
  paymentMethods?: UserPaymentMethod[];
  paymentPin?: string; // 4-6 digit pin
  pinResetAt?: number; // timestamp of last pin change
  failedPinAttempts?: number;
  isWithdrawLocked?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  displayName: string;
  rating: number;
  comment: string;
  location?: string;
  createdAt: number;
}

export interface AppNotification {
  id: string;
  userId: string; // Target user, 'admin' for admins, or 'all' for everyone
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: number;
}

export interface MarketAssignment {
  id: string;
  platformId: string;
  platformName: string;
  targetQuantity: number;
  currentQuantity: number;
  pricePerUnit: number;
  instructions?: string;
  status: 'active' | 'completed';
  createdAt: number;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  avatar?: string;
  totalSubmissions: number;
  todayEarnings: number;
  score: number;
  rank: number;
}

export interface PlatformPrice {
  id: string;
  name: string;
  todayPrice: number;
  regularPrice: number;
  status: 'buying' | 'closed';
  updatedAt: number;
}

export interface Submission {
  id: string;
  userId: string;
  userEmail: string;
  platformId: string;
  platformName: string;
  quantity: number;
  verifiedQuantity?: number;
  failedQuantity?: number;
  pricePerUnit: number;
  details: string;
  sheetLink?: string;
  csvContent?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  processedAt?: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  method: string;
  address: string;
  status: 'pending' | 'paid' | 'rejected';
  createdAt: number;
  transactionId?: string; // Admin-provided reference
}

export interface SiteStats {
  totalUsers: number;
  totalPayouts: number;
  accountsToday: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  authorRole: string;
  date: string;
  category: string;
  image: string;
}
