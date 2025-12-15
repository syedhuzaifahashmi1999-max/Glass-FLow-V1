
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  APPROVALS = 'APPROVALS',
  PIPELINE = 'PIPELINE',
  LISTS = 'LISTS',
  PROJECTS = 'PROJECTS',
  PROJECT_DETAILS = 'PROJECT_DETAILS',
  TASKS = 'TASKS',
  TASK_DETAILS = 'TASK_DETAILS',
  CUSTOMERS = 'CUSTOMERS',
  
  // Finance
  FINANCE_DASHBOARD = 'FINANCE_DASHBOARD',
  PROFIT_LOSS = 'PROFIT_LOSS',
  BALANCE_SHEET = 'BALANCE_SHEET',
  CHART_OF_ACCOUNTS = 'CHART_OF_ACCOUNTS',
  SALES = 'SALES',
  INVOICES = 'INVOICES',
  INVOICE_DETAILS = 'INVOICE_DETAILS',
  QUOTATIONS = 'QUOTATIONS',
  QUOTATION_DETAILS = 'QUOTATION_DETAILS',
  BANK = 'BANK',
  BILLING = 'BILLING',
  PAYMENTS = 'PAYMENTS',
  EXPENSES = 'EXPENSES',
  PURCHASES = 'PURCHASES',
  DEPRECIATION = 'DEPRECIATION',
  
  // HR
  HR_DASHBOARD = 'HR_DASHBOARD',
  EMPLOYEES = 'EMPLOYEES',
  CREATE_USER = 'CREATE_USER',
  DEPARTMENTS = 'DEPARTMENTS',
  TEAMS = 'TEAMS',
  ORGANOGRAM = 'ORGANOGRAM',
  PAYROLL = 'PAYROLL',
  PAYROLL_DETAILS = 'PAYROLL_DETAILS',
  RECRUITMENT = 'RECRUITMENT',
  ONBOARDING = 'ONBOARDING',
  TRAINING = 'TRAINING',
  CLAIMS = 'CLAIMS',
  ATTENDANCE = 'ATTENDANCE',
  LEAVE = 'LEAVE',
  PERFORMANCE = 'PERFORMANCE',
  LETTERS = 'LETTERS', 

  // Inventory/Product
  PRODUCTS = 'PRODUCTS',
  PRODUCT_DETAILS = 'PRODUCT_DETAILS',
  ASSETS = 'ASSETS',
  
  // Admin
  SETTINGS = 'SETTINGS',
  ROLES = 'ROLES'
}

export enum LeadStage {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  WON = 'Won',
  LOST = 'Lost'
}

// ... rest of file unchanged
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  value: number;
  stage: LeadStage;
  type: string;
  lastActive: string;
  avatarUrl?: string;
  productInterest?: string;
  title?: string;
  location?: string;
  linkedin?: string;
  source?: string;
  priority?: string;
  expectedCloseDate?: string;
  probability?: number;
  tags?: string[];
  notes?: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface Metric {
  label: string;
  value: string;
  trend: number;
  trendUp: boolean;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Active' | 'Planning' | 'On Hold' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  category: 'Web' | 'Mobile' | 'Marketing' | 'Design' | 'Internal';
  startDate: string;
  dueDate: string;
  progress: number;
  budget: string;
  description: string;
  members: string[]; // URLs or IDs
  tags: string[];
  relatedProduct?: string;
  teamId?: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  totalSpent: number;
  lastOrderDate: string;
  avatarUrl?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  relatedProduct?: string;
  subtotal?: number;
  tax?: number;
  items?: InvoiceItem[];
  notes?: string;
}

export interface SaleTransaction {
  id: string;
  customerName: string;
  product: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  accountId?: string;
  category?: string;
  referenceId?: string;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
  avatarUrl?: string;
  location?: string;
  salary?: string;
  manager?: string;
  // Extended fields for form
  employmentType?: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
  gender?: string;
  dob?: string;
  nationality?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  type: 'Service' | 'Digital' | 'Physical';
  price: number;
  billingFrequency: string;
  status: 'Active' | 'Draft' | 'Archived';
  description?: string;
  sku?: string;
  stock?: number;
  glAccountId?: string; // Link to Revenue Account
}

export interface ServiceTicket {
  id: string;
  subject: string;
  customerName: string;
  type: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdAt: string;
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignee?: string; // Avatar URL
  assigneeName?: string;
  project?: string;
  tags: string[];
  createdAt: string;
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: 'Checking' | 'Savings' | 'Credit';
  color: 'black' | 'blue' | 'purple' | 'slate';
  glAccountId?: string; // Link to Asset/Liability Account
}

export interface BankTransaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: 'Credit' | 'Debit';
  category: string;
  status: 'Cleared' | 'Pending';
  referenceId?: string;
}

export interface PayrollRun {
  id: string;
  period: string;
  date: string;
  totalCost: number;
  employeeCount: number;
  status: 'Draft' | 'Processing' | 'Paid';
  reference?: string;
}

export interface Quotation {
  id: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  expiryDate: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  items?: InvoiceItem[];
  subtotal?: number;
  tax?: number;
  notes?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  leadId: string;
  memberIds: string[];
  tags: string[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string;
  budget: number;
  targetHeadcount: number;
  location?: string;
  tags?: string[];
}

export interface Expense {
  id: string;
  payee: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  status: 'Paid' | 'Pending' | 'Scheduled' | 'Failed';
  method: string;
  accountId?: string;
  projectId?: string;
  reference?: string;
  glAccountId?: string; // Link to Expense Account
}

export enum CandidateStage {
  APPLIED = 'Applied',
  SCREENING = 'Screening',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  HIRED = 'Hired',
  REJECTED = 'Rejected'
}

export interface Interview {
  id: string;
  type: 'Screening' | 'Technical' | 'Cultural' | 'Final';
  date: string;
  interviewer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  score?: number;
  notes?: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  stage: CandidateStage;
  appliedDate: string;
  rating: number;
  avatarUrl: string;
  source?: string;
  currentCompany?: string;
  skills?: string[];
  interviews?: Interview[];
  notes?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  status: 'Pending' | 'Completed';
  category: 'HR' | 'IT' | 'Admin' | 'Training';
  dueDate?: string;
  assignee?: string;
}

export interface EmployeeProcess {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department?: string;
  avatarUrl: string;
  type: 'Onboarding' | 'Offboarding';
  stage: string;
  progress: number;
  startDate: string;
  status: 'Active' | 'Completed';
  tasks: OnboardingTask[];
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Late' | 'Absent' | 'Half Day' | 'On Leave';
  totalHours?: string;
  location?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl?: string;
  type: 'Annual' | 'Sick' | 'Personal' | 'Maternity' | 'Unpaid';
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  appliedOn?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl?: string;
  role?: string;
  reviewerName: string;
  cycle: string;
  date: string;
  rating: number;
  status: 'Scheduled' | 'Completed' | 'Draft';
  feedback?: string;
}

export interface PerformanceGoal {
  id: string;
  employeeId?: string;
  employeeName: string;
  avatarUrl?: string;
  title: string;
  description: string;
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed';
  progress: number;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Asset {
  id: string;
  name: string;
  category: 'Hardware' | 'Software' | 'Furniture' | 'Vehicle';
  serialNumber?: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Retired';
  purchaseDate: string;
  value: number;
  assignedTo?: string; // employeeId
  assignedToName?: string;
  avatarUrl?: string;
  notes?: string;
  warrantyDate?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  category: string;
  status: 'Active' | 'Inactive';
}

export interface PurchaseItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  expectedDate?: string;
  status: 'Draft' | 'Ordered' | 'Received' | 'Cancelled';
  totalAmount: number;
  items: PurchaseItem[];
  notes?: string;
}

export type PermissionModule = 'CRM' | 'Finance' | 'HR' | 'Inventory' | 'Settings';
export type AccessLevel = 'None' | 'Read' | 'Write' | 'Admin';

export interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  isSystem: boolean;
  permissions: Record<PermissionModule, AccessLevel>;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'dm';
  unreadCount?: number;
  description?: string;
  members?: string[];
  avatarUrl?: string;
  status?: 'online' | 'busy' | 'offline' | 'away';
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'file' | 'image';
  size: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  date: string;
  isMe?: boolean;
  isEdited?: boolean;
  replyToId?: string;
  reactions?: Record<string, number>;
  attachments?: ChatAttachment[];
}

export interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  type: 'Video' | 'Reading' | 'Quiz';
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  status: 'Active' | 'Draft' | 'Archived';
  modules: TrainingModule[];
  modulesCount: number;
}

export interface TrainingAssignment {
  id: string;
  courseId: string;
  employeeId: string;
  assignedDate: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  progress: number;
  completionDate?: string;
  score?: number;
  completedModuleIds?: string[];
}

export interface Claim {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl?: string;
  description: string;
  amount: number;
  date: string;
  category: 'Travel' | 'Meals' | 'Office Supplies' | 'Software' | 'Training' | 'Other';
  status: 'Submitted' | 'Approved' | 'Rejected' | 'Paid';
  notes?: string;
  receiptUrl?: string;
  policyWarning?: string;
  submissionDate?: string;
  approvalDate?: string;
  rejectionReason?: string;
}

export type LetterType = 'Employment Verification' | 'Salary Certificate' | 'NOC' | 'Experience Letter' | 'Confirmation Letter';

export interface HRLetter {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl?: string;
  type: LetterType;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateRequested: string;
  purpose: string;
  addressee?: string;
  dateIssued?: string;
  rejectionReason?: string;
}

export interface GLAccount {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  subtype: string;
  balance: number;
  status: 'Active' | 'Archived';
  description?: string;
}
