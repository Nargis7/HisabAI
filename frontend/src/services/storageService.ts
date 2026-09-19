import { Customer, Product, Transaction, Order, NotificationItem, ShopPulseItem } from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_TRANSACTIONS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const STORAGE_KEYS = {
  CUSTOMERS: 'dukaansaathi_customers_v1',
  TRANSACTIONS: 'dukaansaathi_transactions_v1',
  PRODUCTS: 'dukaansaathi_products_v1',
  ORDERS: 'dukaansaathi_orders_v1',
  NOTIFICATIONS: 'dukaansaathi_notifications_v1',
};

// Helper for safe JSON localStorage reading
function readStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch (err) {
    console.warn(`[DukaanSaathi Storage] Error reading ${key}:`, err);
    return defaultValue;
  }
}

// Helper for safe JSON localStorage writing
function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger window storage event for any external listeners
    window.dispatchEvent(new Event('dukaansaathi_data_change'));
  } catch (err) {
    console.error(`[DukaanSaathi Storage] Error writing to ${key}:`, err);
  }
}

export const storageService = {
  // --- CUSTOMERS ---
  getCustomers(): Customer[] {
    return readStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  },

  saveCustomer(customer: Customer): Customer {
    const customers = this.getCustomers();
    const existingIndex = customers.findIndex((c) => c.id === customer.id);
    let updated: Customer[];
    if (existingIndex >= 0) {
      updated = [...customers];
      updated[existingIndex] = customer;
    } else {
      updated = [customer, ...customers];
    }
    writeStorage(STORAGE_KEYS.CUSTOMERS, updated);
    return customer;
  },

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = customers[index];
    const updatedCustomer: Customer = {
      ...current,
      ...updates,
      // preserve timeline if not provided
      timeline: updates.timeline !== undefined ? updates.timeline : current.timeline
    };

    customers[index] = updatedCustomer;
    writeStorage(STORAGE_KEYS.CUSTOMERS, customers);
    return updatedCustomer;
  },

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filtered = customers.filter((c) => c.id !== id);
    if (filtered.length === customers.length) return false;
    writeStorage(STORAGE_KEYS.CUSTOMERS, filtered);
    return true;
  },

  settleCustomerBalance(customerId: string, paymentMethod: string = 'UPI'): Customer | null {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === customerId);
    if (index === -1) return null;

    const current = customers[index];
    const amountSettled = current.outstandingAmount;
    if (amountSettled <= 0) return current;

    const updatedTimeline = [
      {
        id: `tl-${Date.now()}`,
        type: 'payment' as const,
        date: 'Today, Just now',
        relativeTime: 'Today',
        title: 'Payment Received (Balance Settled)',
        description: `Full outstanding balance of ₹${amountSettled} settled via ${paymentMethod}.`,
        amount: amountSettled,
        paymentStatus: 'paid' as const,
        paymentMethod: (paymentMethod as any) || 'UPI'
      },
      ...current.timeline
    ];

    const updatedCustomer: Customer = {
      ...current,
      outstandingAmount: 0,
      promisedDueDate: undefined,
      status: 'returning',
      statusLabel: 'Returning Customer',
      timeline: updatedTimeline
    };

    customers[index] = updatedCustomer;
    writeStorage(STORAGE_KEYS.CUSTOMERS, customers);
    return updatedCustomer;
  },

  // --- TRANSACTIONS ---
  getTransactions(): Transaction[] {
    return readStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  },

  saveTransaction(transaction: Transaction): Transaction {
    const transactions = this.getTransactions();
    const updated = [transaction, ...transactions];
    writeStorage(STORAGE_KEYS.TRANSACTIONS, updated);

    // Synchronize customer relationship memory
    const customers = this.getCustomers();
    const custIndex = customers.findIndex((c) => c.id === transaction.customerId);
    if (custIndex >= 0) {
      const cust = customers[custIndex];
      const newOutstanding = cust.outstandingAmount + (transaction.balancePending || 0);
      const itemsSummary = transaction.items.map((i) => `${i.quantity} ${i.unit} ${i.productName}`).join(', ');

      const updatedCustomer: Customer = {
        ...cust,
        outstandingAmount: newOutstanding,
        promisedDueDate: transaction.dueDate || cust.promisedDueDate,
        lifetimePurchases: cust.lifetimePurchases + transaction.totalAmount,
        visitsCount: cust.visitsCount + 1,
        lastPurchaseDate: transaction.date || 'Today',
        lastPurchaseSummary: itemsSummary || cust.lastPurchaseSummary,
        status: newOutstanding > 0 ? 'payment-pending' : 'returning',
        statusLabel: newOutstanding > 0 ? 'Payment Pending' : 'Returning Customer',
        timeline: [
          {
            id: `tl-${Date.now()}`,
            date: transaction.date || 'Today',
            relativeTime: 'Today',
            title: `Counter Purchase: ${transaction.items.map((i) => i.productName).join(' + ')}`,
            description: `Recorded via ${transaction.recordedVia === 'voice_ai' ? 'Voice AI' : 'Counter'}. Balance ₹${transaction.balancePending} ${transaction.dueDate ? `due by ${transaction.dueDate}` : ''}.`,
            type: 'purchase',
            amount: transaction.totalAmount,
            paymentStatus: transaction.paymentStatus,
            paymentMethod: transaction.paymentMethod,
            amountPaid: transaction.amountPaid,
            dueAmount: transaction.balancePending,
            dueDate: transaction.dueDate,
            items: transaction.items.map((it) => ({
              name: it.productName,
              quantity: `${it.quantity} ${it.unit}`,
              price: it.totalPrice
            }))
          },
          ...cust.timeline
        ]
      };

      customers[custIndex] = updatedCustomer;
      writeStorage(STORAGE_KEYS.CUSTOMERS, customers);
    }

    return transaction;
  },

  deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    if (filtered.length === transactions.length) return false;
    writeStorage(STORAGE_KEYS.TRANSACTIONS, filtered);
    return true;
  },

  // --- PRODUCTS / INVENTORY ---
  getProducts(): Product[] {
    return readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  },

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    let updated: Product[];
    if (existingIndex >= 0) {
      updated = [...products];
      updated[existingIndex] = product;
    } else {
      updated = [product, ...products];
    }
    writeStorage(STORAGE_KEYS.PRODUCTS, updated);
    return product;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const current = products[index];
    const newStock = updates.stock !== undefined ? updates.stock : current.stock;
    const minThreshold = updates.minAlertThreshold !== undefined ? updates.minAlertThreshold : current.minAlertThreshold;

    const updatedProduct: Product = {
      ...current,
      ...updates,
      stock: newStock,
      status: newStock <= 0 ? 'out_of_stock' : newStock <= minThreshold ? 'low' : 'healthy'
    };

    products[index] = updatedProduct;
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
    return updatedProduct;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    writeStorage(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },

  updateStock(productId: string, newStock: number): Product | null {
    return this.updateProduct(productId, { stock: Math.max(0, newStock) });
  },

  // --- ORDERS ---
  getOrders(): Order[] {
    return readStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  saveOrder(order: Order): Order {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex((o) => o.id === order.id);
    let updated: Order[];
    if (existingIndex >= 0) {
      updated = [...orders];
      updated[existingIndex] = order;
    } else {
      updated = [order, ...orders];
    }
    writeStorage(STORAGE_KEYS.ORDERS, updated);

    // Update customer active orders count if matching
    const customers = this.getCustomers();
    const custIndex = customers.findIndex((c) => c.id === order.customerId);
    if (custIndex >= 0) {
      const activeCount = updated.filter((o) => o.customerId === order.customerId && o.status !== 'completed').length;
      customers[custIndex] = {
        ...customers[custIndex],
        activeOrdersCount: activeCount
      };
      writeStorage(STORAGE_KEYS.CUSTOMERS, customers);
    }

    return order;
  },

  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const updatedOrder: Order = {
      ...orders[index],
      status
    };
    orders[index] = updatedOrder;
    writeStorage(STORAGE_KEYS.ORDERS, orders);

    // Sync customer's active orders count
    const customers = this.getCustomers();
    const custIndex = customers.findIndex((c) => c.id === updatedOrder.customerId);
    if (custIndex >= 0) {
      const activeCount = orders.filter(
        (o) => o.customerId === updatedOrder.customerId && o.status !== 'completed'
      ).length;
      customers[custIndex] = {
        ...customers[custIndex],
        activeOrdersCount: activeCount
      };
      writeStorage(STORAGE_KEYS.CUSTOMERS, customers);
    }

    return updatedOrder;
  },

  deleteOrder(id: string): boolean {
    const orders = this.getOrders();
    const target = orders.find((o) => o.id === id);
    const filtered = orders.filter((o) => o.id !== id);
    if (filtered.length === orders.length) return false;
    writeStorage(STORAGE_KEYS.ORDERS, filtered);

    if (target) {
      const customers = this.getCustomers();
      const custIndex = customers.findIndex((c) => c.id === target.customerId);
      if (custIndex >= 0) {
        const activeCount = filtered.filter(
          (o) => o.customerId === target.customerId && o.status !== 'completed'
        ).length;
        customers[custIndex] = {
          ...customers[custIndex],
          activeOrdersCount: activeCount
        };
        writeStorage(STORAGE_KEYS.CUSTOMERS, customers);
      }
    }

    return true;
  },

  // --- NOTIFICATIONS ---
  getNotifications(): NotificationItem[] {
    return readStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  saveNotification(notification: NotificationItem): void {
    const notifications = this.getNotifications();
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, [notification, ...notifications]);
  },

  markNotificationsRead(): void {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // --- DERIVED SHOP PULSE (Dynamically generated from real persistent data) ---
  deriveShopPulse(customers: Customer[], products: Product[], orders: Order[]): ShopPulseItem[] {
    const pulseItems: ShopPulseItem[] = [];

    // 1. Pending payment commitments (Udhaar due)
    const overdueCustomers = customers.filter((c) => c.outstandingAmount > 0);
    overdueCustomers.forEach((c) => {
      pulseItems.push({
        id: `pulse-due-${c.id}`,
        type: 'payment_due',
        category: 'attention',
        title: `Payment Due: ${c.name} — ₹${c.outstandingAmount}`,
        subtitle: c.promisedDueDate ? `Promised by ${c.promisedDueDate}` : 'Neighbourhood khata commitment',
        amount: c.outstandingAmount,
        badgeText: 'Payment Due',
        badgeSeverity: 'warning',
        actionTarget: 'commitments'
      });
    });

    // 2. Low or Out of Stock Inventory items
    const alertProducts = products.filter((p) => p.status === 'low' || p.status === 'out_of_stock');
    alertProducts.forEach((p) => {
      pulseItems.push({
        id: `pulse-stock-${p.id}`,
        type: 'low_stock',
        category: 'attention',
        title: `${p.status === 'out_of_stock' ? 'Out of Stock' : 'Low Stock Alert'}: ${p.name}`,
        subtitle: `${p.stock} ${p.unit} remaining in store (Alert threshold: ${p.minAlertThreshold} ${p.unit})`,
        badgeText: p.status === 'out_of_stock' ? 'Out of Stock' : 'Restock',
        badgeSeverity: p.status === 'out_of_stock' ? 'critical' : 'warning',
        actionTarget: 'inventory'
      });
    });

    // 3. Orders ready for pickup
    const readyOrders = orders.filter((o) => o.status === 'ready');
    readyOrders.forEach((o) => {
      pulseItems.push({
        id: `pulse-order-${o.id}`,
        type: 'order_ready',
        category: 'attention',
        title: `Order Ready for Pickup: ${o.customerName} (${o.orderNumber})`,
        subtitle: `${o.itemsSummary} — Scheduled: ${o.pickupDate}`,
        amount: o.totalAmount,
        badgeText: 'Ready for Pickup',
        badgeSeverity: 'info',
        actionTarget: 'orders'
      });
    });

    // 4. Orders currently being prepared (Upcoming flow)
    const preparingOrders = orders.filter((o) => o.status === 'pending');
    preparingOrders.forEach((o) => {
      pulseItems.push({
        id: `pulse-prep-${o.id}`,
        type: 'upcoming_flow',
        category: 'upcoming',
        title: `Advance Order: ${o.customerName} (${o.orderNumber})`,
        subtitle: `${o.itemsSummary} — Scheduled: ${o.pickupDate}`,
        amount: o.totalAmount,
        badgeText: 'Preparing',
        badgeSeverity: 'info',
        actionTarget: 'orders'
      });
    });

    return pulseItems;
  },

  markAllNotificationsRead(): void {
    this.markNotificationsRead();
  },

  // Load realistic sample data into storage (for preview/testing)
  loadSampleData(): void {
    writeStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    writeStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    writeStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    writeStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    window.dispatchEvent(new Event('dukaansaathi_data_change'));
  },

  // Reset all to empty
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    window.dispatchEvent(new Event('dukaansaathi_data_change'));
  }
};
