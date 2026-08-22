import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Users, MessageSquare, ThumbsUp, ThumbsDown, Mic, MicOff, Image as ImageIcon,
  ShieldAlert, Award, UserCheck, Play, Pause, CornerDownRight, Plus, CheckCircle, Upload, X, Trash2
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

// Canvas Helper to compress high-res camera photos on client-side (600px max, 65% quality -> ~40KB)
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

const Community = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'profile' | 'rules'
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCropTag, setSelectedCropTag] = useState('all');

  // New Post Form State
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    cropTag: 'General Agriculture',
    images: [],
    voiceUrl: '',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Web Audio Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Active Post Comments State Map { postId: [comments] }
  const [postComments, setPostComments] = useState({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);

  // User Profile Designation State
  const [profileDesignation, setProfileDesignation] = useState('👨🌾 Farmer');
  const [profileBio, setProfileBio] = useState('Dedicated organic farmer sharing agricultural experiences.');

  // Report Modal State
  const [reportModal, setReportModal] = useState({ open: false, targetType: 'post', targetId: null, reason: 'misinformation', details: '' });

  // Load Feed Posts
  const fetchFeed = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/community/feed?page=1&limit=20`;
      if (selectedCropTag !== 'all') url += `&cropTag=${encodeURIComponent(selectedCropTag)}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error('Error fetching community feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedCropTag]);

  // Handle Direct Photo File Upload for Post with Compression
  const handlePostImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      const compressedBase64 = await compressPhotoFile(file);
      setNewPost(prev => ({
        ...prev,
        images: [...(prev.images || []), compressedBase64]
      }));
    }
  };

  // Web Audio Recorder Control
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setAudioBlob(reader.result);
          setNewPost(prev => ({ ...prev, voiceUrl: reader.result }));
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) {
      toast.error(language === 'bn' ? 'মাইক্রোফোন সংযোগ ব্যর্থ হয়েছে।' : 'Microphone access failed.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const getSavedProfile = () => {
    try {
      const saved = localStorage.getItem('agrisathi_profile');
      if (saved) {
        const p = JSON.parse(saved);
        if (p && p.name) return p;
      }
    } catch (_) {}
    return {
      name: user?.name || 'Subhadip Pal',
      address: 'Barasat, District North 24 Parganas, West Bengal',
      farmLocation: 'Barasat, North 24 Parganas, West Bengal',
      farmName: 'AgriSathi Demo Farm'
    };
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে এই পোস্টটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this post?')) return;
    
    // Instantly remove post from client state
    setPosts(prev => prev.filter(p => String(p._id) !== String(postId)));
    toast.success(language === 'bn' ? 'পোস্ট মুছে ফেলা হয়েছে!' : 'Post deleted successfully!');

    try {
      await fetch(`${API_BASE}/community/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      fetchFeed();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  // Submit Post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!newPost.content || !newPost.content.trim()) {
      toast.error(language === 'bn' ? 'অনুগ্রহ করে পোস্টের বিবরণ লিখুন।' : 'Please enter post content.');
      return;
    }

    setSubmitting(true);
    const profile = getSavedProfile();

    try {
      const res = await fetch(`${API_BASE}/community/posts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          cropTag: newPost.cropTag,
          authorName: profile.name,
          authorLocation: profile.farmLocation || profile.address || 'Barasat, West Bengal',
          authorRole: profile.farmName ? `👨‍🌾 ${profile.farmName}` : profileDesignation,
          images: newPost.images || [],
          voiceUrl: newPost.voiceUrl || '',
          postType: newPost.voiceUrl ? 'voice' : (newPost.images?.length ? 'image' : 'text')
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (_) {
        data = { success: false, error: 'Server returned invalid response.' };
      }

      if (res.ok && data.success) {
        toast.success(language === 'bn' ? 'পোস্ট প্রকাশিত হয়েছে!' : 'Post published successfully!');
        setShowCreateModal(false);
        setNewPost({ title: '', content: '', cropTag: 'General Agriculture', images: [], voiceUrl: '' });
        setAudioBlob(null);
        fetchFeed();
      } else {
        toast.error(data.error || 'Failed to publish post.');
      }
    } catch (err) {
      toast.error('Failed to publish post. Check network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // Atomic Like/Dislike Reaction for Comments & Replies
  const handleCommentReaction = async (postId, commentId, reactionType) => {
    // 1. Optimistic Client State Update
    setPostComments(prev => {
      const list = prev[postId] || [];
      const updateReaction = (item) => {
        const prevRx = item.userReaction;
        let likes = item.likesCount || 0;
        let dislikes = item.dislikesCount || 0;
        let newRx = reactionType;

        if (prevRx === reactionType) {
          if (reactionType === 'like') likes = Math.max(0, likes - 1);
          if (reactionType === 'dislike') dislikes = Math.max(0, dislikes - 1);
          newRx = null;
        } else {
          if (prevRx === 'like') likes = Math.max(0, likes - 1);
          if (prevRx === 'dislike') dislikes = Math.max(0, dislikes - 1);
          if (reactionType === 'like') likes += 1;
          if (reactionType === 'dislike') dislikes += 1;
        }

        return { ...item, likesCount: likes, dislikesCount: dislikes, userReaction: newRx };
      };

      const updatedList = list.map(c => {
        if (String(c._id) === String(commentId)) {
          return updateReaction(c);
        }
        if (c.replies && c.replies.length > 0) {
          const updatedReplies = c.replies.map(r => {
            if (String(r._id) === String(commentId)) {
              return updateReaction(r);
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        }
        return c;
      });
      return { ...prev, [postId]: updatedList };
    });

    // 2. Dispatch to Backend
    try {
      const res = await fetch(`${API_BASE}/community/comments/${commentId}/react`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reactionType }),
      });
      const data = await res.json();
      if (data.success) {
        setPostComments(prev => {
          const list = prev[postId] || [];
          const applyServerData = (item) => ({
            ...item,
            likesCount: data.data.likesCount,
            dislikesCount: data.data.dislikesCount,
            userReaction: data.data.userReaction,
          });

          const updatedList = list.map(c => {
            if (String(c._id) === String(commentId)) {
              return applyServerData(c);
            }
            if (c.replies && c.replies.length > 0) {
              const updatedReplies = c.replies.map(r => {
                if (String(r._id) === String(commentId)) {
                  return applyServerData(r);
                }
                return r;
              });
              return { ...c, replies: updatedReplies };
            }
            return c;
          });
          return { ...prev, [postId]: updatedList };
        });
      }
    } catch (err) {
      console.error('Error reacting to comment:', err);
    }
  };

  // Atomic Like/Dislike Reaction for Posts
  const handleReaction = async (postId, reactionType) => {
    // 1. Instant Optimistic Client Update
    setPosts(prev => prev.map(p => {
      if (String(p._id) === String(postId)) {
        const prevRx = p.userReaction;
        let likes = p.likesCount || 0;
        let dislikes = p.dislikesCount || 0;
        let newRx = reactionType;

        if (prevRx === reactionType) {
          if (reactionType === 'like') likes = Math.max(0, likes - 1);
          if (reactionType === 'dislike') dislikes = Math.max(0, dislikes - 1);
          newRx = null;
        } else {
          if (prevRx === 'like') likes = Math.max(0, likes - 1);
          if (prevRx === 'dislike') dislikes = Math.max(0, dislikes - 1);
          if (reactionType === 'like') likes += 1;
          if (reactionType === 'dislike') dislikes += 1;
        }

        return { ...p, likesCount: likes, dislikesCount: dislikes, userReaction: newRx };
      }
      return p;
    }));

    // 2. Dispatch to Backend for Server Verification
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/react`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reactionType }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (String(p._id) === String(postId)) {
            return {
              ...p,
              likesCount: data.data.likesCount,
              dislikesCount: data.data.dislikesCount,
              userReaction: data.data.userReaction,
            };
          }
          return p;
        }));
      }
    } catch (_) {}
  };

  // Toggle Comments View
  const handleToggleComments = async (postId) => {
    if (openCommentsPostId === postId) {
      setOpenCommentsPostId(null);
      return;
    }

    setOpenCommentsPostId(postId);
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/comments`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) {
        setPostComments(prev => ({ ...prev, [postId]: data.data }));
      }
    } catch (_) {}
  };

  // Submit Comment / Threaded Reply
  const handleAddCommentSubmit = async (postId, parentCommentId = null) => {
    const text = parentCommentId ? replyInputs[parentCommentId] : commentInputs[postId];
    if (!text || !text.trim()) return;

    const authorName = getSavedProfile().name;

    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: text.trim(), parentComment: parentCommentId, authorName: authorName }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(language === 'bn' ? 'মন্তব্য যুক্ত হয়েছে!' : 'Comment added!');
        if (parentCommentId) {
          setReplyInputs(prev => ({ ...prev, [parentCommentId]: '' }));
          setReplyingToCommentId(null);
        } else {
          setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        }

        const cRes = await fetch(`${API_BASE}/community/posts/${postId}/comments`, { headers: getAuthHeaders() });
        const cData = await cRes.json();
        if (cData.success) {
          setPostComments(prev => ({ ...prev, [postId]: cData.data }));
          setPosts(prev => prev.map(p => p._id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
        }
      }
    } catch (_) {}
  };

  // Submit Community Report
  const handleSubmitReport = async () => {
    if (!reportModal.details.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/community/reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reportModal),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(language === 'bn' ? 'অভিযোগ জমা হয়েছে। অ্যাডমিন পর্যালোচনা করবেন।' : 'Report submitted to admin.');
        setReportModal({ open: false, targetType: 'post', targetId: null, reason: 'misinformation', details: '' });
      }
    } catch (_) {}
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Identity Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-700/40">
        <div className="flex items-center gap-4">
          <img
            src="/assets/images/logo.jpeg"
            alt="AgriSathi Logo"
            className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-emerald-400 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {language === 'bn' ? 'এগ্রিসাথী কৃষি কমিউনিটি' : 'AgriSathi Farmers Community'}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-semibold hidden sm:inline-block">
                GROW SMARTER
              </span>
            </div>
            <p className="text-emerald-100 text-xs md:text-sm mt-1">
              {language === 'bn'
                ? 'কৃষক, কৃষি কর্মকর্তা ও গবেষকদের অভিজ্ঞতা বিনিময় মঞ্চ'
                : 'Verified agricultural knowledge & experience exchange network for farmers'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-white text-emerald-900 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-bold shadow-md transition flex items-center gap-2 text-xs md:text-sm shrink-0"
        >
          <Plus className="w-5 h-5 text-emerald-700" />
          {language === 'bn' ? 'নতুন পোস্ট তৈরি করুন' : language === 'hi' ? 'नया पोस्ट बनाएं' : 'Create New Post'}
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
            activeTab === 'feed' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          {language === 'bn' ? 'আলোচনা ফিড' : language === 'hi' ? 'चर्चा फ़ीड' : 'Community Feed'}
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
            activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          {language === 'bn' ? 'আমার প্রোফাইল ও পদবী' : language === 'hi' ? 'मेरी प्रोफ़ाइल एवं पद' : 'My Profile & Designation'}
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
            activeTab === 'rules' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          {language === 'bn' ? 'নিয়মাবলী ও রিপোর্ট' : language === 'hi' ? 'नियम एवं रिपोर्ट' : 'Rules & Reports'}
        </button>
      </div>

      {/* ── TAB 1: COMMUNITY FEED ────────────────────────────────────────── */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Crop Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['all', 'Rice', 'Wheat', 'Potato', 'Vegetables', 'General Agriculture'].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedCropTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                  selectedCropTag === tag
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500'
                }`}
              >
                {tag === 'all' ? (language === 'bn' ? 'সব বিষয়' : 'All Topics') : tag}
              </button>
            ))}
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading community discussions...</div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
              {language === 'bn'
                ? 'এখনও কোনো কমিউনিটি পোস্ট নেই। প্রথম কৃষক হিসেবে আপনার পোস্ট তৈরি করুন!'
                : 'No community posts yet. Be the first farmer to share a story or question!'}
            </div>
          ) : (
            posts.map(post => {
              const currentProfile = getSavedProfile();
              const displayAuthorName = (post.authorName === 'AgriSathi Farmer' || !post.authorName) ? currentProfile.name : post.authorName;
              const displayAuthorLocation = (!post.authorLocation || post.authorLocation.includes('Siliguri')) ? (currentProfile.farmLocation || currentProfile.address || 'Barasat, West Bengal') : post.authorLocation;
              const isMyPost = displayAuthorName === currentProfile.name || (user?._id && String(post.author) === String(user._id));

              return (
                <div key={post._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200">
                        {displayAuthorName ? displayAuthorName[0].toUpperCase() : 'S'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{displayAuthorName}</span>
                          <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded border border-emerald-200 font-medium">
                            {post.authorRole || '👨‍🌾 Verified Farmer'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {displayAuthorLocation} • {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isMyPost ? (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition border border-red-200"
                          title="Delete my post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setReportModal({ open: true, targetType: 'post', targetId: post._id, reason: 'misinformation', details: '' })}
                          className="text-gray-400 hover:text-red-600 text-xs flex items-center gap-1 px-2 py-1 hover:bg-gray-50 rounded"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Report
                        </button>
                      )}
                    </div>
                  </div>

                {/* Content */}
                <div>
                  {post.title && <h3 className="font-bold text-gray-900 text-base mb-1">{post.title}</h3>}
                  <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">{post.content}</p>
                </div>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden max-h-80">
                    {post.images.map((img, i) => (
                      <img key={i} src={img} alt="Post attachment" className="w-full h-48 object-cover rounded-lg border" />
                    ))}
                  </div>
                )}

                {/* Voice Player */}
                {post.voiceUrl && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-3">
                    <button
                      onClick={() => {
                        const audio = new Audio(post.voiceUrl);
                        audio.play();
                      }}
                      className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition shadow"
                    >
                      <Play className="w-4 h-4 ml-0.5" />
                    </button>
                    <div className="text-xs text-emerald-800 font-medium">
                      🎤 {language === 'bn' ? 'ভয়েস অডিও রেকর্ড শুনুন' : 'Listen to Voice Note Audio'}
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleReaction(post._id, 'like')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                        post.userReaction === 'like' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likesCount || 0}</span>
                    </button>
                    <button
                      onClick={() => handleReaction(post._id, 'dislike')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                        post.userReaction === 'dislike' ? 'bg-rose-100 text-rose-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{post.dislikesCount || 0}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleComments(post._id)}
                    className="flex items-center gap-1.5 hover:text-emerald-700 font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount || 0} {language === 'bn' ? 'মন্তব্য' : 'Comments'}</span>
                  </button>
                </div>

                {/* Threaded Comments Section */}
                {openCommentsPostId === post._id && (
                  <div className="border-t border-gray-100 pt-4 space-y-4 bg-gray-50/50 p-4 rounded-xl">
                    {/* Add Top Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={language === 'bn' ? 'মন্তব্য লিখুন...' : 'Write a comment...'}
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                        className="flex-1 px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleAddCommentSubmit(post._id)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-xs hover:bg-emerald-700"
                      >
                        Comment
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {(postComments[post._id] || []).map(comment => (
                        <div key={comment._id} className="bg-white p-3 rounded-lg border border-gray-100 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{comment.authorName}</span>
                            <span className="text-gray-400 text-[10px]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>

                          {/* Reply Trigger & Comment Like/Dislike Buttons */}
                          <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500 border-t border-gray-50 mt-1">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleCommentReaction(post._id, comment._id, 'like')}
                                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition ${
                                  comment.userReaction === 'like' ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300' : 'hover:bg-gray-100'
                                }`}
                                title="Authentic & Helpful Answer"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>{comment.likesCount || 0}</span>
                              </button>

                              <button
                                onClick={() => handleCommentReaction(post._id, comment._id, 'dislike')}
                                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition ${
                                  comment.userReaction === 'dislike' ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300' : 'hover:bg-gray-100'
                                }`}
                                title="Inaccurate Answer"
                              >
                                <ThumbsDown className="w-3 h-3" />
                                <span>{comment.dislikesCount || 0}</span>
                              </button>
                            </div>

                            <button
                              onClick={() => setReplyingToCommentId(comment._id)}
                              className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
                            >
                              <CornerDownRight className="w-3 h-3" /> Reply
                            </button>
                          </div>

                          {/* Threaded Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-4 pl-3 border-l-2 border-emerald-200 space-y-2 mt-2">
                              {comment.replies.map(reply => (
                                <div key={reply._id} className="bg-gray-50 p-2.5 rounded-lg text-[11px] space-y-1 border border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-800">{reply.authorName}</span>
                                    <span className="text-gray-400 text-[10px]">{reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : ''}</span>
                                  </div>
                                  <p className="text-gray-700">{reply.content}</p>

                                  {/* Reply Like / Dislike Buttons */}
                                  <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
                                    <button
                                      onClick={() => handleCommentReaction(post._id, reply._id, 'like')}
                                      className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded transition ${
                                        reply.userReaction === 'like' ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300' : 'hover:bg-gray-200 text-gray-600'
                                      }`}
                                      title="Helpful Answer"
                                    >
                                      <ThumbsUp className="w-2.5 h-2.5" />
                                      <span>{reply.likesCount || 0}</span>
                                    </button>

                                    <button
                                      onClick={() => handleCommentReaction(post._id, reply._id, 'dislike')}
                                      className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded transition ${
                                        reply.userReaction === 'dislike' ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300' : 'hover:bg-gray-200 text-gray-600'
                                      }`}
                                      title="Inaccurate Answer"
                                    >
                                      <ThumbsDown className="w-2.5 h-2.5" />
                                      <span>{reply.dislikesCount || 0}</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input Box */}
                          {replyingToCommentId === comment._id && (
                            <div className="flex gap-2 pt-2">
                              <input
                                type="text"
                                placeholder="Reply to this comment..."
                                value={replyInputs[comment._id] || ''}
                                onChange={(e) => setReplyInputs({ ...replyInputs, [comment._id]: e.target.value })}
                                className="flex-1 px-3 py-1 border border-gray-200 rounded text-xs"
                              />
                              <button
                                onClick={() => handleAddCommentSubmit(post._id, comment._id)}
                                className="bg-emerald-600 text-white px-3 py-1 rounded text-xs"
                              >
                                Reply
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        </div>
      )}

      {/* ── TAB 2: PROFILE & DESIGNATION ──────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">
            {language === 'bn' ? 'আমার কমিউনিটি প্রোফাইল ও পদবী' : 'My Community Profile & Role'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'bn' ? 'আপনার ভূমিকা / পদবী (Designation)' : 'Select Your Role / Designation'}
              </label>
              <select
                value={profileDesignation}
                onChange={(e) => setProfileDesignation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="👨🌾 Farmer">👨🌾 Farmer (কৃষক)</option>
                <option value="🎓 Student">🎓 Student (শিক্ষার্থী)</option>
                <option value="🧑🔬 Agricultural Officer">🧑🔬 Agricultural Officer (কৃষি কর্মকর্তা)</option>
                <option value="🌱 Agriculture Professional">🌱 Agriculture Professional (কৃষি বিশেষজ্ঞ)</option>
                <option value="👨💻 Researcher">👨💻 Researcher (গবেষক)</option>
                <option value="👤 Other">👤 Other (অন্যান্য)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Profile Description</label>
              <textarea
                rows="3"
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <button
              onClick={async () => {
                try {
                  await fetch(`${API_BASE}/community/profile`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ designation: profileDesignation, bio: profileBio }),
                  });
                  toast.success(language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated successfully!');
                } catch (_) {}
              }}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 shadow-md"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: RULES & MODERATION ───────────────────────────────────────── */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">AgriSathi Community Code of Conduct</h2>
          <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
            <li>Keep all discussions strictly related to agriculture, crop health, weather, fertilizers, and farming tech.</li>
            <li>No commercial spam, fake agricultural claims, or abusive language.</li>
            <li>All reported content is reviewed by AgriSathi Agricultural Officers.</li>
          </ul>
        </div>
      )}

      {/* Create Post Modal with Direct Photo Upload */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Create Community Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <input
                type="text"
                placeholder="Post Title (Optional)"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <textarea
                rows="4"
                placeholder="Share your farming experience, question, or crop update..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                required
              />

              {/* Crop Tag Selector */}
              <select
                value={newPost.cropTag}
                onChange={(e) => setNewPost({ ...newPost, cropTag: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-xs"
              >
                <option value="General Agriculture">General Agriculture</option>
                <option value="Rice">Rice (ধান)</option>
                <option value="Wheat">Wheat (গম)</option>
                <option value="Potato">Potato (আলু)</option>
                <option value="Vegetables">Vegetables (শাকসবজি)</option>
              </select>

              {/* Direct Photo Upload Input for Post */}
              <div className="space-y-2">
                <label className="font-bold text-gray-700 text-xs block">
                  📷 {language === 'bn' ? 'সরাসরি ছবি আপলোড করুন (Direct Photo Upload)' : 'Direct Photo Upload'}
                </label>
                <div className="border-2 border-dashed border-emerald-300 rounded-xl p-3 text-center bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePostImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-emerald-800 block">
                    {language === 'bn' ? 'ফটো বা ছবি নির্বাচন করুন' : 'Click or drag photos to attach'}
                  </span>
                </div>

                {/* Attached Photo Thumbnails */}
                {newPost.images && newPost.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pt-1">
                    {newPost.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-emerald-300 shadow-sm flex-shrink-0">
                        <img src={img} alt="Post attachment" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewPost(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx)
                          }))}
                          className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Web Audio Recorder Button */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? `Recording (${recordingTime}s)` : 'Record Voice Note'}
                </button>
                {audioBlob && <span className="text-xs text-emerald-700 font-medium">✓ Voice note attached</span>}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 border-b pb-2">Submit Moderation Report</h3>
            <select
              value={reportModal.reason}
              onChange={(e) => setReportModal({ ...reportModal, reason: e.target.value })}
              className="w-full border rounded-lg p-2 text-xs"
            >
              <option value="misinformation">Misinformation / Fake Claim</option>
              <option value="spam">Spam or Commercial Ad</option>
              <option value="harassment">Abusive Language</option>
              <option value="fraud">Fraud / Scam Suspicion</option>
            </select>
            <textarea
              rows="3"
              placeholder="Explain why this content violates community guidelines..."
              value={reportModal.details}
              onChange={(e) => setReportModal({ ...reportModal, details: e.target.value })}
              className="w-full border rounded-lg p-2 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setReportModal({ open: false })} className="px-3 py-1.5 border rounded text-xs">
                Cancel
              </button>
              <button onClick={handleSubmitReport} className="px-4 py-1.5 bg-red-600 text-white rounded text-xs font-semibold">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
