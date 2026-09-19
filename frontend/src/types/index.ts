export type NavigationTab = 
  | 'dashboard'
  | 'customers'
  | 'sales'
  | 'inventory'
  | 'orders'
  | 'commitments'
  | 'khata-migration'
  | 'login';

export type CustomerStatus = 'frequent' | 'returning' | 'new' | 'payment-pending';

export interface TimelineItem {
  id: string;
  type: 'purchase' | 'payment' | 'return' | 'warranty' | 'note';
  date: string;
  relativeTime: string;
  title: string;
  description: string;
  amount?: number;
  paymentStatus?: 'paid' | 'pending' | 'partially-paid';
  paymentMethod?: 'UPI' | 'Cash' | 'Card' | 'Credit / Khata';
  amountPaid?: number;
  dueAmount?: number;
  dueDate?: string;
  items?: Array<{ name: string; quantity: string; price: number }>;
  warrantyExpiry?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarBg?: string;
  address?: string;
  status: CustomerStatus;
  statusLabel: string;
  lifetimePurchases: number;
  outstandingAmount: number;
  visitsCount: number;
  activeOrdersCount: number;
  lastPurchaseDate: string;
  lastPurchaseSummary: string;
  promisedDueDate?: string;
  shopkeeperNotes?: string;
  timeline: TimelineItem[];
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  stock: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  minAlertThreshold: number;
  status: 'healthy' | 'low' | 'out_of_stock';
  barcode?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  timestamp: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  amountPaid: number;
  balancePending: number;
  paymentStatus: 'paid' | 'pending' | 'partially-paid';
  paymentMethod: 'UPI' | 'Cash' | 'Card' | 'Credit / Khata';
  dueDate?: string;
  notes?: string;
  recordedVia: 'manual' | 'voice_ai' | 'khata_scan';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  itemsSummary: string;
  totalAmount: number;
  depositPaid: number;
  pickupDate: string;
  status: 'pending' | 'ready' | 'completed';
  items: Array<{ name: string; quantity: string; price: number }>;
}

export interface KhataExtractedRow {
  id: string;
  rawText: string;
  customerName: string;
  phoneEstimate: string;
  items: string;
  amount: number;
  dueDate: string;
  confidenceScore: number;
  status: 'pending_review' | 'confirmed' | 'rejected' | 'edited';
}

export interface ShopPulseItem {
  id: string;
  type: 'payment_due' | 'low_stock' | 'order_ready' | 'upcoming_flow';
  category: 'attention' | 'upcoming';
  title: string;
  subtitle: string;
  amount?: number;
  badgeText: string;
  badgeSeverity: 'warning' | 'critical' | 'info' | 'success';
  actionTarget: string;
  actionLabel?: string;
}

export interface NotificationItem {
  id: string;
  type: 'payment' | 'inventory' | 'order' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionableId?: string;
}
