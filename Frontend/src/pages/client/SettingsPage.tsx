import { useState } from "react";
import { User, Mail, Phone, MapPin, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  return (
    <div className="flex flex-col animate-fade-in pb-10">
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-tight text-[#0F172A] leading-tight">
          Settings
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full lg:w-[240px] shrink-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap lg:whitespace-normal text-left ${activeTab === "profile" ? "bg-[#F0FDF4] text-[#16A34A] font-semibold" : "text-[#475569] hover:bg-[#F8FAFC]"}`}
            >
              <User size={18} />
              <span className="text-[14px]">Profile Details</span>
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap lg:whitespace-normal text-left ${activeTab === "security" ? "bg-[#F0FDF4] text-[#16A34A] font-semibold" : "text-[#475569] hover:bg-[#F8FAFC]"}`}
            >
              <Shield size={18} />
              <span className="text-[14px]">Security & Password</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-[24px] border border-[#F1F5F9] shadow-sm p-6 sm:p-8">
          
          {activeTab === "profile" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              
              <div className="flex items-center gap-6 pb-8 border-b border-[#F1F5F9]">
                <div className="w-[80px] h-[80px] rounded-full bg-[#E2E8F0] flex items-center justify-center text-[28px] font-bold text-[#64748B]">
                  JD
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#0F172A] mb-1">John Doe</h3>
                  <p className="text-[14px] text-[#64748B] mb-3">Client Account</p>
                  <div className="flex gap-3">
                    <button className="text-[13px] font-semibold bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] px-4 py-1.5 rounded-full hover:bg-[#F1F5F9] transition-colors">
                      Change Avatar
                    </button>
                    <button className="text-[13px] font-semibold text-red-500 px-4 py-1.5 rounded-full hover:bg-red-50 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-semibold text-[#475569] mb-2">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input type="text" defaultValue="John Doe" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14px] font-medium text-[#0F172A] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#475569] mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input type="email" defaultValue="johndoe@example.com" disabled className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-[14px] font-medium text-[#64748B] cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#475569] mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input type="tel" defaultValue="+44 7700 900077" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14px] font-medium text-[#0F172A] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#475569] mb-2">Country of Residence</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input type="text" defaultValue="United Kingdom" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14px] font-medium text-[#0F172A] transition-all" />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-2 border-t border-[#F1F5F9] flex justify-end">
                <button className="bg-[#16A34A] hover:bg-[#15803d] text-white px-6 py-2.5 rounded-full text-[14px] font-semibold transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div>
                <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">Change Password</h3>
                <p className="text-[14px] text-[#64748B] mb-6">Ensure your account is using a long, random password to stay secure.</p>
                
                <div className="grid grid-cols-1 gap-6 max-w-md">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#475569] mb-2">Current Password</label>
                    <div className="relative">
                      <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14px] font-medium text-[#0F172A] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#475569] mb-2">New Password</label>
                    <div className="relative">
                      <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14px] font-medium text-[#0F172A] transition-all" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-8 border-t border-[#F1F5F9] flex justify-start">
                  <button className="bg-[#0F172A] hover:bg-black text-white px-6 py-2.5 rounded-full text-[14px] font-semibold transition-colors shadow-sm">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
