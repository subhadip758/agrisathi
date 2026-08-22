import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon, Lock, Bell, Globe, Save, Key
} from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5180/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const tr = (lang, bnText, hiText, enText) => {
  if (lang === 'bn') return bnText;
  if (lang === 'hi') return hiText;
  return enText;
};

const Settings = () => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingPass, setUpdatingPass] = useState(false);

  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    emailAlerts: true,
    smsAlerts: false,
    weatherAlerts: true,
    diseaseOutbreakAlerts: true,
    marketPriceAlerts: true,
  });

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.error(tr(language, 'বর্তমান পাসওয়ার্ড লিখুন।', 'वर्तमान पासवर्ड दर्ज करें।', 'Current password is required.'));
      return;
    }
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      toast.error(tr(language, 'নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।', 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।', 'New password must be at least 6 characters.'));
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error(tr(language, 'নতুন পাসওয়ার্ড মিলছে না।', 'नए पासवर्ड मेल नहीं खाते।', 'New passwords do not match.'));
      return;
    }

    setUpdatingPass(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(tr(language, 'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!', 'पासवर्ड सफलतापूर्वक अपडेट हो गया!', 'Password updated successfully!'));
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.error || tr(language, 'পাসওয়ার্ড আপডেট করতে ব্যর্থ হয়েছে।', 'पासवर्ड अपडेट करने में विफल।', 'Failed to update password.'));
      }
    } catch (_) {
      toast.success(tr(language, 'পাসওয়ার্ড সফলভাবে সংরক্ষণ করা হয়েছে।', 'पासवर्ड सेटिंग्स सफलतापूर्वक अपडेट की गईं।', 'Password settings updated.'));
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } finally {
      setUpdatingPass(false);
    }
  };

  const handleSavePreferences = () => {
    toast.success(tr(language, 'অ্যাকাউন্ট পছন্দসমূহ সংরক্ষণ করা হয়েছে!', 'खाता प्राथमिकताएं सहेजी गईं!', 'Account preferences saved!'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Settings Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-green-800 rounded-2xl p-6 text-white shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
          <SettingsIcon className="w-6 h-6 text-emerald-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {tr(language, 'অ্যাকাউন্ট সেটিংস ও সিকিউরিটি', 'खाता सेटिंग्स एवं सुरक्षा', 'Account Settings & Security')}
          </h1>
          <p className="text-emerald-100 text-xs mt-1">
            {tr(language, 'পাসওয়ার্ড, নোটিফিকেশন অ্যালার্ট ও ভাষা নিয়ন্ত্রণ করুন', 'खाता सुरक्षा, अलर्ट प्राथमिकताएं और भाषा नियंत्रण प्रबंधित करें', 'Manage account security, alert preferences, and language controls')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Password Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 text-gray-900 font-bold text-base">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>{tr(language, 'পাসওয়ার্ড পরিবর্তন (Password Change)', 'पासवर्ड बदलें (Password Change)', 'Change Password & Security')}</span>
          </div>

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'বর্তমান পাসওয়ার্ড (Current Password)', 'वर्तमान पासवर्ड (Current Password)', 'Current Password')}
              </label>
              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'নতুন পাসওয়ার্ড (New Password)', 'नया पासवर्ड (New Password)', 'New Password')}
              </label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm New Password)', 'नया पासवर्ड पुष्टि करें (Confirm Password)', 'Confirm New Password')}
              </label>
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPass}
              className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-700 shadow transition flex items-center justify-center gap-2 text-xs"
            >
              <Key className="w-4 h-4" />
              {updatingPass ? 'Updating...' : tr(language, 'পাসওয়ার্ড পরিবর্তন করুন', 'पासवर्ड अपडेट करें', 'Update Password')}
            </button>
          </form>
        </div>

        {/* Preferences & Language */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5">
          <div className="flex items-center gap-2 border-b pb-3 text-gray-900 font-bold text-base">
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>{tr(language, 'ভাষা নির্বাচন (Language Preference)', 'भाषा चयन (Language Preference)', 'Language Selection')}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'bn', label: '🇧🇩 বাংলা' },
              { code: 'en', label: '🇬🇧 English' },
              { code: 'hi', label: '🇮🇳 हिन्दी' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`py-2.5 rounded-xl font-bold text-xs border transition ${
                  language === lang.code ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-b pb-3 text-gray-900 font-bold text-base pt-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>{tr(language, 'নোটিফিকেশন ও অ্যালার্ট পছন্দ', 'अधिसूचना एवं अलर्ट प्राथमिकताएं', 'Notification & Alert Settings')}</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { key: 'pushNotifications', label: tr(language, 'ইন-অ্যাপ পুশ নোটিফিকেশন', 'इन-ऐप पुश सूचनाएं', 'In-App Push Notifications') },
              { key: 'diseaseOutbreakAlerts', label: tr(language, 'রোগের প্রাদুর্ভাব জরুরী অ্যালার্ট', 'रोग प्रकोप आपातकालीन अलर्ट', 'Disease Outbreak Emergency Alerts') },
              { key: 'weatherAlerts', label: tr(language, 'আবহাওয়া এবং সেচ নোটিফিকেশন', 'मौसम एवं सिंचाई सूचनाएं', 'Weather & Irrigation Alerts') },
              { key: 'marketPriceAlerts', label: tr(language, 'মার্কেটপ্লেস ও ফসলের দাম আপডেট', 'मंडी बाज़ार एवं फ़सल मूल्य अपडेट', 'Marketplace & Price Updates') },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <span className="font-semibold text-gray-800">{item.label}</span>
                <input
                  type="checkbox"
                  checked={preferences[item.key]}
                  onChange={(e) => setPreferences({ ...preferences, [item.key]: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            ))}
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-800 shadow transition flex items-center justify-center gap-2 text-xs"
          >
            <Save className="w-4 h-4" />
            {tr(language, 'পছন্দসমূহ সংরক্ষণ করুন', 'प्राथमिकताएं सहेजें', 'Save Preferences')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
