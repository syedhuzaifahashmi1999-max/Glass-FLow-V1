

import { Lead, LeadStage, Activity, Metric, Project, Customer, Invoice, SaleTransaction, Employee, Product, ServiceTicket, Task, TaskStatus, BankAccount, BankTransaction, PayrollRun, Quotation, Team, Department, Expense, Candidate, CandidateStage, EmployeeProcess, AttendanceRecord, LeaveRequest, PerformanceReview, PerformanceGoal, Asset, Vendor, PurchaseOrder, Role, ChatChannel, ChatMessage, TrainingCourse, TrainingAssignment, Claim, HRLetter, GLAccount } from './types';

// ... (existing constants)

export const MOCK_ACCOUNTS: GLAccount[] = [
  // Assets
  { id: '1000', code: '1000', name: 'Cash on Hand', type: 'Asset', subtype: 'Current Asset', balance: 5000.00, status: 'Active' },
  { id: '1010', code: '1010', name: 'Chase Checking', type: 'Asset', subtype: 'Bank', balance: 142500.00, status: 'Active' },
  { id: '1020', code: '1020', name: 'SVB Savings', type: 'Asset', subtype: 'Bank', balance: 50000.00, status: 'Active' },
  { id: '1200', code: '1200', name: 'Accounts Receivable', type: 'Asset', subtype: 'Current Asset', balance: 34500.00, status: 'Active' },
  { id: '1500', code: '1500', name: 'Office Equipment', type: 'Asset', subtype: 'Fixed Asset', balance: 15000.00, status: 'Active' },
  
  // Liabilities
  { id: '2000', code: '2000', name: 'Accounts Payable', type: 'Liability', subtype: 'Current Liability', balance: 12500.00, status: 'Active' },
  { id: '2010', code: '2010', name: 'Amex Corporate', type: 'Liability', subtype: 'Credit Card', balance: 4250.20, status: 'Active' },
  { id: '2200', code: '2200', name: 'Sales Tax Payable', type: 'Liability', subtype: 'Current Liability', balance: 2100.00, status: 'Active' },
  
  // Equity
  { id: '3000', code: '3000', name: 'Owner\'s Equity', type: 'Equity', subtype: 'Equity', balance: 100000.00, status: 'Active' },
  { id: '3100', code: '3100', name: 'Retained Earnings', type: 'Equity', subtype: 'Equity', balance: 85000.00, status: 'Active' },

  // Revenue
  { id: '4000', code: '4000', name: 'Sales Revenue', type: 'Revenue', subtype: 'Income', balance: 250000.00, status: 'Active' },
  { id: '4100', code: '4100', name: 'Service Revenue', type: 'Revenue', subtype: 'Income', balance: 75000.00, status: 'Active' },

  // Expenses
  { id: '5000', code: '5000', name: 'Advertising', type: 'Expense', subtype: 'Operating Expense', balance: 15000.00, status: 'Active' },
  { id: '5100', code: '5100', name: 'Rent Expense', type: 'Expense', subtype: 'Operating Expense', balance: 54000.00, status: 'Active' },
  { id: '5200', code: '5200', name: 'Salaries & Wages', type: 'Expense', subtype: 'Payroll', balance: 180000.00, status: 'Active' },
  { id: '5300', code: '5300', name: 'Software Subscriptions', type: 'Expense', subtype: 'Operating Expense', balance: 8500.00, status: 'Active' },
  { id: '5400', code: '5400', name: 'Travel', type: 'Expense', subtype: 'Operating Expense', balance: 4200.00, status: 'Active' },
];

export const MOCK_LETTERS: HRLetter[] = [
  { id: 'LTR-001', employeeId: 'e1', employeeName: 'Alex Doe', avatarUrl: 'https://picsum.photos/100/100?random=20', type: 'Salary Certificate', status: 'Pending', dateRequested: '2024-11-20', purpose: 'Bank Loan Application', addressee: 'Chase Bank' },
  { id: 'LTR-002', employeeId: 'e4', employeeName: 'Linda Kim', avatarUrl: 'https://picsum.photos/100/100?random=23', type: 'Employment Verification', status: 'Approved', dateRequested: '2024-11-15', dateIssued: '2024-11-16', purpose: 'Visa Application', addressee: 'Consulate General' },
  { id: 'LTR-003', employeeId: 'e5', employeeName: 'Robert Chen', avatarUrl: 'https://picsum.photos/100/100?random=24', type: 'NOC', status: 'Rejected', dateRequested: '2024-11-10', purpose: 'Part-time Study', rejectionReason: 'Requires manager approval first' },
  { id: 'LTR-004', employeeId: 'e1', employeeName: 'Alex Doe', avatarUrl: 'https://picsum.photos/100/100?random=20', type: 'Employment Verification', status: 'Approved', dateRequested: '2024-10-01', dateIssued: '2024-10-02', purpose: 'Housing Rental', addressee: 'To Whom It May Concern' },
];

export const MOCK_CLAIMS: Claim[] = [
  { id: 'CLM-001', employeeId: 'e1', employeeName: 'Alex Doe', avatarUrl: 'https://picsum.photos/100/100?random=20', description: 'Flight to NYC for Conference', amount: 450.00, date: '2024-11-10', category: 'Travel', status: 'Approved', notes: 'Economy class' },
  { id: 'CLM-002', employeeId: 'e4', employeeName: 'Linda Kim', avatarUrl: 'https://picsum.photos/100/100?random=23', description: 'Client Lunch with TechNova', amount: 125.50, date: '2024-11-12', category: 'Meals', status: 'Submitted', notes: '3 attendees' },
  { id: 'CLM-003', employeeId: 'e5', employeeName: 'Robert Chen', avatarUrl: 'https://picsum.photos/100/100?random=24', description: 'Mechanical Keyboard', amount: 149.99, date: '2024-11-05', category: 'Office Supplies', status: 'Paid', notes: 'WFH equipment allowance' },
  { id: 'CLM-004', employeeId: 'e1', employeeName: 'Alex Doe', avatarUrl: 'https://picsum.photos/100/100?random=20', description: 'Uber to Airport', amount: 45.00, date: '2024-11-10', category: 'Travel', status: 'Approved' },
  { id: 'CLM-005', employeeId: 'e3', employeeName: 'James Wilson', avatarUrl: 'https://picsum.photos/100/100?random=22', description: 'Sales Training Course', amount: 299.00, date: '2024-10-20', category: 'Training', status: 'Rejected', notes: 'Not pre-approved' },
];

export const MOCK_TRAINING_COURSES: TrainingCourse[] = [
  { 
    id: 'TR-001', 
    title: 'Cybersecurity Awareness 2024', 
    description: 'Essential security protocols, phishing detection, and data protection practices for all employees.', 
    category: 'Security', 
    duration: '1h 30m', 
    status: 'Active', 
    modules: [
        { id: 'm1', title: 'Introduction to Phishing', duration: '15m', type: 'Video' },
        { id: 'm2', title: 'Password Security Best Practices', duration: '20m', type: 'Video' },
        { id: 'm3', title: 'Identifying Malicious Attachments', duration: '25m', type: 'Reading' },
        { id: 'm4', title: 'Final Assessment', duration: '30m', type: 'Quiz' },
    ],
    modulesCount: 4 
  },
  { 
    id: 'TR-002', 
    title: 'Leadership Fundamentals', 
    description: 'Core skills for new managers including conflict resolution, feedback delivery, and team motivation.', 
    category: 'Leadership', 
    duration: '4h 00m', 
    status: 'Active', 
    modules: [
        { id: 'm1', title: 'Transitioning to Management', duration: '45m', type: 'Video' },
        { id: 'm2', title: 'Conflict Resolution Strategies', duration: '60m', type: 'Video' },
        { id: 'm3', title: 'Effective Feedback Loops', duration: '45m', type: 'Reading' },
        { id: 'm4', title: 'Motivation & Engagement', duration: '45m', type: 'Video' },
        { id: 'm5', title: 'Scenario Roleplay', duration: '45m', type: 'Quiz' }
    ],
    modulesCount: 5 
  },
  { 
    id: 'TR-003', 
    title: 'GDPR Compliance', 
    description: 'Understanding data privacy laws and how they impact our daily operations and customer interactions.', 
    category: 'Compliance', 
    duration: '2h 00m', 
    status: 'Active',
    modules: [
        { id: 'm1', title: 'What is GDPR?', duration: '30m', type: 'Video' },
        { id: 'm2', title: 'Data Subject Rights', duration: '45m', type: 'Reading' },
        { id: 'm3', title: 'Handling Breaches', duration: '30m', type: 'Video' },
        { id: 'm4', title: 'Compliance Quiz', duration: '15m', type: 'Quiz' }
    ], 
    modulesCount: 4 
  },
  { 
    id: 'TR-004', 
    title: 'Advanced React Patterns', 
    description: 'Deep dive into hooks, context, performance optimization, and scalable architecture.', 
    category: 'Technical', 
    duration: '6h 30m', 
    status: 'Active', 
    modules: [
        { id: 'm1', title: 'Hooks Deep Dive', duration: '60m', type: 'Video' },
        { id: 'm2', title: 'Context API vs Redux', duration: '45m', type: 'Video' },
        { id: 'm3', title: 'Performance Optimization', duration: '90m', type: 'Video' },
        { id: 'm4', title: 'Render Props & HOCs', duration: '45m', type: 'Reading' },
        { id: 'm5', title: 'Final Project', duration: '120m', type: 'Quiz' }
    ],
    modulesCount: 5 
  },
  { 
    id: 'TR-005', 
    title: 'Effective Communication', 
    description: 'Improving verbal and written communication skills for cross-functional collaboration.', 
    category: 'Soft Skills', 
    duration: '3h 00m', 
    status: 'Active', 
    modules: [
        { id: 'm1', title: 'Active Listening', duration: '30m', type: 'Video' },
        { id: 'm2', title: 'Email Etiquette', duration: '45m', type: 'Reading' },
        { id: 'm3', title: 'Presentation Skills', duration: '60m', type: 'Video' },
        { id: 'm4', title: 'Negotiation Basics', duration: '45m', type: 'Video' }
    ],
    modulesCount: 4 
  },
];

export const MOCK_TRAINING_ASSIGNMENTS: TrainingAssignment[] = [
  { id: 'TA-001', courseId: 'TR-001', employeeId: 'e1', assignedDate: '2024-11-01', dueDate: '2024-11-30', status: 'In Progress', progress: 50, completedModuleIds: ['m1', 'm2'] },
  { id: 'TA-002', courseId: 'TR-003', employeeId: 'e1', assignedDate: '2024-10-15', dueDate: '2024-11-15', status: 'Completed', progress: 100, completionDate: '2024-11-10', score: 95, completedModuleIds: ['m1', 'm2', 'm3', 'm4'] },
  { id: 'TA-003', courseId: 'TR-001', employeeId: 'e2', assignedDate: '2024-11-01', dueDate: '2024-11-30', status: 'Not Started', progress: 0, completedModuleIds: [] },
  { id: 'TA-004', courseId: 'TR-002', employeeId: 'e3', assignedDate: '2024-10-01', dueDate: '2024-10-31', status: 'Overdue', progress: 20, completedModuleIds: ['m1'] },
  { id: 'TA-005', courseId: 'TR-005', employeeId: 'e4', assignedDate: '2024-11-05', dueDate: '2024-12-05', status: 'In Progress', progress: 50, completedModuleIds: ['m1', 'm2'] },
  { id: 'TA-006', courseId: 'TR-004', employeeId: 'e5', assignedDate: '2024-11-10', dueDate: '2024-12-10', status: 'Not Started', progress: 0, completedModuleIds: [] },
];

export const MOCK_CHANNELS: ChatChannel[] = [
  { id: 'ch-1', name: 'general', type: 'public', unreadCount: 0, description: 'Company-wide announcements and general discussion.', members: ['me', 'u2', 'u3', 'u4'] },
  { id: 'ch-2', name: 'announcements', type: 'public', unreadCount: 2, description: 'Important updates from the leadership team.', members: ['me', 'u2'] },
  { id: 'ch-3', name: 'sales-wins', type: 'public', unreadCount: 0, description: 'Celebrating our victories! 🏆', members: ['me', 'u3'] },
  { id: 'ch-4', name: 'design-team', type: 'private', unreadCount: 0, description: 'Private discussions for the product design team.', members: ['me', 'u4'] },
  { id: 'dm-1', name: 'Maria Garcia', type: 'dm', avatarUrl: 'https://picsum.photos/100/100?random=21', status: 'online' },
  { id: 'dm-2', name: 'Sarah Connor', type: 'dm', avatarUrl: 'https://picsum.photos/100/100?random=3', status: 'busy' },
  { id: 'dm-3', name: 'James Wilson', type: 'dm', avatarUrl: 'https://picsum.photos/100/100?random=22', status: 'offline', unreadCount: 1 },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { 
    id: 'msg-1', 
    channelId: 'ch-1', 
    senderId: 'u2', 
    senderName: 'Maria Garcia', 
    senderAvatar: 'https://picsum.photos/100/100?random=21', 
    content: 'Has everyone reviewed the new Q4 goals?', 
    timestamp: '10:30 AM', 
    date: 'Today',
    reactions: { '👍': 3, '🔥': 1 }
  },
  { 
    id: 'msg-2', 
    channelId: 'ch-1', 
    senderId: 'me', 
    senderName: 'Alex Doe', 
    senderAvatar: 'https://picsum.photos/100/100?random=20', 
    content: 'Yes, looking good! I will update the dashboard today.', 
    timestamp: '10:32 AM', 
    date: 'Today',
    isMe: true 
  },
  { 
    id: 'msg-3', 
    channelId: 'ch-1', 
    senderId: 'u3', 
    senderName: 'James Wilson', 
    senderAvatar: 'https://picsum.photos/100/100?random=22', 
    content: 'I have a few questions about the sales targets.', 
    timestamp: '10:35 AM', 
    date: 'Today',
    replyToId: 'msg-1'
  },
  { 
    id: 'msg-4', 
    channelId: 'ch-1', 
    senderId: 'me', 
    senderName: 'Alex Doe', 
    senderAvatar: 'https://picsum.photos/100/100?random=20', 
    content: 'Let’s discuss in the standup.', 
    timestamp: '10:36 AM', 
    date: 'Today',
    isMe: true 
  },
  { 
    id: 'msg-5', 
    channelId: 'ch-2', 
    senderId: 'u2', 
    senderName: 'Maria Garcia', 
    senderAvatar: 'https://picsum.photos/100/100?random=21', 
    content: 'Office will be closed this Friday for maintenance.', 
    timestamp: 'Yesterday', 
    date: 'Yesterday',
    isEdited: true
  },
  { 
    id: 'msg-6', 
    channelId: 'dm-1', 
    senderId: 'u2', 
    senderName: 'Maria Garcia', 
    senderAvatar: 'https://picsum.photos/100/100?random=21', 
    content: 'Hey Alex, do you have the latest design assets?', 
    timestamp: '9:00 AM', 
    date: 'Today'
  },
  { 
    id: 'msg-7', 
    channelId: 'dm-1', 
    senderId: 'me', 
    senderName: 'Alex Doe', 
    senderAvatar: 'https://picsum.photos/100/100?random=20', 
    content: 'Sending them over now.', 
    timestamp: '9:05 AM', 
    date: 'Today', 
    isMe: true,
    attachments: [
        { id: 'a1', name: 'Homepage_V2.fig', type: 'file', size: '24 MB' }
    ] 
  },
];

export const MOCK_ROLES: Role[] = [
  {
    id: 'r1',
    name: 'Super Admin',
    description: 'Full access to all modules and system settings.',
    usersCount: 2,
    isSystem: true,
    permissions: {
      'CRM': 'Admin',
      'Finance': 'Admin',
      'HR': 'Admin',
      'Inventory': 'Admin',
      'Settings': 'Admin'
    }
  },
  {
    id: 'r2',
    name: 'Sales Manager',
    description: 'Manage leads, customers, and view sales reports.',
    usersCount: 5,
    isSystem: false,
    permissions: {
      'CRM': 'Write',
      'Finance': 'Read',
      'HR': 'None',
      'Inventory': 'Read',
      'Settings': 'None'
    }
  },
  {
    id: 'r3',
    name: 'HR Specialist',
    description: 'Manage employees, payroll, and recruitment.',
    usersCount: 3,
    isSystem: false,
    permissions: {
      'CRM': 'None',
      'Finance': 'Read',
      'HR': 'Write',
      'Inventory': 'None',
      'Settings': 'None'
    }
  },
  {
    id: 'r4',
    name: 'Accountant',
    description: 'Manage invoices, expenses, and banking.',
    usersCount: 2,
    isSystem: false,
    permissions: {
      'CRM': 'Read',
      'Finance': 'Write',
      'HR': 'Read',
      'Inventory': 'Read',
      'Settings': 'None'
    }
  },
  {
    id: 'r5',
    name: 'Viewer',
    description: 'Read-only access to basic modules.',
    usersCount: 10,
    isSystem: true,
    permissions: {
      'CRM': 'Read',
      'Finance': 'None',
      'HR': 'None',
      'Inventory': 'Read',
      'Settings': 'None'
    }
  }
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'TechSupply Co', email: 'sales@techsupply.com', phone: '555-0101', contactPerson: 'John Smith', category: 'Hardware', status: 'Active' },
  { id: 'v2', name: 'Office Depot', email: 'b2b@officedepot.com', phone: '555-0102', contactPerson: 'Sarah Jones', category: 'Supplies', status: 'Active' },
  { id: 'v3', name: 'Cloud Services Inc', email: 'billing@cloudinc.com', phone: '555-0103', contactPerson: 'Mike Brown', category: 'Software', status: 'Active' },
  { id: 'v4', name: 'Global Logistics', email: 'ops@globallogistics.com', phone: '555-0104', contactPerson: 'Emily White', category: 'Services', status: 'Inactive' },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-2024-001',
    vendorId: 'v1',
    vendorName: 'TechSupply Co',
    orderDate: '2024-10-01',
    expectedDate: '2024-10-15',
    status: 'Received',
    totalAmount: 12500,
    items: [
      { id: 'pi-1', description: 'MacBook Pro 16"', quantity: 5, unitCost: 2500 }
    ]
  },
  {
    id: 'PO-2024-002',
    vendorId: 'v2',
    vendorName: 'Office Depot',
    orderDate: '2024-10-10',
    expectedDate: '2024-10-12',
    status: 'Received',
    totalAmount: 450,
    items: [
      { id: 'pi-2', description: 'Ergonomic Chairs', quantity: 2, unitCost: 225 }
    ]
  },
  {
    id: 'PO-2024-003',
    vendorId: 'v1',
    vendorName: 'TechSupply Co',
    orderDate: '2024-11-01',
    expectedDate: '2024-11-20',
    status: 'Ordered',
    totalAmount: 5000,
    items: [
      { id: 'pi-3', description: 'Dell Monitors 27"', quantity: 10, unitCost: 500 }
    ]
  },
  {
    id: 'PO-2024-004',
    vendorId: 'v3',
    vendorName: 'Cloud Services Inc',
    orderDate: '2024-11-05',
    status: 'Draft',
    totalAmount: 1200,
    items: [
      { id: 'pi-4', description: 'Annual Server License', quantity: 1, unitCost: 1200 }
    ]
  }
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'AST-001', name: 'MacBook Pro 16"', category: 'Hardware', serialNumber: 'C02XV0J9JG5J', status: 'In Use', purchaseDate: '2023-01-15', value: 2499, assignedTo: 'e1', assignedToName: 'Alex Doe', avatarUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=100' },
  { id: 'AST-002', name: 'Dell UltraSharp 27"', category: 'Hardware', serialNumber: 'CN-0V0-001', status: 'In Use', purchaseDate: '2023-02-10', value: 450, assignedTo: 'e5', assignedToName: 'Robert Chen', avatarUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=100' },
  { id: 'AST-003', name: 'Herman Miller Aeron', category: 'Furniture', serialNumber: 'HM-AE-992', status: 'Available', purchaseDate: '2022-11-05', value: 1200, avatarUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=100' },
  { id: 'AST-004', name: 'Adobe Creative Cloud', category: 'Software', serialNumber: 'LIC-9928-XA', status: 'In Use', purchaseDate: '2024-01-01', value: 600, assignedTo: 'e1', assignedToName: 'Alex Doe', avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg/100px-Adobe_Creative_Cloud_rainbow_icon.svg.png' },
  { id: 'AST-005', name: 'iPhone 15 Pro', category: 'Hardware', serialNumber: 'F2L99XK2', status: 'Maintenance', purchaseDate: '2023-10-20', value: 999, avatarUrl: 'https://images.unsplash.com/photo-1695048180490-758e9bde7bad?auto=format&fit=crop&q=80&w=100' },
  { id: 'AST-006', name: 'Company Van (Ford)', category: 'Vehicle', serialNumber: 'VIN-884291', status: 'In Use', purchaseDate: '2021-06-15', value: 35000, assignedTo: 'e6', assignedToName: 'Emily Davis', avatarUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=100' },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Elena Fisher',
    company: 'Nebula Corp',
    email: 'elena@nebula.io',
    value: 12500,
    stage: LeadStage.PROPOSAL,
    type: 'Project',
    lastActive: '2h ago',
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    productInterest: 'Enterprise License'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    company: 'Hyperion Systems',
    email: 'm.chen@hyperion.net',
    value: 8400,
    stage: LeadStage.QUALIFIED,
    type: 'Direct Sales',
    lastActive: '5h ago',
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    productInterest: 'Add-on Pack'
  },
  {
    id: '3',
    name: 'Sarah Connor',
    company: 'Skynet Ind',
    email: 'sarah@skynet.com',
    value: 45000,
    stage: LeadStage.CONTACTED,
    type: 'Project',
    lastActive: '1d ago',
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    productInterest: 'Enterprise License'
  },
  {
    id: '4',
    name: 'Jean-Luc P.',
    company: 'Starfleet',
    email: 'picard@starfleet.org',
    value: 2500,
    stage: LeadStage.NEW,
    type: 'Direct Sales',
    lastActive: '10m ago',
    avatarUrl: 'https://picsum.photos/100/100?random=4',
    productInterest: 'Support Plan'
  },
  {
    id: '5',
    name: 'Tony Stark',
    company: 'Stark Ind',
    email: 'tony@stark.com',
    value: 1000000,
    stage: LeadStage.WON,
    type: 'Project',
    lastActive: '3d ago',
    avatarUrl: 'https://picsum.photos/100/100?random=5',
    productInterest: 'Enterprise License'
  },
  {
    id: '6',
    name: 'Bruce Wayne',
    company: 'Wayne Ent',
    email: 'bruce@wayne.com',
    value: 500000,
    stage: LeadStage.QUALIFIED,
    type: 'Project',
    lastActive: '4h ago',
    avatarUrl: 'https://picsum.photos/100/100?random=6',
    productInterest: 'Legacy API Access'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', user: 'You', action: 'moved', target: 'Elena Fisher', time: '2h ago' },
  { id: '2', user: 'System', action: 'received email from', target: 'Marcus Chen', time: '5h ago' },
  { id: '3', user: 'You', action: 'created lead', target: 'Jean-Luc P.', time: '10m ago' },
  { id: '4', user: 'You', action: 'closed deal', target: 'Tony Stark', time: '3d ago' },
];

export const MOCK_METRICS: Metric[] = [
  { label: 'Total Active Value', value: '$724,000', trend: 12, trendUp: true },
  { label: 'Leads in Pipeline', value: '42', trend: 5, trendUp: true },
  { label: 'Avg. Deal Size', value: '$17,238', trend: 2, trendUp: false },
  { label: 'Win Rate', value: '34%', trend: 8, trendUp: true },
];

export const CHART_DATA = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    client: 'Nebula Corp',
    status: 'Active',
    priority: 'High',
    category: 'Web',
    startDate: 'Sep 01, 2024',
    dueDate: 'Oct 24, 2024',
    progress: 65,
    budget: '$12,000',
    description: 'Complete overhaul of corporate identity and web presence, moving from WordPress to a custom Next.js stack with headless CMS integration. Key deliverables include a new design system, migrated content, and SEO optimization.',
    members: ['https://picsum.photos/100/100?random=1', 'https://picsum.photos/100/100?random=2'],
    tags: ['Design', 'Dev', 'SEO'],
    relatedProduct: 'Enterprise License',
    teamId: 't3'
  },
  {
    id: 'p2',
    name: 'Mobile App Launch',
    client: 'Hyperion Systems',
    status: 'Planning',
    priority: 'Medium',
    category: 'Mobile',
    startDate: 'Oct 15, 2024',
    dueDate: 'Dec 01, 2024',
    progress: 15,
    budget: '$45,000',
    description: 'Initial discovery phase for the new fintech mobile application. Focusing on user flows and wireframing before high-fidelity design.',
    members: ['https://picsum.photos/100/100?random=3'],
    tags: ['Mobile', 'Strategy'],
    relatedProduct: 'UI Design Kit',
    teamId: 't2'
  },
  {
    id: 'p3',
    name: 'Q4 Marketing Campaign',
    client: 'Stark Ind',
    status: 'On Hold',
    priority: 'Low',
    category: 'Marketing',
    startDate: 'Aug 01, 2024',
    dueDate: 'Nov 15, 2024',
    progress: 40,
    budget: '$25,000',
    description: 'Cross-channel marketing push for the new product line. Currently paused pending asset approval from legal department.',
    members: ['https://picsum.photos/100/100?random=4', 'https://picsum.photos/100/100?random=5', 'https://picsum.photos/100/100?random=6'],
    tags: ['Marketing', 'Ads'],
    relatedProduct: 'Add-on Pack',
    teamId: 't1'
  },
  {
    id: 'p4',
    name: 'Legacy Migration',
    client: 'Wayne Ent',
    status: 'Completed',
    priority: 'High',
    category: 'Internal',
    startDate: 'Jan 10, 2024',
    dueDate: 'Sep 30, 2024',
    progress: 100,
    budget: '$120,000',
    description: 'Migration of 5TB of on-premise data to cloud infrastructure. Successfully completed with zero downtime.',
    members: ['https://picsum.photos/100/100?random=7'],
    tags: ['Infrastructure', 'Data'],
    relatedProduct: 'Legacy API Access',
    teamId: 't2'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Alice Vaughn', company: 'TechNova', email: 'alice@technova.com', phone: '+1 555-0101', status: 'Active', totalSpent: 24500, lastOrderDate: 'Oct 12, 2024', avatarUrl: 'https://picsum.photos/100/100?random=10' },
  { id: 'c2', name: 'Robert Fox', company: 'Circle Inc', email: 'robert@circle.com', phone: '+1 555-0102', status: 'Active', totalSpent: 12000, lastOrderDate: 'Oct 08, 2024', avatarUrl: 'https://picsum.photos/100/100?random=11' },
  { id: 'c3', name: 'Kathryn Murphy', company: 'Soylent Corp', email: 'kat@soylent.com', phone: '+1 555-0103', status: 'Inactive', totalSpent: 4500, lastOrderDate: 'Aug 15, 2024', avatarUrl: 'https://picsum.photos/100/100?random=12' },
  { id: 'c4', name: 'Jacob Jones', company: 'Barone LLC', email: 'jacob@barone.com', phone: '+1 555-0104', status: 'Active', totalSpent: 89000, lastOrderDate: 'Oct 15, 2024', avatarUrl: 'https://picsum.photos/100/100?random=13' },
];

export const MOCK_INVOICES: Invoice[] = [
  { 
    id: 'INV-2024-001', 
    customerId: 'c1', 
    customerName: 'TechNova', 
    issueDate: 'Oct 01, 2024', 
    dueDate: 'Oct 31, 2024', 
    amount: 4500, 
    status: 'Paid', 
    relatedProduct: 'Enterprise License',
    subtotal: 4200,
    tax: 300,
    items: [
        { id: 'i1', description: 'Enterprise License - Annual', quantity: 1, price: 4000 },
        { id: 'i2', description: 'Setup Fee', quantity: 1, price: 200 }
    ],
    notes: 'Thank you for your business. Payment received via Wire.'
  },
  { 
    id: 'INV-2024-002', 
    customerId: 'c2', 
    customerName: 'Circle Inc', 
    issueDate: 'Oct 05, 2024', 
    dueDate: 'Nov 05, 2024', 
    amount: 1200, 
    status: 'Pending', 
    relatedProduct: 'Consulting Hours',
    subtotal: 1200,
    tax: 0,
    items: [
        { id: 'i3', description: 'Consulting Hours (Senior Architect)', quantity: 6, price: 200 }
    ]
  },
  { 
    id: 'INV-2024-003', 
    customerId: 'c4', 
    customerName: 'Barone LLC', 
    issueDate: 'Sep 15, 2024', 
    dueDate: 'Oct 15, 2024', 
    amount: 15000, 
    status: 'Overdue', 
    relatedProduct: 'Legacy API Access',
    subtotal: 14000,
    tax: 1000,
    items: [
        { id: 'i4', description: 'Legacy API Access Fee', quantity: 1, price: 14000 }
    ],
    notes: 'Please remit payment immediately to avoid service interruption.'
  },
  { 
    id: 'INV-2024-004', 
    customerId: 'c1', 
    customerName: 'TechNova', 
    issueDate: 'Oct 12, 2024', 
    dueDate: 'Nov 12, 2024', 
    amount: 20000, 
    status: 'Pending', 
    relatedProduct: 'Enterprise License',
    subtotal: 18500,
    tax: 1500,
    items: [
        { id: 'i5', description: 'Q4 Support Plan', quantity: 1, price: 2500 },
        { id: 'i6', description: 'Custom Feature Development', quantity: 1, price: 16000 }
    ]
  },
];

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 'QT-2024-001',
    customerId: 'c1',
    customerName: 'TechNova',
    issueDate: 'Oct 20, 2024',
    expiryDate: 'Nov 20, 2024',
    amount: 12500,
    status: 'Sent',
    items: [
        { id: 'q1', description: 'Web Development Phase 1', quantity: 1, price: 12500 }
    ],
    subtotal: 12500,
    tax: 0,
    notes: 'Includes initial design and discovery phase.'
  },
  {
    id: 'QT-2024-002',
    customerId: 'c2',
    customerName: 'Circle Inc',
    issueDate: 'Oct 22, 2024',
    expiryDate: 'Nov 22, 2024',
    amount: 4500,
    status: 'Draft',
    items: [
        { id: 'q2', description: 'Marketing Audit', quantity: 1, price: 4500 }
    ],
    subtotal: 4500,
    tax: 0
  },
  {
    id: 'QT-2024-003',
    customerId: 'c4',
    customerName: 'Barone LLC',
    issueDate: 'Sep 30, 2024',
    expiryDate: 'Oct 30, 2024',
    amount: 8000,
    status: 'Accepted',
    items: [
        { id: 'q3', description: 'Q4 Retainer', quantity: 1, price: 8000 }
    ],
    subtotal: 8000,
    tax: 0
  }
];

export const MOCK_SALES: SaleTransaction[] = [
  { id: 'txn_1', customerName: 'TechNova', product: 'Enterprise License', date: 'Oct 12, 2024', amount: 20000, paymentMethod: 'Wire Transfer', status: 'Completed' },
  { id: 'txn_2', customerName: 'Circle Inc', product: 'Consulting Hours', date: 'Oct 08, 2024', amount: 1200, paymentMethod: 'Credit Card', status: 'Completed' },
  { id: 'txn_3', customerName: 'TechNova', product: 'Add-on Pack', date: 'Oct 01, 2024', amount: 4500, paymentMethod: 'Wire Transfer', status: 'Completed' },
  { id: 'txn_4', customerName: 'Soylent Corp', product: 'Support Plan', date: 'Aug 15, 2024', amount: 2200, paymentMethod: 'Credit Card', status: 'Refunded' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e2', name: 'Maria Garcia', role: 'CTO', department: 'Engineering', email: 'maria@glassflow.com', phone: '+1 555-1002', status: 'Active', joinDate: 'Mar 15, 2021', avatarUrl: 'https://picsum.photos/100/100?random=21', location: 'New York, NY', salary: '165000' },
  { id: 'e3', name: 'James Wilson', role: 'Sales Director', department: 'Sales', email: 'james@glassflow.com', phone: '+1 555-1003', status: 'On Leave', joinDate: 'Nov 01, 2022', avatarUrl: 'https://picsum.photos/100/100?random=22', location: 'London, UK', salary: '140000' },
  { id: 'e1', name: 'Alex Doe', role: 'Senior Product Designer', department: 'Design', email: 'alex@glassflow.com', phone: '+1 555-1001', status: 'Active', joinDate: 'Jan 10, 2022', avatarUrl: 'https://picsum.photos/100/100?random=20', location: 'San Francisco, CA', salary: '125000', manager: 'Maria Garcia' },
  { id: 'e4', name: 'Linda Kim', role: 'Marketing Specialist', department: 'Marketing', email: 'linda@glassflow.com', phone: '+1 555-1004', status: 'Active', joinDate: 'Jun 20, 2023', avatarUrl: 'https://picsum.photos/100/100?random=23', location: 'San Francisco, CA', salary: '85000', manager: 'James Wilson' },
  { id: 'e5', name: 'Robert Chen', role: 'Frontend Engineer', department: 'Engineering', email: 'robert@glassflow.com', phone: '+1 555-1005', status: 'Active', joinDate: 'Feb 12, 2023', avatarUrl: 'https://picsum.photos/100/100?random=24', location: 'Remote', salary: '115000', manager: 'Maria Garcia' },
  { id: 'e6', name: 'Emily Davis', role: 'HR Manager', department: 'Operations', email: 'emily@glassflow.com', phone: '+1 555-1006', status: 'Active', joinDate: 'Sep 05, 2020', avatarUrl: 'https://picsum.photos/100/100?random=25', location: 'New York, NY', salary: '95000', manager: 'Maria Garcia' },
  { id: 'e7', name: 'David Kim', role: 'Senior Frontend Engineer', department: 'Engineering', email: 'david.kim@glassflow.com', phone: '+1 555 0123', status: 'Active', joinDate: 'Nov 01, 2024', avatarUrl: 'https://ui-avatars.com/api/?name=David+Kim&background=random', location: 'Remote', salary: '135000', manager: 'Maria Garcia' },
  { id: 'e8', name: 'Michael Ross', role: 'UX Designer', department: 'Design', email: 'mike.ross@glassflow.com', phone: '+1 555 0125', status: 'Active', joinDate: 'Nov 15, 2024', avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Ross&background=random', location: 'San Francisco, CA', salary: '115000', manager: 'Alex Doe' },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Design', description: 'Product design, branding, and user experience research.', managerId: 'e1', budget: 250000, targetHeadcount: 5, location: 'San Francisco, CA', tags: ['Creative', 'UX/UI'] },
  { id: 'd2', name: 'Engineering', description: 'Software development, infrastructure, and QA.', managerId: 'e2', budget: 1200000, targetHeadcount: 15, location: 'New York, NY', tags: ['Tech', 'Dev'] },
  { id: 'd3', name: 'Sales', description: 'Revenue generation, partnerships, and customer acquisition.', managerId: 'e3', budget: 500000, targetHeadcount: 8, location: 'London, UK', tags: ['Revenue', 'Global'] },
  { id: 'd4', name: 'Marketing', description: 'Brand awareness, campaigns, and growth strategies.', managerId: 'e4', budget: 350000, targetHeadcount: 4, location: 'San Francisco, CA', tags: ['Growth'] },
  { id: 'd5', name: 'Operations', description: 'HR, finance, legal, and office management.', managerId: 'e6', budget: 150000, targetHeadcount: 3, location: 'New York, NY', tags: ['Admin'] },
];

export const MOCK_TEAMS: Team[] = [
  { id: 't1', name: 'Growth Hacking', description: 'Cross-functional team focused on viral loops and user acquisition.', leadId: 'e4', memberIds: ['e4', 'e1', 'e6'], tags: ['Marketing', 'Product'] },
  { id: 't2', name: 'Platform Core', description: 'Maintaining the backend infrastructure and core API services.', leadId: 'e2', memberIds: ['e2', 'e5', 'e7'], tags: ['Engineering', 'DevOps'] },
  { id: 't3', name: 'Design Systems', description: 'Building and maintaining the GlassFlow UI kit and brand assets.', leadId: 'e1', memberIds: ['e1', 'e5', 'e8'], tags: ['Design', 'Frontend'] },
];

export const MOCK_PAYROLL_RUNS: PayrollRun[] = [
  { id: 'PR-2024-10', period: 'October 2024', date: 'Oct 31, 2024', totalCost: 60416.67, employeeCount: 6, status: 'Paid', reference: 'ACH-88329' },
  { id: 'PR-2024-09', period: 'September 2024', date: 'Sep 30, 2024', totalCost: 60416.67, employeeCount: 6, status: 'Paid', reference: 'ACH-88102' },
  { id: 'PR-2024-08', period: 'August 2024', date: 'Aug 31, 2024', totalCost: 58500.00, employeeCount: 5, status: 'Paid', reference: 'ACH-87955' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P-101', name: 'Enterprise License', category: 'Software', type: 'Digital', price: 20000, billingFrequency: 'Yearly', status: 'Active', description: 'Full access to the entire GlassFlow suite for unlimited users.', sku: 'GF-ENT-001' },
  { id: 'P-102', name: 'Consulting Hours', category: 'Professional Services', type: 'Service', price: 200, billingFrequency: 'One-time', status: 'Active', description: 'Hourly consultation with our solution architects.', sku: 'GF-SVC-001' },
  { id: 'P-103', name: 'Add-on Pack', category: 'Software', type: 'Digital', price: 4500, billingFrequency: 'One-time', status: 'Active', description: 'Additional modules for marketing and automation.', sku: 'GF-ADD-002' },
  { id: 'P-104', name: 'Support Plan', category: 'Support', type: 'Service', price: 2200, billingFrequency: 'Monthly', status: 'Active', description: '24/7 priority support and dedicated account manager.', sku: 'GF-SUP-001' },
  { id: 'P-105', name: 'UI Design Kit', category: 'Assets', type: 'Digital', price: 99, billingFrequency: 'One-time', status: 'Active', description: 'Figma and Sketch files for the GlassFlow design system.', sku: 'GF-AST-003' },
  { id: 'P-106', name: 'Legacy API Access', category: 'Software', type: 'Digital', price: 5000, billingFrequency: 'Yearly', status: 'Archived', description: 'Access to the deprecated v1 API endpoints.', sku: 'GF-LEG-001' },
];

export const MOCK_TICKETS: ServiceTicket[] = [
  { id: 'T-1001', subject: 'Login authentication failing', customerName: 'TechNova', type: 'Bug', priority: 'High', status: 'Open', assignedTo: 'https://picsum.photos/100/100?random=20', createdAt: '2h ago' },
  { id: 'T-1002', subject: 'Update billing address', customerName: 'Circle Inc', type: 'Support', priority: 'Medium', status: 'In Progress', assignedTo: 'https://picsum.photos/100/100?random=21', createdAt: '1d ago' },
  { id: 'T-1003', subject: 'Feature request: Export to PDF', customerName: 'Soylent Corp', type: 'Feature', priority: 'Low', status: 'Closed', assignedTo: 'https://picsum.photos/100/100?random=22', createdAt: '3d ago' },
  { id: 'T-1004', subject: 'System downtime inquiry', customerName: 'Barone LLC', type: 'Incident', priority: 'Critical', status: 'Resolved', assignedTo: 'https://picsum.photos/100/100?random=23', createdAt: '1w ago' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'T-1',
    title: 'Finalize Homepage Hero',
    description: 'Review the latest hi-fi comps and approve assets for development.',
    status: TaskStatus.IN_PROGRESS,
    priority: 'High',
    dueDate: 'Oct 24, 2024',
    assignee: 'https://picsum.photos/100/100?random=20',
    assigneeName: 'Alex Doe',
    project: 'Website Redesign',
    tags: ['Design', 'Review'],
    createdAt: '2d ago'
  },
  {
    id: 'T-2',
    title: 'Client Discovery Meeting',
    description: 'Initial scoping session with the stakeholders from Hyperion Systems.',
    status: TaskStatus.TODO,
    priority: 'Medium',
    dueDate: 'Oct 26, 2024',
    assignee: 'https://picsum.photos/100/100?random=22',
    assigneeName: 'James Wilson',
    project: 'Mobile App Launch',
    tags: ['Meeting', 'Strategy'],
    createdAt: '1d ago'
  },
  {
    id: 'T-3',
    title: 'Fix Login Bug',
    description: 'Auth token fails to refresh on Safari iOS.',
    status: TaskStatus.DONE,
    priority: 'High',
    dueDate: 'Oct 20, 2024',
    assignee: 'https://picsum.photos/100/100?random=24',
    assigneeName: 'Robert Chen',
    project: 'Website Redesign',
    tags: ['Bug', 'Dev'],
    createdAt: '5d ago'
  },
  {
    id: 'T-4',
    title: 'Q4 Budget Report',
    description: 'Compile financial data for the upcoming board meeting.',
    status: TaskStatus.REVIEW,
    priority: 'High',
    dueDate: 'Oct 25, 2024',
    assignee: 'https://picsum.photos/100/100?random=25',
    assigneeName: 'Emily Davis',
    tags: ['Finance', 'Admin'],
    createdAt: '3h ago'
  },
  {
    id: 'T-5',
    title: 'Update UI Kit',
    description: 'Add new button variants and card components to the design system.',
    status: TaskStatus.TODO,
    priority: 'Low',
    dueDate: 'Nov 01, 2024',
    assignee: 'https://picsum.photos/100/100?random=20',
    assigneeName: 'Alex Doe',
    project: 'Mobile App Launch',
    tags: ['Design System'],
    createdAt: '1w ago'
  }
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  { id: 'BA-01', name: 'Primary Business Checking', bankName: 'Chase', accountNumber: '**** 4291', balance: 142500.00, currency: 'USD', type: 'Checking', color: 'black' },
  { id: 'BA-02', name: 'Operational Savings', bankName: 'Silicon Valley Bank', accountNumber: '**** 8823', balance: 50000.00, currency: 'USD', type: 'Savings', color: 'blue' },
  { id: 'BA-03', name: 'Corporate Credit', bankName: 'Amex', accountNumber: '**** 1002', balance: -4250.20, currency: 'USD', type: 'Credit', color: 'slate' },
];

export const MOCK_BANK_TRANSACTIONS: BankTransaction[] = [
  { id: 'BT-101', accountId: 'BA-01', date: 'Oct 12, 2024', description: 'Payment from TechNova', amount: 20000, type: 'Credit', category: 'Sales', status: 'Cleared', referenceId: 'INV-2024-004' },
  { id: 'BT-102', accountId: 'BA-01', date: 'Oct 10, 2024', description: 'AWS Services', amount: 1250.00, type: 'Debit', category: 'Infrastructure', status: 'Cleared' },
  { id: 'BT-103', accountId: 'BA-01', date: 'Oct 08, 2024', description: 'Payment from Circle Inc', amount: 1200, type: 'Credit', category: 'Sales', status: 'Cleared', referenceId: 'INV-2024-002' },
  { id: 'BT-104', accountId: 'BA-02', date: 'Oct 01, 2024', description: 'Interest Deposit', amount: 125.50, type: 'Credit', category: 'Interest', status: 'Cleared' },
  { id: 'BT-105', accountId: 'BA-03', date: 'Sep 28, 2024', description: 'Office Supplies', amount: 340.20, type: 'Debit', category: 'Operations', status: 'Pending' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP-001', payee: 'AWS Web Services', description: 'Monthly Cloud Infrastructure', amount: 1250.00, date: '2024-10-10', category: 'Infrastructure', status: 'Paid', method: 'Credit Card', reference: 'INV-AWS-OCT' },
  { id: 'EXP-002', payee: 'WeWork', description: 'Office Rent - SF', amount: 4500.00, date: '2024-10-01', category: 'Rent', status: 'Paid', method: 'Wire Transfer' },
  { id: 'EXP-003', payee: 'Adobe Creative Cloud', description: 'Team License Subscription', amount: 599.00, date: '2024-10-15', category: 'Software', status: 'Pending', method: 'Credit Card' },
  { id: 'EXP-004', payee: 'Uber for Business', description: 'Client Travel', amount: 145.50, date: '2024-10-18', category: 'Travel', status: 'Paid', method: 'Corporate Card' },
  { id: 'EXP-005', payee: 'Slack', description: 'Annual Subscription', amount: 2400.00, date: '2024-09-15', category: 'Software', status: 'Paid', method: 'Wire Transfer' },
];

export const MOCK_CANDIDATES: Candidate[] = [
  { id: 'CAN-001', name: 'David Kim', role: 'Senior Frontend Engineer', email: 'david.kim@email.com', phone: '+1 555 0123', stage: CandidateStage.INTERVIEW, appliedDate: '2024-10-01', rating: 4, avatarUrl: 'https://ui-avatars.com/api/?name=David+Kim&background=random' },
  { id: 'CAN-002', name: 'Sarah Jenkins', role: 'Product Manager', email: 'sarah.j@email.com', phone: '+1 555 0124', stage: CandidateStage.APPLIED, appliedDate: '2024-10-12', rating: 0, avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random' },
  { id: 'CAN-003', name: 'Michael Ross', role: 'UX Designer', email: 'mike.ross@email.com', phone: '+1 555 0125', stage: CandidateStage.OFFER, appliedDate: '2024-09-20', rating: 5, avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Ross&background=random' },
  { id: 'CAN-004', name: 'Jessica Pearson', role: 'Sales Executive', email: 'jess.p@email.com', phone: '+1 555 0126', stage: CandidateStage.SCREENING, appliedDate: '2024-10-10', rating: 3, avatarUrl: 'https://ui-avatars.com/api/?name=Jessica+Pearson&background=random' },
  { id: 'CAN-005', name: 'Louis Litt', role: 'Legal Counsel', email: 'louis@email.com', phone: '+1 555 0127', stage: CandidateStage.HIRED, appliedDate: '2024-09-01', rating: 4, avatarUrl: 'https://ui-avatars.com/api/?name=Louis+Litt&background=random' },
];

export const MOCK_ONBOARDING_PROCESSES: EmployeeProcess[] = [
  {
    id: 'OB-001',
    employeeId: 'e7',
    employeeName: 'David Kim',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    avatarUrl: 'https://ui-avatars.com/api/?name=David+Kim&background=random',
    type: 'Onboarding',
    stage: 'Week 1',
    progress: 45,
    startDate: '2024-11-01',
    status: 'Active',
    tasks: [
      { id: 't1', title: 'Sign Contract', status: 'Completed', category: 'HR', dueDate: '2024-11-01', assignee: 'HR' },
      { id: 't2', title: 'IT Setup', status: 'Completed', category: 'IT', dueDate: '2024-11-02', assignee: 'IT Support' },
      { id: 't3', title: 'Team Introduction', status: 'Pending', category: 'Admin', dueDate: '2024-11-03', assignee: 'Manager' },
      { id: 't4', title: 'Product Training', status: 'Pending', category: 'Training', dueDate: '2024-11-05', assignee: 'Mentor' },
    ]
  },
  {
    id: 'OB-002',
    employeeId: 'e8',
    employeeName: 'Michael Ross',
    role: 'UX Designer',
    department: 'Design',
    avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Ross&background=random',
    type: 'Onboarding',
    stage: 'Pre-boarding',
    progress: 10,
    startDate: '2024-11-15',
    status: 'Active',
    tasks: [
      { id: 't5', title: 'Send Welcome Email', status: 'Completed', category: 'HR', dueDate: '2024-11-10', assignee: 'HR' },
      { id: 't6', title: 'Laptop Provisioning', status: 'Pending', category: 'IT', dueDate: '2024-11-12', assignee: 'IT Support' },
      { id: 't7', title: 'Account Creation', status: 'Pending', category: 'IT', dueDate: '2024-11-13', assignee: 'IT Support' },
    ]
  },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', employeeId: 'e1', employeeName: 'Alex Doe', avatarUrl: 'https://picsum.photos/100/100?random=20', date: '2024-11-20', checkIn: '08:55 AM', checkOut: '05:30 PM', status: 'Present', totalHours: '8h 35m' },
  { id: 'att-2', employeeId: 'e2', employeeName: 'Maria Garcia', avatarUrl: 'https://picsum.photos/100/100?random=21', date: '2024-11-20', checkIn: '09:10 AM', checkOut: '06:00 PM', status: 'Late', totalHours: '8h 50m' },
  { id: 'att-3', employeeId: 'e3', employeeName: 'James Wilson', avatarUrl: 'https://picsum.photos/100/100?random=22', date: '2024-11-20', status: 'On Leave' },
  { id: 'att-4', employeeId: 'e4', employeeName: 'Linda Kim', avatarUrl: 'https://picsum.photos/100/100?random=23', date: '2024-11-20', checkIn: '08:45 AM', checkOut: '05:15 PM', status: 'Present', totalHours: '8h 30m' },
  { id: 'att-5', employeeId: 'e5', employeeName: 'Robert Chen', avatarUrl: 'https://picsum.photos/100/100?random=24', date: '2024-11-20', checkIn: '09:00 AM', status: 'Present' }, // Currently checked in
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'lr-1', employeeId: 'e1', employeeName: 'Alex Doe', avatarUrl: 'https://picsum.photos/100/100?random=20', type: 'Annual', startDate: '2024-12-20', endDate: '2024-12-31', days: 8, status: 'Pending', reason: 'Holiday vacation', appliedOn: '2024-11-15' },
  { id: 'lr-2', employeeId: 'e3', employeeName: 'James Wilson', avatarUrl: 'https://picsum.photos/100/100?random=22', type: 'Sick', startDate: '2024-11-20', endDate: '2024-11-22', days: 3, status: 'Approved', reason: 'Flu', appliedOn: '2024-11-19' },
  { id: 'lr-3', employeeId: 'e5', employeeName: 'Robert Chen', avatarUrl: 'https://picsum.photos/100/100?random=24', type: 'Personal', startDate: '2024-11-10', endDate: '2024-11-10', days: 1, status: 'Rejected', reason: 'Personal errand', appliedOn: '2024-11-01' },
];

export const MOCK_REVIEWS: PerformanceReview[] = [
  { id: 'rv-1', employeeId: 'e1', employeeName: 'Alex Doe', avatarUrl: 'https://picsum.photos/100/100?random=20', role: 'Senior Product Designer', reviewerName: 'Maria Garcia', cycle: 'Q4 2024', date: '2024-12-15', rating: 4.8, status: 'Scheduled' },
  { id: 'rv-2', employeeId: 'e4', employeeName: 'Linda Kim', avatarUrl: 'https://picsum.photos/100/100?random=23', role: 'Marketing Specialist', reviewerName: 'James Wilson', cycle: 'Q3 2024', date: '2024-09-30', rating: 4.2, status: 'Completed', feedback: 'Great performance on the summer campaign.' },
  { id: 'rv-3', employeeId: 'e5', employeeName: 'Robert Chen', avatarUrl: 'https://picsum.photos/100/100?random=24', role: 'Frontend Engineer', reviewerName: 'Maria Garcia', cycle: 'Q3 2024', date: '2024-10-01', rating: 3.9, status: 'Completed', feedback: 'Consistent delivery but needs to improve documentation.' },
  { id: 'rv-4', employeeId: 'e7', employeeName: 'David Kim', avatarUrl: 'https://ui-avatars.com/api/?name=David+Kim&background=random', role: 'Senior Frontend Engineer', reviewerName: 'Maria Garcia', cycle: 'Probation Review', date: '2025-02-01', rating: 0, status: 'Scheduled' },
];

export const MOCK_GOALS: PerformanceGoal[] = [
  { id: 'gl-1', employeeId: 'e1', employeeName: 'Alex Doe', avatarUrl: 'https://picsum.photos/100/100?random=20', title: 'Redesign Mobile App UI', description: 'Complete overhaul of the mobile app user interface.', status: 'On Track', progress: 65, dueDate: '2024-12-31', priority: 'High' },
  { id: 'gl-2', employeeId: 'e4', employeeName: 'Linda Kim', avatarUrl: 'https://picsum.photos/100/100?random=23', title: 'Increase Social Engagement', description: 'Grow Twitter followers by 20%.', status: 'At Risk', progress: 30, dueDate: '2024-12-31', priority: 'Medium' },
  { id: 'gl-3', employeeId: 'e5', employeeName: 'Robert Chen', avatarUrl: 'https://picsum.photos/100/100?random=24', title: 'Refactor Legacy Code', description: 'Migrate old class components to functional hooks.', status: 'Completed', progress: 100, dueDate: '2024-11-30', priority: 'Medium' },
  { id: 'gl-4', employeeId: 'e3', employeeName: 'James Wilson', avatarUrl: 'https://picsum.photos/100/100?random=22', title: 'Close $1M in Sales', description: 'Achieve Q4 sales target.', status: 'On Track', progress: 85, dueDate: '2024-12-31', priority: 'High' },
];
