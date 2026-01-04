import React, { useState } from 'react';
import { useApp } from '../store';
import { User, Mail, Phone, Building2, MapPin, Edit2, Save, X, Key, Copy, Trash2, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateUserProfile, generateApiKey, deleteApiKey } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    company: user?.company || '',
    address: user?.address || '',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-pars-bg dark:bg-stone-950 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-pars-primary dark:text-white mb-4">Please log in to view your profile</h2>
        <button onClick={() => navigate('/')} className="text-pars-cta font-bold hover:underline">Go Home</button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyName.trim()) {
      generateApiKey(newKeyName);
      setNewKeyName('');
      setIsGeneratingKey(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-pars-bg dark:bg-stone-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-stone-800 overflow-hidden ring-4 ring-white dark:ring-stone-900 shadow-xl">
              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-stone-900" title="Active"></div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-pars-primary dark:text-white">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-pars-cta/10 text-pars-cta text-xs font-bold rounded-full uppercase tracking-wider">{user.role}</span>
              <span className="text-xs text-gray-400">Member since {user.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-stone-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-pars-cta" /> Personal Information
            </h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`text-sm font-bold flex items-center gap-2 transition-colors ${isEditing ? 'text-red-500 hover:text-red-600' : 'text-pars-cta hover:text-orange-700'}`}
            >
              {isEditing ? <><X className="h-4 w-4" /> Cancel</> : <><Edit2 className="h-4 w-4" /> Edit Profile</>}
            </button>
          </div>
          
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-pars-cta outline-none transition"
                    />
                  ) : (
                    <div className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                  <div className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white opacity-70">
                    <Mail className="h-4 w-4 text-gray-400" /> {user.email}
                  </div>
                  {isEditing && <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-pars-cta outline-none transition"
                    />
                  ) : (
                    <div className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" /> {user.phone || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Company</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="Organization Name"
                      className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-pars-cta outline-none transition"
                    />
                  ) : (
                    <div className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" /> {user.company || 'Not set'}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Billing Address</label>
                  {isEditing ? (
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Street, City, Country..."
                      rows={2}
                      className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-pars-cta outline-none transition resize-none"
                    />
                  ) : (
                    <div className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" /> {user.address || 'Not set'}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end animate-fade-in">
                  <button type="submit" className="bg-pars-cta text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Dropshipping API Keys Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                <Key className="h-5 w-5 text-pars-cta" /> Dropshipping API
              </h2>
              <p className="text-gray-400 text-sm">Manage API keys for integrating AloTelcom services into your platform.</p>
            </div>
            {!isGeneratingKey && (
              <button 
                onClick={() => setIsGeneratingKey(true)}
                className="bg-pars-cta text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg flex items-center gap-2 self-start md:self-auto"
              >
                <Plus className="h-4 w-4" /> Generate Key
              </button>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {isGeneratingKey && (
              <div className="mb-8 bg-gray-50 dark:bg-stone-800 p-6 rounded-2xl border border-gray-200 dark:border-stone-700 animate-fade-in">
                <form onSubmit={handleGenerateKey} className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-grow w-full">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Key Name / Identifier</label>
                    <input 
                      type="text" 
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. My Travel App Production"
                      className="w-full bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-pars-cta outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                      type="button" 
                      onClick={() => setIsGeneratingKey(false)}
                      className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 dark:border-stone-600 rounded-xl text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-stone-700 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!newKeyName.trim()}
                      className="flex-1 sm:flex-none bg-pars-cta text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            )}

            {user.apiKeys && user.apiKeys.length > 0 ? (
              <div className="space-y-4">
                {user.apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="bg-gray-50 dark:bg-stone-800 p-4 rounded-xl border border-gray-100 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">{apiKey.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-200 dark:bg-stone-700 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="font-mono text-sm text-gray-500 dark:text-gray-400 break-all">{apiKey.key}</div>
                      <div className="text-xs text-gray-400 mt-1">Created: {apiKey.createdAt}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-pars-cta dark:hover:text-white transition-colors"
                        title="Copy Key"
                      >
                        {copiedKeyId === apiKey.id ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                      </button>
                      <button 
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Revoke Key"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-stone-800 rounded-xl">
                <div className="w-16 h-16 bg-gray-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Key className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No API Keys Found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                  Generate an API key to start using AloTelcom's dropshipping capabilities.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;