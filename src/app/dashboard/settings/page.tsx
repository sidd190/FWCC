"use client";

import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data & Privacy', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-[#0B874F] mb-2 flex items-center">
          <Settings className="w-8 h-8 mr-3" />
          Settings
        </h1>
        <p className="text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-[#0B874F]/20 text-[#0B874F] border border-[#0B874F]/50'
                        : 'text-gray-300 hover:bg-[#0B874F]/10 hover:text-[#0B874F]'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue="Admin User"
                      className="w-full px-4 py-2 bg-black/50 border border-[#0B874F]/30 rounded-lg text-white focus:outline-none focus:border-[#0B874F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      defaultValue="Full-stack developer passionate about open source"
                      className="w-full px-4 py-2 bg-black/50 border border-[#0B874F]/30 rounded-lg text-white focus:outline-none focus:border-[#0B874F] resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Email Notifications</div>
                      <div className="text-gray-400 text-sm">Receive updates via email</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Push Notifications</div>
                      <div className="text-gray-400 text-sm">Browser notifications for important updates</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <button className="w-full p-4 bg-[#0B874F]/10 border border-[#0B874F]/30 text-[#0B874F] rounded-lg hover:bg-[#0B874F]/20 transition-colors text-left">
                    <div className="font-medium">Change Password</div>
                    <div className="text-sm opacity-80">Update your account password</div>
                  </button>
                  <button className="w-full p-4 bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] rounded-lg hover:bg-[#F5A623]/20 transition-colors text-left">
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm opacity-80">Add an extra layer of security</div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Data & Privacy</h2>
                <div className="space-y-4">
                  <button className="w-full p-4 bg-[#9B59B6]/10 border border-[#9B59B6]/30 text-[#9B59B6] rounded-lg hover:bg-[#9B59B6]/20 transition-colors text-left">
                    <div className="font-medium">Export Data</div>
                    <div className="text-sm opacity-80">Download your account data</div>
                  </button>
                  <button className="w-full p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-left">
                    <div className="font-medium">Delete Account</div>
                    <div className="text-sm opacity-80">Permanently delete your account</div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Theme</label>
                    <select className="w-full px-4 py-2 bg-black/50 border border-[#0B874F]/30 rounded-lg text-white focus:outline-none focus:border-[#0B874F]">
                      <option value="dark">Dark (Current)</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-[#0B874F]/30">
              <button className="px-6 py-2 bg-[#0B874F] text-black font-medium rounded-lg hover:bg-[#0B874F]/80 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}