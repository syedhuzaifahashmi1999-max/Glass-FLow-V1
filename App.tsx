
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Cursor from './components/layout/Cursor'; // Import Cursor
import Dashboard from './views/Dashboard';
import LeadsList from './views/LeadsList';
import ProjectsList from './views/ProjectsList';
import ProjectDetails from './views/ProjectDetails';
import CustomersList from './views/CustomersList';
import EmployeesList from './views/EmployeesList';
import DepartmentsList from './views/DepartmentsList';
import TeamsList from './views/TeamsList';
import ProductsList from './views/ProductsList';
import ProductDetails from './views/ProductDetails';
import SalesOverview from './views/SalesOverview';
import InvoicesList from './views/InvoicesList';
import InvoiceDetails from './views/InvoiceDetails';
import QuotationsList from './views/QuotationsList';
import QuotationDetails from './views/QuotationDetails';
import BankDashboard from './views/BankDashboard';
import TasksList from './views/TasksList';
import TaskDetails from './views/TaskDetails';
import Settings from './views/Settings';
import PayrollList from './views/PayrollList';
import PayrollDetails from './views/PayrollDetails';
import Organogram from './views/Organogram';
import ExpensesList from './views/ExpensesList';
import RecruitmentBoard from './views/RecruitmentBoard';
import OnboardingBoard from './views/OnboardingBoard';
import TrainingBoard from './views/TrainingBoard'; 
import ClaimsList from './views/ClaimsList'; 
import HRLettersList from './views/HRLettersList'; 
import ApprovalsList from './views/ApprovalsList'; 
import AttendanceBoard from './views/AttendanceBoard';
import LeaveBoard from './views/LeaveBoard';
import PerformanceBoard from './views/PerformanceBoard';
import AssetsList from './views/AssetsList';
import PurchasesList from './views/PurchasesList';
import RolesList from './views/RolesList';
import CreateUser from './views/CreateUser'; 
import Auth from './views/Auth';
import Packages from './views/Packages';
import LandingPage from './views/LandingPage';
import TeamChat from './views/TeamChat';
import HRDashboard from './views/HRDashboard'; 
import FinanceDashboard from './views/FinanceDashboard'; 
import ProfitLoss from './views/ProfitLoss';
import BalanceSheet from './views/BalanceSheet';
import ChartOfAccounts from './views/ChartOfAccounts'; 
import Depreciation from './views/Depreciation';
import { ViewState, Lead, Project, Customer, Invoice, LeadStage, Task, Employee, Product, SaleTransaction, BankAccount, BankTransaction, PayrollRun, Quotation, Team, Department, Expense, Candidate, PurchaseOrder, Asset, Role, PermissionModule, LeaveRequest, Claim, HRLetter, GLAccount } from './types';
import { MOCK_PROJECTS, MOCK_PRODUCTS, MOCK_LEADS, MOCK_CUSTOMERS, MOCK_INVOICES, MOCK_TASKS, MOCK_EMPLOYEES, MOCK_SALES, MOCK_BANK_ACCOUNTS, MOCK_BANK_TRANSACTIONS, MOCK_PAYROLL_RUNS, MOCK_QUOTATIONS, MOCK_TEAMS, MOCK_DEPARTMENTS, MOCK_EXPENSES, MOCK_CANDIDATES, MOCK_PURCHASE_ORDERS, MOCK_ASSETS, MOCK_ROLES, MOCK_LEAVE_REQUESTS, MOCK_CLAIMS, MOCK_LETTERS, MOCK_ACCOUNTS } from './constants';
import { ShieldAlert } from 'lucide-react';

// Map Views to Modules for Permission Checking
const VIEW_PERMISSIONS: Record<string, PermissionModule | 'General'> = {
  [ViewState.DASHBOARD]: 'General',
  [ViewState.CHAT]: 'General', 
  [ViewState.APPROVALS]: 'General', 
  [ViewState.LISTS]: 'CRM',
  [ViewState.PROJECTS]: 'CRM',
  [ViewState.PROJECT_DETAILS]: 'CRM',
  [ViewState.TASKS]: 'CRM',
  [ViewState.TASK_DETAILS]: 'CRM',
  [ViewState.CUSTOMERS]: 'CRM',
  [ViewState.QUOTATIONS]: 'CRM',
  [ViewState.QUOTATION_DETAILS]: 'CRM',
  [ViewState.PRODUCTS]: 'CRM', 
  [ViewState.PRODUCT_DETAILS]: 'CRM',
  [ViewState.FINANCE_DASHBOARD]: 'Finance', 
  [ViewState.PROFIT_LOSS]: 'Finance',
  [ViewState.BALANCE_SHEET]: 'Finance',
  [ViewState.CHART_OF_ACCOUNTS]: 'Finance', 
  [ViewState.SALES]: 'Finance',
  [ViewState.INVOICES]: 'Finance',
  [ViewState.INVOICE_DETAILS]: 'Finance',
  [ViewState.BANK]: 'Finance',
  [ViewState.EXPENSES]: 'Finance',
  [ViewState.PAYMENTS]: 'Finance',
  [ViewState.BILLING]: 'Finance',
  [ViewState.PURCHASES]: 'Finance', 
  [ViewState.DEPRECIATION]: 'Finance',
  [ViewState.HR_DASHBOARD]: 'HR', 
  [ViewState.EMPLOYEES]: 'HR',
  [ViewState.DEPARTMENTS]: 'HR',
  [ViewState.TEAMS]: 'HR',
  [ViewState.ORGANOGRAM]: 'HR',
  [ViewState.PAYROLL]: 'HR',
  [ViewState.PAYROLL_DETAILS]: 'HR',
  [ViewState.RECRUITMENT]: 'HR',
  [ViewState.ONBOARDING]: 'HR',
  [ViewState.TRAINING]: 'HR',
  [ViewState.CLAIMS]: 'HR', 
  [ViewState.LETTERS]: 'HR', 
  [ViewState.ATTENDANCE]: 'HR',
  [ViewState.LEAVE]: 'HR',
  [ViewState.PERFORMANCE]: 'HR',
  [ViewState.ASSETS]: 'HR', 
  [ViewState.ROLES]: 'Settings',
  [ViewState.CREATE_USER]: 'HR',
  [ViewState.SETTINGS]: 'Settings',
};

const AccessDenied = ({ onHome }: { onHome: () => void }) => (
  <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95">
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
      <ShieldAlert size={40} className="text-red-500" />
    </div>
    <h2 className="text-2xl font-light text-black mb-2">Access Restricted</h2>
    <p className="text-gray-500 max-w-md mb-8">
      Your current role does not have permission to view this module. Please contact your administrator or switch roles in settings.
    </p>
    <button 
      onClick={onHome}
      className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
    >
      Return to Dashboard
    </button>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [landingView, setLandingView] = useState<'landing' | 'packages' | 'auth'>('landing');
  const [previousLandingView, setPreviousLandingView] = useState<'landing' | 'packages'>('landing');
  const [currentPlan, setCurrentPlan] = useState('Professional');
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // App Appearance & Settings State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [accentColor, setAccentColor] = useState('black');
  const [currency, setCurrency] = useState('USD');

  // RBAC State
  const [activeRole, setActiveRole] = useState<Role>(MOCK_ROLES[0]); // Default to Super Admin

  // Data State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedPayrollRunId, setSelectedPayrollRunId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [quotations, setQuotations] = useState<Quotation[]>(MOCK_QUOTATIONS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales, setSales] = useState<SaleTransaction[]>(MOCK_SALES);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(MOCK_BANK_TRANSACTIONS);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(MOCK_PAYROLL_RUNS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
  const [letters, setLetters] = useState<HRLetter[]>(MOCK_LETTERS);
  const [glAccounts, setGlAccounts] = useState<GLAccount[]>(MOCK_ACCOUNTS);

  // Apply theme class and accent colors
  useEffect(() => {
    const root = document.documentElement;
    
    // Dark Mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Accent Colors
    const lightColors: Record<string, string> = {
      black: '#111111', 
      blue: '#2563eb', // blue-600
      purple: '#9333ea', // purple-600
      emerald: '#059669', // emerald-600
      orange: '#ea580c', // orange-600
    };

    const darkColors: Record<string, string> = {
      black: '#FFFFFF', // High contrast for dark mode
      blue: '#3b82f6', // blue-500
      purple: '#a855f7', // purple-500
      emerald: '#10b981', // emerald-500
      orange: '#f97316', // orange-500
    };

    const color = theme === 'dark' ? darkColors[accentColor] : lightColors[accentColor];
    const fg = (theme === 'dark' && accentColor === 'black') ? '#000000' : '#FFFFFF';

    root.style.setProperty('--color-accent', color);
    root.style.setProperty('--color-accent-foreground', fg);

  }, [theme, accentColor]);

  // --- Permission Check Logic ---
  const hasAccess = (view: ViewState): boolean => {
    const module = VIEW_PERMISSIONS[view];
    if (module === 'General') return true;
    if (!module) return true; // Default allow if undefined
    
    const permissionLevel = activeRole.permissions[module];
    return permissionLevel !== 'None';
  };

  const handleNavigate = (view: ViewState) => {
    if (hasAccess(view)) {
      setCurrentView(view);
      // Reset selections when changing main views
      if (![ViewState.PROJECT_DETAILS, ViewState.PRODUCT_DETAILS, ViewState.TASK_DETAILS, ViewState.PAYROLL_DETAILS, ViewState.INVOICE_DETAILS, ViewState.QUOTATION_DETAILS].includes(view)) {
         setSelectedProjectId(null);
         setSelectedProductId(null);
         setSelectedTaskId(null);
         setSelectedPayrollRunId(null);
         setSelectedInvoiceId(null);
         setSelectedQuotationId(null);
      }
    } else {
      alert("You do not have permission to access this module.");
    }
  };

  const handleGlobalSearchSelect = (type: string, id: string) => {
      // Logic to deep-link based on search result type
      switch (type) {
          case 'Project':
              setSelectedProjectId(id);
              handleNavigate(ViewState.PROJECT_DETAILS);
              break;
          case 'Task':
              setSelectedTaskId(id);
              handleNavigate(ViewState.TASK_DETAILS);
              break;
          case 'Employee':
              handleNavigate(ViewState.EMPLOYEES);
              break;
          case 'Invoice':
              setSelectedInvoiceId(id);
              handleNavigate(ViewState.INVOICE_DETAILS);
              break;
          case 'Lead':
              handleNavigate(ViewState.LISTS);
              break;
          case 'Product':
              setSelectedProductId(id);
              handleNavigate(ViewState.PRODUCT_DETAILS);
              break;
          case 'Expense':
              handleNavigate(ViewState.EXPENSES);
              break;
          case 'PurchaseOrder':
              handleNavigate(ViewState.PURCHASES);
              break;
          case 'BankAccount':
              handleNavigate(ViewState.BANK);
              break;
          case 'Department':
              handleNavigate(ViewState.DEPARTMENTS);
              break;
          case 'Team':
              handleNavigate(ViewState.TEAMS);
              break;
          case 'Candidate':
              handleNavigate(ViewState.RECRUITMENT);
              break;
          case 'Onboarding':
              handleNavigate(ViewState.ONBOARDING);
              break;
          case 'Course':
              handleNavigate(ViewState.TRAINING);
              break;
          case 'Claim':
              handleNavigate(ViewState.CLAIMS);
              break;
          case 'Letter':
              handleNavigate(ViewState.LETTERS);
              break;
          case 'Review':
              handleNavigate(ViewState.PERFORMANCE);
              break;
          case 'Leave':
              handleNavigate(ViewState.LEAVE);
              break;
          case 'PayrollRun':
              setSelectedPayrollRunId(id);
              handleNavigate(ViewState.PAYROLL_DETAILS);
              break;
          case 'Asset':
              handleNavigate(ViewState.ASSETS);
              break;
          case 'Role':
              handleNavigate(ViewState.ROLES);
              break;
          case 'Navigation':
              handleNavigate(id as ViewState);
              break;
          default:
              console.log("Unknown search type", type);
      }
  };

  const handleCreateUser = (newEmployee: Employee) => {
      setEmployees(prev => [newEmployee, ...prev]);
      handleNavigate(ViewState.EMPLOYEES);
  };

  const handleLogin = () => { setIsAuthenticated(true); };
  const handleLogout = () => { setIsAuthenticated(false); setLandingView('landing'); setCurrentView(ViewState.DASHBOARD); };
  const handleSelectPlan = (plan: string) => { setCurrentPlan(plan); setPreviousLandingView('packages'); setLandingView('auth'); };
  const handleLoginClick = () => { if (landingView === 'packages') { setPreviousLandingView('packages'); } else { setPreviousLandingView('landing'); } setLandingView('auth'); };
  const handleGetStartedClick = () => { setLandingView('packages'); }
  const handleProjectSelect = (id: string) => { setSelectedProjectId(id); setCurrentView(ViewState.PROJECT_DETAILS); };
  const handleProductSelect = (id: string) => { setSelectedProductId(id); setCurrentView(ViewState.PRODUCT_DETAILS); };
  const handleTaskSelect = (id: string) => { setSelectedTaskId(id); setCurrentView(ViewState.TASK_DETAILS); };
  const handlePayrollSelect = (id: string) => { setSelectedPayrollRunId(id); setCurrentView(ViewState.PAYROLL_DETAILS); };
  const handleInvoiceSelect = (id: string) => { setSelectedInvoiceId(id); setCurrentView(ViewState.INVOICE_DETAILS); };
  const handleQuotationSelect = (id: string) => { setSelectedQuotationId(id); setCurrentView(ViewState.QUOTATION_DETAILS); };

  const handleUpdateProject = (updatedProject: Project) => { setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p)); };
  const handleUpdatePayrollStatus = (runId: string, status: PayrollRun['status']) => { setPayrollRuns(prev => prev.map(run => run.id === runId ? { ...run, status } : run)); };
  const handleUpdateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => { setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status } : inv)); if(status === 'Paid') { const inv = invoices.find(i => i.id === invoiceId); if(inv) handleRecordPayment(inv); } };
  const handleUpdateQuotationStatus = (id: string, status: Quotation['status']) => { setQuotations(prev => prev.map(q => q.id === id ? { ...q, status } : q)); };
  const handleConvertQuotation = (quotation: Quotation) => { const newInvoice: Invoice = { id: `INV-${Date.now()}`, customerId: quotation.customerId, customerName: quotation.customerName, issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), dueDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), amount: quotation.amount, status: 'Pending', items: quotation.items, subtotal: quotation.subtotal, tax: quotation.tax, notes: `Converted from Quotation ${quotation.id}.` }; setInvoices(prev => [newInvoice, ...prev]); handleUpdateQuotationStatus(quotation.id, 'Accepted'); handleNavigate(ViewState.INVOICES); };
  const createCustomerFromLead = (lead: Lead): Customer => { const existingCustomer = customers.find(c => c.name === lead.name || c.company === lead.company); if (existingCustomer) return existingCustomer; const newCustomer: Customer = { id: `c-${Date.now()}`, name: lead.name, company: lead.company, email: lead.email, phone: lead.phone || '', status: 'Active', totalSpent: 0, lastOrderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), avatarUrl: lead.avatarUrl }; setCustomers(prev => [...prev, newCustomer]); return newCustomer; };
  const handleConvertLead = (lead: Lead) => { const customer = createCustomerFromLead(lead); if (lead.type === 'Project') { const newProject: Project = { id: `p-${Date.now()}`, name: `Project for ${lead.company}`, client: lead.company, status: 'Planning', priority: 'Medium', category: 'Web', startDate: new Date().toLocaleDateString(), dueDate: lead.expectedCloseDate || 'TBD', progress: 0, budget: `$${lead.value.toLocaleString()}`, description: lead.notes || `Converted from lead ${lead.name}`, members: [], tags: lead.tags || [] }; setProjects(prev => [...prev, newProject]); setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, stage: LeadStage.WON } : l)); handleNavigate(ViewState.PROJECTS); } else { const newInvoice: Invoice = { id: `INV-${Date.now()}`, customerId: customer.id, customerName: customer.name, issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), dueDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), amount: lead.value, status: 'Pending', items: [{ id: 'i1', description: 'Services', quantity: 1, price: lead.value }], subtotal: lead.value, tax: 0 }; setInvoices(prev => [...prev, newInvoice]); setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, stage: LeadStage.WON } : l)); handleNavigate(ViewState.INVOICES); } };
  const handleRecordPayment = (invoice: Invoice) => { const targetAccount = bankAccounts[0]; if (!targetAccount) return; const newTransaction: BankTransaction = { id: `BT-${Date.now()}`, accountId: targetAccount.id, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), description: `Payment for Invoice ${invoice.id}`, amount: invoice.amount, type: 'Credit', category: 'Sales', status: 'Cleared', referenceId: invoice.id }; setBankTransactions(prev => [newTransaction, ...prev]); setBankAccounts(prev => prev.map(acc => acc.id === targetAccount.id ? { ...acc, balance: acc.balance + invoice.amount } : acc )); };
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>, accountId?: string) => { const newExpense = { ...expenseData, id: `EXP-${Date.now()}` }; setExpenses(prev => [newExpense, ...prev]); if (expenseData.status === 'Paid' && accountId) { const newTxn: BankTransaction = { id: `BT-${Date.now()}`, accountId: accountId, date: expenseData.date, description: `Expense: ${expenseData.payee}`, amount: expenseData.amount, type: 'Debit', category: expenseData.category, status: 'Cleared' }; setBankTransactions(prev => [newTxn, ...prev]); setBankAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, balance: acc.balance - expenseData.amount } : acc )); } };
  const handleAddAsset = (assetData: Omit<Asset, 'id'>) => { const newAsset: Asset = { ...assetData, id: `AST-${Date.now()}` }; setAssets(prev => [newAsset, ...prev]); handleNavigate(ViewState.ASSETS); };

  const renderView = () => {
    // 1. Check Permissions First
    if (!hasAccess(currentView)) {
        return <AccessDenied onHome={() => handleNavigate(ViewState.DASHBOARD)} />;
    }

    // 2. Render Component
    switch (currentView) {
      case ViewState.DASHBOARD: return <Dashboard currency={currency} onNavigate={handleNavigate} />;
      case ViewState.HR_DASHBOARD: return <HRDashboard />; 
      case ViewState.FINANCE_DASHBOARD: return <FinanceDashboard currency={currency} />; 
      case ViewState.PROFIT_LOSS: return <ProfitLoss currency={currency} />;
      case ViewState.BALANCE_SHEET: return <BalanceSheet currency={currency} />;
      case ViewState.CHART_OF_ACCOUNTS: return <ChartOfAccounts />;
      case ViewState.DEPRECIATION: return <Depreciation assets={assets} currency={currency} onNavigate={handleNavigate} />;
      case ViewState.CHAT: return <TeamChat />;
      case ViewState.APPROVALS: 
        return (
            <ApprovalsList 
                expenses={expenses} setExpenses={setExpenses}
                leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests}
                claims={claims} setClaims={setClaims}
                purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders}
                letters={letters} setLetters={setLetters}
                currency={currency}
            />
        );
      case ViewState.LISTS: return <LeadsList leads={leads} setLeads={setLeads} onConvertLead={handleConvertLead} currency={currency} />;
      case ViewState.PROJECTS: return <ProjectsList projects={projects} setProjects={setProjects} teams={teams} onSelectProject={handleProjectSelect} currency={currency} />;
      case ViewState.PROJECT_DETAILS:
        const project = projects.find(p => p.id === selectedProjectId);
        if (project) return <ProjectDetails project={project} tasks={tasks} setTasks={setTasks} onUpdateProject={handleUpdateProject} onBack={() => handleNavigate(ViewState.PROJECTS)} teams={teams} employees={employees} expenses={expenses} />;
        return <ProjectsList projects={projects} setProjects={setProjects} teams={teams} onSelectProject={handleProjectSelect} currency={currency} />;
      case ViewState.TASKS: return <TasksList tasks={tasks} setTasks={setTasks} projects={projects} onSelectTask={handleTaskSelect} />;
      case ViewState.TASK_DETAILS:
        const task = tasks.find(t => t.id === selectedTaskId);
        if (task) return <TaskDetails task={task} onBack={() => handleNavigate(ViewState.TASKS)} />;
        return <TasksList tasks={tasks} setTasks={setTasks} projects={projects} onSelectTask={handleTaskSelect} />;
      case ViewState.CUSTOMERS: return <CustomersList customers={customers} setCustomers={setCustomers} />;
      case ViewState.EMPLOYEES: return <EmployeesList employees={employees} setEmployees={setEmployees} onNavigate={handleNavigate} />;
      case ViewState.CREATE_USER: return <CreateUser onSave={handleCreateUser} onCancel={() => handleNavigate(ViewState.EMPLOYEES)} />;
      case ViewState.DEPARTMENTS: return <DepartmentsList employees={employees} departments={departments} setDepartments={setDepartments} />;
      case ViewState.TEAMS: return <TeamsList employees={employees} teams={teams} setTeams={setTeams} projects={projects} />;
      case ViewState.ORGANOGRAM: return <Organogram employees={employees} setEmployees={setEmployees} />;
      case ViewState.PAYROLL: return <PayrollList payrollRuns={payrollRuns} setPayrollRuns={setPayrollRuns} employees={employees} onSelectRun={handlePayrollSelect} />;
      case ViewState.PAYROLL_DETAILS:
        const run = payrollRuns.find(r => r.id === selectedPayrollRunId);
        if (run) return <PayrollDetails run={run} employees={employees} onBack={() => handleNavigate(ViewState.PAYROLL)} onUpdateStatus={handleUpdatePayrollStatus} />;
        return <PayrollList payrollRuns={payrollRuns} setPayrollRuns={setPayrollRuns} employees={employees} onSelectRun={handlePayrollSelect} />;
      case ViewState.PRODUCTS: return <ProductsList products={products} setProducts={setProducts} onSelectProduct={handleProductSelect} glAccounts={glAccounts} />;
      case ViewState.PRODUCT_DETAILS:
        const product = products.find(p => p.id === selectedProductId);
        if (product) return <ProductDetails product={product} onBack={() => handleNavigate(ViewState.PRODUCTS)} />;
        return <ProductsList products={products} setProducts={setProducts} onSelectProduct={handleProductSelect} glAccounts={glAccounts} />;
      case ViewState.SALES: return <SalesOverview sales={sales} setSales={setSales} currency={currency} />;
      case ViewState.INVOICES: return <InvoicesList invoices={invoices} setInvoices={setInvoices} customers={customers} products={products} onSelectInvoice={handleInvoiceSelect} onPaymentRecorded={handleRecordPayment} currency={currency} />;
      case ViewState.INVOICE_DETAILS:
        const invoice = invoices.find(i => i.id === selectedInvoiceId);
        if (invoice) return <InvoiceDetails invoice={invoice} onBack={() => handleNavigate(ViewState.INVOICES)} onUpdateStatus={handleUpdateInvoiceStatus} />;
        return <InvoicesList invoices={invoices} setInvoices={setInvoices} customers={customers} products={products} onSelectInvoice={handleInvoiceSelect} onPaymentRecorded={handleRecordPayment} currency={currency} />;
      case ViewState.QUOTATIONS: return <QuotationsList quotations={quotations} setQuotations={setQuotations} customers={customers} onSelectQuotation={handleQuotationSelect} />;
      case ViewState.QUOTATION_DETAILS:
        const quotation = quotations.find(q => q.id === selectedQuotationId);
        if (quotation) return <QuotationDetails quotation={quotation} onBack={() => handleNavigate(ViewState.QUOTATIONS)} onUpdateStatus={handleUpdateQuotationStatus} onConvertToInvoice={handleConvertQuotation} />;
        return <QuotationsList quotations={quotations} setQuotations={setQuotations} customers={customers} onSelectQuotation={handleQuotationSelect} />;
      case ViewState.BANK: return <BankDashboard accounts={bankAccounts} transactions={bankTransactions} setAccounts={setBankAccounts} setTransactions={setBankTransactions} currency={currency} glAccounts={glAccounts} />;
      case ViewState.EXPENSES: return <ExpensesList expenses={expenses} setExpenses={setExpenses} accounts={bankAccounts} projects={projects} onAddExpense={handleAddExpense} currency={currency} glAccounts={glAccounts} />;
      case ViewState.RECRUITMENT: return <RecruitmentBoard candidates={candidates} setCandidates={setCandidates} />;
      case ViewState.ONBOARDING: return <OnboardingBoard />;
      case ViewState.TRAINING: return <TrainingBoard />;
      case ViewState.CLAIMS: return <ClaimsList />; 
      case ViewState.LETTERS: return <HRLettersList />; 
      case ViewState.ATTENDANCE: return <AttendanceBoard />;
      case ViewState.LEAVE: return <LeaveBoard />;
      case ViewState.PERFORMANCE: return <PerformanceBoard />;
      case ViewState.ASSETS: return <AssetsList assets={assets} setAssets={setAssets} onNavigate={handleNavigate} />;
      case ViewState.PURCHASES: return <PurchasesList purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders} products={products} employees={employees} onAddAsset={handleAddAsset} />;
      case ViewState.ROLES: return <RolesList employees={employees} setEmployees={setEmployees} />;
      case ViewState.SETTINGS:
        return (
          <Settings 
            theme={theme} 
            onThemeChange={setTheme}
            layoutCompact={sidebarCompact}
            onLayoutChange={setSidebarCompact}
            accentColor={accentColor}
            onAccentColorChange={setAccentColor}
            activeRole={activeRole}
            onRoleChange={setActiveRole}
            roles={MOCK_ROLES}
            currentPlan={currentPlan}
            currency={currency}
            onCurrencyChange={setCurrency}
          />
        );
      default: return <Dashboard currency={currency} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`${isAuthenticated ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden md:cursor-none'} w-full font-light transition-colors duration-300 ${theme === 'dark' ? 'bg-[#09090b] text-white' : 'bg-white text-gray-900'}`}>
      <Cursor /> {/* Global Cursor */}
      
      {!isAuthenticated ? (
        <>
          {landingView === 'landing' && <LandingPage onGetStarted={handleGetStartedClick} onLogin={handleLoginClick} />}
          {landingView === 'packages' && <Packages onSelect={handleSelectPlan} onLoginClick={handleLoginClick} onBack={() => setLandingView('landing')} />}
          {landingView === 'auth' && <Auth onLogin={handleLogin} onBack={() => setLandingView(previousLandingView)} />}
        </>
      ) : (
        <div className="flex h-full w-full">
          <Sidebar 
            currentView={currentView} 
            onNavigate={handleNavigate} 
            compact={sidebarCompact}
            userRole={activeRole}
            onLogout={handleLogout}
          />
          
          <main className="flex-1 flex flex-col h-full overflow-hidden relative border-l border-gray-100 dark:border-gray-800">
            <Header 
                currentView={currentView} 
                theme={theme} 
                onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
                onNavigate={handleNavigate}
                onSearchSelect={handleGlobalSearchSelect}
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="min-h-full fade-in">
                {renderView()}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
