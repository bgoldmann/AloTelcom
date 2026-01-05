import React, { useState } from 'react';
import { 
  LayoutDashboard, Key, Search as SearchIcon, Palette, Save, 
  CreditCard, Globe, BarChart3, Lock, Eye, EyeOff, CheckCircle, Shield, Phone, Mic,
  Users, ShoppingBag, MoreHorizontal, Trash2, Ban, CheckCircle2, Filter, Package,
  TrendingUp, Settings, Mail, Download, Edit, ExternalLink, Calendar, DollarSign,
  Activity, AlertCircle, RefreshCw, FileText, Plus, Copy, X
} from 'lucide-react';
import { useApp } from '../store';
import { User, Order } from '../types';

type AdminTab = 'dashboard' | 'users' | 'orders' | 'products' | 'analytics' | 'integrations' | 'seo' | 'theme' | 'settings';

const Admin: React.FC = () => {
  const { 
    adminConfig, updateAdminConfig, 
    users, updateUserStatus, deleteUser,
    allOrders
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Search/Filter states
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'expired' | 'pending'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Local state for forms (initialized with store data)
  const [formData, setFormData] = useState(adminConfig);

  const handleInputChange = (section: keyof typeof formData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      updateAdminConfig(formData);
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  // Filter Logic
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = allOrders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
      (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()));
    
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full pt-20">
        <div className="p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Admin Console</h2>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-pars-cta text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'users' ? 'bg-pars-cta text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Users className="h-5 w-5" /> User Manager
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'orders' ? 'bg-pars-cta text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <ShoppingBag className="h-5 w-5" /> Orders
            </button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'products' ? 'bg-pars-cta text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Package className="h-5 w-5" /> Products
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-pars-cta text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <BarChart3 className="h-5 w-5" /> Analytics
            </button>
            <div className="h-px bg-gray-100 my-2"></div>
            <button onClick={() => setActiveTab('integrations')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'integrations' ? 'bg-pars-cta text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Key className="h-5 w-5" /> Integrations
            </button>
            <button onClick={() => setActiveTab('seo')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'seo' ? 'bg-pars-cta text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <SearchIcon className="h-5 w-5" /> SEO & Meta
            </button>
            <button onClick={() => setActiveTab('theme')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'theme' ? 'bg-pars-cta text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Palette className="h-5 w-5" /> Appearance
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'settings' ? 'bg-pars-cta text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Settings className="h-5 w-5" /> Settings
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-24 max-w-7xl">
        
        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dash' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'integrations', icon: Key, label: 'API' },
            { id: 'theme', icon: Palette, label: 'Theme' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-pars-cta text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in-up">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
              {activeTab === 'integrations' ? 'API Integrations' : activeTab === 'seo' ? 'SEO Settings' : activeTab}
            </h1>
            
            {/* Save button only for config tabs */}
            {['integrations', 'seo', 'theme', 'dashboard', 'settings'].includes(activeTab) && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : <><Save className="h-5 w-5" /> Save Config</>}
              </button>
            )}
          </div>

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="h-6 w-6" /></div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Users</p>
                      <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl"><ShoppingBag className="h-6 w-6" /></div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                      <h3 className="text-2xl font-bold text-gray-900">{allOrders.length}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><CreditCard className="h-6 w-6" /></div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Revenue (Est)</p>
                      <h3 className="text-2xl font-bold text-gray-900">${allOrders.reduce((sum, o) => sum + o.plan.price, 0).toFixed(2)}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Activity className="h-6 w-6" /></div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Active Services</p>
                      <h3 className="text-2xl font-bold text-gray-900">{allOrders.filter(o => o.status === 'active').length}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp className="h-6 w-6" /></div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Conversion Rate</p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {users.length > 0 ? ((allOrders.length / users.length) * 100).toFixed(1) : '0.0'}%
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><DollarSign className="h-6 w-6" /></div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Avg Order Value</p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        ${allOrders.length > 0 ? (allOrders.reduce((sum, o) => sum + o.plan.price, 0) / allOrders.length).toFixed(2) : '0.00'}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                    <input 
                      type="text" 
                      value={formData.general.siteName}
                      onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input 
                      type="email" 
                      value={formData.general.supportEmail}
                      onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New order received</p>
                      <p className="text-xs text-gray-500">{allOrders.length > 0 ? allOrders[0].id : 'No orders yet'}</p>
                    </div>
                    <span className="text-xs text-gray-500">{allOrders.length > 0 ? allOrders[0].date : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New user registered</p>
                      <p className="text-xs text-gray-500">{users.length > 0 ? users[users.length - 1].name : 'No users yet'}</p>
                    </div>
                    <span className="text-xs text-gray-500">{users.length > 0 ? users[users.length - 1].joinedDate : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative max-w-sm w-full">
                     <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                     <input 
                       type="text" 
                       placeholder="Search users by name or email..." 
                       value={userSearch}
                       onChange={(e) => setUserSearch(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pars-cta/50"
                     />
                  </div>
                  <div className="text-sm text-gray-500">
                     Showing {filteredUsers.length} users
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                       <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Joined</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {filteredUsers.map(user => (
                         <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                     <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-full h-full object-cover" loading="lazy" />
                                  </div>
                                  <div>
                                     <div className="font-bold text-gray-900">{user.name}</div>
                                     <div className="text-gray-500 text-xs">{user.email}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                 user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                 user.role === 'support' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                               }`}>
                                 {user.role}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                 user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                               }`}>
                                 {user.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                               {user.joinedDate}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View/Edit User"
                                  >
                                     <Eye className="h-4 w-4" />
                                  </button>
                                  {user.status === 'active' ? (
                                    <button 
                                      onClick={() => updateUserStatus(user.id, 'suspended')}
                                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Suspend User"
                                    >
                                       <Ban className="h-4 w-4" />
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => updateUserStatus(user.id, 'active')}
                                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Activate User"
                                    >
                                       <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => deleteUser(user.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete User"
                                  >
                                     <Trash2 className="h-4 w-4" />
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                       {filteredUsers.length === 0 && (
                          <tr>
                             <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                No users found matching your search.
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow md:w-64">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search Order ID, Email..." 
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pars-cta/50"
                        />
                      </div>
                      <div className="relative">
                        <select 
                          value={orderFilter}
                          onChange={(e) => setOrderFilter(e.target.value as any)}
                          className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pars-cta/50 appearance-none bg-white"
                        >
                           <option value="all">All Status</option>
                           <option value="active">Active</option>
                           <option value="expired">Expired</option>
                           <option value="pending">Pending</option>
                        </select>
                        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                   </div>
                </div>

                <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                       <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {filteredOrders.map(order => (
                         <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}>
                            <td className="px-6 py-4 font-mono font-medium text-gray-600">
                               {order.id}
                            </td>
                            <td className="px-6 py-4">
                               <div className="font-bold text-gray-900">{order.customerName || 'Guest'}</div>
                               <div className="text-gray-500 text-xs">{order.customerEmail}</div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <span className="text-lg">{order.plan.flag}</span>
                                  <div>
                                     <div className="font-medium text-gray-900">{order.plan.country}</div>
                                     <div className="text-xs text-gray-500">{order.plan.data} • {order.plan.type.toUpperCase()}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900">
                               ${order.plan.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                               {order.date}
                            </td>
                            <td className="px-6 py-4">
                               <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                 order.status === 'active' ? 'bg-green-100 text-green-700' : 
                                 order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                               }`}>
                                 {order.status}
                               </span>
                            </td>
                         </tr>
                       ))}
                       {filteredOrders.length === 0 && (
                          <tr>
                             <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                No orders found.
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
               </div>
             </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              {/* Airalo */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Globe className="h-32 w-32" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Airalo eSIM API</h3>
                <p className="text-sm text-gray-500 mb-6">Configure connection to Airalo for inventory and ordering.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                    <input 
                      type="text" 
                      value={formData.apiKeys.airaloClientId}
                      onChange={(e) => handleInputChange('apiKeys', 'airaloClientId', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none font-mono text-sm"
                      placeholder="Enter Client ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        value={formData.apiKeys.airaloClientSecret}
                        onChange={(e) => handleInputChange('apiKeys', 'airaloClientSecret', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none font-mono text-sm"
                        placeholder="••••••••••••••••"
                      />
                      <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* VPN & Voice Services */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* VPN Provider */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5"><Shield className="h-24 w-24" /></div>
                   <h3 className="text-lg font-bold text-gray-900 mb-1">VPN Provider</h3>
                   <p className="text-sm text-gray-500 mb-6">API Key for VPN provisioning (e.g. Nord Security).</p>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          value={formData.apiKeys.vpnApiKey}
                          onChange={(e) => handleInputChange('apiKeys', 'vpnApiKey', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none font-mono text-sm"
                          placeholder="vpn_live_..."
                        />
                        <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                   </div>
                </div>

                {/* Voice & Number Provider */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5"><Phone className="h-24 w-24" /></div>
                   <h3 className="text-lg font-bold text-gray-900 mb-1">Voice & Numbers</h3>
                   <p className="text-sm text-gray-500 mb-6">Twilio or similar provider credentials.</p>
                   <div className="space-y-4 relative z-10">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voice API Key (VOIP)</label>
                        <input 
                          type="password" 
                          value={formData.apiKeys.voiceApiKey}
                          onChange={(e) => handleInputChange('apiKeys', 'voiceApiKey', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none font-mono text-sm"
                          placeholder="SK..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number Provisioning Key</label>
                        <input 
                          type="password" 
                          value={formData.apiKeys.numberApiKey}
                          onChange={(e) => handleInputChange('apiKeys', 'numberApiKey', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none font-mono text-sm"
                          placeholder="SK..."
                        />
                      </div>
                   </div>
                </div>
              </div>

              {/* Stripe */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><CreditCard className="h-32 w-32" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Stripe Payments</h3>
                <p className="text-sm text-gray-500 mb-6">Manage payment gateway credentials.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publishable Key</label>
                    <input 
                      type="text" 
                      value={formData.apiKeys.stripePublicKey}
                      onChange={(e) => handleInputChange('apiKeys', 'stripePublicKey', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none font-mono text-sm"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        value={formData.apiKeys.stripeSecretKey}
                        onChange={(e) => handleInputChange('apiKeys', 'stripeSecretKey', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none font-mono text-sm"
                        placeholder="sk_test_..."
                      />
                      <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Google */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Google Services</h3>
                <p className="text-sm text-gray-500 mb-6">Analytics and Adwords (Ads) configuration.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Ads ID (Adwear)</label>
                    <input 
                      type="text" 
                      value={formData.apiKeys.googleAdsId}
                      onChange={(e) => handleInputChange('apiKeys', 'googleAdsId', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none font-mono text-sm"
                      placeholder="AW-XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                    <input 
                      type="text" 
                      value={formData.apiKeys.googleAnalyticsId}
                      onChange={(e) => handleInputChange('apiKeys', 'googleAnalyticsId', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none font-mono text-sm"
                      placeholder="G-XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Search Engine Optimization</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input 
                    type="text" 
                    value={formData.seo.metaTitle}
                    onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Recommended length: 50-60 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea 
                    value={formData.seo.metaDescription}
                    onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Recommended length: 150-160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <input 
                    type="text" 
                    value={formData.seo.keywords}
                    onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pars-cta outline-none"
                    placeholder="travel, esim, data..."
                  />
                  <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                </div>
              </div>

              {/* Preview Snippet */}
              <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Google Search Preview</h4>
                <div className="font-sans">
                   <div className="text-sm text-gray-800 mb-0.5 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-gray-300"></span>
                      parstelcom.com
                   </div>
                   <div className="text-xl text-blue-800 font-medium hover:underline cursor-pointer mb-1">
                      {formData.seo.metaTitle}
                   </div>
                   <div className="text-sm text-gray-600">
                      {formData.seo.metaDescription}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* THEME TAB */}
          {activeTab === 'theme' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Color Setup</h3>
              <p className="text-sm text-gray-500 mb-8">Customize the look and feel of your app. These changes reflect in real-time.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Primary Color */}
                <div className="space-y-3">
                   <label className="block text-sm font-bold text-gray-700">Primary Color</label>
                   <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg shadow-sm border border-gray-200" style={{ backgroundColor: formData.theme.primaryColor }}></div>
                      <input 
                        type="text" 
                        value={formData.theme.primaryColor}
                        onChange={(e) => handleInputChange('theme', 'primaryColor', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 uppercase font-mono"
                      />
                   </div>
                   <input 
                      type="color" 
                      value={formData.theme.primaryColor}
                      onChange={(e) => handleInputChange('theme', 'primaryColor', e.target.value)}
                      className="w-full h-8 cursor-pointer rounded-lg"
                   />
                </div>

                {/* CTA Color */}
                <div className="space-y-3">
                   <label className="block text-sm font-bold text-gray-700">Button/CTA Color</label>
                   <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg shadow-sm border border-gray-200" style={{ backgroundColor: formData.theme.ctaColor }}></div>
                      <input 
                        type="text" 
                        value={formData.theme.ctaColor}
                        onChange={(e) => handleInputChange('theme', 'ctaColor', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 uppercase font-mono"
                      />
                   </div>
                   <input 
                      type="color" 
                      value={formData.theme.ctaColor}
                      onChange={(e) => handleInputChange('theme', 'ctaColor', e.target.value)}
                      className="w-full h-8 cursor-pointer rounded-lg"
                   />
                </div>

                {/* Accent Color */}
                <div className="space-y-3">
                   <label className="block text-sm font-bold text-gray-700">Accent Color</label>
                   <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg shadow-sm border border-gray-200" style={{ backgroundColor: formData.theme.accentColor }}></div>
                      <input 
                        type="text" 
                        value={formData.theme.accentColor}
                        onChange={(e) => handleInputChange('theme', 'accentColor', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 uppercase font-mono"
                      />
                   </div>
                   <input 
                      type="color" 
                      value={formData.theme.accentColor}
                      onChange={(e) => handleInputChange('theme', 'accentColor', e.target.value)}
                      className="w-full h-8 cursor-pointer rounded-lg"
                   />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in-up z-50">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="font-bold">Configuration Saved Successfully</span>
        </div>
      )}
    </div>
  );
};

export default Admin;