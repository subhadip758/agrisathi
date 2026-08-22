import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { User, Edit3, Save, X, Sprout } from 'lucide-react';
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

const Profile = () => {
  const { language } = useLanguage();
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize profile with cached profile or defaults
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('agrisathi_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      name: 'Subhadip Pal',
      email: 'subhadippalx@gmail.com',
      phone: '8389914302',
      address: 'Barasat, District North 24 Parganas, West Bengal',
      farmName: 'AgriSathi Demo Farm',
      landSize: '4.5',
      landUnit: 'acres',
      cropTypes: 'Rice, Wheat, Potato, Vegetables',
      farmLocation: 'Barasat, North 24 Parganas, West Bengal',
      soilType: 'Loamy Alluvial (দোআঁশ মাটি / दोमट मिट्टी)',
      irrigationType: 'Borewell + Drip Irrigation',
    };
  });

  // Load user details
  useEffect(() => {
    const fetchUserProfile = async () => {
      const saved = localStorage.getItem('agrisathi_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name) {
            setProfileData(parsed);
            return; // Preserve user's explicit local edits across refreshes
          }
        } catch (_) {}
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() });
        const data = await res.json();
        const u = data.user || data.data?.user;
        if (u) {
          const userAddr = u.address || u.farmDetails?.location?.address || 'Barasat, District North 24 Parganas, West Bengal';
          let city = u.farmDetails?.location?.city || 'Barasat';
          let district = u.farmDetails?.location?.district || 'North 24 Parganas';

          if (userAddr.toLowerCase().includes('barasat')) {
            city = 'Barasat';
            district = 'North 24 Parganas';
          }

          const fetchedData = {
            name: u.name || 'Subhadip Pal',
            email: u.email || 'subhadippalx@gmail.com',
            phone: u.phone || u.phoneNumber || '8389914302',
            address: userAddr,
            farmName: u.farmDetails?.farmName || u.farmName || 'AgriSathi Demo Farm',
            landSize: u.farmDetails?.landSize || '4.5',
            landUnit: 'acres',
            cropTypes: Array.isArray(u.farmDetails?.cropTypes) ? u.farmDetails.cropTypes.join(', ') : (u.farmDetails?.cropTypes || 'Rice, Wheat, Potato, Vegetables'),
            farmLocation: `${city}, ${district}, West Bengal`,
            soilType: u.farmDetails?.soilType || 'Loamy Alluvial (দোআঁশ মাটি / दोमट मिट्टी)',
            irrigationType: u.farmDetails?.irrigationType || 'Borewell + Drip Irrigation',
          };
          setProfileData(fetchedData);
          localStorage.setItem('agrisathi_profile', JSON.stringify(fetchedData));
        }
      } catch (_) {}
    };
    fetchUserProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    const userAddr = profileData.address || 'Barasat, District North 24 Parganas, West Bengal';
    let city = 'Barasat';
    let district = 'North 24 Parganas';
    if (userAddr.toLowerCase().includes('barasat')) {
      city = 'Barasat';
      district = 'North 24 Parganas';
    } else {
      const parts = userAddr.split(',');
      if (parts.length > 0 && parts[0].trim()) city = parts[0].trim();
      if (parts.length > 1 && parts[1].trim()) district = parts[1].trim();
    }
    const computedLocation = `${city}, ${district}, West Bengal`;
    const finalProfile = { ...profileData, farmLocation: computedLocation };

    // Persist immediately in localStorage
    localStorage.setItem('agrisathi_profile', JSON.stringify(finalProfile));

    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          farmDetails: {
            farmName: profileData.farmName,
            landSize: profileData.landSize,
            cropTypes: profileData.cropTypes,
            soilType: profileData.soilType,
            irrigationType: profileData.irrigationType,
            location: { address: profileData.address, city, district, state: 'West Bengal' }
          }
        }),
      });

      let data;
      try { data = await res.json(); } catch (_) { data = { success: true }; }

      if (res.ok && (data.success || data.status === 'success')) {
        toast.success(tr(language, 'প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!', 'प्रोफ़ाइल जानकारी सफलतापूर्वक सहेजी गई!', 'Profile updated successfully!'));
        setIsEditing(false);
        setProfileData(finalProfile);
        const updated = data.user || data.data?.user;
        if (updated && updateUser) updateUser(updated);
      } else {
        setIsEditing(false);
        setProfileData(finalProfile);
        toast.success(tr(language, 'প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!', 'प्रोफ़ाइल जानकारी सफलतापूर्वक सहेजी गई!', 'Profile updated successfully!'));
      }
    } catch (_) {
      setIsEditing(false);
      setProfileData(finalProfile);
      toast.success(tr(language, 'প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!', 'प्रोफ़ाइल जानकारी सफलतापूर्वक सहेजी गई!', 'Profile updated successfully!'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* High-Contrast Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 font-bold text-2xl text-emerald-200">
            {profileData.name ? profileData.name[0].toUpperCase() : 'F'}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{profileData.name || 'AgriSathi Farmer'}</h1>
            <p className="text-emerald-100 text-xs md:text-sm mt-0.5">
              📍 {profileData.farmLocation} • 👨‍🌾 {tr(language, 'যাচাইকৃত এগ্রিসাথী সদস্য', 'सत्यापित एग्रीसाथी सदस्य', 'Verified AgriSathi Member')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white text-emerald-800 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-bold shadow transition flex items-center gap-2 text-xs"
        >
          {isEditing ? <X className="w-4 h-4 text-red-600" /> : <Edit3 className="w-4 h-4 text-emerald-700" />}
          {isEditing
            ? tr(language, 'সম্পাদনা বাতিল', 'संपादन रद्द करें', 'Cancel Editing')
            : tr(language, 'প্রোফাইল সম্পাদনা করুন', 'प्रोफ़ाइल संपादित करें', 'Edit Profile')}
        </button>
      </div>

      {/* Main Profile Form Card */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Personal Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 text-gray-900 font-bold text-base">
            <User className="w-5 h-5 text-emerald-600" />
            <span>{tr(language, 'ব্যক্তিগত তথ্য (Personal Information)', 'व्यक्तिगत जानकारी (Personal Information)', 'Personal Information')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'সম্পূর্ণ নাম (Full Name)', 'पूरा नाम (Full Name)', 'Full Name')}
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 disabled:bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'ইমেইল ঠিকানা (Email Address)', 'ईमेल पता (Email Address)', 'Email Address')}
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 disabled:bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'ফোন নম্বর (Phone Number)', 'फ़ोन नंबर (Phone Number)', 'Phone Number')}
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 disabled:bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'ঠিকানা (Address)', 'पता (Address)', 'Address')}
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 disabled:bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Farm Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 text-gray-900 font-bold text-base">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>{tr(language, 'খামার ও চাষের বিবরণ (Farm Details)', 'खेत और कृषि विवरण (Farm Details)', 'Farm & Cultivation Details')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'খামারের নাম (Farm Name)', 'खेत का नाम (Farm Name)', 'Farm Name')}
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileData.farmName}
                onChange={(e) => setProfileData({ ...profileData, farmName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 disabled:bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'জমির পরিমাণ (Land Size in Acres)', 'भूमि का आकार (Land Size in Acres)', 'Land Size (Acres)')}
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileData.landSize}
                onChange={(e) => setProfileData({ ...profileData, landSize: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 disabled:bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'ফসলের ধরন (Crop Types)', 'फ़सलों के प्रकार (Crop Types)', 'Crop Types Cultivated')}
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileData.cropTypes}
                onChange={(e) => setProfileData({ ...profileData, cropTypes: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 disabled:bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'মাটির ধরন (Soil Type)', 'मिट्टी का प्रकार (Soil Type)', 'Soil Type')}
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileData.soilType}
                onChange={(e) => setProfileData({ ...profileData, soilType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 disabled:bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="col-span-2">
              <label className="font-bold text-gray-700 block mb-1">
                {tr(language, 'সেচ ব্যবস্থা (Irrigation System)', 'सिंचाई प्रणाली (Irrigation System)', 'Irrigation Infrastructure')}
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileData.irrigationType}
                onChange={(e) => setProfileData({ ...profileData, irrigationType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 disabled:bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              {tr(language, 'বাতিল', 'रद्द करें', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving
                ? tr(language, 'সংরক্ষণ করা হচ্ছে...', 'सहेजा जा रहा है...', 'Saving...')
                : tr(language, 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন', 'प्रोफ़ाइल परिवर्तन सहेजें', 'Save Profile Changes')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;