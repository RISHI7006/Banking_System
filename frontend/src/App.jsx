import React, { useState, useEffect, useRef } from 'react';
import {
  Landmark, ShieldAlert, Users, MessageSquareWarning, TrendingUp,
  FileSpreadsheet, Bot, History, CheckCircle2, AlertTriangle,
  ArrowUpRight, ArrowDownRight, RefreshCw, Layers, Search, Sparkles,
  ChevronRight, Database, ExternalLink, Sliders, Activity, Lock,
  Terminal, CreditCard, Bell, Settings, HelpCircle, Upload,
  Download, FileText, Check, ArrowLeft, MoreHorizontal, Plus,
  DollarSign, Briefcase, Calendar, Clock, AlertCircle, X,
  Copy, Eye, EyeOff, ShieldCheck, Filter, Send, Share2, FileCheck,
  CheckCircle, ArrowRight, Zap, PieChart as PieIcon, MessageCircle,
  HelpCircle as QuestionIcon, UserCheck
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from './api/client';

export default function App() {
  // Navigation & Global UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Default currency is now Indian Rupees (INR)
  const [currency, setCurrency] = useState('INR');
  const [cardFrozen, setCardFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [dashboardTimeframe, setDashboardTimeframe] = useState('This Month');
  const [leaderboardFilter, setLeaderboardFilter] = useState('all');

  // Dynamic Monthly Card Limit State (Fully Interactive with Modal & Live Updates)
  const [showAdjustLimitModal, setShowAdjustLimitModal] = useState(false);
  const [tempLimitInput, setTempLimitInput] = useState(500000);
  const [userCardLimits, setUserCardLimits] = useState({
    'Fraud Analyst': 500000,
    'Chief Risk Officer': 2500000,
    'Senior Underwriter': 800000,
    'Compliance Auditor': 600000
  });

  // Interactive People / Role Perspective State
  // When this changes, ALL dashboard KPIs, spending numbers, charts, cardholder name, and recent inferences change in REAL TIME!
  const [role, setRole] = useState('Fraud Analyst');

  // Backend Health & Data
  const [health, setHealth] = useState({ status: 'ok', models_ready: true });
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // File Upload Refs
  const fileInputRef = useRef(null);
  const batchCsvInputRef = useRef(null);

  // Dynamic Multi-Person Profiles for Real-Time Role Switching
  const peopleProfiles = {
    'Fraud Analyst': {
      name: 'Pooja Verma',
      email: 'pooja.verma@weavebank.in',
      avatar: 'PV',
      cardHolder: 'POOJA VERMA',
      cardNum: '5421 8900 1200 4410',
      account: 'AC-882194',
      primaryFocus: 'Transaction Anomaly Surveillance & Cyber Fraud Interception',
      metrics: {
        'This Week': {
          spend: 345000,
          spendChange: '+14.2%',
          budget: 500000,
          budgetUtil: '69.0% utilized',
          budgetChange: '+6.1%',
          revenue: 1420000,
          revenueChange: '+22.4%',
          reserves: 8400000,
          reservesChange: '+12.5%',
          budgetDetails: 24500,
          cardLimit: 200000,
          cardSpent: 65000,
          barData: [
            { month: 'Mon', marketing: 42, operating: 31, tech: 28 },
            { month: 'Tue', marketing: 58, operating: 44, tech: 35 },
            { month: 'Wed', marketing: 39, operating: 38, tech: 29 },
            { month: 'Thu', marketing: 75, operating: 51, tech: 47 },
            { month: 'Fri', marketing: 88, operating: 62, tech: 58 },
            { month: 'Sat', marketing: 34, operating: 28, tech: 21 },
            { month: 'Sun', marketing: 29, operating: 22, tech: 19 }
          ],
          donutTotal: 48500,
          donutData: [
            { name: 'Fraud Intercept', value: 45, color: '#F43F5E' },
            { name: 'Card Protection', value: 25, color: '#00C076' },
            { name: 'Wire Screening', value: 20, color: '#F59E0B' },
            { name: 'Cyber Defense', value: 10, color: '#3B82F6' }
          ]
        },
        'This Month': {
          spend: 1845000,
          spendChange: '+18.4%',
          budget: 2500000,
          budgetUtil: '73.8% utilized',
          budgetChange: '+8.2%',
          revenue: 4890000,
          revenueChange: '+24.1%',
          reserves: 18500000,
          reservesChange: '+14.7%',
          budgetDetails: 92400,
          cardLimit: 500000,
          cardSpent: 184500,
          barData: [
            { month: 'Jan', marketing: 145, operating: 90, tech: 85 },
            { month: 'Feb', marketing: 175, operating: 110, tech: 95 },
            { month: 'Mar', marketing: 130, operating: 105, tech: 80 },
            { month: 'Apr', marketing: 240, operating: 145, tech: 120 },
            { month: 'May', marketing: 295, operating: 180, tech: 160 },
            { month: 'Jun', marketing: 210, operating: 130, tech: 115 }
          ],
          donutTotal: 184500,
          donutData: [
            { name: 'Fraud Intercept', value: 40, color: '#F43F5E' },
            { name: 'Card Protection', value: 30, color: '#00C076' },
            { name: 'Wire Screening', value: 20, color: '#F59E0B' },
            { name: 'Cyber Defense', value: 10, color: '#3B82F6' }
          ]
        },
        'Quarterly': {
          spend: 5240000,
          spendChange: '+16.5%',
          budget: 7000000,
          budgetUtil: '74.8% utilized',
          budgetChange: '+7.4%',
          revenue: 14200000,
          revenueChange: '+21.8%',
          reserves: 24500000,
          reservesChange: '+15.2%',
          budgetDetails: 285000,
          cardLimit: 1500000,
          cardSpent: 524000,
          barData: [
            { month: 'Q1', marketing: 420, operating: 290, tech: 240 },
            { month: 'Q2', marketing: 610, operating: 380, tech: 340 },
            { month: 'Q3', marketing: 490, operating: 320, tech: 290 },
            { month: 'Q4', marketing: 580, operating: 390, tech: 330 }
          ],
          donutTotal: 524000,
          donutData: [
            { name: 'Fraud Intercept', value: 38, color: '#F43F5E' },
            { name: 'Card Protection', value: 32, color: '#00C076' },
            { name: 'Wire Screening', value: 18, color: '#F59E0B' },
            { name: 'Cyber Defense', value: 12, color: '#3B82F6' }
          ]
        }
      }
    },
    'Chief Risk Officer': {
      name: 'Vikramaditya Singhania',
      email: 'vikram.singhania@weavebank.in',
      avatar: 'VS',
      cardHolder: 'VIKRAM SINGHANIA',
      cardNum: '4120 7700 9912 3004',
      account: 'AC-100492',
      primaryFocus: 'Enterprise Solvency, Basel III Capital & Portfolio Credit Risk',
      metrics: {
        'This Week': {
          spend: 680000,
          spendChange: '+5.4%',
          budget: 1200000,
          budgetUtil: '56.6% utilized',
          budgetChange: '+3.1%',
          revenue: 2950000,
          revenueChange: '+16.2%',
          reserves: 42000000,
          reservesChange: '+4.5%',
          budgetDetails: 68000,
          cardLimit: 1000000,
          cardSpent: 240000,
          barData: [
            { month: 'Mon', marketing: 65, operating: 45, tech: 38 },
            { month: 'Tue', marketing: 72, operating: 54, tech: 42 },
            { month: 'Wed', marketing: 68, operating: 49, tech: 40 },
            { month: 'Thu', marketing: 85, operating: 62, tech: 52 },
            { month: 'Fri', marketing: 95, operating: 71, tech: 64 },
            { month: 'Sat', marketing: 42, operating: 34, tech: 28 },
            { month: 'Sun', marketing: 35, operating: 29, tech: 22 }
          ],
          donutTotal: 125000,
          donutData: [
            { name: 'Credit Capital', value: 45, color: '#00C076' },
            { name: 'Operational Risk', value: 25, color: '#3B82F6' },
            { name: 'Liquidity Buffer', value: 20, color: '#F59E0B' },
            { name: 'Market Risk', value: 10, color: '#94A3B8' }
          ]
        },
        'This Month': {
          spend: 2850000,
          spendChange: '+11.2%',
          budget: 4500000,
          budgetUtil: '63.3% utilized',
          budgetChange: '+4.8%',
          revenue: 11400000,
          revenueChange: '+19.5%',
          reserves: 58000000,
          reservesChange: '+6.8%',
          budgetDetails: 185000,
          cardLimit: 2500000,
          cardSpent: 850000,
          barData: [
            { month: 'Jan', marketing: 240, operating: 180, tech: 140 },
            { month: 'Feb', marketing: 280, operating: 210, tech: 165 },
            { month: 'Mar', marketing: 220, operating: 175, tech: 135 },
            { month: 'Apr', marketing: 340, operating: 245, tech: 190 },
            { month: 'May', marketing: 410, operating: 305, tech: 240 },
            { month: 'Jun', marketing: 310, operating: 220, tech: 180 }
          ],
          donutTotal: 450000,
          donutData: [
            { name: 'Credit Capital', value: 40, color: '#00C076' },
            { name: 'Operational Risk', value: 30, color: '#3B82F6' },
            { name: 'Liquidity Buffer', value: 20, color: '#F59E0B' },
            { name: 'Market Risk', value: 10, color: '#94A3B8' }
          ]
        },
        'Quarterly': {
          spend: 8400000,
          spendChange: '+9.8%',
          budget: 13500000,
          budgetUtil: '62.2% utilized',
          budgetChange: '+5.5%',
          revenue: 34500000,
          revenueChange: '+17.4%',
          reserves: 72000000,
          reservesChange: '+8.4%',
          budgetDetails: 540000,
          cardLimit: 5000000,
          cardSpent: 1950000,
          barData: [
            { month: 'Q1', marketing: 720, operating: 540, tech: 410 },
            { month: 'Q2', marketing: 980, operating: 710, tech: 580 },
            { month: 'Q3', marketing: 810, operating: 620, tech: 490 },
            { month: 'Q4', marketing: 940, operating: 690, tech: 540 }
          ],
          donutTotal: 1350000,
          donutData: [
            { name: 'Credit Capital', value: 42, color: '#00C076' },
            { name: 'Operational Risk', value: 28, color: '#3B82F6' },
            { name: 'Liquidity Buffer', value: 18, color: '#F59E0B' },
            { name: 'Market Risk', value: 12, color: '#94A3B8' }
          ]
        }
      }
    },
    'Senior Underwriter': {
      name: 'Ananya Sharma',
      email: 'ananya.sharma@weavebank.in',
      avatar: 'AS',
      cardHolder: 'ANANYA SHARMA',
      cardNum: '4890 2211 4455 8890',
      account: 'AC-340912',
      primaryFocus: 'Retail & Corporate Loan Underwriting, DTI Assessment & Default Scoring',
      metrics: {
        'This Week': {
          spend: 185000,
          spendChange: '+6.8%',
          budget: 350000,
          budgetUtil: '52.8% utilized',
          budgetChange: '+4.2%',
          revenue: 920000,
          revenueChange: '+15.4%',
          reserves: 14500000,
          reservesChange: '+8.9%',
          budgetDetails: 18500,
          cardLimit: 300000,
          cardSpent: 85000,
          barData: [
            { month: 'Mon', marketing: 28, operating: 19, tech: 14 },
            { month: 'Tue', marketing: 36, operating: 24, tech: 18 },
            { month: 'Wed', marketing: 31, operating: 21, tech: 16 },
            { month: 'Thu', marketing: 44, operating: 29, tech: 22 },
            { month: 'Fri', marketing: 52, operating: 35, tech: 27 },
            { month: 'Sat', marketing: 22, operating: 15, tech: 11 },
            { month: 'Sun', marketing: 18, operating: 12, tech: 9 }
          ],
          donutTotal: 28500,
          donutData: [
            { name: 'Home Loans', value: 50, color: '#00C076' },
            { name: 'Personal Loans', value: 25, color: '#3B82F6' },
            { name: 'Auto Credit', value: 15, color: '#F59E0B' },
            { name: 'Education Loan', value: 10, color: '#94A3B8' }
          ]
        },
        'This Month': {
          spend: 945000,
          spendChange: '+10.4%',
          budget: 1600000,
          budgetUtil: '59.0% utilized',
          budgetChange: '+5.1%',
          revenue: 3850000,
          revenueChange: '+18.2%',
          reserves: 19800000,
          reservesChange: '+9.4%',
          budgetDetails: 64500,
          cardLimit: 800000,
          cardSpent: 320000,
          barData: [
            { month: 'Jan', marketing: 110, operating: 75, tech: 60 },
            { month: 'Feb', marketing: 135, operating: 90, tech: 75 },
            { month: 'Mar', marketing: 105, operating: 70, tech: 55 },
            { month: 'Apr', marketing: 165, operating: 115, tech: 90 },
            { month: 'May', marketing: 210, operating: 140, tech: 115 },
            { month: 'Jun', marketing: 150, operating: 100, tech: 80 }
          ],
          donutTotal: 98500,
          donutData: [
            { name: 'Home Loans', value: 45, color: '#00C076' },
            { name: 'Personal Loans', value: 30, color: '#3B82F6' },
            { name: 'Auto Credit', value: 15, color: '#F59E0B' },
            { name: 'Education Loan', value: 10, color: '#94A3B8' }
          ]
        },
        'Quarterly': {
          spend: 2950000,
          spendChange: '+11.8%',
          budget: 4800000,
          budgetUtil: '61.4% utilized',
          budgetChange: '+6.0%',
          revenue: 11800000,
          revenueChange: '+19.1%',
          reserves: 25400000,
          reservesChange: '+10.5%',
          budgetDetails: 195000,
          cardLimit: 1500000,
          cardSpent: 680000,
          barData: [
            { month: 'Q1', marketing: 320, operating: 220, tech: 175 },
            { month: 'Q2', marketing: 450, operating: 310, tech: 250 },
            { month: 'Q3', marketing: 380, operating: 260, tech: 210 },
            { month: 'Q4', marketing: 430, operating: 290, tech: 240 }
          ],
          donutTotal: 295000,
          donutData: [
            { name: 'Home Loans', value: 48, color: '#00C076' },
            { name: 'Personal Loans', value: 27, color: '#3B82F6' },
            { name: 'Auto Credit', value: 15, color: '#F59E0B' },
            { name: 'Education Loan', value: 10, color: '#94A3B8' }
          ]
        }
      }
    },
    'Compliance Auditor': {
      name: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@weavebank.in',
      avatar: 'RD',
      cardHolder: 'ROHAN DESHMUKH',
      cardNum: '4532 9900 1144 7721',
      account: 'AC-994102',
      primaryFocus: 'RBI Grievance Redressal, CFPB SLA Enforcement & AML Audit Logging',
      metrics: {
        'This Week': {
          spend: 120000,
          spendChange: '+3.5%',
          budget: 250000,
          budgetUtil: '48.0% utilized',
          budgetChange: '+1.9%',
          revenue: 680000,
          revenueChange: '+11.8%',
          reserves: 11200000,
          reservesChange: '+5.4%',
          budgetDetails: 12000,
          cardLimit: 250000,
          cardSpent: 55000,
          barData: [
            { month: 'Mon', marketing: 18, operating: 12, tech: 9 },
            { month: 'Tue', marketing: 24, operating: 16, tech: 12 },
            { month: 'Wed', marketing: 21, operating: 14, tech: 11 },
            { month: 'Thu', marketing: 29, operating: 19, tech: 15 },
            { month: 'Fri', marketing: 35, operating: 23, tech: 18 },
            { month: 'Sat', marketing: 15, operating: 10, tech: 8 },
            { month: 'Sun', marketing: 12, operating: 8, tech: 6 }
          ],
          donutTotal: 19500,
          donutData: [
            { name: 'CFPB Remediation', value: 40, color: '#00C076' },
            { name: 'AML Investigations', value: 35, color: '#F59E0B' },
            { name: 'Data Privacy Audit', value: 15, color: '#3B82F6' },
            { name: 'Legal Disclosures', value: 10, color: '#94A3B8' }
          ]
        },
        'This Month': {
          spend: 580000,
          spendChange: '+6.2%',
          budget: 1100000,
          budgetUtil: '52.7% utilized',
          budgetChange: '+3.4%',
          revenue: 2950000,
          revenueChange: '+14.6%',
          reserves: 15600000,
          reservesChange: '+7.2%',
          budgetDetails: 48000,
          cardLimit: 600000,
          cardSpent: 195000,
          barData: [
            { month: 'Jan', marketing: 75, operating: 50, tech: 40 },
            { month: 'Feb', marketing: 90, operating: 60, tech: 50 },
            { month: 'Mar', marketing: 70, operating: 45, tech: 35 },
            { month: 'Apr', marketing: 115, operating: 75, tech: 60 },
            { month: 'May', marketing: 140, operating: 95, tech: 75 },
            { month: 'Jun', marketing: 100, operating: 65, tech: 55 }
          ],
          donutTotal: 65000,
          donutData: [
            { name: 'CFPB Remediation', value: 45, color: '#00C076' },
            { name: 'AML Investigations', value: 30, color: '#F59E0B' },
            { name: 'Data Privacy Audit', value: 15, color: '#3B82F6' },
            { name: 'Legal Disclosures', value: 10, color: '#94A3B8' }
          ]
        },
        'Quarterly': {
          spend: 1850000,
          spendChange: '+7.5%',
          budget: 3400000,
          budgetUtil: '54.4% utilized',
          budgetChange: '+4.1%',
          revenue: 8900000,
          revenueChange: '+15.2%',
          reserves: 21500000,
          reservesChange: '+8.1%',
          budgetDetails: 145000,
          cardLimit: 1200000,
          cardSpent: 480000,
          barData: [
            { month: 'Q1', marketing: 210, operating: 140, tech: 110 },
            { month: 'Q2', marketing: 290, operating: 195, tech: 155 },
            { month: 'Q3', marketing: 240, operating: 160, tech: 130 },
            { month: 'Q4', marketing: 270, operating: 180, tech: 145 }
          ],
          donutTotal: 185000,
          donutData: [
            { name: 'CFPB Remediation', value: 42, color: '#00C076' },
            { name: 'AML Investigations', value: 33, color: '#F59E0B' },
            { name: 'Data Privacy Audit', value: 15, color: '#3B82F6' },
            { name: 'Legal Disclosures', value: 10, color: '#94A3B8' }
          ]
        }
      }
    }
  };

  const activeProfile = peopleProfiles[role] || peopleProfiles['Fraud Analyst'];
  const activeMetrics = activeProfile.metrics[dashboardTimeframe] || activeProfile.metrics['This Month'];

  // Derived Dynamic Monthly Card Limit Calculations
  const currentCardLimit = userCardLimits[role] !== undefined 
    ? userCardLimits[role] 
    : (activeMetrics.cardLimit || 500000);
  const currentCardSpent = activeMetrics.cardSpent || 184500;
  const currentRemaining = Math.max(0, currentCardLimit - currentCardSpent);
  const limitUtilizationPct = Math.min(100, Math.round((currentCardSpent / Math.max(1, currentCardLimit)) * 100));

  const handleOpenAdjustLimit = () => {
    setTempLimitInput(currentCardLimit);
    setShowAdjustLimitModal(true);
  };

  const handleSaveCardLimit = (newLimit) => {
    const parsed = Math.max(10000, parseFloat(newLimit) || 10000);
    setUserCardLimits(prev => ({ ...prev, [role]: parsed }));
    setShowAdjustLimitModal(false);
    showToast(`Monthly card limit updated to ${formatAmount(parsed)} for ${activeProfile.name}!`);
  };

  // Currency Converter & Formatter: Always formats with correct currency symbol
  const formatAmount = (amtNum) => {
    if (currency === 'INR') {
      return `₹${amtNum.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    } else if (currency === 'EUR') {
      return `€${(amtNum / 90).toLocaleString('en-EU', { maximumFractionDigits: 2 })}`;
    } else {
      return `$${(amtNum / 83.5).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    }
  };

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Master Transactions Data
  const initialTransactions = [
    {
      id: 'TX-9482',
      merchant: 'Air India Flights',
      avatarLetter: 'AI',
      category: 'Travel',
      status: 'Completed',
      date: 'Jul 8, 2023',
      amountInr: 185000.00,
      paymentMethod: 'RuPay •••• 1801',
      account: activeProfile.account,
      owner: activeProfile.name,
      cardType: 'Card payment',
      receiptStatus: 'Missing',
      reconciliation: 'Pending receipt',
      mlFraudScore: 0.04,
      anomalyLevel: 'Normal',
      history: [
        { title: 'Payment completed', desc: `Charged to RuPay ending in 1801 for business travel`, date: 'Jul 8, 2023', status: 'done' },
        { title: 'Categorized as Travel', desc: 'Included in executive travel transaction records', date: 'Jul 8, 2023', status: 'done' },
        { title: 'AI Anomaly Screening Passed', desc: 'XGBoost Fraud Model v1.0 evaluated in 0.02ms', date: 'Jul 8, 2023', status: 'done' },
        { title: 'Receipt required', desc: 'Action needed to complete general ledger reconciliation', date: 'Action needed', status: 'pending' }
      ]
    },
    {
      id: 'TX-9483',
      merchant: 'Apple BKC Mumbai',
      avatarLetter: 'AP',
      category: 'Hardware',
      status: 'Completed',
      date: 'Jul 12, 2023',
      amountInr: 289900.00,
      paymentMethod: 'RuPay •••• 1801',
      account: activeProfile.account,
      owner: activeProfile.name,
      cardType: 'In-store UPI / Tap & Pay',
      receiptStatus: 'Attached',
      reconciliation: 'Reconciled',
      mlFraudScore: 0.01,
      anomalyLevel: 'Normal',
      history: [
        { title: 'Payment completed', desc: 'Charged for 2x MacBook Air M2 workstations', date: 'Jul 12, 2023', status: 'done' },
        { title: 'Categorized as Hardware', desc: 'Engineering workstation equipment budget', date: 'Jul 12, 2023', status: 'done' },
        { title: 'Receipt verified & reconciled', desc: 'Apple invoice auto-matched by OCR parser', date: 'Jul 12, 2023', status: 'done' }
      ]
    },
    {
      id: 'TX-9484',
      merchant: 'Amazon AWS Cloud India',
      avatarLetter: 'AW',
      category: 'Software & SaaS',
      status: 'Completed',
      date: 'Jul 15, 2023',
      amountInr: 698500.00,
      paymentMethod: 'Corporate RuPay •••• 9000',
      account: activeProfile.account,
      owner: activeProfile.name,
      cardType: 'Recurring corporate payment',
      receiptStatus: 'Attached',
      reconciliation: 'Reconciled',
      mlFraudScore: 0.02,
      anomalyLevel: 'Normal',
      history: [
        { title: 'Recurring SaaS invoice settled', desc: 'Automated cloud hosting compute billing', date: 'Jul 15, 2023', status: 'done' },
        { title: 'Categorized as Software & SaaS', desc: 'Production compute infrastructure allocation', date: 'Jul 15, 2023', status: 'done' }
      ]
    },
    {
      id: 'TX-9485',
      merchant: 'Suspicious Offshore Wire Transfer',
      avatarLetter: 'SW',
      category: 'Wire Transfer',
      status: 'Blocked',
      date: 'Jul 19, 2023',
      amountInr: 8150000.00,
      paymentMethod: 'NEFT / RTGS •••• 7712',
      account: activeProfile.account,
      owner: 'External Recipient (High-Risk Jurisdiction)',
      cardType: 'Cross-border wire',
      receiptStatus: 'Missing',
      reconciliation: 'Fraud Hold',
      mlFraudScore: 0.96,
      anomalyLevel: 'Critical Fraud Anomaly',
      history: [
        { title: 'Outbound wire transfer initiated', desc: 'Unusual amount to new offshore beneficiary', date: 'Jul 19, 2023', status: 'done' },
        { title: 'AI Fraud Alert Triggered', desc: 'PR-AUC 0.865 XGBoost engine scored 96.2% risk', date: 'Jul 19, 2023', status: 'alert' },
        { title: 'Immediate Authorization Hold', desc: 'Transaction frozen pending compliance sign-off', date: 'Jul 19, 2023', status: 'alert' }
      ]
    }
  ];

  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedTx, setSelectedTx] = useState(initialTransactions[0]);

  // Real-Time Customer Complaint Chat State
  const [customerProblem, setCustomerProblem] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${activeProfile.name}! Welcome to the Modern Banking Management System Real-Time Customer Complaint & Dispute Resolution Desk. Please describe any banking problem (e.g. money deducted without OTP, failed ATM withdrawal, loan rejection, unauthorized charges, or dispute). I will cross-reference banking regulations and RBI/CFPB policy to provide you an immediate resolution and action steps.`,
      citations: [
        { id: 'DOC-REG-003', title: 'Consumer Financial Protection Bureau (CFPB) SOP', source: 'CFPB Consumer Guidelines', relevance: 0.98 },
        { id: 'DOC-REG-002', title: 'Zero-Liability & Fraud Prevention Framework', source: 'RBI / FinCEN Master Directions', relevance: 0.95 }
      ],
      tool_calls: []
    }
  ]);

  // Credit Risk Form State
  const [creditForm, setCreditForm] = useState({
    person_age: 32,
    person_income: 1450000,
    person_home_ownership: 'RENT',
    person_emp_length: 5.0,
    loan_intent: 'EDUCATION',
    loan_grade: 'B',
    loan_amnt: 500000,
    loan_int_rate: 10.99,
    loan_percent_income: 0.18,
    cb_person_default_on_file: 'N',
    cb_person_cred_hist_length: 7
  });
  const [creditResult, setCreditResult] = useState(null);

  // Fraud Form State
  const [fraudForm, setFraudForm] = useState({
    Amount: 18500.0,
    V1: -2.31,
    V2: 1.84,
    V3: -1.90,
    V4: 3.25,
    V5: -0.85,
    merchant: '',
    location: ''
  });
  const [fraudResult, setFraudResult] = useState(null);
  const [batchFraudResults, setBatchFraudResults] = useState(null);
  const [singleTxCounter, setSingleTxCounter] = useState(1);

  // Churn Form State
  const [churnForm, setChurnForm] = useState({
    CreditScore: 680,
    Geography: 'Germany',
    Gender: 'Female',
    Age: 46,
    Tenure: 4,
    Balance: 850000,
    NumOfProducts: 1,
    HasCrCard: 1,
    IsActiveMember: 0,
    EstimatedSalary: 1250000
  });
  const [churnResult, setChurnResult] = useState(null);

  // Dedicated Queue Data for Credit Risk Dashboard
  const [creditQueue, setCreditQueue] = useState([
    { id: 'APP-801', name: 'Priya Nair', amount: 850000, intent: 'EDUCATION', grade: 'Grade B', prob: 0.084, status: 'Approved', emp: '5 yrs', income: 1450000 },
    { id: 'APP-802', name: 'Rajesh Kothari', amount: 1500000, intent: 'VENTURE', grade: 'Grade D', prob: 0.421, status: 'Under Review', emp: '2 yrs', income: 980000 },
    { id: 'APP-803', name: 'Sneha Sengupta', amount: 320000, intent: 'DEBTCONSOLIDATION', grade: 'Grade A', prob: 0.032, status: 'Approved', emp: '8 yrs', income: 2100000 },
    { id: 'APP-804', name: 'Amitav Ghosh', amount: 1200000, intent: 'PERSONAL', grade: 'Grade E', prob: 0.689, status: 'Declined', emp: '1 yr', income: 550000 }
  ]);

  // Dedicated Queue Data for Fraud Detection Dashboard
  const [fraudQueue, setFraudQueue] = useState([
    { id: 'TX-9901', merchant: 'Binance Crypto Buy', amount: 245000, location: 'Kyiv, UA (VPN)', prob: 0.968, level: 'Critical Anomaly', status: 'Blocked', time: '2m ago' },
    { id: 'TX-9902', merchant: 'Luxury Watch Store', amount: 410000, location: 'Mumbai, IN', prob: 0.884, level: 'High Risk', status: 'Flagged', time: '11m ago' },
    { id: 'TX-9903', merchant: 'Electronics Mart', amount: 78000, location: 'Dubai, UAE', prob: 0.742, level: 'High Risk', status: 'Under Review', time: '24m ago' },
    { id: 'TX-9904', merchant: 'Swiggy Gourmet Order', amount: 1250, location: 'Bengaluru, IN', prob: 0.008, level: 'Normal', status: 'Cleared', time: '35m ago' }
  ]);

  // Dedicated Queue Data for Customer Churn Dashboard
  const [churnQueue, setChurnQueue] = useState([
    { id: 'CUST-4101', name: 'Ramesh Chandra', age: 52, balance: 1840000, products: 1, churnProb: 0.784, risk: 'High', recommendation: 'Special 8.2% Senior FD Rate', offerSent: false },
    { id: 'CUST-4102', name: 'Kavita Menon', age: 34, balance: 980000, products: 1, churnProb: 0.621, risk: 'High', recommendation: 'Lifetime Free RuPay Platinum Card', offerSent: false },
    { id: 'CUST-4103', name: 'Devendra Joshi', age: 45, balance: 2450000, products: 3, churnProb: 0.142, risk: 'Low', recommendation: 'Wealth Management Advisory Call', offerSent: false },
    { id: 'CUST-4104', name: 'Shweta Bansal', age: 29, balance: 310000, products: 2, churnProb: 0.089, risk: 'Low', recommendation: 'Annual Fee Waiver + Lounge Access', offerSent: false }
  ]);

  // Analytics Datasets for Sub-Dashboards
  const creditGradeData = [
    { grade: 'Grade A', count: 12400, defaultRate: '2.1%' },
    { grade: 'Grade B', count: 9800, defaultRate: '4.8%' },
    { grade: 'Grade C', count: 6200, defaultRate: '12.4%' },
    { grade: 'Grade D', count: 3100, defaultRate: '24.6%' },
    { grade: 'Grade E', count: 920, defaultRate: '38.2%' },
    { grade: 'Grade F', count: 161, defaultRate: '56.0%' }
  ];

  const creditIntentData = [
    { name: 'Education', value: 34, color: '#00C076' },
    { name: 'Debt Consolidation', value: 28, color: '#3B82F6' },
    { name: 'Medical', value: 16, color: '#F59E0B' },
    { name: 'Home Imprv.', value: 14, color: '#8B5CF6' },
    { name: 'Personal', value: 8, color: '#94A3B8' }
  ];

  // Dynamic Fraud Dashboard Analytics Datasets
  const [dynamicFraudHourlyData, setDynamicFraudHourlyData] = useState([
    { hour: '00:00', screened: 4800, anomalies: 8 },
    { hour: '04:00', screened: 3100, anomalies: 14 },
    { hour: '08:00', screened: 7900, anomalies: 22 },
    { hour: '12:00', screened: 16400, anomalies: 41 },
    { hour: '16:00', screened: 19800, anomalies: 36 },
    { hour: '20:00', screened: 14200, anomalies: 29 }
  ]);

  const [dynamicFraudVectorData, setDynamicFraudVectorData] = useState([
    { name: 'Card-Not-Present', value: 46, color: '#F43F5E' },
    { name: 'Synthetic Identity', value: 26, color: '#F59E0B' },
    { name: 'Account Takeover', value: 18, color: '#3B82F6' },
    { name: 'Wire Fraud', value: 10, color: '#8B5CF6' }
  ]);

  // Dynamic Fraud Top KPI State (Updates on CSV Upload & Single Screening)
  const [fraudKpis, setFraudKpis] = useState({
    screened: '142,890 TXNs',
    screenedChange: '+14.2%',
    interceptedVal: 8450000,
    interceptedChange: '+28.4%',
    fpr: '0.04%',
    fprChange: '-0.02%',
    prAuc: '0.8650',
    prAucChange: '+0.031'
  });

  const churnBalanceData = [
    { range: '0-5L', churnRate: 14.2, count: 3200 },
    { range: '5L-15L', churnRate: 9.8, count: 4800 },
    { range: '15L-30L', churnRate: 6.4, count: 2900 },
    { range: '30L-50L', churnRate: 18.5, count: 1100 },
    { range: '>50L', churnRate: 24.1, count: 650 }
  ];

  const churnSegmentData = [
    { name: '2+ Products (Sticky)', value: 62, color: '#00C076' },
    { name: 'Single Product (Neutral)', value: 26, color: '#3B82F6' },
    { name: 'High Attrition Risk', value: 12, color: '#F43F5E' }
  ];

  // Fetch initial backend data
  const refreshAll = async () => {
    try {
      const [hRes, dRes, mRes, aRes] = await Promise.all([
        api.get('/api/health').catch(() => ({ data: { status: 'offline', models_ready: false } })),
        api.get('/api/dashboard/summary').catch(() => ({ data: null })),
        api.get('/api/models/metrics').catch(() => ({ data: { leaderboard: [] } })),
        api.get('/api/audit/logs').catch(() => ({ data: { logs: [] } }))
      ]);
      setHealth(hRes.data);
      if (dRes.data) setDashboardData(dRes.data);
      if (mRes.data) setLeaderboard(mRes.data.leaderboard || []);
      if (aRes.data) setAuditLogs(aRes.data.logs || []);
      showToast(`Synchronized data for ${activeProfile.name}!`);
    } catch (e) {
      showToast("Operating with local intelligence cache", "info");
    }
  };

  useEffect(() => {
    refreshAll();
  }, [role]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchDropdown(true);
      }
      if (e.key === 'Escape') {
        setShowSearchDropdown(false);
        setShowNotifications(false);
        setShowSettings(false);
        setShowProfile(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global Search Items
  const searchItems = [
    { name: `Air India Flights (${formatAmount(185000)})`, type: 'Transaction', action: () => { setSelectedTx(transactions[0]); setActiveTab('transaction'); } },
    { name: `Apple BKC Mumbai (${formatAmount(289900)})`, type: 'Transaction', action: () => { setSelectedTx(transactions[1]); setActiveTab('transaction'); } },
    { name: `Amazon AWS Cloud (${formatAmount(698500)})`, type: 'Transaction', action: () => { setSelectedTx(transactions[2]); setActiveTab('transaction'); } },
    { name: `Suspicious Offshore Wire (${formatAmount(8150000)})`, type: 'Transaction', action: () => { setSelectedTx(transactions[3]); setActiveTab('transaction'); } },
    { name: 'CFPB Real-Time Customer Complaint Chat', type: 'Customer Resolution', action: () => setActiveTab('complaints') },
    { name: 'Credit Risk Underwriting (XGBoost)', type: 'Module', action: () => setActiveTab('credit') },
    { name: 'Fraud Detection & Anomaly Scanner', type: 'Module', action: () => setActiveTab('fraud') },
    { name: 'Customer Churn Predictor (Random Forest)', type: 'Module', action: () => setActiveTab('churn') },
    { name: 'All 16 ML/DL Model Leaderboard', type: 'Leaderboard', action: () => setActiveTab('leaderboard') },
    { name: 'Card & Universal Bank Budget Management', type: 'Wallet', action: () => setActiveTab('cardbudget') }
  ];

  const filteredSearch = searchItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Transaction Event Handlers
  const handleExportDetails = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      `Transaction ID,Merchant,Amount,Currency,Date,Status,Payment Card,Account,Owner,Reconciliation,ML Fraud Score\n` +
      `${selectedTx.id},"${selectedTx.merchant}",${selectedTx.amountInr},${currency},"${selectedTx.date}","${selectedTx.status}","${selectedTx.paymentMethod}","${selectedTx.account}","${selectedTx.owner}","${selectedTx.reconciliation}",${selectedTx.mlFraudScore}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedTx.id}_${selectedTx.merchant.replace(/\s+/g, '_')}_Details.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported CSV details for ${selectedTx.merchant}!`);
  };

  const handleRequestReceipt = () => {
    showToast(`Receipt request notification dispatched to ${selectedTx.owner}!`, 'info');
  };

  const handleAttachReceiptClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReceiptFileChange = (e) => {
    const file = e.target.files[0];
    const fileName = file ? file.name : "Tax_Invoice_Verified.pdf";

    const updated = {
      ...selectedTx,
      receiptStatus: 'Attached',
      reconciliation: 'Reconciled',
      receiptFileName: fileName,
      history: [
        ...selectedTx.history.filter(h => h.title !== 'Receipt required'),
        {
          title: 'Tax Invoice Attached & Verified',
          desc: `${fileName} (1.4 MB) matched to payment of ${formatAmount(selectedTx.amountInr)}`,
          date: 'Just now',
          status: 'done'
        }
      ]
    };
    setSelectedTx(updated);
    setTransactions(transactions.map(t => t.id === selectedTx.id ? updated : t));
    showToast(`Receipt "${fileName}" attached! Status updated to Reconciled.`, 'success');
  };

  // Real-Time Customer Complaint Resolution Handler
  const handleCustomerProblemSubmit = async (promptText) => {
    const query = promptText || customerProblem;
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query };
    setChatMessages((prev) => [...prev, userMsg]);
    setCustomerProblem('');
    setChatLoading(true);

    try {
      const res = await api.post('/api/agent/chat', { message: query });
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.data.reply,
          citations: res.data.citations || [],
          tool_calls: res.data.tool_calls || []
        }
      ]);
      showToast("Complaint resolved according to bank policy & regulatory guidelines!");
    } catch (err) {
      // Offline fallback: Provides immediate, rich policy-based guidance
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `### 🛡️ Consumer Protection & Bank Policy Resolution\n\n**Issue Assessment:** Electronic Fund Dispute / Unauthorized Deduction\n**Policy Authority:** *RBI Master Direction / CFPB Regulation E (Electronic Fund Transfers)*\n**Resolution Target:** *24 to 48 Hours SLA*\n\n#### Immediate Steps Initiated for Your Account:\n- **Step 1:** Your transaction has been registered under Zero-Liability protection.\n- **Step 2:** Temporary freeze placed on payment channels to avoid further unauthorized debiting.\n- **Step 3:** Auto-chargeback initiated against the beneficiary payment gateway.\n- **Step 4:** Provisional credit of the disputed sum will be credited back to your account within 7 business days.\n\n*Reference Token: MBMS-DISPUTE-${Math.floor(100000 + Math.random() * 900000)} has been logged.*`,
          citations: [
            { id: 'DOC-REG-003', title: 'CFPB Consumer Complaint Response SOP', source: 'CFPB 12 CFR Part 1002', relevance: 0.97 },
            { id: 'DOC-REG-002', title: 'Anti-Money Laundering & Zero-Liability Framework', source: 'RBI / BSA Guidelines', relevance: 0.94 }
          ],
          tool_calls: [
            { tool: 'customer_complaint_resolver', arguments: { problem: query } },
            { tool: 'search_banking_docs', arguments: { query: 'Unauthorized dispute resolution' } }
          ]
        }
      ]);
      showToast("Policy solution provided (Instant Intelligent Mode)!");
    } finally {
      setChatLoading(false);
    }
  };

  // Prediction Handlers
  const handleCreditPredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/predict/credit-risk', creditForm);
      setCreditResult(res.data);
      showToast("Credit Risk evaluated successfully!");
      refreshAll();
    } catch (err) {
      const prob = creditForm.loan_percent_income > 0.35 || creditForm.cb_person_default_on_file === 'Y' ? 0.78 : 0.08;
      setCreditResult({
        default_probability: prob,
        loan_status: prob > 0.5 ? 1 : 0,
        risk_tier: prob > 0.5 ? "Elevated Risk" : "Prime / Low Risk",
        recommendation: prob > 0.5 ? "Manual Senior Underwriter Review Required" : "Instant Auto-Approval Eligible",
        contributing_factors: [
          { factor: "Debt-to-Income Proportion", impact: prob > 0.5 ? "Negative" : "Positive", detail: `Loan is ${(creditForm.loan_percent_income * 100).toFixed(0)}% of annual income` },
          { factor: "Verified Annual Income", impact: "Positive", detail: `${formatAmount(creditForm.person_income)} verified salary base` }
        ]
      });
      showToast("Credit Risk calculated (Instant Mode)!");
    } finally {
      setLoading(false);
    }
  };

  const handleFraudPredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/predict/fraud', fraudForm);
      const data = res.data;
      setFraudResult(data);

      // Build a rich transaction entry to inject into the Suspicious TX table
      const merchant = fraudForm.merchant?.trim() || `Manual Entry #${singleTxCounter}`;
      const location = fraudForm.location?.trim() || 'User Submitted';
      const prob = data.fraud_probability;
      const isSuspicious = prob >= 0.3;
      const level = prob >= 0.85 ? 'Critical Anomaly' : prob >= 0.5 ? 'High Risk' : prob >= 0.3 ? 'Elevated' : 'Normal';
      const newEntry = {
        id: `TX-MAN-${String(singleTxCounter).padStart(4, '0')}`,
        merchant,
        amount: fraudForm.Amount,
        location,
        prob,
        level,
        status: prob >= 0.5 ? 'Blocked' : prob >= 0.3 ? 'Flagged' : 'Cleared'
      };
      setSingleTxCounter(c => c + 1);

      // Always inject into table; prepend so it appears at top
      setFraudQueue(prev => [newEntry, ...prev]);

      // Update KPI screened count + intercepted value if high risk
      setFraudKpis(prev => {
        const prevScreened = parseInt((prev.screened || '0').replace(/[^0-9]/g, '')) || 0;
        const prevIntercepted = (typeof prev.interceptedVal === 'number' ? prev.interceptedVal : 0);
        const addedVal = isSuspicious ? fraudForm.Amount : 0;
        return {
          ...prev,
          screened: `${(prevScreened + 1).toLocaleString()} TXNs`,
          screenedChange: `+1 Manual Entry`,
          interceptedVal: prevIntercepted + addedVal,
          interceptedChange: isSuspicious ? `+1 Intercepted` : prev.interceptedChange
        };
      });

      showToast(
        isSuspicious
          ? `⚠️ ALERT: ${merchant} flagged as ${level} — injected into Suspicious Queue!`
          : `✅ ${merchant} cleared — No fraud pattern detected.`
        , isSuspicious ? 'danger' : 'success'
      );
      refreshAll();
    } catch (err) {
      const isAnomaly = fraudForm.Amount > 50000 || fraudForm.V1 < -3;
      const prob = isAnomaly ? 0.94 : 0.002;
      const data = {
        fraud_probability: prob,
        is_fraud: isAnomaly,
        anomaly_level: isAnomaly ? "Critical Fraud Anomaly" : "Normal",
        recommended_action: isAnomaly ? "Immediate Block & Security Hold" : "Auto-Approved"
      };
      setFraudResult(data);

      const merchant = fraudForm.merchant?.trim() || `Manual Entry #${singleTxCounter}`;
      const location = fraudForm.location?.trim() || 'User Submitted';
      const newEntry = {
        id: `TX-MAN-${String(singleTxCounter).padStart(4, '0')}`,
        merchant,
        amount: fraudForm.Amount,
        location,
        prob,
        level: isAnomaly ? 'Critical Anomaly' : 'Normal',
        status: isAnomaly ? 'Blocked' : 'Cleared'
      };
      setSingleTxCounter(c => c + 1);
      setFraudQueue(prev => [newEntry, ...prev]);

      setFraudKpis(prev => {
        const prevScreened = parseInt((prev.screened || '0').replace(/[^0-9]/g, '')) || 0;
        const prevIntercepted = (typeof prev.interceptedVal === 'number' ? prev.interceptedVal : 0);
        return {
          ...prev,
          screened: `${(prevScreened + 1).toLocaleString()} TXNs`,
          screenedChange: '+1 Manual Entry',
          interceptedVal: prevIntercepted + (isAnomaly ? fraudForm.Amount : 0),
          interceptedChange: isAnomaly ? '+1 Intercepted' : prev.interceptedChange
        };
      });

      showToast("Fraud screening evaluated (Instant Mode)!", isAnomaly ? 'danger' : 'success');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchFraudUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/predict/fraud/batch-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data;
      setBatchFraudResults(data);

      // 1. DYNAMICALLY UPDATE 4 TOP FRAUD KPI CARDS
      setFraudKpis({
        screened: `${data.total_records_processed.toLocaleString()} TXNs`,
        screenedChange: `+${data.total_records_processed.toLocaleString()} Scanned`,
        interceptedVal: data.intercepted_fraud_value,
        interceptedChange: `+${data.high_risk_flagged} Intercepted`,
        fpr: data.false_positive_rate || '0.04%',
        fprChange: 'Batch Threat Rate',
        prAuc: data.pr_auc || '0.8650',
        prAucChange: 'XGBoost v1.0'
      });

      // 2. DYNAMICALLY UPDATE HOURLY VELOCITY & ATTACK VECTORS CHARTS
      if (data.hourly_data && data.hourly_data.length > 0) {
        setDynamicFraudHourlyData(data.hourly_data);
      }
      if (data.attack_vectors && data.attack_vectors.length > 0) {
        setDynamicFraudVectorData(data.attack_vectors);
      }

      // 3. DYNAMICALLY UPDATE REAL-TIME INTERCEPTED SUSPICIOUS TRANSACTIONS TABLE
      if (data.suspicious_transactions && data.suspicious_transactions.length > 0) {
        setFraudQueue(data.suspicious_transactions);
      }

      showToast(`Batch Scan Complete: ${data.total_records_processed.toLocaleString()} transactions analyzed! Intercepted ${data.high_risk_flagged} threats!`);
    } catch (err) {
      console.error("Batch upload failed:", err);
      showToast(`Batch scan error: ${err.response?.data?.detail || err.message}`, 'danger');
    } finally {
      setLoading(false);
      // Reset input element so re-uploading the same or modified file triggers onChange
      if (e.target) e.target.value = '';
    }
  };

  // Quick 1-Click Test with the Curated 150-Row Sample Fraud Batch
  const handleLoadSampleFraudBatch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/sample_fraud_batch.csv');
      const blob = await response.blob();
      const file = new File([blob], 'sample_fraud_batch.csv', { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/predict/fraud/batch-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data;
      setBatchFraudResults(data);

      setFraudKpis({
        screened: `${data.total_records_processed.toLocaleString()} TXNs`,
        screenedChange: '+150 Test Batch',
        interceptedVal: data.intercepted_fraud_value,
        interceptedChange: `+${data.high_risk_flagged} Intercepted`,
        fpr: data.false_positive_rate || '10.0%',
        fprChange: 'Test Threat Rate',
        prAuc: '0.8650',
        prAucChange: 'Calibrated'
      });

      if (data.hourly_data) setDynamicFraudHourlyData(data.hourly_data);
      if (data.attack_vectors) setDynamicFraudVectorData(data.attack_vectors);
      if (data.suspicious_transactions) setFraudQueue(data.suspicious_transactions);

      showToast(`Sample Attack Batch Loaded: 150 transactions screened, ${data.high_risk_flagged} threats intercepted!`);
    } catch (err) {
      showToast("Failed to load sample fraud batch", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleChurnPredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/predict/churn', churnForm);
      setChurnResult(res.data);
      showToast("Customer churn likelihood assessed!");
      refreshAll();
    } catch (err) {
      const isHigh = churnForm.Age > 45 && churnForm.IsActiveMember === 0;
      setChurnResult({
        churn_probability: isHigh ? 0.68 : 0.14,
        is_churn: isHigh,
        risk_tier: isHigh ? "Severe Attrition Risk" : "Loyal / Low Attrition",
        retention_strategy: isHigh ? "Dedicated Relationship Manager Contact & Rate Boost" : "Standard Relationship Banking",
        primary_drivers: isHigh ? ["Age demographic >45", "Digital inactivity", "Single product holding"] : ["Active member engagement", "Multi-product adoption"]
      });
      showToast("Customer churn scored (Instant Mode)!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Hidden File Input for Receipt Attachment */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleReceiptFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />

      {/* Floating Action Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border transition-all transform animate-bounce ${
          toast.type === 'success'
            ? 'bg-[#00C076] text-white border-emerald-400'
            : toast.type === 'danger'
            ? 'bg-rose-600 text-white border-rose-500'
            : 'bg-slate-900 text-white border-slate-700'
        }`}>
          <CheckCircle2 className="h-4 w-4" />
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ADJUST MONTHLY CARD LIMIT MODAL (Interactive Card Limit Controller) */}
      {/* ==================================================================== */}
      {showAdjustLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-[#00C076] flex items-center justify-center font-bold">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Adjust Monthly Card Limit</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Universal Bank Corporate RuPay • {activeProfile.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdjustLimitModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Input & Formatted Preview */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5 font-mono uppercase tracking-wider">
                  Enter New Monthly Limit ({currency === 'INR' ? '₹ INR' : '$ USD'})
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 font-black text-slate-400 text-sm">
                    {currency === 'INR' ? '₹' : '$'}
                  </span>
                  <input
                    type="number"
                    step="10000"
                    value={tempLimitInput}
                    onChange={(e) => setTempLimitInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-lg font-black text-slate-900 outline-none focus:border-[#00C076] focus:bg-white transition"
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Formatted: <strong className="text-slate-700">{formatAmount(tempLimitInput)}</strong></span>
                  <span>Current Spent: <strong className="text-slate-700">{formatAmount(currentCardSpent)}</strong></span>
                </div>
              </div>

              {/* Range Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{formatAmount(50000)}</span>
                  <span className="text-[#00C076] font-bold font-mono">{formatAmount(tempLimitInput)}</span>
                  <span>{formatAmount(5000000)}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={tempLimitInput}
                  onChange={(e) => setTempLimitInput(parseFloat(e.target.value))}
                  className="w-full accent-[#00C076] cursor-pointer"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 font-mono">
                  Quick Select Preset Limit
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[200000, 500000, 1000000, 2500000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTempLimitInput(preset)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                        tempLimitInput === preset
                          ? 'bg-[#00C076] text-white border-emerald-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {formatAmount(preset)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Real-Time Utilization Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Projected Card Utilization</span>
                  <span className={`font-mono font-bold ${
                    tempLimitInput < currentCardSpent ? 'text-rose-600' : 'text-[#00C076]'
                  }`}>
                    {tempLimitInput > 0 ? Math.round((currentCardSpent / tempLimitInput) * 100) : 100}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      tempLimitInput < currentCardSpent
                        ? 'bg-rose-500'
                        : (currentCardSpent / tempLimitInput) > 0.75
                        ? 'bg-amber-500'
                        : 'bg-[#00C076]'
                    }`}
                    style={{ width: `${Math.min(100, Math.round((currentCardSpent / Math.max(1, tempLimitInput)) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Spent: {formatAmount(currentCardSpent)}</span>
                  <span className={tempLimitInput < currentCardSpent ? 'text-rose-600 font-bold' : 'text-slate-700 font-medium'}>
                    {tempLimitInput < currentCardSpent
                      ? `Exceeded by ${formatAmount(currentCardSpent - tempLimitInput)}`
                      : `Remaining: ${formatAmount(tempLimitInput - currentCardSpent)}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdjustLimitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveCardLimit(tempLimitInput)}
                className="flex-1 py-2.5 rounded-xl bg-[#00C076] hover:bg-[#00A664] text-white text-xs font-bold shadow-sm transition"
              >
                Save & Apply Limit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 1. TOP HEADER (Search, Notifications, Settings, People Selector) */}
      {/* ==================================================================== */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Brand Logo - 3D Animated Modern Banking Management System */}
        <div className="flex items-center gap-3.5 cursor-pointer group select-none" onClick={() => setActiveTab('dashboard')} title="Modern Banking Management System">
          {/* 3D Animated Logo Scene */}
          <div className="logo-3d-scene relative">
            <div className="logo-3d-object logo-glow-filter relative w-11 h-11 flex items-center justify-center">
              {/* Outer Orbiting Gyro Ring */}
              <svg className="absolute -inset-1.5 w-[56px] h-[56px] logo-orbit-ring pointer-events-none" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="23" stroke="url(#orbitGradient)" strokeWidth="1.5" strokeDasharray="5 7" strokeLinecap="round" />
                <circle cx="28" cy="5" r="2.5" fill="#00F5A0" className="shadow-[0_0_10px_#00F5A0]" />
              </svg>
              {/* Reverse Micro Ring */}
              <svg className="absolute -inset-0.5 w-[48px] h-[48px] logo-orbit-ring-fast pointer-events-none opacity-40" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="19" stroke="#34D399" strokeWidth="1" strokeDasharray="3 9" strokeLinecap="round" />
              </svg>

              {/* 3D Isometric Banking Core */}
              <svg className="w-11 h-11 drop-shadow-lg" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="topFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="50%" stopColor="#00C076" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="leftFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="rightFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="100%" stopColor="#064E3B" />
                  </linearGradient>
                  <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00C076" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#00F5A0" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#D1FAE5" />
                  </linearGradient>
                </defs>

                {/* 3D Isometric Facets */}
                {/* Top Isometric Face */}
                <polygon points="24,5 42,15 24,25 6,15" fill="url(#topFaceGrad)" />
                <polygon points="24,7 39,15 24,23 9,15" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />

                {/* Left Isometric Face */}
                <polygon points="6,15 24,25 24,43 6,33" fill="url(#leftFaceGrad)" />
                <line x1="6" y1="15" x2="6" y2="33" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />

                {/* Right Isometric Face */}
                <polygon points="24,25 42,15 42,33 24,43" fill="url(#rightFaceGrad)" />
                <line x1="24" y1="25" x2="24" y2="43" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />

                {/* 3D Bank Architecture Monogram (Pillars & Pediment) */}
                <polygon points="24,11 32,16 24,20 16,16" fill="#FFFFFF" fillOpacity="0.95" />
                <line x1="17" y1="22" x2="17" y2="33" stroke="url(#pillarGrad)" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="24" y1="26" x2="24" y2="37" stroke="url(#pillarGrad)" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="31" y1="22" x2="31" y2="33" stroke="url(#pillarGrad)" strokeWidth="2.2" strokeLinecap="round" />

                {/* Glowing Core Gem */}
                <polygon points="24,13 27,16 24,19 21,16" fill="#00F5A0" className="logo-core-pulse" />
              </svg>
            </div>
          </div>

          {/* Brand Name Typography */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-slate-900 font-sans leading-none group-hover:text-[#00C076] transition-colors">
                Modern Banking
              </span>
              <span className="text-[9px] uppercase font-mono font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 text-[#00C076] border border-emerald-200/80 shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C076] animate-pulse" />
                3D System
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono mt-0.5">
              Management System
            </span>
          </div>
        </div>

        {/* Center Search Bar with LIVE Dropdown */}
        <div className="hidden md:flex items-center w-96 relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowSearchDropdown(true)}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
            placeholder="Search transactions, models, complaints... (Ctrl+K)"
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-10 pr-12 py-2 text-xs text-slate-700 outline-none focus:border-[#00C076] focus:bg-white transition"
          />
          <button
            onClick={() => setShowSearchDropdown(!showSearchDropdown)}
            className="absolute right-3 text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded hover:bg-slate-300 transition"
          >
            ⌘K
          </button>

          {/* Search Dropdown Modal */}
          {showSearchDropdown && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase font-mono">
                <span>Quick Results</span>
                <button onClick={() => setShowSearchDropdown(false)} className="hover:text-slate-700">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1 mt-1">
                {filteredSearch.length > 0 ? (
                  filteredSearch.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action();
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                        showToast(`Navigated to ${item.name}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 flex items-center justify-between transition group"
                    >
                      <span className="font-semibold text-slate-800 group-hover:text-[#00C076]">{item.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {item.type}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">No matching records found.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Tools: Refresh, Notifications, Settings, People Role Perspective */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          <button
            onClick={refreshAll}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Refresh AI Models & Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); setShowProfile(false); }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative"
            title="View Alerts & Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="h-2 w-2 rounded-full bg-[#00C076] absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {/* Notifications Drawer */}
          {showNotifications && (
            <div className="absolute right-12 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">Notifications ({activeProfile.name})</span>
                <button
                  onClick={() => {
                    showToast("All notifications marked as read!");
                    setShowNotifications(false);
                  }}
                  className="text-[10px] text-[#00C076] font-bold hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                <div
                  onClick={() => { setActiveTab('transaction'); setShowNotifications(false); }}
                  className="p-3 rounded-xl border bg-emerald-50/40 border-emerald-200 cursor-pointer hover:bg-emerald-50 transition"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Missing Invoice Alert</span>
                    <span className="text-[10px] text-slate-400 font-mono">10m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Air India Flights ({formatAmount(185000)}) requires a tax invoice for reconciliation.</p>
                </div>

                <div
                  onClick={() => { setActiveTab('fraud'); setShowNotifications(false); }}
                  className="p-3 rounded-xl border bg-rose-50/40 border-rose-200 cursor-pointer hover:bg-rose-50 transition"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>High-Risk Wire Blocked</span>
                    <span className="text-[10px] text-slate-400 font-mono">45m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Offshore wire transfer of {formatAmount(8150000)} was blocked by XGBoost.</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Button */}
          <button
            onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); setShowProfile(false); }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Platform Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Settings Modal (Directly matching user image 3) */}
          {showSettings && (
            <div className="absolute right-4 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm font-bold text-slate-900">Platform Settings</span>
                <button onClick={() => setShowSettings(false)}>
                  <X className="h-4 w-4 text-slate-400 hover:text-slate-700" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Currency Display (Supports Indian Rupees, USD, EUR) */}
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Currency Display</label>
                  <select
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      showToast(`Currency display switched to ${e.target.value}!`);
                    }}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none focus:border-[#00C076]"
                  >
                    <option value="INR">INR (₹) - Indian Rupees (Default)</option>
                    <option value="USD">USD ($) - US Dollars</option>
                    <option value="EUR">EUR (€) - Euros</option>
                  </select>
                </div>

                {/* Active Perspective Role (Matching User Screenshot 3 - changes dashboard in REAL TIME) */}
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Active Perspective Role</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      showToast(`Switched active perspective to ${e.target.value}! Dashboard updated.`);
                    }}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none focus:border-[#00C076]"
                  >
                    <option value="Fraud Analyst">Fraud Analyst</option>
                    <option value="Chief Risk Officer">Chief Risk Officer</option>
                    <option value="Senior Underwriter">Senior Underwriter</option>
                    <option value="Compliance Auditor">Compliance Auditor</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Active Profile:</span>
                  <span className="font-bold text-slate-900">{activeProfile.name}</span>
                </div>
              </div>
            </div>
          )}

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* People / Role Perspective Profile Pill */}
          <div
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowSettings(false); }}
            className="flex items-center gap-2.5 pl-1 cursor-pointer hover:opacity-80 transition"
          >
            <div className="h-8 w-8 rounded-full bg-[#00C076] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {activeProfile.avatar}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">{activeProfile.name}</div>
              <div className="text-[10px] text-[#00C076] font-semibold">{role}</div>
            </div>
          </div>

          {/* Profile Modal */}
          {showProfile && (
            <div className="absolute right-0 top-12 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="h-10 w-10 rounded-full bg-[#00C076] text-white flex items-center justify-center font-black">
                  {activeProfile.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{activeProfile.name}</div>
                  <div className="text-[10px] text-slate-400">{activeProfile.email}</div>
                  <span className="inline-block mt-0.5 text-[9px] font-mono px-2 py-0.2 rounded-full bg-emerald-50 text-[#00C076] font-bold">
                    {role}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{activeProfile.primaryFocus}</p>
              <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
                <button
                  onClick={() => { setActiveTab('dashboard'); setShowProfile(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
                >
                  View Role Dashboard
                </button>
                <button
                  onClick={() => { setActiveTab('cardbudget'); setShowProfile(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
                >
                  Manage Role Corporate Card
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. MAIN LAYOUT (Left Sidebar + Active Content Canvas) */}
      {/* ==================================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Main Menu
            </div>

            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'complaints', label: 'CFPB Complaint NLP', icon: MessageSquareWarning, badge: 'Realtime Chat' },
              { id: 'transaction', label: 'Transaction Details', icon: DollarSign, badge: 'Live' },
              { id: 'credit', label: 'Credit Risk AI', icon: Landmark, badge: 'XGBoost' },
              { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert, badge: 'Realtime' },
              { id: 'cardbudget', label: 'Card & Budget', icon: CreditCard },
              { id: 'churn', label: 'Customer Churn', icon: Users, badge: 'RF' },
              { id: 'leaderboard', label: 'Model Leaderboard', icon: Layers, badge: '16 Models' },
              { id: 'audit', label: 'Documents & Audit', icon: History }
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    showToast(`Switched to ${item.label}`);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-[#00C076] text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !active && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Role Switcher Quick Pill */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Active Role</span>
                <span className="font-bold text-[#00C076]">{role}</span>
              </div>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  showToast(`Dashboard switched to ${e.target.value}!`);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-[#00C076]"
              >
                <option value="Fraud Analyst">Fraud Analyst</option>
                <option value="Chief Risk Officer">Chief Risk Officer</option>
                <option value="Senior Underwriter">Senior Underwriter</option>
                <option value="Compliance Auditor">Compliance Auditor</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Dynamic Center Work Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 bg-[#F8FAFC]">
          {/* ================================================================ */}
          {/* PRIMARY MULTI-DASHBOARD NAVIGATION CONTROLLER */}
          {/* ================================================================ */}
          <div className="max-w-7xl mx-auto mb-6 bg-white border border-slate-200/90 p-2 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => { setActiveTab('dashboard'); showToast("Switched to Executive Banking Overview!"); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                  activeTab === 'dashboard'
                    ? 'bg-[#00C076] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Executive Banking</span>
              </button>
              <button
                onClick={() => { setActiveTab('credit'); showToast("Switched to Credit Risk Dashboard!"); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                  activeTab === 'credit'
                    ? 'bg-[#00C076] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Landmark className="h-4 w-4" />
                <span>Credit Risk Dashboard</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'credit' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  XGBoost
                </span>
              </button>
              <button
                onClick={() => { setActiveTab('fraud'); showToast("Switched to Fraud Detection Dashboard!"); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                  activeTab === 'fraud'
                    ? 'bg-[#00C076] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Fraud Detection Dashboard</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'fraud' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-600'}`}>
                  Realtime
                </span>
              </button>
              <button
                onClick={() => { setActiveTab('churn'); showToast("Switched to Customer Churn Dashboard!"); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                  activeTab === 'churn'
                    ? 'bg-[#00C076] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Customer Churn Dashboard</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'churn' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                  Retention
                </span>
              </button>
              <button
                onClick={() => { setActiveTab('complaints'); showToast("Switched to CFPB Consumer Complaints Desk!"); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                  activeTab === 'complaints'
                    ? 'bg-[#00C076] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MessageSquareWarning className="h-4 w-4" />
                <span>CFPB Complaints Desk</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'complaints' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700'}`}>
                  NLP
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-1.5 md:pt-0">
              <span className="text-[11px] text-slate-400 font-medium">Perspective:</span>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {role} ({activeProfile.name})
              </span>
            </div>
          </div>
          {/* ================================================================ */}
          {/* 1. BANKING MANAGEMENT DASHBOARD (Real-Time Role & Currency Adaptive) */}
          {/* ================================================================ */}
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-6 pt-2">
              {/* Top Title Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Banking Management Dashboard
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#00C076] border border-emerald-200">
                      {role} View
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Live data stream configured for <strong>{activeProfile.name}</strong> ({activeProfile.email})
                  </p>
                </div>

                {/* Timeframe Selector (This Week, This Month, Quarterly) */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm text-xs">
                  {['This Week', 'This Month', 'Quarterly'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => {
                        setDashboardTimeframe(tf);
                        showToast(`Switched view to ${tf}!`);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                        dashboardTimeframe === tf
                          ? 'bg-[#00C076] text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Top KPI Cards (Indian Rupees Format & Real-Time Dynamic) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Monthly Spend',
                    val: formatAmount(activeMetrics.spend),
                    change: activeMetrics.spendChange,
                    desc: 'vs. previous period'
                  },
                  {
                    title: 'Allocated Budget',
                    val: formatAmount(activeMetrics.budget),
                    change: activeMetrics.budgetChange,
                    desc: activeMetrics.budgetUtil
                  },
                  {
                    title: 'Total Revenue',
                    val: formatAmount(activeMetrics.revenue),
                    change: activeMetrics.revenueChange,
                    desc: 'Operating cashflow'
                  },
                  {
                    title: 'Net Reserves',
                    val: formatAmount(activeMetrics.reserves),
                    change: activeMetrics.reservesChange,
                    desc: 'Liquid reserves'
                  }
                ].map((kpi, i) => (
                  <div
                    key={i}
                    onClick={() => showToast(`Selected KPI: ${kpi.title} (${kpi.val})`)}
                    className="weave-card p-5 hover:border-[#00C076] hover:shadow-md transition cursor-pointer group"
                  >
                    <span className="text-xs font-semibold text-slate-400 block mb-1 group-hover:text-slate-600 transition">
                      {kpi.title}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{kpi.val}</span>
                      <span className="text-xs font-bold text-[#00C076]">{kpi.change}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">{kpi.desc}</span>
                  </div>
                ))}
              </div>

              {/* Center Row: Spend Bar Chart + Activity Donut + Role Debit Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Spend Bar Chart (6 cols) */}
                <div className="lg:col-span-6 weave-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                        Spend by Category (Total)
                      </h3>
                      <p className="text-[11px] text-slate-400">Departmental allocation for {dashboardTimeframe}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#00C076]" /> Marketing</span>
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" /> Operating</span>
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#94A3B8]" /> Tech</span>
                    </div>
                  </div>

                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeMetrics.barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                        <YAxis stroke="#94A3B8" fontSize={11} />
                        <Tooltip
                          formatter={(value) => [`${currency === 'INR' ? '₹' : '$'}${value}k`, '']}
                          contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="marketing" fill="#00C076" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="operating" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="tech" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Activity Donut (3 cols) */}
                <div className="lg:col-span-3 weave-card p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Activity
                    </h3>
                    <p className="text-[11px] text-slate-400">Channel breakdown ({dashboardTimeframe})</p>
                  </div>

                  <div className="h-44 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activeMetrics.donutData}
                          innerRadius={48}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {activeMetrics.donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center pointer-events-none">
                      <span className="text-[10px] text-slate-400 font-medium block">Total</span>
                      <span className="text-sm font-extrabold text-slate-900">{formatAmount(activeMetrics.donutTotal)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                    {activeMetrics.donutData.map((a, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-slate-500">{a.name}</span>
                        <span className="font-bold text-slate-800">{a.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Universal Bank RuPay / Corporate Card */}
                <div className="lg:col-span-3 space-y-4">
                  <div className={`credit-card-sheen p-5 rounded-2xl text-white shadow-xl flex flex-col justify-between h-48 relative transition ${
                    cardFrozen ? 'opacity-75 ring-2 ring-rose-500' : ''
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold tracking-wider text-slate-200">Universal Bank</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setCardFrozen(!cardFrozen);
                            showToast(cardFrozen ? "Card unfrozen and active!" : "Card frozen for security!", cardFrozen ? 'success' : 'warning');
                          }}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold transition ${
                            cardFrozen ? 'bg-rose-500 text-white' : 'bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50'
                          }`}
                        >
                          {cardFrozen ? 'FROZEN' : 'ACTIVE'}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="h-7 w-9 rounded-md bg-amber-400/90 border border-amber-300 shadow-inner flex items-center justify-center">
                        <div className="w-6 h-4 border border-amber-600/40 rounded-sm" />
                      </div>
                      <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 9c2.5 0 5 1.5 5 3s-2.5 3-5 3" />
                        <path d="M2 6c4.5 0 9 2.5 9 6s-4.5 6-9 6" />
                      </svg>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm tracking-widest text-slate-100 font-bold">
                          {showCardNumber ? activeProfile.cardNum : "•••• •••• •••• 0000"}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(activeProfile.cardNum.replace(/\s+/g, ''));
                              showToast("Card number copied to clipboard!");
                            }}
                            className="text-slate-400 hover:text-white p-1"
                            title="Copy Card Number"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setShowCardNumber(!showCardNumber)}
                            className="text-slate-400 hover:text-white p-1"
                            title={showCardNumber ? "Mask Number" : "Reveal Number"}
                          >
                            {showCardNumber ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
                        <span>{activeProfile.cardHolder}</span>
                        <span className="font-mono">EXP 08/29</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Card Limit Widget (Matching User Uploaded Image) */}
                  <div className="weave-card p-5 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 uppercase font-mono tracking-wider">
                        MONTHLY CARD LIMIT
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        limitUtilizationPct > 90 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-[#00C076]'
                      }`}>
                        {limitUtilizationPct}% Used
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {formatAmount(currentCardLimit)}
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            limitUtilizationPct > 90
                              ? 'bg-rose-500'
                              : limitUtilizationPct > 75
                              ? 'bg-amber-500'
                              : 'bg-[#00C076]'
                          }`}
                          style={{ width: `${limitUtilizationPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>Spent: {formatAmount(currentCardSpent)}</span>
                        <span>Remaining: {formatAmount(currentRemaining)}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleOpenAdjustLimit}
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-[#00C076] hover:text-[#00C076] transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Sliders className="h-3.5 w-3.5 text-slate-400" />
                      <span>Adjust Limit</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ================================================================ */}
              {/* AI INTELLIGENCE DASHBOARDS QUICK OVERVIEW (Credit, Fraud, Churn) */}
              {/* ================================================================ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Banking AI Dashboards
                    </h3>
                    <p className="text-[11px] text-slate-400">Direct access to specialized machine learning & deep learning suites</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#00C076] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    4 Models Online
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Credit Risk Dashboard Card */}
                  <div
                    onClick={() => { setActiveTab('credit'); showToast("Switched to Credit Risk Dashboard!"); }}
                    className="weave-card p-5 hover:border-[#00C076] hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-[#00C076] flex items-center justify-center">
                          <Landmark className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          XGBoost + ANN
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-[#00C076] transition">
                        Credit Risk Prediction
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        Loan default probability, credit grade distributions, and Regulation B adverse action explainability.
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">NPL Rate</span>
                          <span className="font-bold text-slate-800">2.14%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Underwritten</span>
                          <span className="font-bold text-slate-800">{formatAmount(428000000)}</span>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 w-full py-2 rounded-xl bg-slate-50 hover:bg-[#00C076] group-hover:bg-[#00C076] text-slate-700 hover:text-white group-hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5">
                      <span>Launch Credit Dashboard</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Fraud Detection Dashboard Card */}
                  <div
                    onClick={() => { setActiveTab('fraud'); showToast("Switched to Fraud Detection Dashboard!"); }}
                    className="weave-card p-5 hover:border-rose-400 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600">
                          PR-AUC 0.865
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition">
                        Fraud Transaction Detection
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        Surveillance radar against 0.17% class imbalance, batch CSV scanning, and immediate fraud freeze.
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Intercepted (24h)</span>
                          <span className="font-bold text-rose-600">{formatAmount(8450000)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">False Positives</span>
                          <span className="font-bold text-slate-800">0.04%</span>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 w-full py-2 rounded-xl bg-slate-50 hover:bg-rose-600 group-hover:bg-rose-600 text-slate-700 hover:text-white group-hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5">
                      <span>Launch Fraud Dashboard</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Customer Churn Dashboard Card */}
                  <div
                    onClick={() => { setActiveTab('churn'); showToast("Switched to Customer Churn Dashboard!"); }}
                    className="weave-card p-5 hover:border-emerald-400 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-[#00C076] flex items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          Random Forest
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-[#00C076] transition">
                        Customer Churn & Retention
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        Customer attrition likelihood, tenured balance impact, and automated loyalty retention playbooks.
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Attrition Rate</span>
                          <span className="font-bold text-slate-800">4.18%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Retention Saved</span>
                          <span className="font-bold text-[#00C076]">88.6%</span>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 w-full py-2 rounded-xl bg-slate-50 hover:bg-[#00C076] group-hover:bg-[#00C076] text-slate-700 hover:text-white group-hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5">
                      <span>Launch Churn Dashboard</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Live Transactions Stream */}
              <div className="weave-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Recent Invoices & Inferences for {activeProfile.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">Click any transaction to view full details</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('transaction');
                      showToast("Opened Transaction Details view!");
                    }}
                    className="text-xs font-bold text-[#00C076] hover:underline flex items-center gap-1"
                  >
                    <span>View Selected</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono">
                        <th className="py-2.5 px-3">Transaction ID</th>
                        <th className="py-2.5 px-3">Merchant</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Receipt</th>
                        <th className="py-2.5 px-3">Reconciliation</th>
                        <th className="py-2.5 px-3">AI Fraud Score</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          onClick={() => {
                            setSelectedTx(tx);
                            setActiveTab('transaction');
                            showToast(`Inspecting ${tx.merchant}!`);
                          }}
                          className={`hover:bg-slate-50 transition cursor-pointer ${
                            selectedTx.id === tx.id ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-semibold text-slate-600">{tx.id}</td>
                          <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                            <span className="h-6 w-6 rounded-lg bg-emerald-50 text-[#00C076] flex items-center justify-center font-bold text-xs">
                              {tx.avatarLetter}
                            </span>
                            <span>{tx.merchant}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{tx.category}</td>
                          <td className="py-3 px-3 font-black text-slate-900">
                            {formatAmount(tx.amountInr)}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.receiptStatus === 'Attached'
                                ? 'bg-emerald-50 text-[#00C076] border border-emerald-200'
                                : 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                            }`}>
                              {tx.receiptStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.reconciliation === 'Reconciled'
                                ? 'bg-emerald-50 text-[#00C076]'
                                : tx.reconciliation === 'Fraud Hold'
                                ? 'bg-rose-50 text-rose-600'
                                : 'bg-amber-50 text-[#F59E0B]'
                            }`}>
                              {tx.reconciliation}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-700">
                            {(tx.mlFraudScore * 100).toFixed(1)}% ({tx.anomalyLevel})
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button className="px-2.5 py-1 rounded-lg bg-[#00C076] hover:bg-[#00A664] text-white text-[10px] font-bold shadow-sm">
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 2. REAL-TIME CFPB CONSUMER COMPLAINTS NLP CHAT (Brand New Screen) */}
          {/* ================================================================ */}
          {activeTab === 'complaints' && (
            <div className="max-w-5xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <MessageSquareWarning className="h-5 w-5 text-[#00C076]" />
                    <span>CFPB Consumer Complaints NLP & Real-Time Customer Resolution Desk</span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    Live customer dispute resolution: queries banking policies, regulatory guidance & search engine data in real time.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setChatMessages([chatMessages[0]]);
                    showToast("Complaint chat history cleared!");
                  }}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  Clear History
                </button>
              </div>

              {/* Real-Time Live Chat Window */}
              <div className="flex-1 overflow-y-auto p-5 weave-card space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 text-xs leading-relaxed ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-[#00C076]">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div className={`max-w-2xl rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-[#00C076] text-white font-medium shadow-sm'
                        : 'bg-[#F8FAFC] border border-slate-200/80 text-slate-800'
                    }`}>
                      {msg.tool_calls && msg.tool_calls.length > 0 && (
                        <div className="mb-3 space-y-1">
                          {msg.tool_calls.map((tc, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-600">
                              <Terminal className="h-3 w-3 text-[#00C076]" />
                              <span>Live Bank Engine Tool: <strong className="text-[#00C076]">{tc.tool}</strong></span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                            Traceable Regulatory Citations & Bank Policy Source:
                          </span>
                          <div className="space-y-1">
                            {msg.citations.map((c, ci) => (
                              <div key={ci} className="text-[11px] p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                                <div>
                                  <strong className="text-slate-800">[{c.id}] {c.title}</strong>
                                  <div className="text-[10px] text-slate-400">Policy: {c.source}</div>
                                </div>
                                <span className="font-mono text-[10px] text-[#00C076] font-bold">
                                  {(c.relevance * 100).toFixed(0)}% relevance
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <RefreshCw className="h-4 w-4 animate-spin text-[#00C076]" />
                    <span>Searching bank policies, regulatory repositories & formulating solution...</span>
                  </div>
                )}
              </div>

              {/* Sample Dispute Problem Pills for 1-Click Testing */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-400 font-mono shrink-0">Sample Customer Disputes:</span>
                {[
                  "₹25,000 deducted from my account without any OTP or SMS",
                  "ATM at Mumbai debited ₹10,000 but cash was not dispensed",
                  "Why was my home loan application rejected without adverse notice?",
                  "Unexpected annual card maintenance charge of ₹1,500 applied"
                ].map((pill, pi) => (
                  <button
                    key={pi}
                    onClick={() => handleCustomerProblemSubmit(pill)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-[#00C076] text-slate-600 hover:text-slate-900 transition shadow-sm text-xs font-medium"
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Customer Dispute Input Form */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleCustomerProblemSubmit(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={customerProblem}
                  onChange={(e) => setCustomerProblem(e.target.value)}
                  placeholder="Explain your banking problem or dispute (e.g. unauthorized charge, failed ATM, delayed refund)..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#00C076] shadow-sm"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-5 py-3 rounded-xl bg-[#00C076] hover:bg-[#00A664] text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
                >
                  <span>Resolve</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* ================================================================ */}
          {/* 3. TRANSACTION DETAILS VIEW (1:1 with Reference Screenshot) */}
          {/* ================================================================ */}
          {activeTab === 'transaction' && (
            <div className="max-w-6xl mx-auto space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Transactions</span>
                  </button>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-slate-900 font-bold">{selectedTx.merchant}</span>
                </div>

                <button
                  onClick={handleExportDetails}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition flex items-center gap-2"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Export details</span>
                </button>
              </div>

              <h1 className="text-xl font-black text-slate-900 tracking-tight">Transaction Details</h1>

              <div className="weave-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00C076] font-extrabold text-lg">
                    {selectedTx.avatarLetter}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-base font-bold text-slate-900">{selectedTx.merchant}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        selectedTx.status === 'Completed'
                          ? 'bg-emerald-50 text-[#00C076] border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${selectedTx.status === 'Completed' ? 'bg-[#00C076]' : 'bg-rose-600'}`} />
                        {selectedTx.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedTx.cardType} - {selectedTx.date}
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-2xl md:text-3xl font-black text-slate-900">
                    {formatAmount(selectedTx.amountInr)}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currency} - Paid with {selectedTx.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Grid: Left Column & Right Column */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-6">
                  <div className="weave-card p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                        Payment Details
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        {currency}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Transaction date</span>
                        <span className="font-semibold text-slate-800">{selectedTx.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Merchant</span>
                        <span className="font-semibold text-slate-800">{selectedTx.merchant}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Payment card</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">CARD</span>
                          <span>{selectedTx.paymentMethod}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Account</span>
                        <span className="font-semibold text-slate-800 font-mono">{selectedTx.account}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Owner</span>
                        <span className="font-semibold text-slate-800">{selectedTx.owner}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">AI Fraud Assessment</span>
                        <span className={`font-semibold flex items-center gap-1 ${
                          selectedTx.mlFraudScore > 0.5 ? 'text-rose-600' : 'text-[#00C076]'
                        }`}>
                          {selectedTx.mlFraudScore > 0.5 ? (
                            <>
                              <AlertTriangle className="h-3.5 w-3.5" />
                              <span>Critical Flag ({(selectedTx.mlFraudScore * 100).toFixed(1)}%)</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Passed ({(selectedTx.mlFraudScore * 100).toFixed(1)}% score)</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="weave-card p-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-3">
                      Activity History
                    </h3>

                    <div className="space-y-4 text-xs">
                      {selectedTx.history.map((event, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`h-3 w-3 rounded-full mt-1 shrink-0 ring-4 ${
                            event.status === 'done'
                              ? 'bg-[#00C076] ring-emerald-50'
                              : event.status === 'alert'
                              ? 'bg-rose-600 ring-rose-50'
                              : 'bg-[#F59E0B] ring-amber-50'
                          }`} />
                          <div className="flex-1 flex items-start justify-between">
                            <div>
                              <div className="font-bold text-slate-800">{event.title}</div>
                              <div className="text-[11px] text-slate-400">{event.desc}</div>
                            </div>
                            <span className={`text-[11px] font-semibold ${
                              event.status === 'pending' ? 'text-[#F59E0B]' : 'text-slate-400'
                            }`}>
                              {event.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="weave-card p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                        Receipt
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        selectedTx.receiptStatus === 'Attached'
                          ? 'bg-emerald-50 text-[#00C076] border border-emerald-200'
                          : 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                      }`}>
                        ● {selectedTx.receiptStatus}
                      </span>
                    </div>

                    <div
                      onClick={handleAttachReceiptClick}
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-[#F8FAFC]/60 hover:bg-[#F8FAFC] transition cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-400 group-hover:text-[#00C076] group-hover:bg-emerald-50 flex items-center justify-center mx-auto mb-2 transition">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-800 mb-0.5">
                        {selectedTx.receiptFileName || (selectedTx.receiptStatus === 'Attached' ? 'Tax_Invoice_Verified.pdf' : 'No receipt attached')}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {selectedTx.receiptStatus === 'Attached'
                          ? 'Document verified by OCR parser'
                          : 'Drag and drop your receipt here, PDF, JPG or PNG up to 10MB'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={handleRequestReceipt}
                        className="flex-1 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm"
                      >
                        Request receipt
                      </button>
                      <button
                        onClick={handleAttachReceiptClick}
                        className="flex-1 py-2 rounded-xl bg-[#00C076] hover:bg-[#00A664] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{selectedTx.receiptStatus === 'Attached' ? 'Replace receipt' : 'Attach receipt'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="weave-card p-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-3">
                      Category & Reconciliation
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Category</label>
                        <select
                          value={selectedTx.category}
                          onChange={(e) => {
                            const updated = { ...selectedTx, category: e.target.value };
                            setSelectedTx(updated);
                            showToast(`Category updated to ${e.target.value}!`);
                          }}
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold outline-none focus:border-[#00C076]"
                        >
                          <option value="Travel">Travel (Airlines, Lodging)</option>
                          <option value="Hardware">Hardware & Equipment</option>
                          <option value="Software & SaaS">Software & SaaS</option>
                          <option value="Wire Transfer">Wire Transfer</option>
                          <option value="Operating Expenses">Operating Expenses</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Reconciliation</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedTx.reconciliation === 'Reconciled'
                            ? 'bg-emerald-50 text-[#00C076] border border-emerald-200'
                            : selectedTx.reconciliation === 'Fraud Hold'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                        }`}>
                          {selectedTx.reconciliation}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {selectedTx.reconciliation === 'Reconciled'
                          ? 'Payments complete. Receipt verified and transaction reconciled.'
                          : 'Payments complete. Attach valid evidence/receipt before finalizing this transaction record.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 4. CREDIT RISK DASHBOARD */}
          {/* ================================================================ */}
          {activeTab === 'credit' && (
            <div className="max-w-7xl mx-auto space-y-6 pt-2">
              {/* Top Title Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Credit Risk & Loan Underwriting Dashboard
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#00C076] border border-emerald-200">
                      Underwriter AI Suite
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    XGBoost + ANN default risk scoring trained on 32,581 loans with Regulation B Adverse Action explainability.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700 shadow-xs">
                    ROC-AUC: 0.9443 | KS: 68.4
                  </span>
                </div>
              </div>

              {/* 4 Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Portfolio Underwritten', val: formatAmount(428000000), change: '+8.4%', desc: '32,581 active loan books' },
                  { title: 'Weighted NPL Default Rate', val: '2.14%', change: '-0.32%', desc: 'vs. 3.50% industry baseline' },
                  { title: 'Average Credit Score', val: '742 / 850', change: '+12 pts', desc: 'Grade A / Prime tier' },
                  { title: 'Capital Adequacy (CAR)', val: '16.8%', change: '+1.4%', desc: 'Basel III Tier 1 compliant' }
                ].map((kpi, i) => (
                  <div key={i} className="weave-card p-5 hover:border-[#00C076] transition shadow-xs">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">{kpi.title}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{kpi.val}</span>
                      <span className="text-xs font-bold text-[#00C076]">{kpi.change}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">{kpi.desc}</span>
                  </div>
                ))}
              </div>

              {/* Visual Analytics Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Credit Grade Distribution Bar Chart */}
                <div className="lg:col-span-8 weave-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                        Loan Portfolio by Assigned Grade
                      </h3>
                      <p className="text-[11px] text-slate-400">Total volume and historical default rate per credit risk band</p>
                    </div>
                    <span className="text-[11px] font-mono text-[#00C076] font-bold">XGBoost Calibration</span>
                  </div>

                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={creditGradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                          formatter={(value, name) => [value.toLocaleString(), 'Loans Underwritten']}
                        />
                        <Bar dataKey="count" fill="#00C076" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Loan Intent Donut */}
                <div className="lg:col-span-4 weave-card p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Loan Purpose Intent
                    </h3>
                    <p className="text-[11px] text-slate-400">Distribution across commercial & personal categories</p>
                  </div>

                  <div className="h-44 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={creditIntentData}
                          innerRadius={48}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {creditIntentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center pointer-events-none">
                      <span className="text-[10px] text-slate-400 font-medium block">Total Intent</span>
                      <span className="text-sm font-extrabold text-slate-900">100%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                    {creditIntentData.map((a, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-slate-500">{a.name}</span>
                        <span className="font-bold text-slate-800">{a.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Underwriting Simulator + Result Box */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form onSubmit={handleCreditPredict} className="lg:col-span-7 weave-card p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Applicant Financial Parameters Simulator
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCreditForm({
                            person_age: 38,
                            person_income: 1850000,
                            person_home_ownership: 'MORTGAGE',
                            person_emp_length: 9.0,
                            loan_intent: 'HOMEIMPROVEMENT',
                            loan_grade: 'A',
                            loan_amnt: 400000,
                            loan_int_rate: 8.5,
                            loan_percent_income: 0.12,
                            cb_person_default_on_file: 'N',
                            cb_person_cred_hist_length: 12
                          });
                          showToast("Loaded Prime Borrower preset!");
                        }}
                        className="text-[10px] bg-emerald-50 text-[#00C076] font-bold px-2 py-1 rounded-lg hover:bg-emerald-100"
                      >
                        Prime Borrower
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCreditForm({
                            person_age: 23,
                            person_income: 380000,
                            person_home_ownership: 'RENT',
                            person_emp_length: 0.5,
                            loan_intent: 'DEBTCONSOLIDATION',
                            loan_grade: 'E',
                            loan_amnt: 320000,
                            loan_int_rate: 18.2,
                            loan_percent_income: 0.54,
                            cb_person_default_on_file: 'Y',
                            cb_person_cred_hist_length: 1
                          });
                          showToast("Loaded High-Risk Subprime preset!");
                        }}
                        className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-100"
                      >
                        Subprime Alert
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Age</label>
                      <input
                        type="number"
                        value={creditForm.person_age}
                        onChange={(e) => setCreditForm({...creditForm, person_age: parseInt(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Annual Income ({currency === 'INR' ? '₹' : '$'})</label>
                      <input
                        type="number"
                        value={creditForm.person_income}
                        onChange={(e) => setCreditForm({...creditForm, person_income: parseFloat(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Home Ownership</label>
                      <select
                        value={creditForm.person_home_ownership}
                        onChange={(e) => setCreditForm({...creditForm, person_home_ownership: e.target.value})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      >
                        <option value="RENT">RENT</option>
                        <option value="MORTGAGE">MORTGAGE</option>
                        <option value="OWN">OWN</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Employment (Years)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={creditForm.person_emp_length}
                        onChange={(e) => setCreditForm({...creditForm, person_emp_length: parseFloat(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Loan Intent</label>
                      <select
                        value={creditForm.loan_intent}
                        onChange={(e) => setCreditForm({...creditForm, loan_intent: e.target.value})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      >
                        <option value="EDUCATION">EDUCATION</option>
                        <option value="PERSONAL">PERSONAL</option>
                        <option value="DEBTCONSOLIDATION">DEBT CONSOLIDATION</option>
                        <option value="HOMEIMPROVEMENT">HOME IMPROVEMENT</option>
                        <option value="VENTURE">VENTURE</option>
                        <option value="MEDICAL">MEDICAL</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Assigned Grade</label>
                      <select
                        value={creditForm.loan_grade}
                        onChange={(e) => setCreditForm({...creditForm, loan_grade: e.target.value})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      >
                        {['A', 'B', 'C', 'D', 'E', 'F'].map(g => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Loan Amount ({currency === 'INR' ? '₹' : '$'})</label>
                      <input
                        type="number"
                        value={creditForm.loan_amnt}
                        onChange={(e) => setCreditForm({...creditForm, loan_amnt: parseFloat(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={creditForm.loan_int_rate}
                        onChange={(e) => setCreditForm({...creditForm, loan_int_rate: parseFloat(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Prior Default on File</label>
                      <select
                        value={creditForm.cb_person_default_on_file}
                        onChange={(e) => setCreditForm({...creditForm, cb_person_default_on_file: e.target.value})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      >
                        <option value="N">No (Clean History)</option>
                        <option value="Y">Yes (Delinquency Recorded)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#00C076] hover:bg-[#00A664] text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <Landmark className="h-4 w-4" />
                    <span>{loading ? 'Evaluating Model...' : 'Execute Credit Risk Evaluation'}</span>
                  </button>
                </form>

                <div className="lg:col-span-5 weave-card p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-3 mb-4">
                      Underwriting Result & Explainability
                    </h3>

                    {creditResult ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-xs text-slate-500 block mb-1">Default Risk Probability</span>
                          <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-black text-slate-900">
                              {(creditResult.default_probability * 100).toFixed(1)}%
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              creditResult.loan_status === 0
                                ? 'bg-emerald-50 text-[#00C076] border border-emerald-200'
                                : 'bg-rose-50 text-rose-600 border border-rose-200'
                            }`}>
                              {creditResult.risk_tier}
                            </span>
                          </div>
                          <p className="mt-2 text-xs font-bold text-slate-700">
                            Recommendation: {creditResult.recommendation}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-slate-700 block mb-2 font-mono uppercase tracking-wider">
                            Regulation B Adverse Action Factors
                          </span>
                          <div className="space-y-2">
                            {creditResult.contributing_factors.map((f, i) => (
                              <div key={i} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs flex items-center justify-between">
                                <span className="font-semibold text-slate-700">{f.factor}</span>
                                <span className={`text-[10px] font-bold ${f.impact === 'Negative' ? 'text-rose-600' : 'text-[#00C076]'}`}>
                                  {f.impact}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                        <Landmark className="h-8 w-8 text-slate-300 mx-auto" />
                        <p>Adjust applicant parameters on the left and submit to view instant default probability and adverse action breakdown.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                    Model: XGBoost v1.0.0 | ROC-AUC: 0.9443 | Test F1: 0.8222 | Zero Data Leakage
                  </div>
                </div>
              </div>

              {/* Recent Underwriting Queue Table */}
              <div className="weave-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Recent Underwriting Loan Applications
                    </h3>
                    <p className="text-[11px] text-slate-400">Real-time applications awaiting automated or underwriter decision</p>
                  </div>
                  <span className="text-xs font-bold text-slate-600">
                    {creditQueue.length} Active In Review
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono">
                        <th className="py-2.5 px-3">Application ID</th>
                        <th className="py-2.5 px-3">Applicant Name</th>
                        <th className="py-2.5 px-3">Loan Amount</th>
                        <th className="py-2.5 px-3">Intent</th>
                        <th className="py-2.5 px-3">Grade</th>
                        <th className="py-2.5 px-3">Default Risk</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Decision Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {creditQueue.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 font-mono font-semibold text-slate-600">{app.id}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{app.name}</td>
                          <td className="py-3 px-3 font-black text-slate-900">{formatAmount(app.amount)}</td>
                          <td className="py-3 px-3 text-slate-600">{app.intent}</td>
                          <td className="py-3 px-3 font-bold text-slate-800">{app.grade}</td>
                          <td className="py-3 px-3 font-mono">
                            <span className={app.prob > 0.3 ? 'text-rose-600 font-bold' : 'text-[#00C076] font-bold'}>
                              {(app.prob * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'Approved'
                                ? 'bg-emerald-50 text-[#00C076] border border-emerald-200'
                                : app.status === 'Declined'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setCreditQueue(creditQueue.map(q => q.id === app.id ? {...q, status: 'Approved'} : q));
                                showToast(`Approved loan ${app.id} for ${app.name}!`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#00C076] hover:bg-[#00A664] text-white text-[10px] font-bold shadow-xs transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setCreditQueue(creditQueue.map(q => q.id === app.id ? {...q, status: 'Declined'} : q));
                                showToast(`Declined loan ${app.id} (Adverse Action Notice Sent)`, 'danger');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold border border-rose-200 transition"
                            >
                              Decline
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 5. FRAUD DETECTION DASHBOARD */}
          {/* ================================================================ */}
          {activeTab === 'fraud' && (
            <div className="max-w-7xl mx-auto space-y-6 pt-2">
              {/* Top Title Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Fraud Transaction Detection Dashboard
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                      Realtime Surveillance Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Extreme class imbalance classification (0.17% fraud rate) with XGBoost, Isolation Forest, and Autoencoders.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700 shadow-xs">
                    PR-AUC: 0.8650 | Recall: 82.5% | Precision: 91.2%
                  </span>
                </div>
              </div>

              {/* 4 Top KPI Cards (Dynamic - Updates on CSV Upload) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: '24h Transactions Screened', val: fraudKpis.screened, change: fraudKpis.screenedChange, desc: 'Latency: 1.8ms / inference' },
                  { title: 'Intercepted Fraud Value', val: formatAmount(fraudKpis.interceptedVal), change: fraudKpis.interceptedChange, desc: 'Saved across flagged threats' },
                  { title: 'False Positive Rate (FPR)', val: fraudKpis.fpr, change: fraudKpis.fprChange, desc: 'Minimal user friction' },
                  { title: 'Precision-Recall AUC', val: fraudKpis.prAuc, change: fraudKpis.prAucChange, desc: 'Scale Pos Weight = 150' }
                ].map((kpi, i) => (
                  <div key={i} className="weave-card p-5 hover:border-rose-400 transition shadow-xs">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">{kpi.title}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{kpi.val}</span>
                      <span className="text-xs font-bold text-rose-600">{kpi.change}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">{kpi.desc}</span>
                  </div>
                ))}
              </div>

              {/* Visual Analytics Charts Row (Dynamic) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Hourly Volume vs Anomalies */}
                <div className="lg:col-span-8 weave-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                        Hourly Transaction Velocity & Anomalies
                      </h3>
                      <p className="text-[11px] text-slate-400">Total transaction throughput vs real-time blocked fraud attempts</p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-[#00C076]" /> Total Volume
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-rose-500" /> Blocked Anomalies
                      </span>
                    </div>
                  </div>

                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dynamicFraudHourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                        />
                        <Bar dataKey="screened" fill="#00C076" radius={[4, 4, 0, 0]} name="Screened" />
                        <Bar dataKey="anomalies" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Anomalies" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Fraud Vectors Donut */}
                <div className="lg:col-span-4 weave-card p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Fraud Attack Vectors
                    </h3>
                    <p className="text-[11px] text-slate-400">Distribution by compromise mechanism</p>
                  </div>

                  <div className="h-44 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dynamicFraudVectorData}
                          innerRadius={48}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {dynamicFraudVectorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center pointer-events-none">
                      <span className="text-[10px] text-slate-400 font-medium block">Top Vector</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {dynamicFraudVectorData[0]?.name || 'CNP'} {dynamicFraudVectorData[0]?.value || 46}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                    {dynamicFraudVectorData.map((a, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-slate-500">{a.name}</span>
                        <span className="font-bold text-slate-800">{a.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Single Screening + Batch CSV Suite */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form onSubmit={handleFraudPredict} className="lg:col-span-6 weave-card p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                        Single Transaction Screening
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Enter details — result auto-adds to Suspicious Queue below</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFraudForm({ Amount: 2450.00, V1: 0.12, V2: -0.45, V3: 0.88, V4: -0.21, V5: 0.15, merchant: 'Amazon India', location: 'Mumbai, IN' });
                          setFraudResult(null);
                          showToast("Loaded Legitimate Retail TXN preset!");
                        }}
                        className="text-[10px] bg-emerald-50 text-[#00C076] font-bold px-2 py-1 rounded-lg hover:bg-emerald-100"
                      >
                        Legitimate TXN
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFraudForm({ Amount: 85000.00, V1: -4.89, V2: 3.82, V3: -5.11, V4: 4.67, V5: -2.31, merchant: 'Offshore Wire Beneficiary', location: 'Moscow, RU (TOR)' });
                          setFraudResult(null);
                          showToast("Loaded Anomaly Preset data!");
                        }}
                        className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-100"
                      >
                        Anomaly Preset
                      </button>
                    </div>
                  </div>

                  {/* Merchant + Location Row */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1 font-medium">Merchant / Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Amazon India, ATM Withdrawal"
                        value={fraudForm.merchant || ''}
                        onChange={(e) => setFraudForm({...fraudForm, merchant: e.target.value})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:border-[#00C076] transition"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1 font-medium">Origin Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, IN or Dubai, UAE"
                        value={fraudForm.location || ''}
                        onChange={(e) => setFraudForm({...fraudForm, location: e.target.value})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:border-[#00C076] transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="col-span-2 sm:col-span-3">
                      <label className="text-slate-500 block mb-1">Transaction Amount ({currency === 'INR' ? '₹' : '$'})</label>
                      <input
                        type="number"
                        step="0.01"
                        value={fraudForm.Amount}
                        onChange={(e) => setFraudForm({...fraudForm, Amount: parseFloat(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-sm outline-none focus:border-[#00C076]"
                      />
                    </div>
                    {['V1', 'V2', 'V3', 'V4', 'V5'].map((v) => (
                      <div key={v}>
                        <label className="text-slate-500 block mb-1 font-mono">{v} <span className="text-[9px] text-slate-300">(PCA feature)</span></label>
                        <input
                          type="number"
                          step="0.01"
                          value={fraudForm[v]}
                          onChange={(e) => setFraudForm({...fraudForm, [v]: parseFloat(e.target.value) || 0})}
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono outline-none focus:border-[#00C076]"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>{loading ? 'Evaluating...' : 'Screen Transaction for Fraud'}</span>
                  </button>

                  {fraudResult && (
                    <div className={`p-4 rounded-xl border space-y-3 ${fraudResult.is_fraud || fraudResult.fraud_probability >= 0.3 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${fraudResult.is_fraud || fraudResult.fraud_probability >= 0.3 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span className={`text-xs font-bold uppercase tracking-wide ${fraudResult.is_fraud || fraudResult.fraud_probability >= 0.3 ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {fraudResult.anomaly_level}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${fraudResult.is_fraud || fraudResult.fraud_probability >= 0.3 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>
                          Added to Queue ✓
                        </span>
                      </div>

                      {/* Probability Bar */}
                      <div>
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-[10px] text-slate-500 font-mono">Fraud Probability</span>
                          <span className={`text-2xl font-black font-mono ${fraudResult.is_fraud || fraudResult.fraud_probability >= 0.3 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {(fraudResult.fraud_probability * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${fraudResult.fraud_probability >= 0.5 ? 'bg-rose-500' : fraudResult.fraud_probability >= 0.3 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(fraudResult.fraud_probability * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Action + Entry ID */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/50">
                        <span className="text-slate-600">Action: <strong>{fraudResult.recommended_action}</strong></span>
                        <span className="font-mono text-[10px] text-slate-400">TX-MAN-{String(singleTxCounter - 1).padStart(4, '0')}</span>
                      </div>
                    </div>
                  )}
                </form>

                <div className="lg:col-span-6 weave-card p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                        Batch CSV Transaction Upload & AI Scan
                      </h3>
                      <a
                        href="/sample_fraud_batch.csv"
                        download="sample_fraud_batch.csv"
                        className="text-[11px] text-[#00C076] hover:underline font-bold flex items-center gap-1"
                        title="Download prepared 150-row test dataset with 15 known fraud attacks"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download Sample CSV</span>
                      </a>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center bg-[#F8FAFC] hover:bg-slate-50 transition">
                      <FileSpreadsheet className="h-9 w-9 text-[#00C076] mx-auto mb-2" />
                      <div className="text-xs font-bold text-slate-800 mb-0.5">Upload Transaction Batch File (.csv)</div>
                      <p className="text-[11px] text-slate-400 mb-3.5">
                        High-throughput vectorized screening for 1,000+ to 280,000+ transactions
                      </p>

                      <input
                        type="file"
                        ref={batchCsvInputRef}
                        accept=".csv"
                        onChange={handleBatchFraudUpload}
                        className="hidden"
                      />

                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => batchCsvInputRef.current && batchCsvInputRef.current.click()}
                          disabled={loading}
                          className="py-2 px-4 rounded-xl bg-[#00C076] hover:bg-[#00A664] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>{loading ? 'Scanning File...' : 'Choose CSV File'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLoadSampleFraudBatch}
                          disabled={loading}
                          className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          <span>Quick Test 150-Row Batch</span>
                        </button>
                      </div>
                    </div>

                    {batchFraudResults && (
                      <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-500">File: <strong>{batchFraudResults.filename || 'Batch File'}</strong></span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#00C076] border border-emerald-200">
                            Dashboard Synced ✓
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1 border-t border-slate-200">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Scanned</span>
                            <span className="font-bold text-slate-800">{batchFraudResults.total_records_processed.toLocaleString()} TXNs</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Threats Blocked</span>
                            <span className="font-bold text-rose-600">{batchFraudResults.high_risk_flagged} anomalies</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Value Saved</span>
                            <span className="font-bold text-slate-900">{formatAmount(batchFraudResults.intercepted_fraud_value || 0)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Model: XGBoost + PCA Anomaly Radar</span>
                    <span>PR-AUC: 0.8650</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Suspicious Transaction Queue */}
              <div className="weave-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Real-Time Intercepted Suspicious Transactions
                    </h3>
                    <p className="text-[11px] text-slate-400">Transactions flagged by real-time PCA and anomaly detection engine</p>
                  </div>
                  <span className="text-xs font-bold text-rose-600">
                    {fraudQueue.filter(f => f.status === 'Blocked' || f.status === 'Flagged').length} Anomalies Requiring Action
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono">
                        <th className="py-2.5 px-3">TX ID</th>
                        <th className="py-2.5 px-3">Merchant</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Origin Location</th>
                        <th className="py-2.5 px-3">Fraud Probability</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Surveillance Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fraudQueue.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 font-mono font-semibold text-slate-600">{tx.id}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{tx.merchant}</td>
                          <td className="py-3 px-3 font-black text-slate-900">{formatAmount(tx.amount)}</td>
                          <td className="py-3 px-3 text-slate-600">{tx.location}</td>
                          <td className="py-3 px-3 font-mono">
                            <span className={tx.prob > 0.5 ? 'text-rose-600 font-bold' : 'text-[#00C076] font-bold'}>
                              {(tx.prob * 100).toFixed(1)}% ({tx.level})
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === 'Blocked'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : tx.status === 'Cleared'
                                ? 'bg-emerald-50 text-[#00C076] border border-emerald-200'
                                : 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setFraudQueue(fraudQueue.map(q => q.id === tx.id ? {...q, status: 'Blocked'} : q));
                                showToast(`Card blocked & TX ${tx.id} confirmed as Fraud!`, 'danger');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold shadow-xs transition"
                            >
                              Freeze Card
                            </button>
                            <button
                              onClick={() => {
                                setFraudQueue(fraudQueue.map(q => q.id === tx.id ? {...q, status: 'Cleared'} : q));
                                showToast(`Released hold on ${tx.id} (Cleared)!`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition"
                            >
                              Clear Hold
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 6. CUSTOMER CHURN & RETENTION DASHBOARD */}
          {/* ================================================================ */}
          {activeTab === 'churn' && (
            <div className="max-w-7xl mx-auto space-y-6 pt-2">
              {/* Top Title Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Customer Churn & Retention Dashboard
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#00C076] border border-emerald-200">
                      Retention Intelligence
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Random Forest ensemble estimating customer attrition risk with automated loyalty retention strategies.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700 shadow-xs">
                    Model: Random Forest | Test Accuracy: 86.8% | ROC-AUC: 0.865
                  </span>
                </div>
              </div>

              {/* 4 Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Overall Churn Propensity', val: '4.18%', change: '-1.2%', desc: 'Quarterly attrition trend' },
                  { title: 'At-Risk Portfolio Balance', val: formatAmount(34500000), change: '-18.5%', desc: '142 flagged accounts' },
                  { title: 'Automated Retention Success', val: '88.6%', change: '+5.4%', desc: 'Saved via targeted perks' },
                  { title: 'Avg Customer Lifetime Value', val: formatAmount(420000), change: '+9.1%', desc: 'High-balance depositors' }
                ].map((kpi, i) => (
                  <div key={i} className="weave-card p-5 hover:border-[#00C076] transition shadow-xs">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">{kpi.title}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{kpi.val}</span>
                      <span className="text-xs font-bold text-[#00C076]">{kpi.change}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">{kpi.desc}</span>
                  </div>
                ))}
              </div>

              {/* Visual Analytics Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Churn Rate by Balance */}
                <div className="lg:col-span-8 weave-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                        Attrition Propensity by Account Balance
                      </h3>
                      <p className="text-[11px] text-slate-400">Churn rate (%) across customer balance tiers in {currency === 'INR' ? '₹' : '$'}</p>
                    </div>
                    <span className="text-[11px] font-mono text-[#00C076] font-bold">Balance Elasticity</span>
                  </div>

                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={churnBalanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                          formatter={(value, name) => [`${value}%`, 'Churn Rate']}
                        />
                        <Bar dataKey="churnRate" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Customer Retention Health Donut */}
                <div className="lg:col-span-4 weave-card p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Customer Retention Health
                    </h3>
                    <p className="text-[11px] text-slate-400">Relationship stickiness breakdown</p>
                  </div>

                  <div className="h-44 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={churnSegmentData}
                          innerRadius={48}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {churnSegmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center pointer-events-none">
                      <span className="text-[10px] text-slate-400 font-medium block">Sticky Tier</span>
                      <span className="text-sm font-extrabold text-slate-900">62%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-[11px] pt-2 border-t border-slate-100">
                    {churnSegmentData.map((a, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-slate-500">{a.name}</span>
                        <span className="font-bold text-slate-800">{a.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Churn Simulator + Result Box */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form onSubmit={handleChurnPredict} className="lg:col-span-7 weave-card p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Customer Profile Attrition Calculator
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setChurnForm({
                            CreditScore: 780,
                            Geography: 'France',
                            Gender: 'Male',
                            Age: 32,
                            Tenure: 6,
                            Balance: 1200000,
                            NumOfProducts: 2,
                            HasCrCard: 1,
                            IsActiveMember: 1,
                            EstimatedSalary: 1800000
                          });
                          showToast("Loaded Loyal Multi-Product Customer preset!");
                        }}
                        className="text-[10px] bg-emerald-50 text-[#00C076] font-bold px-2 py-1 rounded-lg hover:bg-emerald-100"
                      >
                        Loyal (2+ Products)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setChurnForm({
                            CreditScore: 540,
                            Geography: 'Germany',
                            Gender: 'Female',
                            Age: 51,
                            Tenure: 1,
                            Balance: 1650000,
                            NumOfProducts: 1,
                            HasCrCard: 1,
                            IsActiveMember: 0,
                            EstimatedSalary: 950000
                          });
                          showToast("Loaded At-Risk Single-Product Senior preset!");
                        }}
                        className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-100"
                      >
                        High Attrition Risk
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Credit Score</label>
                      <input
                        type="number"
                        value={churnForm.CreditScore}
                        onChange={(e) => setChurnForm({...churnForm, CreditScore: parseInt(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Age</label>
                      <input
                        type="number"
                        value={churnForm.Age}
                        onChange={(e) => setChurnForm({...churnForm, Age: parseInt(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Balance ({currency === 'INR' ? '₹' : '$'})</label>
                      <input
                        type="number"
                        value={churnForm.Balance}
                        onChange={(e) => setChurnForm({...churnForm, Balance: parseFloat(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Number of Products</label>
                      <select
                        value={churnForm.NumOfProducts}
                        onChange={(e) => setChurnForm({...churnForm, NumOfProducts: parseInt(e.target.value) || 1})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      >
                        <option value="1">1 Product (Elevated Risk)</option>
                        <option value="2">2 Products (Sticky)</option>
                        <option value="3">3 Products (High Value)</option>
                        <option value="4">4 Products</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Active Member</label>
                      <select
                        value={churnForm.IsActiveMember}
                        onChange={(e) => setChurnForm({...churnForm, IsActiveMember: parseInt(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      >
                        <option value="1">Yes (Active Transactor)</option>
                        <option value="0">No (Dormant Account)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Tenure (Years)</label>
                      <input
                        type="number"
                        value={churnForm.Tenure}
                        onChange={(e) => setChurnForm({...churnForm, Tenure: parseInt(e.target.value) || 0})}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#00C076]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#00C076] hover:bg-[#00A664] text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>{loading ? 'Evaluating Model...' : 'Predict Churn Propensity & Recommend Strategy'}</span>
                  </button>
                </form>

                <div className="lg:col-span-5 weave-card p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-3 mb-4">
                      Retention Strategy & Drivers
                    </h3>
                    {churnResult ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-xs text-slate-500 block mb-1">Customer Attrition Likelihood</span>
                          <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-black text-slate-900">
                              {(churnResult.churn_probability * 100).toFixed(1)}%
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              churnResult.churn_probability < 0.25
                                ? 'bg-emerald-50 text-[#00C076] border border-emerald-200'
                                : 'bg-rose-50 text-rose-600 border border-rose-200'
                            }`}>
                              {churnResult.churn_risk}
                            </span>
                          </div>
                          <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100 text-xs">
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-0.5">
                              Recommended Retention Playbook
                            </span>
                            <p className="font-bold text-slate-800">
                              {churnResult.retention_strategy}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                        <Users className="h-8 w-8 text-slate-300 mx-auto" />
                        <p>Submit customer profile on the left to view attrition propensity and automated retention perks.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                    Model: Random Forest Ensemble | Features: Balance, Age, NumOfProducts, ActiveStatus
                  </div>
                </div>
              </div>

              {/* High-Risk Customer Directory & Retention Playbook Table */}
              <div className="weave-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      High-Risk Customer Directory & Retention Worklist
                    </h3>
                    <p className="text-[11px] text-slate-400">High-value depositors at risk of attrition requiring proactive intervention</p>
                  </div>
                  <span className="text-xs font-bold text-[#00C076]">
                    {churnQueue.length} Accounts Monitored
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono">
                        <th className="py-2.5 px-3">Customer ID</th>
                        <th className="py-2.5 px-3">Customer Name</th>
                        <th className="py-2.5 px-3">Age</th>
                        <th className="py-2.5 px-3">Deposit Balance</th>
                        <th className="py-2.5 px-3">Products</th>
                        <th className="py-2.5 px-3">Churn Risk</th>
                        <th className="py-2.5 px-3">Prescribed Retention Action</th>
                        <th className="py-2.5 px-3 text-right">Offer Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {churnQueue.map((cust) => (
                        <tr key={cust.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 font-mono font-semibold text-slate-600">{cust.id}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{cust.name}</td>
                          <td className="py-3 px-3 text-slate-600">{cust.age} yrs</td>
                          <td className="py-3 px-3 font-black text-slate-900">{formatAmount(cust.balance)}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cust.products === 1 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-[#00C076]'
                            }`}>
                              {cust.products} {cust.products === 1 ? 'Product (At Risk)' : 'Products (Sticky)'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <span className={cust.churnProb > 0.4 ? 'text-rose-600 font-bold' : 'text-[#00C076] font-bold'}>
                              {(cust.churnProb * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-medium">
                            {cust.recommendation}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setChurnQueue(churnQueue.map(q => q.id === cust.id ? {...q, offerSent: true} : q));
                                showToast(`Dispatched: "${cust.recommendation}" to ${cust.name}!`);
                              }}
                              disabled={cust.offerSent}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold shadow-xs transition ${
                                cust.offerSent
                                  ? 'bg-slate-100 text-slate-400 cursor-default'
                                  : 'bg-[#00C076] hover:bg-[#00A664] text-white'
                              }`}
                            >
                              {cust.offerSent ? 'Offer Sent ✓' : 'Deploy Retention Offer'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 7. MODEL LEADERBOARD */}
          {/* ================================================================ */}
          {activeTab === 'leaderboard' && (
            <div className="max-w-6xl mx-auto space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Machine Learning & Deep Learning Leaderboard
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Empirical benchmarks across 16 models (Classical ML, Deep ANN, 1D-CNN, and RNN/LSTM) on held-out test splits.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm text-xs">
                  {['all', 'credit_risk', 'fraud', 'churn', 'complaint'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setLeaderboardFilter(f)}
                      className={`px-3 py-1 rounded-lg font-bold transition uppercase text-[10px] ${
                        leaderboardFilter === f ? 'bg-[#00C076] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="weave-card p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                        <th className="py-3 px-3">Module</th>
                        <th className="py-3 px-3">Architecture</th>
                        <th className="py-3 px-3">F1-Score</th>
                        <th className="py-3 px-3">ROC-AUC</th>
                        <th className="py-3 px-3">PR-AUC</th>
                        <th className="py-3 px-3">Precision</th>
                        <th className="py-3 px-3">Recall</th>
                        <th className="py-3 px-3">Latency</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaderboard
                        .filter(m => leaderboardFilter === 'all' || m.module === leaderboardFilter)
                        .map((m, idx) => {
                          const isProd =
                            (m.module === 'credit_risk' && m.model_name === 'XGBoost') ||
                            (m.module === 'fraud' && m.model_name === 'XGBoost') ||
                            (m.module === 'churn' && m.model_name === 'Random Forest') ||
                            (m.module === 'complaint' && m.model_name.includes('Linear SVM'));
                          return (
                            <tr key={idx} className={`hover:bg-slate-50 ${isProd ? 'bg-emerald-50/40' : ''}`}>
                              <td className="py-3 px-3 font-semibold uppercase text-slate-600">{m.module}</td>
                              <td className="py-3 px-3 text-slate-900 font-sans font-bold flex items-center gap-1.5">
                                {m.model_name}
                                {m.model_name.includes('ANN') || m.model_name.includes('Deep') ? (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono">
                                    DL / ANN
                                  </span>
                                ) : null}
                              </td>
                              <td className="py-3 px-3 text-[#00C076] font-bold">{m.f1}</td>
                              <td className="py-3 px-3 text-blue-600 font-semibold">{m.roc_auc || 'N/A'}</td>
                              <td className="py-3 px-3 text-indigo-600">{m.pr_auc || 'N/A'}</td>
                              <td className="py-3 px-3 text-slate-500">{m.precision}</td>
                              <td className="py-3 px-3 text-slate-500">{m.recall}</td>
                              <td className="py-3 px-3 text-slate-400">{m.inference_latency_ms}ms</td>
                              <td className="py-3 px-3">
                                {isProd ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#00C076] border border-emerald-200 text-[10px] font-bold">
                                    PRODUCTION
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[10px]">BASELINE</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 8. CARD & BUDGET VIEW (Matching User Screenshot 5) */}
          {/* ================================================================ */}
          {activeTab === 'cardbudget' && (
            <div className="max-w-6xl mx-auto space-y-6 pt-2">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Card & Budget Management</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Card issuance, multi-currency wallets, spending limits and security controls for <strong>{activeProfile.name}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Black Debit Card */}
                <div className={`credit-card-sheen p-6 rounded-2xl text-white shadow-xl flex flex-col justify-between h-56 transition ${
                  cardFrozen ? 'opacity-75 ring-2 ring-rose-500' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold tracking-wider text-slate-200">Universal Bank</span>
                    <button
                      onClick={() => {
                        setCardFrozen(!cardFrozen);
                        showToast(cardFrozen ? "Card unfrozen!" : "Card frozen for security!", cardFrozen ? 'success' : 'warning');
                      }}
                      className={`text-[9px] font-mono px-2.5 py-1 rounded-full font-bold transition ${
                        cardFrozen ? 'bg-rose-500 text-white' : 'bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50'
                      }`}
                    >
                      {cardFrozen ? 'FROZEN' : 'ACTIVE'}
                    </button>
                  </div>
                  <div className="h-8 w-10 rounded-md bg-amber-400/90 border border-amber-300 shadow-inner flex items-center justify-center">
                    <div className="w-7 h-5 border border-amber-600/40 rounded-sm" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-base tracking-widest text-slate-100 font-bold">
                        {showCardNumber ? activeProfile.cardNum : "•••• •••• •••• 0000"}
                      </span>
                      <button onClick={() => setShowCardNumber(!showCardNumber)}>
                        {showCardNumber ? <EyeOff className="h-3.5 w-3.5 text-slate-400" /> : <Eye className="h-3.5 w-3.5 text-slate-400" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                      <span>{activeProfile.cardHolder}</span>
                      <span className="font-mono">EXP 08/29</span>
                    </div>
                  </div>
                </div>

                {/* Spending Limits (Matching User Image) */}
                <div className="weave-card p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      MONTHLY CARD LIMIT
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      limitUtilizationPct > 90 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-[#00C076]'
                    }`}>
                      {limitUtilizationPct}% Used
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    {formatAmount(currentCardLimit)}
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          limitUtilizationPct > 90
                            ? 'bg-rose-500'
                            : limitUtilizationPct > 75
                            ? 'bg-amber-500'
                            : 'bg-[#00C076]'
                        }`}
                        style={{ width: `${limitUtilizationPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Spent: {formatAmount(currentCardSpent)}</span>
                      <span>Remaining: {formatAmount(currentRemaining)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenAdjustLimit}
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-[#00C076] hover:text-[#00C076] transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Sliders className="h-3.5 w-3.5 text-slate-400" />
                    <span>Adjust Limit</span>
                  </button>
                </div>

                {/* Security & Controls (Matching User Image 5 Right) */}
                <div className="weave-card p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-3">
                    Security & Controls
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Online Transactions</span>
                      <span className="text-[#00C076] font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">International Payments</span>
                      <span className="text-[#00C076] font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Contactless NFC</span>
                      <span className="text-[#00C076] font-bold">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 10. AUDIT & GOVERNANCE */}
          {/* ================================================================ */}
          {activeTab === 'audit' && (
            <div className="max-w-6xl mx-auto space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">Documents & Regulatory Audit Trail</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Immutable record of user actions, risk evaluations, and AI agent tool invocations with automated PII redaction.
                  </p>
                </div>
                <button
                  onClick={() => showToast("Audit trail exported for regulatory compliance review!")}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Audit Log</span>
                </button>
              </div>

              <div className="weave-card p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Actor ID</th>
                        <th className="py-2.5 px-3">Action Type</th>
                        <th className="py-2.5 px-3">Target</th>
                        <th className="py-2.5 px-3">Outcome</th>
                        <th className="py-2.5 px-3">Metadata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(auditLogs.length > 0 ? auditLogs : [
                        { timestamp: '2026-10-31 20:30:15', actor_id: activeProfile.name.toLowerCase().replace(/\s+/g, '_'), action: 'TRANSACTION_RECONCILIATION', resource_type: 'card_payment', outcome: 'COMPLETED', details: { merchant: 'Air India Flights', amount: 185000 } },
                        { timestamp: '2026-10-31 20:15:22', actor_id: 'fraud_engine', action: 'ANOMALY_SCREENING', resource_type: 'wire_transfer', outcome: 'BLOCKED', details: { risk_score: 0.96 } },
                        { timestamp: '2026-10-31 19:45:10', actor_id: 'underwriter', action: 'CREDIT_RISK_SCORE', resource_type: 'loan_app', outcome: 'APPROVED', details: { tier: 'Prime' } }
                      ]).map((log, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-500">{log.timestamp}</td>
                          <td className="py-2.5 px-3 text-[#00C076] font-bold">{log.actor_id}</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">{log.action}</td>
                          <td className="py-2.5 px-3 text-slate-500">{log.resource_type}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#00C076] border border-emerald-200 text-[10px] font-bold">
                              {log.outcome}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">
                            {JSON.stringify(log.details)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
