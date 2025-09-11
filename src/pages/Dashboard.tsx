import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Send, 
  Plus, 
  Eye, 
  EyeOff, 
  CreditCard, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownLeft,
  MoreHorizontal,
  Bell,
  Settings,
  User,
  Search
} from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { Layout } from '../components/Layout/layout';

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const transactions = [
    {
      id: 1,
      type: 'expense',
      merchant: 'Starbucks Coffee',
      category: 'Food & Dining',
      amount: -5.25,
      date: 'Today, 2:30 PM',
      icon: '☕',
      status: 'completed'
    },
    {
      id: 2,
      type: 'transfer',
      merchant: 'Savings Transfer',
      category: 'Transfer',
      amount: -250.00,
      date: 'Today, 10:15 AM',
      icon: '💰',
      status: 'completed'
    },
    {
      id: 3,
      type: 'income',
      merchant: 'Acme Corp Payroll',
      category: 'Salary',
      amount: 3000.00,
      date: 'Yesterday, 9:00 AM',
      icon: '💼',
      status: 'completed'
    },
    {
      id: 4,
      type: 'expense',
      merchant: 'Amazon Purchase',
      category: 'Shopping',
      amount: -89.99,
      date: 'Dec 6, 3:45 PM',
      icon: '📦',
      status: 'completed'
    }
  ];

  const accounts = [
    { name: 'Checking', balance: 2450.00, change: +125.50, type: 'checking' },
    { name: 'Savings', balance: 12750.00, change: +250.00, type: 'savings' },
    { name: 'Investment', balance: 8430.25, change: -45.75, type: 'investment' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Good morning, Sarah</h2>
          <p className="text-slate-600">Here's what's happening with your money today.</p>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {accounts.map((account, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{account.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-2xl font-bold text-slate-800">
                      {balanceVisible ? formatCurrency(account.balance) : '••••••'}
                    </p>
                    <button 
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${
                  account.type === 'checking' ? 'bg-blue-100 text-blue-600' :
                  account.type === 'savings' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {account.type === 'checking' ? <CreditCard className="w-5 h-5" /> :
                   account.type === 'savings' ? <PiggyBank className="w-5 h-5" /> :
                   <TrendingUp className="w-5 h-5" />}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {account.change > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm font-medium">+{formatCurrency(account.change)}</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-500 text-sm font-medium">-{formatCurrency(account.change)}</span>
                  </>
                )}
                <span className="text-slate-500 text-sm">this week</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="text-sm border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 3 months</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-lg">
                        {transaction.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-800 font-medium truncate">{transaction.merchant}</p>
                            <p className="text-slate-500 text-sm">{transaction.category}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-slate-800'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-slate-500 text-sm">{transaction.date}</p>
                          </div>
                        </div>
                      </div>
                      
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-slate-100 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  View all transactions
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions & Insights */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                  <Send className="w-4 h-4" />
                  <span>Send Money</span>
                </button>
                
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Funds</span>
                </button>
                
                <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                  <TrendingUp className="w-4 h-4" />
                  <span>Invest</span>
                </button>
              </div>
            </div>

            {/* Spending Insights */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Spent</span>
                  <span className="font-semibold text-slate-800">$345.24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Budget Remaining</span>
                  <span className="font-semibold text-green-600">$654.76</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '34.5%'}}></div>
                </div>
                <p className="text-xs text-slate-500">You're on track with your spending this week</p>
              </div>
            </div>

            {/* Goals */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Savings Goal</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Vacation Fund</span>
                  <span className="font-semibold text-slate-800">$2,450 / $5,000</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full" style={{width: '49%'}}></div>
                </div>
                <p className="text-xs text-slate-500">49% complete • $2,550 to go</p>
                <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Add to Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </Layout>
  );
};

export default Dashboard;