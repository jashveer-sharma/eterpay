// EterPay Demo Data — Central Mock Data Store
// All data is simulated for demonstration purposes only.
// No real financial data, credentials or transactions.

export const DEMO_USER = {
  id: "usr_eterpay_demo",
  name: "Alex Rivera",
  firstName: "Alex",
  lastName: "Rivera",
  email: "alex.rivera@eterpay.demo",
  phone: "+91 98765 43210",
  country: "IN",
  countryName: "India",
  currency: "INR",
  avatar: null,
  memberSince: "2024-01-15",
  accountType: "personal" as "personal" | "business",
  kycStatus: "verified" as "verified" | "pending" | "unverified",
  twoFAEnabled: true,
  plan: "EterPay Plus",
};

export const DEMO_BALANCES = {
  primary: { currency: "INR", symbol: "₹", amount: 184_250.75, available: 180_000.00 },
  wallet: [
    { currency: "USD", symbol: "$", amount: 1_240.50, flag: "🇺🇸" },
    { currency: "EUR", symbol: "€", amount: 876.20, flag: "🇪🇺" },
    { currency: "GBP", symbol: "£", amount: 420.00, flag: "🇬🇧" },
    { currency: "JPY", symbol: "¥", amount: 95_000, flag: "🇯🇵" },
    { currency: "SGD", symbol: "S$", amount: 680.30, flag: "🇸🇬" },
  ],
};

export const DEMO_TRANSACTIONS = [
  { id: "txn_001", type: "credit", category: "transfer", title: "Payment from Priya Sharma", amount: 15000, currency: "INR", symbol: "₹", date: "2026-11-04", status: "completed", ref: "TXN20261104001", counterparty: "Priya Sharma", note: "Rent share November" },
  { id: "txn_002", type: "debit", category: "subscription", title: "Netflix Premium", amount: 649, currency: "INR", symbol: "₹", date: "2026-11-03", status: "completed", ref: "TXN20261103002", counterparty: "Netflix Inc.", note: "Monthly subscription" },
  { id: "txn_003", type: "debit", category: "commerce", title: "Amazon.in Purchase", amount: 3899, currency: "INR", symbol: "₹", date: "2026-11-02", status: "completed", ref: "TXN20261102003", counterparty: "Amazon India", note: "Order #402-7641223" },
  { id: "txn_004", type: "credit", category: "refund", title: "Refund — Myntra Return", amount: 1299, currency: "INR", symbol: "₹", date: "2026-11-01", status: "completed", ref: "TXN20261101004", counterparty: "Myntra", note: "Return processed" },
  { id: "txn_005", type: "debit", category: "travel", title: "Singapore Airlines", amount: 42500, currency: "INR", symbol: "₹", date: "2026-10-30", status: "completed", ref: "TXN20261030005", counterparty: "SIA", note: "BLR–SIN Flight" },
  { id: "txn_006", type: "debit", category: "transfer", title: "Sent to Rahul Verma", amount: 5000, currency: "INR", symbol: "₹", date: "2026-10-28", status: "completed", ref: "TXN20261028006", counterparty: "Rahul Verma", note: "Shared dinner" },
  { id: "txn_007", type: "credit", category: "transfer", title: "International payment received", amount: 850, currency: "USD", symbol: "$", date: "2026-10-27", status: "completed", ref: "TXN20261027007", counterparty: "John Smith", note: "Freelance invoice #47" },
  { id: "txn_008", type: "debit", category: "commerce", title: "Zomato Gold Order", amount: 820, currency: "INR", symbol: "₹", date: "2026-10-26", status: "pending", ref: "TXN20261026008", counterparty: "Zomato", note: "Food delivery" },
  { id: "txn_009", type: "debit", category: "invest", title: "EterPay Invest — Gold Fund", amount: 10000, currency: "INR", symbol: "₹", date: "2026-10-25", status: "completed", ref: "TXN20261025009", counterparty: "EterPay Invest", note: "Portfolio rebalance" },
  { id: "txn_010", type: "credit", category: "transfer", title: "UPI payment received", amount: 2500, currency: "INR", symbol: "₹", date: "2026-10-24", status: "completed", ref: "TXN20261024010", counterparty: "Meera Patel", note: "Movie tickets" },
  { id: "txn_011", type: "debit", category: "commerce", title: "Flipkart Big Billion Sale", amount: 7649, currency: "INR", symbol: "₹", date: "2026-10-20", status: "completed", ref: "TXN20261020011", counterparty: "Flipkart", note: "Electronics order" },
  { id: "txn_012", type: "debit", category: "subscription", title: "Spotify Premium", amount: 119, currency: "INR", symbol: "₹", date: "2026-10-18", status: "completed", ref: "TXN20261018012", counterparty: "Spotify AB", note: "Monthly plan" },
];

export const DEMO_PAYMENT_METHODS = [
  { id: "pm_001", type: "upi", label: "UPI — alex@eterpay", icon: "upi", default: true, verified: true },
  { id: "pm_002", type: "card", label: "HDFC Credit Card •••• 4821", network: "Visa", expires: "08/28", icon: "visa", default: false, verified: true },
  { id: "pm_003", type: "card", label: "SBI Debit Card •••• 9043", network: "RuPay", expires: "12/27", icon: "rupay", default: false, verified: true },
  { id: "pm_004", type: "bank", label: "HDFC Bank Account •••• 7812", ifsc: "HDFC0001234", icon: "bank", default: false, verified: true },
  { id: "pm_005", type: "wallet", label: "EterPay Wallet — ₹180,000", icon: "wallet", default: false, verified: true },
  { id: "pm_006", type: "paypal", label: "PayPal — alex.rivera@paypal.com", icon: "paypal", default: false, verified: true },
];

export const DEMO_INVOICES = [
  { id: "inv_001", number: "INV-2026-047", client: "TechCorp Solutions", clientEmail: "billing@techcorp.in", amount: 85000, currency: "INR", status: "paid", due: "2026-10-31", issued: "2026-10-15", items: [{ desc: "Frontend Development", qty: 1, rate: 85000, total: 85000 }] },
  { id: "inv_002", number: "INV-2026-048", client: "Nexus Startup", clientEmail: "founders@nexus.io", amount: 42000, currency: "INR", status: "pending", due: "2026-11-15", issued: "2026-11-01", items: [{ desc: "UI/UX Design", qty: 3, rate: 14000, total: 42000 }] },
  { id: "inv_003", number: "INV-2026-049", client: "Global Media Ltd", clientEmail: "accounts@globalmedia.com", amount: 1200, currency: "USD", status: "pending", due: "2026-11-20", issued: "2026-11-05", items: [{ desc: "Content Strategy", qty: 1, rate: 1200, total: 1200 }] },
  { id: "inv_004", number: "INV-2026-044", client: "RetailPlus Pvt Ltd", clientEmail: "finance@retailplus.in", amount: 65000, currency: "INR", status: "overdue", due: "2026-10-20", issued: "2026-10-05", items: [{ desc: "E-commerce Setup", qty: 1, rate: 65000, total: 65000 }] },
  { id: "inv_005", number: "INV-2026-040", client: "EventWave Agency", clientEmail: "pay@eventwave.in", amount: 28000, currency: "INR", status: "draft", due: "2026-11-30", issued: "2026-11-05", items: [{ desc: "Event Photography", qty: 2, rate: 14000, total: 28000 }] },
];

export const DEMO_SUBSCRIPTIONS = [
  { id: "sub_001", name: "Netflix Premium", amount: 649, currency: "INR", cycle: "monthly", nextBilling: "2026-12-03", status: "active", category: "entertainment" },
  { id: "sub_002", name: "Spotify Premium", amount: 119, currency: "INR", cycle: "monthly", nextBilling: "2026-12-18", status: "active", category: "music" },
  { id: "sub_003", name: "Adobe Creative Cloud", amount: 4230, currency: "INR", cycle: "monthly", nextBilling: "2026-11-25", status: "active", category: "software" },
  { id: "sub_004", name: "GitHub Pro", amount: 7, currency: "USD", cycle: "monthly", nextBilling: "2026-12-01", status: "active", category: "developer" },
  { id: "sub_005", name: "EterPay Plus", amount: 299, currency: "INR", cycle: "monthly", nextBilling: "2026-12-05", status: "active", category: "finance" },
  { id: "sub_006", name: "Figma Professional", amount: 1200, currency: "INR", cycle: "monthly", nextBilling: "2026-11-28", status: "paused", category: "design" },
];

export const DEMO_PORTFOLIO = {
  totalValue: 258_400,
  currency: "INR",
  change24h: +2.14,
  changeValue: 5420,
  assets: [
    { name: "Gold Fund", symbol: "GOLD", allocation: 30, value: 77520, change: +1.8, units: 24.5 },
    { name: "NIFTY 50 Index", symbol: "NIFTY", allocation: 25, value: 64600, change: +2.4, units: 42.3 },
    { name: "US Technology ETF", symbol: "USTECH", allocation: 20, value: 51680, change: +3.1, units: 8.2 },
    { name: "Sovereign Bond", symbol: "BOND", allocation: 15, value: 38760, change: +0.4, units: 388 },
    { name: "EterPay FX Reserve", symbol: "FXRES", allocation: 10, value: 25840, change: +0.9, units: 100 },
  ],
};

export const DEMO_NOTIFICATIONS = [
  { id: "n_001", type: "credit", title: "Payment received", body: "₹15,000 received from Priya Sharma", time: "2 hours ago", read: false },
  { id: "n_002", type: "security", title: "New login detected", body: "Sign-in from Chrome on Windows — Bangalore, IN", time: "5 hours ago", read: false },
  { id: "n_003", type: "invoice", title: "Invoice overdue", body: "INV-2026-044 for RetailPlus is 16 days overdue", time: "1 day ago", read: false },
  { id: "n_004", type: "subscription", title: "Subscription renewal", body: "Adobe Creative Cloud renews in 3 days — ₹4,230", time: "2 days ago", read: true },
  { id: "n_005", type: "invest", title: "Portfolio update", body: "Your portfolio gained ₹5,420 (2.14%) today", time: "2 days ago", read: true },
  { id: "n_006", type: "promotion", title: "Zero-fee international transfers", body: "Send money abroad with no fees this weekend", time: "3 days ago", read: true },
];

export const DEMO_ANALYTICS = {
  monthlySpend: [
    { month: "Jun", amount: 42000 }, { month: "Jul", amount: 68000 }, { month: "Aug", amount: 55000 },
    { month: "Sep", amount: 73000 }, { month: "Oct", amount: 61000 }, { month: "Nov", amount: 38000 },
  ],
  categoryBreakdown: [
    { category: "Commerce", amount: 28000, percent: 44 },
    { category: "Travel", amount: 14000, percent: 22 },
    { category: "Subscriptions", amount: 7200, percent: 11 },
    { category: "Food", amount: 5400, percent: 8 },
    { category: "Transfers", amount: 9800, percent: 15 },
  ],
  totalSpentThisMonth: 64400,
  totalReceivedThisMonth: 102000,
  netCashFlow: +37600,
};

export const DEMO_MERCHANTS = [
  { id: "m_001", name: "TechCorp Solutions", category: "Technology", revenue: 85000, transactions: 12, status: "active" },
  { id: "m_002", name: "Nexus Startup", category: "SaaS", revenue: 42000, transactions: 7, status: "active" },
  { id: "m_003", name: "Global Media Ltd", category: "Media", revenue: 102000, transactions: 24, status: "active" },
];

export const DEMO_PRODUCTS_COMMERCE = [
  { id: "p_001", name: "Noise Cancelling Headphones", price: 8999, currency: "INR", category: "Electronics", image: null, rating: 4.5, inStock: true },
  { id: "p_002", name: "Leather Wallet", price: 1899, currency: "INR", category: "Accessories", image: null, rating: 4.2, inStock: true },
  { id: "p_003", name: "Smart Water Bottle", price: 2499, currency: "INR", category: "Lifestyle", image: null, rating: 4.7, inStock: true },
  { id: "p_004", name: "Mechanical Keyboard", price: 12499, currency: "INR", category: "Electronics", image: null, rating: 4.8, inStock: false },
  { id: "p_005", name: "Yoga Mat Premium", price: 1599, currency: "INR", category: "Sports", image: null, rating: 4.4, inStock: true },
  { id: "p_006", name: "Coffee Subscription (3mo)", price: 2999, currency: "INR", category: "Food", image: null, rating: 4.9, inStock: true },
];

export const DEMO_TRAVEL = [
  { id: "t_001", type: "flight", route: "BLR → DXB", airline: "IndiGo", date: "2026-12-15", price: 24500, currency: "INR", class: "Economy", stops: 0 },
  { id: "t_002", type: "flight", route: "BLR → SIN", airline: "Singapore Airlines", date: "2026-12-20", price: 42500, currency: "INR", class: "Economy", stops: 0 },
  { id: "t_003", type: "hotel", name: "Marina Bay Sands", city: "Singapore", stars: 5, nights: 3, pricePerNight: 25000, currency: "INR", checkIn: "2026-12-20" },
  { id: "t_004", type: "hotel", name: "Atlantis The Palm", city: "Dubai", stars: 5, nights: 4, pricePerNight: 35000, currency: "INR", checkIn: "2026-12-15" },
];

export const DEMO_CURRENCIES_FX = [
  { from: "INR", to: "USD", rate: 0.01065, change: +0.18 },
  { from: "INR", to: "EUR", rate: 0.00954, change: -0.06 },
  { from: "INR", to: "GBP", rate: 0.00795, change: +0.05 },
  { from: "INR", to: "JPY", rate: 1.6858, change: -0.25 },
  { from: "INR", to: "SGD", rate: 0.01365, change: +0.11 },
  { from: "INR", to: "AED", rate: 0.03911, change: 0.00 },
  { from: "INR", to: "CAD", rate: 0.01498, change: +0.07 },
  { from: "INR", to: "AUD", rate: 0.01550, change: -0.12 },
];

export const DEMO_PAYMENT_NETWORKS_ANYWHERE = [
  { id: "net_paypal", name: "PayPal", type: "wallet", countries: 200, logo: "paypal", connected: true, status: "live" },
  { id: "net_visa", name: "Visa Direct", type: "card", countries: 190, logo: "visa", connected: true, status: "live" },
  { id: "net_mc", name: "Mastercard Send", type: "card", countries: 180, logo: "mastercard", connected: false, status: "planned" },
  { id: "net_upi", name: "UPI", type: "qr", countries: 1, logo: "upi", connected: true, status: "live" },
  { id: "net_rupay", name: "RuPay", type: "card", countries: 20, logo: "rupay", connected: true, status: "demo" },
  { id: "net_sepa", name: "SEPA Transfer", type: "bank", countries: 36, logo: "sepa", connected: false, status: "planned" },
  { id: "net_promptpay", name: "PromptPay (Thailand)", type: "qr", countries: 1, logo: "promptpay", connected: false, status: "planned" },
  { id: "net_pix", name: "PIX (Brazil)", type: "qr", countries: 1, logo: "pix", connected: false, status: "planned" },
];

// Auth helpers
export const DEMO_CREDENTIALS = { email: "demo@eterpay.com", password: "Demo1234!" };

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("eterpay_session") === "demo_active";
};

export const setAuthenticated = (val: boolean) => {
  if (val) localStorage.setItem("eterpay_session", "demo_active");
  else localStorage.removeItem("eterpay_session");
};
