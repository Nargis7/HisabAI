import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  Customer,
  Transaction,
  Order,
  Product,
  ShopPulseItem,
  NotificationItem,
  KhataExtractedRow
} from './types';
import { storageService } from './services/storageService';

// Layouts
import { Sidebar } from './components/layouts/Sidebar';
import { Header } from './components/layouts/Header';
import { MobileNav } from './components/layouts/MobileNav';

// Modals
import { ScanCustomerModal } from './components/modals/ScanCustomerModal';
import { NewCustomerModal } from './components/modals/NewCustomerModal';
import { EditCustomerModal } from './components/modals/EditCustomerModal';
import { NewTransactionModal } from './components/modals/NewTransactionModal';
import { VoiceTransactionModal } from './components/modals/VoiceTransactionModal';
import { MemorySearchModal } from './components/modals/MemorySearchModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { SendReminderModal } from './components/modals/SendReminderModal';

// Pages
import { DashboardPage } from './components/pages/DashboardPage';
import { CustomersPage } from './components/pages/CustomersPage';
import { SalesPage } from './components/pages/SalesPage';
import { InventoryPage } from './components/pages/InventoryPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { CommitmentsPage } from './components/pages/CommitmentsPage';
import { KhataMigrationPage } from './components/pages/KhataMigrationPage';
import { LoginPage } from './components/pages/LoginPage';

export function App() {
  // Authentication state (default true so user lands directly in the working system)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Navigation & Entity State backed by persistent storageService
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(() => storageService.getCustomers());
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(() => storageService.getTransactions());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storageService.getNotifications());

  // Modals state
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [transactionTargetCustomer, setTransactionTargetCustomer] = useState<Customer | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSendReminderOpen, setIsSendReminderOpen] = useState(false);
  const [reminderTargetCustomer, setReminderTargetCustomer] = useState<Customer | null>(null);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  // Subscribe to storage change events so state remains in sync across any updates
  useEffect(() => {
    const handleStorageSync = () => {
      setCustomers(storageService.getCustomers());
      setTransactions(storageService.getTransactions());
      setOrders(storageService.getOrders());
      setProducts(storageService.getProducts());
      setNotifications(storageService.getNotifications());
    };

    window.addEventListener('hisabai_data_change', handleStorageSync);
    window.addEventListener('dukaansaathi_data_change', handleStorageSync);
    return () => {
      window.removeEventListener('hisabai_data_change', handleStorageSync);
      window.removeEventListener('dukaansaathi_data_change', handleStorageSync);
    };
  }, []);

  // Counts for Badges calculated strictly from real data
  const unreadAlertsCount = notifications.filter((n) => !n.read).length;
  const pendingCount = customers.filter((c) => c.outstandingAmount > 0).length;
  const ordersReadyCount = orders.filter((o) => o.status === 'ready').length;
  const lowStockCount = products.filter((p) => p.status === 'low' || p.status === 'out_of_stock').length;

  // --- Handlers for Persistence & State ---

  // Identify Customer from Scanner (or QR / Phone)
  const handleCustomerIdentified = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setCurrentTab('customers');
    setIsScanModalOpen(false);
  };

  // Create New Customer
  const handleSaveNewCustomer = (createdCustomer: Customer) => {
    storageService.saveCustomer(createdCustomer);
    setSelectedCustomerId(createdCustomer.id);
    setCurrentTab('customers');
    setIsNewCustomerModalOpen(false);
  };

  // Update Customer
  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    storageService.saveCustomer(updatedCustomer);
    setEditingCustomer(null);
  };

  // Delete Customer
  const handleDeleteCustomer = (customerId: string) => {
    storageService.deleteCustomer(customerId);
    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null);
    }
  };

  // Record New Transaction (Manual or Voice AI)
  const handleSaveTransaction = (newTx: Transaction) => {
    // If the customer does not exist yet (e.g. from Voice Entry or on-the-fly custom entry), create them
    const existing = customers.find((c) => c.id === newTx.customerId);
    if (!existing) {
      const autoCust: Customer = {
        id: newTx.customerId,
        name: newTx.customerName,
        phone: newTx.customerPhone,
        status: newTx.balancePending > 0 ? 'payment-pending' : 'new',
        statusLabel: newTx.balancePending > 0 ? 'Payment Pending' : 'New Customer',
        outstandingAmount: newTx.balancePending,
        promisedDueDate: newTx.dueDate,
        lifetimePurchases: newTx.totalAmount,
        visitsCount: 1,
        activeOrdersCount: 0,
        lastPurchaseDate: newTx.date,
        lastPurchaseSummary: newTx.items.map((i) => i.productName).join(', '),
        timeline: []
      };
      storageService.saveCustomer(autoCust);
    }

    storageService.saveTransaction(newTx);
  };

  // Delete Transaction
  const handleDeleteTransaction = (transactionId: string) => {
    storageService.deleteTransaction(transactionId);
  };

  // Open Transaction Modal for specific customer
  const handleOpenNewTransactionForCustomer = (customer: Customer) => {
    setTransactionTargetCustomer(customer);
    setIsNewTransactionModalOpen(true);
  };

  // Settle Balance for Customer
  const handleSettleBalance = (customerId: string) => {
    storageService.settleCustomerBalance(customerId);
  };

  // Import Khata Records
  const handleImportKhataRecords = (records: KhataExtractedRow[]) => {
    records.forEach((row) => {
      const existing = customers.find(
        (c) => c.name.toLowerCase().includes(row.customerName.toLowerCase())
      );

      if (existing) {
        const updated: Customer = {
          ...existing,
          outstandingAmount: existing.outstandingAmount + row.amount,
          promisedDueDate: row.dueDate || existing.promisedDueDate,
          timeline: [
            {
              id: `tl-khata-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              date: 'Migrated',
              title: 'Handwritten Khata Entry',
              description: `Digitized: "${row.rawText}"`,
              type: 'purchase',
              amount: row.amount,
              dueAmount: row.amount,
              dueDate: row.dueDate,
              relativeTime: 'Khata Import'
            },
            ...(existing.timeline || [])
          ]
        };
        storageService.saveCustomer(updated);
      } else {
        const newCust: Customer = {
          id: `cust-khata-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          name: row.customerName,
          phone: row.phoneEstimate,
          address: 'Neighbourhood Resident',
          status: 'returning',
          statusLabel: 'Returning Customer',
          outstandingAmount: row.amount,
          promisedDueDate: row.dueDate,
          lifetimePurchases: row.amount,
          visitsCount: 1,
          activeOrdersCount: 0,
          lastPurchaseDate: 'Migrated from Khata',
          lastPurchaseSummary: `Khata Migration: ₹${row.amount}`,
          shopkeeperNotes: `Imported from handwritten bahi-khata: "${row.rawText}"`,
          timeline: [
            {
              id: `tl-khata-${Date.now()}`,
              date: 'Migrated',
              title: 'Handwritten Khata Migration',
              description: `Digitized from diary entry: "${row.rawText}"`,
              type: 'purchase',
              amount: row.amount,
              dueAmount: row.amount,
              dueDate: row.dueDate,
              relativeTime: 'Khata Import'
            }
          ]
        };
        storageService.saveCustomer(newCust);
      }
    });
  };

  // Orders CRUD
  const handleSaveOrder = (newOrder: Order) => {
    storageService.saveOrder(newOrder);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    storageService.updateOrderStatus(orderId, status);
  };

  const handleDeleteOrder = (orderId: string) => {
    storageService.deleteOrder(orderId);
  };

  // Products CRUD
  const handleAddProduct = (newProduct: Product) => {
    storageService.saveProduct(newProduct);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    storageService.saveProduct(updatedProduct);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    storageService.updateStock(productId, newStock);
  };

  const handleDeleteProduct = (productId: string) => {
    storageService.deleteProduct(productId);
  };

  // If user signed out, show clean login page
  if (!isAuthenticated) {
    return <LoginPage onSignInSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={(tab: NavigationTab) => setCurrentTab(tab)}
          onOpenScan={() => setIsScanModalOpen(true)}
          onOpenVoice={() => setIsVoiceModalOpen(true)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          pendingCount={pendingCount}
          ordersReadyCount={ordersReadyCount}
          lowStockCount={lowStockCount}
        />

        {/* Center Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <Header
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
            onOpenNotifications={() => setIsNotificationOpen(true)}
            onOpenScan={() => setIsScanModalOpen(true)}
            onToggleMobileMenu={() => setIsMobileMoreOpen(true)}
            unreadCount={unreadAlertsCount}
          />

          {/* Dynamic Page View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
            {currentTab === 'dashboard' && (
              <DashboardPage
                customers={customers}
                transactions={transactions}
                orders={orders}
                products={products}
                onOpenScan={() => setIsScanModalOpen(true)}
                onOpenVoice={() => setIsVoiceModalOpen(true)}
                onOpenNewTransaction={() => {
                  setTransactionTargetCustomer(null);
                  setIsNewTransactionModalOpen(true);
                }}
                onNavigate={setCurrentTab}
                onSelectCustomer={(id) => {
                  setSelectedCustomerId(id);
                  setCurrentTab('customers');
                }}
              />
            )}

            {currentTab === 'customers' && (
              <CustomersPage
                customers={customers}
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={setSelectedCustomerId}
                onOpenCreateCustomer={() => setIsNewCustomerModalOpen(true)}
                onOpenNewTransaction={handleOpenNewTransactionForCustomer}
                onOpenVoice={() => setIsVoiceModalOpen(true)}
                onOpenSendReminder={(cust) => {
                  setReminderTargetCustomer(cust);
                  setIsSendReminderOpen(true);
                }}
                onEditCustomer={(cust) => setEditingCustomer(cust)}
                onDeleteCustomer={handleDeleteCustomer}
                onSettleBalance={handleSettleBalance}
              />
            )}

            {currentTab === 'sales' && (
              <SalesPage
                transactions={transactions}
                onOpenNewTransaction={() => {
                  setTransactionTargetCustomer(null);
                  setIsNewTransactionModalOpen(true);
                }}
                onOpenVoice={() => setIsVoiceModalOpen(true)}
                onSelectCustomer={(id) => {
                  setSelectedCustomerId(id);
                  setCurrentTab('customers');
                }}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {currentTab === 'inventory' && (
              <InventoryPage
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateStock={handleUpdateStock}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            )}

            {currentTab === 'orders' && (
              <OrdersPage
                orders={orders}
                customers={customers}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onSelectCustomer={(id) => {
                  setSelectedCustomerId(id);
                  setCurrentTab('customers');
                }}
                onSaveOrder={handleSaveOrder}
                onDeleteOrder={handleDeleteOrder}
              />
            )}

            {currentTab === 'commitments' && (
              <CommitmentsPage
                customers={customers}
                onOpenSendReminder={(cust) => {
                  setReminderTargetCustomer(cust);
                  setIsSendReminderOpen(true);
                }}
                onSettleBalance={handleSettleBalance}
                onSelectCustomer={(id) => {
                  setSelectedCustomerId(id);
                  setCurrentTab('customers');
                }}
              />
            )}

            {currentTab === 'khata-migration' && (
              <KhataMigrationPage onImportRecords={handleImportKhataRecords} />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenScan={() => setIsScanModalOpen(true)}
        onOpenMore={() => setIsMobileMoreOpen(true)}
      />

      {/* Mobile More Sheet */}
      {isMobileMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:hidden bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full bg-white rounded-t-2xl p-5 border-t border-slate-200 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">More Options</h3>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="text-xs font-semibold text-slate-500 p-1"
              >
                Close
              </button>
            </div>
            <div className="py-2 space-y-1 text-sm">
              <button
                onClick={() => {
                  setCurrentTab('inventory');
                  setIsMobileMoreOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                <span>📦 Store Inventory</span>
                {lowStockCount > 0 && (
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                    {lowStockCount} low
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentTab('orders');
                  setIsMobileMoreOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                <span>🛍️ Customer Orders</span>
                {ordersReadyCount > 0 && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                    {ordersReadyCount} ready
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentTab('commitments');
                  setIsMobileMoreOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                <span>⏳ Pending Commitments (Udhaar)</span>
                {pendingCount > 0 && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    {pendingCount} due
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentTab('khata-migration');
                  setIsMobileMoreOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                <span>📄 Khata Migration (Paper OCR)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Vision AI
                </span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  setIsVoiceModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                <span>🎙️ Voice Entry (Mic)</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                  Hindi / Hinglish
                </span>
              </button>

              <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    storageService.loadSampleData();
                    setIsMobileMoreOpen(false);
                  }}
                  className="w-full text-left text-xs text-indigo-600 font-semibold p-2 rounded-lg hover:bg-indigo-50"
                >
                  Load Sample Shop Data
                </button>
                <button
                  onClick={() => {
                    if (confirm('Clear all stored customers, sales, and products?')) {
                      storageService.clearAllData();
                      setIsMobileMoreOpen(false);
                    }
                  }}
                  className="w-full text-left text-xs text-rose-600 font-semibold p-2 rounded-lg hover:bg-rose-50"
                >
                  Reset to Clean Empty State
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ScanCustomerModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        customers={customers}
        onCustomerIdentified={handleCustomerIdentified}
        onOpenCreateCustomer={() => {
          setIsScanModalOpen(false);
          setIsNewCustomerModalOpen(true);
        }}
      />

      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onCreateCustomer={handleSaveNewCustomer}
      />

      {editingCustomer && (
        <EditCustomerModal
          isOpen={Boolean(editingCustomer)}
          onClose={() => setEditingCustomer(null)}
          customer={editingCustomer}
          onSaveCustomer={handleUpdateCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}

      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
        customers={customers}
        products={products}
        selectedCustomer={transactionTargetCustomer}
        onSaveTransaction={handleSaveTransaction}
        onCreateCustomer={(newCust) => storageService.saveCustomer(newCust)}
      />

      <VoiceTransactionModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSaveVoiceTransaction={handleSaveTransaction}
        customers={customers}
      />

      <MemorySearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={setCurrentTab}
        onSelectCustomer={(id) => {
          setSelectedCustomerId(id);
          setCurrentTab('customers');
        }}
        customers={customers}
        products={products}
        transactions={transactions}
        orders={orders}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onSelectAction={(tab) => setCurrentTab(tab)}
        onMarkAllRead={() => {
          storageService.markAllNotificationsRead();
        }}
      />

      <SendReminderModal
        isOpen={isSendReminderOpen}
        onClose={() => setIsSendReminderOpen(false)}
        customer={reminderTargetCustomer}
      />
    </div>
  );
}
export default App;
