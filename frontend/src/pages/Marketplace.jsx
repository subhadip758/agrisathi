import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, Search, Plus, Snowflake, Sprout, Star,
  ShieldAlert, Phone, Trash2, Upload, X
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

const FRESHNESS_BADGES = {
  'NEWLY ARRIVED': {
    bg: 'bg-emerald-500 text-white border-emerald-400',
    label: { bn: '🟢 নতুন এসেছে (Newly Arrived)', hi: '🟢 नया आया (Newly Arrived)', en: '🟢 Newly Arrived' },
  },
  'FRESH': {
    bg: 'bg-green-600 text-white border-green-500',
    label: { bn: '🟢 সম্পূর্ণ তাজা (Fresh)', hi: '🟢 बिल्कुल ताज़ा (Fresh)', en: '🟢 Fresh' },
  },
  'AGING': {
    bg: 'bg-amber-500 text-white border-amber-400',
    label: { bn: '🟡 মাঝারি পুরনো (Aging)', hi: '🟡 मध्यम (Aging)', en: '🟡 Aging' },
  },
  'OLD': {
    bg: 'bg-orange-600 text-white border-orange-500',
    label: { bn: '🟠 পুরনো (Old)', hi: '🟠 पुराना (Old)', en: '🟠 Old' },
  },
  'QUALITY REVIEW': {
    bg: 'bg-rose-600 text-white border-rose-500',
    label: { bn: '🔴 মান পর্যালোচনার অধীনে', hi: '🔴 गुणवत्ता समीक्षा के अधीन', en: '🔴 Quality Review' },
  },
};

// Canvas Helper to compress high-res camera photos on client-side
const compressPhotoFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 600;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.65));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

const Marketplace = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [userRoleMode, setUserRoleMode] = useState('buyer'); // 'buyer' | 'seller'
  const [activeTab, setActiveTab] = useState('fresh'); // 'fresh' | 'cold_storage'
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Seller Privacy Consent State
  const [hasConsented, setHasConsented] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentCheck, setConsentCheck] = useState(false);

  // Add Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    farmerName: user?.name || 'AgriSathi Farmer',
    farmerContact: user?.phone || user?.phoneNumber || '8520074651',
    title: '',
    category: 'fresh',
    cropType: 'rice',
    variety: 'Standard',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    harvestDate: new Date().toISOString().split('T')[0],
    allowBuyerContact: true,
    images: [],
    imageUrl: '',
    location: { state: 'West Bengal', district: 'North 24 Parganas', blockOrVillage: 'Barasat', address: '' },
    contactPreferences: { showPhone: true, showWhatsapp: true, showAddress: true },
    storageDetails: { coldStorageName: '', receiptRefNumber: '', entryDate: new Date().toISOString().split('T')[0] }
  });

  // Action Modals State
  const [updateQtyModal, setUpdateQtyModal] = useState({ open: false, listingId: null, soldIncrement: '' });
  const [updatePriceModal, setUpdatePriceModal] = useState({ open: false, listingId: null, newPrice: '' });
  const [reportModal, setReportModal] = useState({ open: false, listing: null, reason: 'fraud', details: '' });

  // Buyer Rating & Review Form State
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch Public Buyer Listings
  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab) params.append('category', activeTab);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/market/listings?${params.toString()}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setListings(data.data);
      } else {
        setListings([]);
      }
    } catch (_) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Seller's Own Listings
  const fetchMyListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/market/my-listings`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMyListings(data.data);
      }
    } catch (_) {}
  };

  // Check Seller Privacy Consent Status
  const checkConsent = async () => {
    try {
      const res = await fetch(`${API_BASE}/market/consent`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && data.data?.consentStatus) {
        setHasConsented(true);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchListings();
  }, [activeTab, search]);

  useEffect(() => {
    if (userRoleMode === 'seller') {
      checkConsent();
      fetchMyListings();
    }
  }, [userRoleMode]);

  // Handle direct file selection and compression for seller produce images
  const handleDirectImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    toast.info(tr(language, 'ছবি সংকুচিত ও প্রসেস করা হচ্ছে...', 'फ़ोटो संपीड़ित और संसाधित की जा रही है...', 'Compressing produce photo...'));
    const compressedImages = await Promise.all(files.map(file => compressPhotoFile(file)));
    const validImages = compressedImages.filter(Boolean);

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...validImages],
      imageUrl: validImages[0] || prev.imageUrl
    }));
    toast.success(tr(language, 'ছবি সফলভাবে যোগ করা হয়েছে!', 'फ़ोटो सफलतापूर्वक जोड़ी गई!', 'Photo attached successfully!'));
  };

  // Auto-fetch profile helper
  const getSavedProfile = () => {
    try {
      const saved = localStorage.getItem('agrisathi_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          const profilePhone = (parsed.phone && parsed.phone !== '8520074651')
            ? parsed.phone
            : (user?.phone || user?.phoneNumber || user?.mobile || '8389914302');

          return {
            name: parsed.name || user?.name || 'Subhadip Pal',
            phone: profilePhone,
            address: parsed.address || parsed.farmLocation || 'Barasat, District North 24 Parganas, West Bengal',
            farmLocation: parsed.farmLocation || parsed.address || 'Barasat, North 24 Parganas, West Bengal'
          };
        }
      }
    } catch (_) {}

    const defaultPhone = user?.phone || user?.phoneNumber || user?.mobile || '8389914302';
    return {
      name: user?.name || 'Subhadip Pal',
      phone: defaultPhone,
      address: 'Barasat, District North 24 Parganas, West Bengal',
      farmLocation: 'Barasat, North 24 Parganas, West Bengal'
    };
  };

  const syncProfileToForm = () => {
    const p = getSavedProfile();
    setFormData(prev => ({
      ...prev,
      farmerName: p.name || 'Subhadip Pal',
      farmerContact: p.phone || '8389914302',
      location: {
        state: 'West Bengal',
        district: 'North 24 Parganas',
        blockOrVillage: 'Barasat',
        address: p.address || p.farmLocation || 'Barasat, West Bengal'
      }
    }));
  };

  // Trigger consent modal if seller has not consented yet
  const handleOpenAddProduce = () => {
    syncProfileToForm();
    if (!hasConsented) {
      setShowConsentModal(true);
    } else {
      setShowAddModal(true);
    }
  };

  // Agree & Save Consent
  const handleAgreeConsent = async () => {
    if (!consentCheck) {
      toast.warning(tr(language, 'এগিয়ে যেতে নীতিতে সম্মত হন।', 'आगे बढ़ने के लिए नीति से सहमत हों।', 'Please check the consent box to proceed.'));
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/market/consent`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ consentStatus: true, policyVersion: 'v1.0' }),
      });
      const data = await res.json();
      if (data.success) {
        setHasConsented(true);
        setShowConsentModal(false);
        setShowAddModal(true);
        toast.success(tr(language, 'গোপনীয়তা সম্মতি সংরক্ষিত হয়েছে।', 'गोपनीयता सहमति सहेजी गई।', 'Privacy consent recorded.'));
      }
    } catch (_) {
      setHasConsented(true);
      setShowConsentModal(false);
      setShowAddModal(true);
    }
  };

  // Add Product Submit
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.farmerName || !formData.farmerName.trim()) {
      toast.error(tr(language, 'বিক্রেতার নাম আবশ্যিক।', 'विक्रेता का नाम आवश्यक है।', 'Seller name is required.'));
      return;
    }
    if (!formData.farmerContact || !formData.farmerContact.trim()) {
      toast.error(tr(language, 'বিক্রেতার মোবাইল নম্বর আবশ্যিক।', 'विक्रेता का फ़ोन नंबर आवश्यक है।', 'Seller contact number is required.'));
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      toast.error(tr(language, 'ফসলের সরাসরি ছবি আপলোড করা আবশ্যিক।', 'फ़सल की प्रत्यक्ष फ़ोटो अपलोड करना अनिवार्य है।', 'Produce photo upload is mandatory. Please select a photo file.'));
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error(tr(language, 'ফসলের পরিমাণ ০ এর বেশি হতে হবে।', 'मात्रा 0 से अधिक होनी चाहिए।', 'Quantity must be greater than 0.'));
      return;
    }
    if (formData.pricePerUnit === undefined || formData.pricePerUnit === '' || Number(formData.pricePerUnit) < 0) {
      toast.error(tr(language, 'প্রতি ইউনিটের সঠিক মূল্য নির্ধারণ করুন।', 'प्रति इकाई मान्य मूल्य दर्ज करें।', 'Valid price per unit is required.'));
      return;
    }

    // Cold Storage Validation
    if (formData.category === 'cold_storage') {
      if (!formData.storageDetails.coldStorageName || !formData.storageDetails.coldStorageName.trim()) {
        toast.error(tr(language, 'কোল্ড স্টোরেজের নাম আবশ্যিক।', 'कोल्ड स्टोरेज यूनिट का नाम आवश्यक है।', 'Cold Storage unit name is required.'));
        return;
      }
      if (!formData.storageDetails.receiptRefNumber || !formData.storageDetails.receiptRefNumber.trim()) {
        toast.error(tr(language, 'কোল্ড স্টোরেজ বন্ড / রসিদ নম্বর আবশ্যিক।', 'कोल्ड स्टोरेज बॉन्ड / रसीद संख्या आवश्यक है।', 'Cold Storage bond/receipt number is required.'));
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/market/listings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...formData, termsAgreed: true }),
      });

      let data;
      try {
        data = await res.json();
      } catch (_) {
        data = { success: false, error: 'Network response parsing error' };
      }

      if (res.ok && data.success) {
        toast.success(tr(language, 'ফসল সফলভাবে তালিকাভুক্ত হয়েছে!', 'फ़सल सफलतापूर्वक सूचीबद्ध हो गई!', 'Produce listed successfully!'));
        setShowAddModal(false);
        setFormData({
          farmerName: user?.name || 'AgriSathi Farmer', farmerContact: user?.phone || user?.phoneNumber || '8520074651',
          title: '', category: 'fresh', cropType: 'rice', variety: 'Standard',
          quantity: '', unit: 'kg', pricePerUnit: '', harvestDate: new Date().toISOString().split('T')[0],
          allowBuyerContact: true, images: [], imageUrl: '',
          location: { state: 'West Bengal', district: 'North 24 Parganas', blockOrVillage: 'Barasat', address: '' },
          contactPreferences: { showPhone: true, showAddress: true },
          storageDetails: { coldStorageName: '', receiptRefNumber: '', entryDate: new Date().toISOString().split('T')[0] }
        });
        fetchMyListings();
        fetchListings();
      } else {
        toast.error(data.error || tr(language, 'ফসল আপলোড করতে ব্যর্থ হয়েছে।', 'फ़सल अपलोड करने में विफल।', 'Failed to upload listing. Check inputs.'));
      }
    } catch (err) {
      toast.error('Failed to submit listing. Network connection issue.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Sold Quantity Update
  const handleUpdateSoldSubmit = async () => {
    if (!updateQtyModal.soldIncrement) return;
    try {
      const res = await fetch(`${API_BASE}/market/listings/${updateQtyModal.listingId}/sold-quantity`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ soldIncrement: updateQtyModal.soldIncrement }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUpdateQtyModal({ open: false, listingId: null, soldIncrement: '' });
        fetchMyListings();
      }
    } catch (_) {}
  };

  // Submit Price Update
  const handleUpdatePriceSubmit = async () => {
    if (!updatePriceModal.newPrice) return;
    try {
      const res = await fetch(`${API_BASE}/market/listings/${updatePriceModal.listingId}/price`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newPrice: updatePriceModal.newPrice }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(tr(language, 'দাম আপডেট হয়েছে!', 'मूल्य अद्यतन हो गया!', 'Price updated successfully!'));
        setUpdatePriceModal({ open: false, listingId: null, newPrice: '' });
        fetchMyListings();
      }
    } catch (_) {}
  };

  // Soft Delete Listing
  const handleDeleteListing = async (id) => {
    if (!window.confirm(tr(language, 'আপনি কি নিশ্চিত যে এই তালিকাটি মুছে ফেলতে চান?', 'क्या आप इस सूची को हटाना चाहते हैं?', 'Are you sure you want to remove this listing?'))) return;
    try {
      await fetch(`${API_BASE}/market/listings/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      toast.success(tr(language, 'ফসল তালিকা মুছে ফেলা হয়েছে।', 'सूची हटा दी गई।', 'Listing removed.'));
      fetchMyListings();
    } catch (_) {}
  };

  // Submit Fraud Report (Persists report and notifies seller anonymized)
  const handleSubmitScamReport = async () => {
    if (!reportModal.details.trim()) {
      toast.error(tr(language, 'অনুগ্রহ করে রিপোর্টের বিবরণ প্রদান করুন', 'कृपया रिपोर्ट का विवरण प्रदान करें', 'Please enter report details'));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/market/listings/${reportModal.listing._id}/report`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reportModal),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(tr(language, 'রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে!', 'रिपोर्ट सफलतापूर्वक जमा की गई!', 'Report submitted successfully!'));
        setReportModal({ open: false, listing: null, reason: 'Suspected Fraud', details: '' });
        fetchListings();
      } else {
        toast.error(data.error || 'Failed to submit report');
      }
    } catch (_) {
      toast.error('Network error submitting report');
    }
  };

  // Submit Buyer Review & Rating
  const handleReviewSubmit = async (listingId) => {
    if (!reviewForm.comment || !reviewForm.comment.trim()) {
      toast.error(tr(language, 'অনুগ্রহ করে আপনার মতামত লিখুন', 'कृपया अपनी समीक्षा लिखें', 'Please write your review comment'));
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/market/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          buyerName: user?.name || 'Verified Buyer'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(tr(language, 'রেটিং ও মতামত সফলভাবে জমা দেওয়া হয়েছে!', 'रेटिंग और समीक्षा सफलतापूर्वक जमा की गई!', 'Rating and review submitted successfully!'));
        setReviewForm({ rating: 5, comment: '' });
        if (selectedItem && selectedItem._id === listingId) {
          setSelectedItem(data.data);
        }
        fetchListings();
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (_) {
      toast.error('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Marketplace Banner & Role Selector */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-emerald-300" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {tr(language, 'কৃষি সাথী সরাসরি কৃষক মার্কেটপ্লেস', 'एग्रीसाथी प्रत्यक्ष किसान बाज़ार', 'AgriSathi Direct Farmer Marketplace')}
            </h1>
          </div>
          <p className="text-emerald-100 text-xs md:text-sm mt-1 max-w-2xl">
            {tr(language,
              'মধ্যস্থতাকারী ছাড়া সরাসরি কৃষকের কাছ থেকে তাজা ফসল ও কোল্ড স্টোরেজ শস্য ক্রয়-বিক্রয় করুন।',
              'बिना बिचौलियों के सीधे स्थानीय किसानों से ताज़ा फ़सल और कोल्ड स्टोरेज अनाज खरीदें व बेचें। शून्य कमीशन।',
              'Buy and sell farm-fresh produce and cold-storage grains directly with local farmers. Zero middleman fees.'
            )}
          </p>
        </div>

        {/* Role Mode Toggle Switch */}
        <div className="flex bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-500/40">
          <button
            onClick={() => setUserRoleMode('buyer')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${userRoleMode === 'buyer' ? 'bg-white text-emerald-900 shadow' : 'text-emerald-200 hover:text-white'}`}
          >
            🛒 {tr(language, 'ক্রেতা মোড', 'खरीदार मोड', 'BUYER MODE')}
          </button>
          <button
            onClick={() => setUserRoleMode('seller')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${userRoleMode === 'seller' ? 'bg-white text-emerald-900 shadow' : 'text-emerald-200 hover:text-white'}`}
          >
            🌾 {tr(language, 'বিক্রেতা মোড', 'विक्रेता मोड', 'SELLER MODE')}
          </button>
        </div>
      </div>

      {/* ── 🛒 BUYER EXPERIENCE SECTION ───────────────────────────────────── */}
      {userRoleMode === 'buyer' && (
        <div className="space-y-6">
          {/* Category Tabs & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('fresh')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${activeTab === 'fresh' ? 'bg-emerald-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Sprout className="w-4 h-4" />
                {tr(language, '🥬 তাজা ফসল (Fresh Harvest)', '🥬 ताज़ा फ़सल (Fresh Produce)', 'Fresh Produce')}
              </button>
              <button
                onClick={() => setActiveTab('cold_storage')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${activeTab === 'cold_storage' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Snowflake className="w-4 h-4" />
                {tr(language, '🏪 কোল্ড স্টোরেজ শস্য (Cold Storage)', '🏪 कोल्ड स्टोरेज अनाज (Cold Storage)', 'Cold Storage Stock')}
              </button>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={tr(language, 'ফসল, জেলা বা কৃষকের নাম অনুসন্ধান...', 'फ़सल, जिला या किसान खोजें...', 'Search crop, district, farmer...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              {tr(language, 'যাচাইকৃত ফসল তালিকা লোড হচ্ছে...', 'सत्यापित फ़सल सूचियां लोड हो रही हैं...', 'Loading verified produce listings...')}
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
              {tr(language,
                'বর্তমানে কোনো বিক্রেতা ফসল তালিকাভুক্ত করেননি। নতুন ফসল যুক্ত করতে "বিক্রেতা মোড" ব্যবহার করুন।',
                'वर्तमान में कोई फ़सल उपलब्ध नहीं है। विक्रेता फ़सल जोड़ने के लिए "विक्रेता मोड" का उपयोग करें।',
                'No produce listings currently available. Sellers can list produce using "SELL PRODUCE".'
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(item => {
                const badge = FRESHNESS_BADGES[item.freshnessStatus] || FRESHNESS_BADGES['NEWLY ARRIVED'];
                const reviewCount = item.reviews?.length || 0;
                const ratingDisplay = item.sellerRating > 0 ? `${item.sellerRating} / 5` : 'New';

                return (
                  <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition space-y-3 flex flex-col justify-between p-4">
                    <div>
                      <div className="relative h-44 rounded-lg overflow-hidden mb-3">
                        <img src={item.images?.[0] || item.imageUrl || 'https://via.placeholder.com/300'} alt={item.title} className="w-full h-full object-cover" />
                        <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow ${badge.bg}`}>
                          {badge.label[language] || badge.label.en}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                        <span className="text-emerald-700 font-extrabold text-lg">₹{item.pricePerUnit}/{item.unit}</span>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>⭐ {ratingDisplay}</span>
                        {reviewCount > 0 && <span className="text-gray-400 font-normal">({reviewCount} {tr(language, 'মতামত', 'प्रतिक्रिया', 'feedback')})</span>}
                      </div>

                      <div className="text-xs text-gray-600 space-y-1 mt-2">
                        <div><strong>{tr(language, 'বিক্রেতা:', 'विक्रेता:', 'Seller:')}</strong> {item.farmerName}</div>
                        <div><strong>{tr(language, 'উপলব্ধ পরিমাণ:', 'उपलब्ध मात्रा:', 'Available:')}</strong> <span className="font-semibold text-emerald-800">{item.remainingQuantity ?? item.quantity} {item.unit}</span></div>
                        <div><strong>{tr(language, 'ফসল তোলার তারিখ:', 'कटाई की तारीख:', 'Harvested:')}</strong> {new Date(item.harvestDate).toLocaleDateString()}</div>
                        <div><strong>{tr(language, 'অবস্থান:', 'स्थान:', 'Location:')}</strong> {item.location?.district}, {item.location?.state}</div>

                        {item.category === 'cold_storage' && item.storageDetails?.coldStorageName && (
                          <div className="text-blue-800 font-medium pt-1">
                            🏪 <strong>{tr(language, 'কোল্ড স্টোরেজ:', 'कोल्ड स्टोरेज:', 'Cold Storage:')}</strong> {item.storageDetails.coldStorageName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 bg-emerald-50 text-emerald-800 border border-emerald-200 py-2 rounded-lg text-xs font-bold hover:bg-emerald-100 transition"
                      >
                        {tr(language, 'বিবরণ দেখুন ও যোগাযোগ করুন', 'विवरण देखें एवं संपर्क करें', 'View Details, Contact & Rate')}
                      </button>
                      <button
                        onClick={() => setReportModal({ open: true, listing: item, reason: 'Suspected Fraud', details: '' })}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Report Listing"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 🟢 SELLER EXPERIENCE SECTION ───────────────────────────────────── */}
      {userRoleMode === 'seller' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">🌾 {tr(language, 'আমার প্রকাশিত ফসল ও বিক্রি ট্র্যাকার', 'मेरी सूचीबद्ध फ़सलें एवं बिक्री ट्रैकर', 'My Listings & Sales Tracker')}</h2>
              <p className="text-xs text-gray-500">
                {tr(language, 'তালিকা পরিচালনা করুন, বিক্রির পরিমাণ ও দাম আপডেট করুন।', 'फ़सल प्रबंधित करें, बिक्री मात्रा और मूल्य अद्यतन करें।', 'Manage listings, update sold quantities, view buyer reports & prices.')}
              </p>
            </div>
            <button
              onClick={handleOpenAddProduce}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-700 shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {tr(language, 'নতুন ফসল যোগ করুন', 'नई फ़सल जोड़ें', 'Add New Produce')}
            </button>
          </div>

          {/* My Listings List */}
          {myListings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
              {tr(language,
                'বর্তমানে আপনার কোনো সক্রিয় ফসল তালিকা নেই। আপনার ফসল বিক্রি করতে "নতুন ফসল যোগ করুন" বোতামে ক্লিক করুন!',
                'वर्तमान में आपकी कोई सक्रिय सूची नहीं है। अपनी फ़सल बेचने के लिए "नई फ़सल जोड़ें" पर क्लिक करें!',
                'You have no active listings right now. Click "Add New Produce" to list your harvest!'
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myListings.map(item => (
                <div key={item._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded mt-1 ${item.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                        {item.status === 'sold' ? '🔴 SOLD OUT' : '🟢 ACTIVE'}
                      </span>
                    </div>
                    <span className="text-lg font-extrabold text-emerald-700">₹{item.pricePerUnit}/{item.unit}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div><strong>Total Quantity:</strong> {item.quantity} {item.unit}</div>
                    <div><strong>Sold Quantity:</strong> <span className="font-bold text-amber-700">{item.soldQuantity || 0} {item.unit}</span></div>
                    <div><strong>Remaining:</strong> <span className="font-bold text-emerald-800">{item.remainingQuantity ?? item.quantity} {item.unit}</span></div>
                    <div><strong>Freshness:</strong> {item.freshnessStatus}</div>
                    {item.category === 'cold_storage' && item.storageDetails?.receiptRefNumber && (
                      <div className="col-span-2 text-blue-800 font-semibold">
                        📄 <strong>Bond / Receipt Ref:</strong> {item.storageDetails.receiptRefNumber} ({item.storageDetails.coldStorageName})
                      </div>
                    )}
                  </div>

                  {/* ANONYMIZED BUYER REPORTS SECTION */}
                  {item.reports && item.reports.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg space-y-1.5 text-xs">
                      <div className="font-bold text-rose-900 flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        ⚠️ Buyer Report Flagged ({item.reports.length} report{item.reports.length > 1 ? 's' : ''}):
                      </div>
                      {item.reports.map((rpt, idx) => (
                        <div key={idx} className="bg-white p-2 rounded border border-rose-100 space-y-0.5">
                          <div className="font-bold text-rose-950">Subject / Reason: {rpt.reason}</div>
                          {rpt.details && <div className="text-gray-700">Details: "{rpt.details}"</div>}
                          <div className="text-[10px] text-gray-400">Reported on: {new Date(rpt.createdAt || Date.now()).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t text-xs">
                    <button
                      onClick={() => setUpdateQtyModal({ open: true, listingId: item._id, soldIncrement: '' })}
                      className="flex-1 bg-amber-50 text-amber-800 border border-amber-300 py-1.5 rounded font-bold hover:bg-amber-100"
                    >
                      Update Sold Qty
                    </button>
                    <button
                      onClick={() => setUpdatePriceModal({ open: true, listingId: item._id, newPrice: item.pricePerUnit })}
                      className="flex-1 bg-blue-50 text-blue-800 border border-blue-300 py-1.5 rounded font-bold hover:bg-blue-100"
                    >
                      Update Price
                    </button>
                    <button
                      onClick={() => handleDeleteListing(item._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Seller Privacy Consent Policy Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Marketplace Privacy & Contact Policy</h3>
            <div className="text-xs text-gray-600 space-y-2 max-h-60 overflow-y-auto pr-2">
              <p>• Product information & photographs will be publicly visible to potential buyers.</p>
              <p>• District and approximate location will be displayed for discovery.</p>
              <p>• Phone contact numbers will be displayed for direct calls from buyers.</p>
              <p>• <strong>Notice:</strong> AgriSathi does not handle payment, delivery, or transactions. You will deal directly with buyers.</p>
            </div>
            <label className="flex items-center gap-2 border-t pt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentCheck}
                onChange={(e) => setConsentCheck(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-xs font-bold text-gray-800">
                {tr(language, '☑ আমি মার্কেটপ্লেস গোপনীয়তা নীতির শর্তাবলীতে সম্মত', '☑ मैं बाज़ार गोपनीयता नीति की शर्तों से सहमत हूँ', '☑ I agree to the Marketplace Privacy & Contact Policy')}
              </span>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowConsentModal(false)} className="px-4 py-2 border rounded-lg text-xs font-medium">Cancel</button>
              <button onClick={handleAgreeConsent} className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow hover:bg-emerald-700">
                {tr(language, 'স্বীকৃতি দিন ও এগিয়ে যান (Agree & Continue)', 'स्वीकार करें और आगे बढ़ें (Agree & Continue)', 'AGREE & CONTINUE')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Produce Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl my-8">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
              {tr(language, 'নতুন ফসল যোগ করুন', 'नई फ़सल जोड़ें', 'Add Produce Listing')}
            </h3>
            <form onSubmit={handleAddProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700">{tr(language, 'বিক্রেতার নাম *', 'विक्रेता का नाम *', 'Seller Name *')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subhadip Ghosh"
                  value={formData.farmerName}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700">{tr(language, 'ফোন নম্বর *', 'फ़ोन नंबर *', 'Seller Phone Number *')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8520074651"
                  value={formData.farmerContact}
                  onChange={(e) => setFormData({ ...formData, farmerContact: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700">{tr(language, 'ফসলের শিরোনাম *', 'फ़सल का नाम *', 'Crop / Product Title *')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Minikit Paddy Rice"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700">{tr(language, 'ক্যাটাগরি *', 'श्रेणी *', 'Category *')}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1 font-semibold text-emerald-800"
                >
                  <option value="fresh">🥬 FRESH / NEWLY ARRIVED</option>
                  <option value="cold_storage">🏪 COLD STORAGE</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700">{tr(language, 'মোট পরিমাণ *', 'कुल मात्रा *', 'Total Available Quantity *')}</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 100"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700">{tr(language, 'প্রতি ইউনিট মূল্য (₹) *', 'प्रति इकाई मूल्य (₹) *', 'Price Per Unit (₹) *')}</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 35"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              {/* DEDICATED COLD STORAGE BOND & RECEIPT FIELDS */}
              {formData.category === 'cold_storage' && (
                <div className="col-span-2 bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-3">
                  <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                    <Snowflake className="w-4 h-4 text-blue-600" />
                    {tr(language, 'কোল্ড স্টোরেজ বন্ড ও রসিদ বিবরণ (Cold Storage Bond Details)', 'कोल्ड स्टोरेज बॉन्ड विवरण (Cold Storage Bond Details)', 'Cold Storage Receipt & Bond Details')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Cold Storage Unit Name *</label>
                      <input
                        type="text"
                        required={formData.category === 'cold_storage'}
                        placeholder="e.g. Barasat Central Cold Storage"
                        value={formData.storageDetails.coldStorageName}
                        onChange={(e) => setFormData({
                          ...formData,
                          storageDetails: { ...formData.storageDetails, coldStorageName: e.target.value }
                        })}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Receipt / Bond Number *</label>
                      <input
                        type="text"
                        required={formData.category === 'cold_storage'}
                        placeholder="e.g. CS-BOND-98214"
                        value={formData.storageDetails.receiptRefNumber}
                        onChange={(e) => setFormData({
                          ...formData,
                          storageDetails: { ...formData.storageDetails, receiptRefNumber: e.target.value }
                        })}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Storage Entry Date *</label>
                      <input
                        type="date"
                        required={formData.category === 'cold_storage'}
                        value={formData.storageDetails.entryDate}
                        onChange={(e) => setFormData({
                          ...formData,
                          storageDetails: { ...formData.storageDetails, entryDate: e.target.value }
                        })}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Image File Upload Input */}
              <div className="col-span-2 space-y-2">
                <label className="font-bold text-gray-700 block">
                  📷 {tr(language, 'ফসলের সরাসরি ছবি আপলোড করুন *', 'फ़सल की प्रत्यक्ष फ़ोटो अपलोड करें *', 'Direct Produce Photo Upload *')}
                </label>
                <div className="border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDirectImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-emerald-800 block">
                    {tr(language, 'ফটো নির্বাচন করতে ফাইল নির্বাচন ক্লিক করুন', 'फ़ोटो चुनने के लिए क्लिक करें', 'Click or drag photo files to upload produce images')}
                  </span>
                </div>

                {formData.images && formData.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pt-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-emerald-300 shadow-sm flex-shrink-0">
                        <img src={img} alt="Uploaded produce" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx),
                            imageUrl: prev.images[0] || ''
                          }))}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2 flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Produce'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details & Buyer Rating / Feedback Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-lg text-gray-900">{selectedItem.title}</h3>
              <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <img src={selectedItem.images?.[0] || selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-48 object-cover rounded-xl" />
            <div className="text-xs text-gray-700 space-y-1.5">
              <div><strong>Seller Name:</strong> {selectedItem.farmerName}</div>
              <div><strong>District:</strong> {selectedItem.location?.district}, {selectedItem.location?.state}</div>
              <div><strong>Available Quantity:</strong> {selectedItem.remainingQuantity ?? selectedItem.quantity} {selectedItem.unit}</div>
              <div><strong>Price:</strong> ₹{selectedItem.pricePerUnit}/{selectedItem.unit}</div>
            </div>

            {selectedItem.category === 'cold_storage' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-blue-900 flex items-center gap-1">
                  <Snowflake className="w-4 h-4 text-blue-600" /> Cold Storage Receipt & Bond Info:
                </div>
                <div><strong>Cold Storage Unit:</strong> {selectedItem.storageDetails?.coldStorageName || 'Barasat Cold Storage'}</div>
                <div><strong>Receipt / Bond Ref #:</strong> {selectedItem.storageDetails?.receiptRefNumber || 'CS-BOND-102'}</div>
                {selectedItem.storageDetails?.entryDate && (
                  <div><strong>Storage Entry Date:</strong> {new Date(selectedItem.storageDetails.entryDate).toLocaleDateString()}</div>
                )}
              </div>
            )}

            {/* BUYER RATING & REVIEW FEEDBACK SECTION */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {tr(language, 'ক্রেতা রেটিং ও মতামত', 'खरीदार रेटिंग एवं समीक्षाएं', 'Buyer Ratings & Feedback')} ({selectedItem.reviews?.length || 0})
                </h4>
                <span className="font-extrabold text-amber-800 text-xs">
                  ⭐ {selectedItem.sellerRating > 0 ? `${selectedItem.sellerRating} / 5` : 'New'}
                </span>
              </div>

              {/* Add Review Form */}
              <div className="bg-white p-3 rounded-lg border space-y-2">
                <div className="text-xs font-bold text-gray-800">
                  {tr(language, 'পণ্য ও বিক্রেতাকে রেটিং দিন:', 'उत्पाद और विक्रेता को रेटिंग दें:', 'Rate this product & seller:')}
                </div>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows="2"
                  placeholder={tr(language, 'আপনার মতামত বা অভিজ্ঞতা লিখুন...', 'अपनी समीक्षा या अनुभव लिखें...', 'Write your feedback rating or experience...')}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-2 border rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleReviewSubmit(selectedItem._id)}
                  disabled={submittingReview}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow transition"
                >
                  {submittingReview
                    ? tr(language, 'জমা দেওয়া হচ্ছে...', 'सहेजा जा रहा है...', 'Submitting Feedback...')
                    : tr(language, 'রেটিং ও মতামত জমা দিন', 'समीक्षा जमा करें', 'Submit Buyer Feedback')}
                </button>
              </div>

              {/* All Buyers Public Reviews List */}
              {selectedItem.reviews && selectedItem.reviews.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pt-1">
                  {selectedItem.reviews.map((r, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-lg border text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold text-gray-800">
                        <span>{r.buyerName || 'Verified Buyer'}</span>
                        <span className="text-amber-500 font-bold">⭐ {r.rating}/5</span>
                      </div>
                      <p className="text-gray-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="font-bold text-emerald-900 text-xs">{tr(language, 'বিক্রেতার সাথে সরাসরি কথা বলুন:', 'विक्रेता से सीधे बात करें:', 'Direct Contact Seller:')}</div>
              <div className="flex gap-2">
                <a href={`tel:${selectedItem.farmerContact}`} className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 shadow transition">
                  <Phone className="w-4 h-4" /> {tr(language, 'বিক্রেতাকে কল করুন', 'विक्रेता को कॉल करें', 'Call Seller')} ({selectedItem.farmerContact})
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Sold Quantity Modal */}
      {updateQtyModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-gray-900 border-b pb-2">Update Sold Quantity</h3>
            <input
              type="number"
              placeholder="Enter newly sold amount (e.g. 30)"
              value={updateQtyModal.soldIncrement}
              onChange={(e) => setUpdateQtyModal({ ...updateQtyModal, soldIncrement: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setUpdateQtyModal({ open: false, listingId: null, soldIncrement: '' })} className="px-3 py-1.5 border rounded text-xs">Cancel</button>
              <button onClick={handleUpdateSoldSubmit} className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold">Save Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Price Modal */}
      {updatePriceModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-gray-900 border-b pb-2">Update Price Per Unit</h3>
            <input
              type="number"
              placeholder="Enter new price (₹)"
              value={updatePriceModal.newPrice}
              onChange={(e) => setUpdatePriceModal({ ...updatePriceModal, newPrice: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setUpdatePriceModal({ open: false, listingId: null, newPrice: '' })} className="px-3 py-1.5 border rounded text-xs">Cancel</button>
              <button onClick={handleUpdatePriceSubmit} className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-bold">Update Price</button>
            </div>
          </div>
        </div>
      )}

      {/* Scam / Listing Report Modal */}
      {reportModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-gray-900 border-b pb-2">
              {tr(language, 'পণ্য / প্রতারণা রিপোর্ট করুন', 'फ़सल / धोखाधड़ी की रिपोर्ट करें', 'Report Listing / Scam Suspicion')}
            </h3>
            <select
              value={reportModal.reason}
              onChange={(e) => setReportModal({ ...reportModal, reason: e.target.value })}
              className="w-full border rounded-lg p-2 text-xs font-bold text-gray-800"
            >
              <option value="Suspected Fraud">Suspected Fraud</option>
              <option value="Fake Product">Fake Product</option>
              <option value="Misleading Information">Misleading Information</option>
              <option value="Fake Product Images">Fake Product Images</option>
              <option value="Suspicious Seller">Suspicious Seller</option>
            </select>
            <textarea
              rows="3"
              placeholder={tr(language, 'রিপোর্টের সুনির্দিষ্ট বিবরণ প্রদান করুন...', 'रिपोर्ट के लिए विवरण दर्ज करें...', 'Provide specific details about your report...')}
              value={reportModal.details}
              onChange={(e) => setReportModal({ ...reportModal, details: e.target.value })}
              className="w-full border rounded-lg p-2 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setReportModal({ open: false, listing: null, reason: 'Suspected Fraud', details: '' })} className="px-3 py-1.5 border rounded text-xs">Cancel</button>
              <button onClick={handleSubmitScamReport} className="px-4 py-1.5 bg-red-600 text-white rounded text-xs font-bold">Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
