import { Customer, Product, Transaction, Order, KhataExtractedRow, ShopPulseItem, NotificationItem } from '../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    email: 'ramesh.kumar@gmail.com',
    avatarBg: 'bg-indigo-600',
    address: 'Flat 302, Sai Residency, Main Market Road',
    status: 'payment-pending',
    statusLabel: 'Payment Pending',
    lifetimePurchases: 12450,
    outstandingAmount: 430,
    visitsCount: 18,
    activeOrdersCount: 1,
    lastPurchaseDate: 'Today, 4:15 PM',
    lastPurchaseSummary: '2kg Rice + 1L Cooking Oil',
    promisedDueDate: 'This Friday',
    shopkeeperNotes: 'Prefers Kolam rice (soft grain). Usually clears khata on Friday evening after his weekly wage deposit.',
    timeline: [
      {
        id: 'tl-1',
        type: 'purchase',
        date: 'Today, 4:15 PM',
        relativeTime: 'Today',
        title: 'Grocery Purchase',
        description: '2kg Kolam Rice + 1L Fortune Sunflower Oil',
        amount: 430,
        paymentStatus: 'pending',
        amountPaid: 0,
        dueAmount: 430,
        dueDate: 'Friday, 22 Sept',
        items: [
          { name: 'Kolam Super Rice', quantity: '2 kg', price: 130 },
          { name: 'Fortune Sunflower Oil 1L', quantity: '1 pouch', price: 150 },
          { name: 'Madhur Pure Sugar', quantity: '1 kg', price: 50 },
          { name: 'Tata Tea Gold', quantity: '250g', price: 100 }
        ]
      },
      {
        id: 'tl-2',
        type: 'purchase',
        date: '12 Sept 2026, 11:20 AM',
        relativeTime: '6 days ago',
        title: 'Atta & Staples Restock',
        description: '5kg Aashirvaad Atta + 1kg Salt',
        amount: 650,
        paymentStatus: 'paid',
        paymentMethod: 'UPI',
        amountPaid: 650,
        dueAmount: 0,
        items: [
          { name: 'Aashirvaad Shudh Chakki Atta', quantity: '5 kg bag', price: 260 },
          { name: 'Tata Iodized Salt', quantity: '1 packet', price: 28 },
          { name: 'Amul Butter 500g', quantity: '1 pack', price: 285 },
          { name: 'Maggi 4-Pack Noodles', quantity: '1 unit', price: 77 }
        ]
      },
      {
        id: 'tl-3',
        type: 'return',
        date: '05 Sept 2026, 6:40 PM',
        relativeTime: '2 weeks ago',
        title: 'Product Return & Replacement',
        description: 'Cooking Oil seal was dented; replaced with fresh pack without extra charge.',
        amount: 150,
        paymentStatus: 'paid',
        paymentMethod: 'Cash',
        items: [
          { name: 'Fortune Sunflower Oil 1L', quantity: '1 pouch (Replaced)', price: 150 }
        ]
      },
      {
        id: 'tl-4',
        type: 'warranty',
        date: '14 July 2026',
        relativeTime: '2 months ago',
        title: 'Appliance Purchase & Warranty Logged',
        description: 'Philips HL7756/00 750W Mixer Grinder (Bill #DK-8821). Shop 2-year warranty card registered.',
        amount: 3290,
        paymentStatus: 'paid',
        paymentMethod: 'UPI',
        warrantyExpiry: '14 July 2028'
      },
      {
        id: 'tl-5',
        type: 'payment',
        date: '28 Aug 2026, 8:10 PM',
        relativeTime: '3 weeks ago',
        title: 'Previous Khata Cleared',
        description: 'Cleared full balance via PhonePe QR scanner at counter.',
        amount: 850,
        paymentStatus: 'paid',
        paymentMethod: 'UPI'
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'Priya Sharma',
    phone: '+91 98234 56789',
    email: 'priya.sharma@outlook.com',
    avatarBg: 'bg-emerald-600',
    address: 'B-14, Green Valley Apts, Sector 4',
    status: 'payment-pending',
    statusLabel: 'Due Today',
    lifetimePurchases: 28400,
    outstandingAmount: 620,
    visitsCount: 32,
    activeOrdersCount: 0,
    lastPurchaseDate: 'Yesterday, 7:30 PM',
    lastPurchaseSummary: 'Tea + Dry Fruits + Milk',
    promisedDueDate: 'Today (18 Sept)',
    shopkeeperNotes: 'Longtime customer. Buys premium tea and dairy regularly.',
    timeline: [
      {
        id: 'tl-p1',
        type: 'purchase',
        date: 'Yesterday, 7:30 PM',
        relativeTime: 'Yesterday',
        title: 'Tea & Daily Essentials',
        description: 'Tata Tea Gold 500g, Cashews 250g, 2L Amul Milk',
        amount: 620,
        paymentStatus: 'pending',
        amountPaid: 0,
        dueAmount: 620,
        dueDate: 'Today (18 Sept)'
      }
    ]
  },
  {
    id: 'cust-3',
    name: 'Amit Kumar',
    phone: '+91 98112 34567',
    avatarBg: 'bg-blue-600',
    address: 'House 56, Ward 8, Near Water Tank',
    status: 'returning',
    statusLabel: 'Returning Customer',
    lifetimePurchases: 6420,
    outstandingAmount: 250,
    visitsCount: 9,
    activeOrdersCount: 1,
    lastPurchaseDate: '15 Sept, 10:15 AM',
    lastPurchaseSummary: 'Wheat Flour 5kg',
    promisedDueDate: '22 Sept',
    shopkeeperNotes: 'Pre-ordered 1 Tin Mustard Oil (15L) for Diwali preparations.',
    timeline: [
      {
        id: 'tl-a1',
        type: 'purchase',
        date: '15 Sept, 10:15 AM',
        relativeTime: '3 days ago',
        title: 'Weekly Groceries',
        description: 'Aashirvaad Atta 5kg bag',
        amount: 250,
        paymentStatus: 'pending',
        dueDate: '22 Sept'
      }
    ]
  },
  {
    id: 'cust-4',
    name: 'Sanjay Verma',
    phone: '+91 97654 32109',
    avatarBg: 'bg-violet-600',
    address: 'Shop 4, Verma Electricals, Opp Metro Pillar 82',
    status: 'frequent',
    statusLabel: 'Frequent Shopper',
    lifetimePurchases: 19800,
    outstandingAmount: 0,
    visitsCount: 24,
    activeOrdersCount: 1,
    lastPurchaseDate: '16 Sept, 2:00 PM',
    lastPurchaseSummary: 'Snacks + Cold Drinks crate',
    shopkeeperNotes: 'Always pays immediately via Google Pay QR.',
    timeline: [
      {
        id: 'tl-s1',
        type: 'purchase',
        date: '16 Sept, 2:00 PM',
        relativeTime: '2 days ago',
        title: 'Shop Party Snacks',
        description: 'Haldiram Bhujia, Cold Drinks 6 pack',
        amount: 480,
        paymentStatus: 'paid',
        paymentMethod: 'UPI'
      }
    ]
  },
  {
    id: 'cust-5',
    name: 'Sunita Devi',
    phone: '+91 98450 12345',
    avatarBg: 'bg-rose-600',
    address: 'Quarter 12, Railway Colony',
    status: 'returning',
    statusLabel: 'Returning Customer',
    lifetimePurchases: 8900,
    outstandingAmount: 0,
    visitsCount: 14,
    activeOrdersCount: 0,
    lastPurchaseDate: '14 Sept, 5:45 PM',
    lastPurchaseSummary: 'Basmati Rice + Spices',
    shopkeeperNotes: 'Prefers organic turmeric and desi ghee.',
    timeline: [
      {
        id: 'tl-d1',
        type: 'purchase',
        date: '14 Sept, 5:45 PM',
        relativeTime: '4 days ago',
        title: 'Pooja & Kitchen Supplies',
        description: 'India Gate Basmati Rice 5kg, Everest Masala Pack',
        amount: 780,
        paymentStatus: 'paid',
        paymentMethod: 'Cash'
      }
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kolam Super Rice',
    hindiName: 'कोलम चावल',
    category: 'Grains & Rice',
    stock: 12,
    unit: 'kg',
    costPrice: 48,
    sellingPrice: 65,
    minAlertThreshold: 15,
    status: 'low',
    barcode: '8901030381021'
  },
  {
    id: 'prod-2',
    name: 'Fortune Sunflower Oil (1L Pouch)',
    hindiName: 'फॉर्च्यून सनफ्लावर तेल',
    category: 'Edible Oils',
    stock: 3,
    unit: 'pouches',
    costPrice: 125,
    sellingPrice: 150,
    minAlertThreshold: 8,
    status: 'low',
    barcode: '8906007280145'
  },
  {
    id: 'prod-3',
    name: 'Madhur Pure Refined Sugar',
    hindiName: 'मधुर चीनी',
    category: 'Staples',
    stock: 0,
    unit: 'kg',
    costPrice: 40,
    sellingPrice: 48,
    minAlertThreshold: 20,
    status: 'out_of_stock',
    barcode: '8901725182103'
  },
  {
    id: 'prod-4',
    name: 'Aashirvaad Shudh Chakki Atta (5kg)',
    hindiName: 'आशीर्वाद चक्की आटा 5kg',
    category: 'Flour & Atta',
    stock: 2,
    unit: 'bags',
    costPrice: 220,
    sellingPrice: 260,
    minAlertThreshold: 5,
    status: 'low',
    barcode: '8901030894211'
  },
  {
    id: 'prod-5',
    name: 'Tata Tea Gold Premium (500g)',
    hindiName: 'टाटा टी गोल्ड 500g',
    category: 'Beverages',
    stock: 24,
    unit: 'packs',
    costPrice: 275,
    sellingPrice: 320,
    minAlertThreshold: 6,
    status: 'healthy',
    barcode: '8901052002138'
  },
  {
    id: 'prod-6',
    name: 'Amul Butter Pasteurised (500g)',
    hindiName: 'अमूल मक्खन 500g',
    category: 'Dairy & Cold',
    stock: 18,
    unit: 'packs',
    costPrice: 245,
    sellingPrice: 285,
    minAlertThreshold: 5,
    status: 'healthy',
    barcode: '8901262010058'
  },
  {
    id: 'prod-7',
    name: 'Tata Iodized Salt (1kg Pouch)',
    hindiName: 'टाटा नमक 1kg',
    category: 'Staples',
    stock: 45,
    unit: 'packets',
    costPrice: 22,
    sellingPrice: 28,
    minAlertThreshold: 15,
    status: 'healthy',
    barcode: '8901058852309'
  },
  {
    id: 'prod-8',
    name: 'Parle-G Original Glucose Biscuits (Pack of 12)',
    hindiName: 'पारले-जी बिस्कुट',
    category: 'Snacks & Bakery',
    stock: 36,
    unit: 'units',
    costPrice: 8,
    sellingPrice: 10,
    minAlertThreshold: 10,
    status: 'healthy',
    barcode: '8901719101035'
  },
  {
    id: 'prod-9',
    name: 'MDH Deggi Mirch (100g)',
    hindiName: 'MDH देगी मिर्च 100g',
    category: 'Spices & Masala',
    stock: 14,
    unit: 'boxes',
    costPrice: 72,
    sellingPrice: 88,
    minAlertThreshold: 4,
    status: 'healthy',
    barcode: '8902167000124'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'DK-2041',
    customerId: 'cust-1',
    customerName: 'Ramesh Kumar',
    customerPhone: '+91 98765 43210',
    itemsSummary: '2kg Kolam Rice + 1L Cooking Oil + Sugar 1kg',
    totalAmount: 430,
    depositPaid: 0,
    pickupDate: 'Today, 6:00 PM',
    status: 'ready',
    items: [
      { name: 'Kolam Super Rice', quantity: '2 kg', price: 130 },
      { name: 'Fortune Sunflower Oil 1L', quantity: '1 pouch', price: 150 },
      { name: 'Sugar & Salt bundle', quantity: '1 set', price: 150 }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'DK-2042',
    customerId: 'cust-3',
    customerName: 'Amit Kumar',
    customerPhone: '+91 98112 34567',
    itemsSummary: '15L Mustard Oil Tin (Special Order)',
    totalAmount: 2150,
    depositPaid: 500,
    pickupDate: 'Tomorrow, 11:00 AM',
    status: 'pending',
    items: [
      { name: 'Engine Brand Pure Mustard Oil 15L Tin', quantity: '1 tin', price: 2150 }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: 'DK-2043',
    customerId: 'cust-4',
    customerName: 'Sanjay Verma',
    customerPhone: '+91 97654 32109',
    itemsSummary: 'Festival Sweets Pack (Haldiram Rasgulla x 4)',
    totalAmount: 960,
    depositPaid: 960,
    pickupDate: 'Today, 5:30 PM',
    status: 'ready',
    items: [
      { name: 'Haldiram Rasgulla 1kg Tin', quantity: '4 tins', price: 960 }
    ]
  },
  {
    id: 'ord-104',
    orderNumber: 'DK-2044',
    customerId: 'cust-2',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98234 56789',
    itemsSummary: 'Dry Fruit Gift Hamper (Almonds, Cashews, Raisins)',
    totalAmount: 1450,
    depositPaid: 500,
    pickupDate: 'Today, 7:00 PM',
    status: 'ready',
    items: [
      { name: 'Premium Royal Dry Fruit Box', quantity: '1 box', price: 1450 }
    ]
  }
];

export const INITIAL_SHOP_PULSE: ShopPulseItem[] = [
  {
    id: 'pulse-1',
    type: 'payment_due',
    category: 'attention',
    title: '2 payments due today',
    subtitle: 'Ramesh Kumar (₹430) & Priya Sharma (₹620)',
    amount: 1050,
    badgeText: 'Action needed',
    badgeSeverity: 'warning',
    actionTarget: 'commitments',
    actionLabel: 'View Commitments'
  },
  {
    id: 'pulse-2',
    type: 'low_stock',
    category: 'attention',
    title: '2 products running low',
    subtitle: 'Fortune Sunflower Oil (3 left) · Aashirvaad Atta 5kg (2 left)',
    badgeText: 'Low Stock',
    badgeSeverity: 'critical',
    actionTarget: 'inventory',
    actionLabel: 'Check Stock'
  },
  {
    id: 'pulse-3',
    type: 'order_ready',
    category: 'attention',
    title: '4 orders ready for pickup',
    subtitle: 'Ramesh, Sanjay & 2 others scheduled this evening',
    badgeText: 'Ready',
    badgeSeverity: 'info',
    actionTarget: 'orders',
    actionLabel: 'Manage Orders'
  },
  {
    id: 'pulse-4',
    type: 'upcoming_flow',
    category: 'upcoming',
    title: '₹12,400 expected this week',
    subtitle: '6 regular customer commitments promised before Sunday',
    amount: 12400,
    badgeText: 'Cash Flow',
    badgeSeverity: 'success',
    actionTarget: 'commitments'
  },
  {
    id: 'pulse-5',
    type: 'upcoming_flow',
    category: 'upcoming',
    title: 'Supplier payment due Friday',
    subtitle: 'Godrej & Fortune FMCG Distributor invoice (#INV-9022)',
    amount: 18500,
    badgeText: 'Supplier Due',
    badgeSeverity: 'warning',
    actionTarget: 'sales'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'payment',
    title: 'Payment commitment due today',
    message: 'Ramesh Kumar promised to clear ₹430 today for groceries.',
    time: '15 mins ago',
    read: false,
    actionableId: 'cust-1'
  },
  {
    id: 'notif-2',
    type: 'inventory',
    title: 'Low stock warning',
    message: 'Fortune Sunflower Oil 1L dropped to 3 pouches (threshold: 8).',
    time: '1 hour ago',
    read: false,
    actionableId: 'prod-2'
  },
  {
    id: 'notif-3',
    type: 'order',
    title: 'Customer order ready for pickup',
    message: "Ramesh Kumar's grocery packet #DK-2041 is packed and tagged.",
    time: '2 hours ago',
    read: false,
    actionableId: 'ord-101'
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Shop memory synced',
    message: 'Daily khata ledger backup completed with 256 memory tags.',
    time: 'Yesterday',
    read: true
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    customerId: 'cust-1',
    customerName: 'Ramesh Kumar',
    customerPhone: '+91 98765 43210',
    date: 'Today, 4:15 PM',
    timestamp: '2026-09-18T16:15:00',
    items: [
      {
        productId: 'prod-1',
        productName: 'Kolam Super Rice',
        quantity: 2,
        unit: 'kg',
        unitPrice: 65,
        totalPrice: 130
      },
      {
        productId: 'prod-2',
        productName: 'Fortune Sunlite Sunflower Oil',
        quantity: 1,
        unit: 'pouch',
        unitPrice: 150,
        totalPrice: 150
      },
      {
        productId: 'prod-3',
        productName: 'Refined White Sugar',
        quantity: 3,
        unit: 'kg',
        unitPrice: 50,
        totalPrice: 150
      }
    ],
    totalAmount: 430,
    amountPaid: 0,
    balancePending: 430,
    paymentStatus: 'pending',
    paymentMethod: 'Credit / Khata',
    dueDate: 'Friday (22 Sept)',
    recordedVia: 'voice_ai',
    notes: 'Ramesh promised to clear on Friday evening.'
  },
  {
    id: 'tx-102',
    customerId: 'cust-2',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98234 56789',
    date: 'Yesterday, 7:30 PM',
    timestamp: '2026-09-17T19:30:00',
    items: [
      {
        productId: 'prod-5',
        productName: 'Tata Tea Gold Premium',
        quantity: 1,
        unit: 'pack',
        unitPrice: 320,
        totalPrice: 320
      },
      {
        productId: 'prod-6',
        productName: 'Amul Butter Pasteurised',
        quantity: 1,
        unit: 'pack',
        unitPrice: 285,
        totalPrice: 285
      },
      {
        productId: 'prod-7',
        productName: 'Tata Iodized Salt',
        quantity: 1,
        unit: 'packet',
        unitPrice: 28,
        totalPrice: 28
      }
    ],
    totalAmount: 620,
    amountPaid: 0,
    balancePending: 620,
    paymentStatus: 'pending',
    paymentMethod: 'Credit / Khata',
    dueDate: 'Today (18 Sept)',
    recordedVia: 'manual',
    notes: 'Daily essentials, due today.'
  },
  {
    id: 'tx-103',
    customerId: 'cust-3',
    customerName: 'Amit Kumar',
    customerPhone: '+91 98112 34567',
    date: '16 Sept 2026, 11:20 AM',
    timestamp: '2026-09-16T11:20:00',
    items: [
      {
        productId: 'prod-4',
        productName: 'Aashirvaad Shudh Chakki Atta',
        quantity: 1,
        unit: 'bag',
        unitPrice: 260,
        totalPrice: 260
      },
      {
        productId: 'prod-8',
        productName: 'Parle-G Glucose Biscuits',
        quantity: 5,
        unit: 'units',
        unitPrice: 10,
        totalPrice: 50
      }
    ],
    totalAmount: 310,
    amountPaid: 310,
    balancePending: 0,
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    recordedVia: 'manual'
  },
  {
    id: 'tx-104',
    customerId: 'cust-4',
    customerName: 'Sanjay Verma',
    customerPhone: '+91 97654 32109',
    date: '15 Sept 2026, 6:45 PM',
    timestamp: '2026-09-15T18:45:00',
    items: [
      {
        productId: 'prod-9',
        productName: 'MDH Deggi Mirch',
        quantity: 2,
        unit: 'boxes',
        unitPrice: 88,
        totalPrice: 176
      },
      {
        productId: 'prod-7',
        productName: 'Tata Iodized Salt',
        quantity: 2,
        unit: 'packets',
        unitPrice: 28,
        totalPrice: 56
      }
    ],
    totalAmount: 232,
    amountPaid: 232,
    balancePending: 0,
    paymentStatus: 'paid',
    paymentMethod: 'Cash',
    recordedVia: 'manual'
  }
];

export const SAMPLE_KHATA_ROWS: KhataExtractedRow[] = [
  {
    id: 'khata-1',
    rawText: 'रमेश - २ किलो चावल + तेल १ - रु ४३० (शुक्रवार)',
    customerName: 'Ramesh Kumar',
    phoneEstimate: '+91 98765 43210',
    items: '2kg Rice + 1L Oil',
    amount: 430,
    dueDate: 'Friday, 22 Sept',
    confidenceScore: 98,
    status: 'pending_review'
  },
  {
    id: 'khata-2',
    rawText: 'अमित - आटा ५ किलो - २५० (२२ तारीख)',
    customerName: 'Amit Kumar',
    phoneEstimate: '+91 98112 34567',
    items: 'Wheat Flour 5kg bag',
    amount: 250,
    dueDate: '22 Sept 2026',
    confidenceScore: 94,
    status: 'pending_review'
  },
  {
    id: 'khata-3',
    rawText: 'सुरेश टेलर - शक्कर ३ किलो + पत्ती - रु २८० (सोमवार)',
    customerName: 'Suresh Tailor',
    phoneEstimate: '+91 98221 99012',
    items: 'Sugar 3kg + Tea pack',
    amount: 280,
    dueDate: 'Monday, 25 Sept',
    confidenceScore: 91,
    status: 'pending_review'
  },
  {
    id: 'khata-4',
    rawText: 'दीपक भैया - बिस्कुट ५ पैकेट + तेल - ३२० (कल)',
    customerName: 'Deepak Bhaiya',
    phoneEstimate: '+91 97120 44556',
    items: '5 Biscuits + 1L Oil',
    amount: 320,
    dueDate: 'Tomorrow',
    confidenceScore: 89,
    status: 'pending_review'
  }
];

export const MEMORY_SEARCH_QUERIES = [
  {
    query: "What did Ramesh buy last time?",
    category: "Customer Memory",
    answer: {
      customer: "Ramesh Kumar",
      phone: "+91 98765 43210",
      headline: "Ramesh's last purchase was today at 4:15 PM",
      details: [
        { label: "Items", value: "2kg Kolam Super Rice + 1L Fortune Sunflower Oil + 1kg Sugar" },
        { label: "Purchase Date", value: "Today, 18 Sept 2026" },
        { label: "Total Bill", value: "₹430" },
        { label: "Payment Status", value: "Pending commitment (Promised Friday)" },
        { label: "Shop Preference", value: "Always prefers Kolam soft rice over Sona Masoori" }
      ],
      quickAction: { label: "Open Ramesh's Profile", customerId: "cust-1" }
    }
  },
  {
    query: "Who has payments due today?",
    category: "Udhaar & Commitments",
    answer: {
      headline: "2 customers have promised payments due today",
      details: [
        { label: "Ramesh Kumar", value: "₹430 (Promised for Friday evening/today)" },
        { label: "Priya Sharma", value: "₹620 (Tea + Dry Fruits from yesterday)" }
      ],
      quickAction: { label: "View All Commitments", navigateTo: "commitments" }
    }
  },
  {
    query: "Which products are low in stock?",
    category: "Inventory Awareness",
    answer: {
      headline: "2 items are below minimum threshold, 1 is completely out of stock",
      details: [
        { label: "Fortune Sunflower Oil (1L)", value: "3 pouches left (Threshold: 8)" },
        { label: "Aashirvaad Chakki Atta (5kg)", value: "2 bags left (Threshold: 5)" },
        { label: "Madhur Pure Sugar", value: "0 kg in stock (OUT OF STOCK)" }
      ],
      quickAction: { label: "Open Inventory Manager", navigateTo: "inventory" }
    }
  },
  {
    query: "Show Ramesh's returns and warranties",
    category: "Returns & Warranties",
    answer: {
      customer: "Ramesh Kumar",
      headline: "1 active warranty and 1 processed return on record",
      details: [
        { label: "Philips 750W Mixer Grinder", value: "Warranty valid until 14 July 2028 (Bill #DK-8821)" },
        { label: "Fortune Oil Replacement", value: "Returned on 05 Sept due to dented seal (Replaced at zero cost)" }
      ],
      quickAction: { label: "View Timeline Details", customerId: "cust-1" }
    }
  }
];
