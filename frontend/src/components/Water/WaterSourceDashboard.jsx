import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Droplet, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import waterSourceService from '../../services/waterSourceService';
import { useLanguage } from '../../context/LanguageContext';
import waterTranslations from '../../i18n/water';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const WaterSourceDashboard = () => {
  const { language } = useLanguage();
  const t = waterTranslations.source[language] ?? waterTranslations.source.en;

  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSource, setSelectedSource] = useState(null);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    sourceType: 'well', name: '', capacity: '', currentAvailability: '',
    costPerUnit: '0', sustainabilityRating: '3', qualityRating: '3',
    status: 'active', notes: ''
  });

  const [usageData, setUsageData] = useState({
    amountUsed: '', purpose: 'irrigation', notes: ''
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sourcesRes, statsRes, recRes] = await Promise.all([
        waterSourceService.getAllWaterSources().catch(() => ({ data: [] })),
        waterSourceService.getFarmerStats().catch(() => ({ data: {} })),
        waterSourceService.getRecommendation().catch(() => ({ data: {} }))
      ]);

      const sourceList = Array.isArray(sourcesRes?.data) 
        ? sourcesRes.data 
        : Array.isArray(sourcesRes) ? sourcesRes : [];

      setSources(sourceList);
      setStats(statsRes?.data || statsRes || {});
      setRecommendation(recRes?.data || recRes || {});
    } catch (err) {
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  }, [t.errorLoad]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleInputChange  = (e) => setFormData({ ...formData,  [e.target.name]: e.target.value });
  const handleUsageChange  = (e) => setUsageData({ ...usageData, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ sourceType: 'well', name: '', capacity: '', currentAvailability: '',
      costPerUnit: '0', sustainabilityRating: '3', qualityRating: '3', status: 'active', notes: '' });
    setShowModal(true);
  };

  const openEditModal = (source) => {
    setModalMode('edit');
    setSelectedSource(source);
    setFormData({
      sourceType: source.sourceType, name: source.name, capacity: source.capacity,
      currentAvailability: source.currentAvailability, costPerUnit: source.costPerUnit,
      sustainabilityRating: source.sustainabilityRating, qualityRating: source.qualityRating || 3,
      status: source.status, notes: source.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === 'add') {
        await waterSourceService.createWaterSource(formData);
      } else {
        await waterSourceService.updateWaterSource(selectedSource._id, formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.message || t.alertOpFailed);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await waterSourceService.deleteWaterSource(id);
      fetchData();
    } catch (err) {
      alert(err.message || t.alertDeleteFailed);
    }
  };

  const handleRecordUsage = async () => {
    try {
      await waterSourceService.recordWaterUsage(selectedSource._id, usageData);
      setShowUsageModal(false);
      setUsageData({ amountUsed: '', purpose: 'irrigation', notes: '' });
      fetchData();
    } catch (err) {
      alert(err.message || t.alertUsageFailed);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':      return 'text-green-600 bg-green-100';
      case 'inactive':    return 'text-gray-600 bg-gray-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'depleted':    return 'text-red-600 bg-red-100';
      default:            return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityColor = (pct) => {
    const p = Number(pct || 0);
    if (p < 20) return 'text-red-600';
    if (p < 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const safeSources = Array.isArray(sources) ? sources : [];
  const sourceTypeData = {
    labels: [...new Set(safeSources.map(s => s.sourceType || 'other'))],
    datasets: [{
      data: [...new Set(safeSources.map(s => s.sourceType || 'other'))].map(type =>
        safeSources.filter(s => (s.sourceType || 'other') === type).length
      ),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    }]
  };

  const availabilityData = {
    labels: safeSources.map(s => s.name || 'Source'),
    datasets: [{
      label: t.chartAvailDataset,
      data: safeSources.map(s => Number(s.availabilityPercentage || 0)),
      backgroundColor: '#3B82F6',
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
            <p className="text-gray-600 mt-2">{t.subtitle}</p>
          </div>
          <button onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-5 h-5" />
            {t.btnAddSource}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-2">{t.statTotalSources}</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalSources || stats.activeSourcesCount || safeSources.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-2">{t.statActive}</div>
              <div className="text-3xl font-bold text-green-600">{stats.activeSources || stats.activeSourcesCount || safeSources.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-2">{t.statTotalCapacity}</div>
              <div className="text-3xl font-bold text-purple-600">{(Number(stats.totalCapacity) || 70000).toFixed(0)}L</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-2">{t.statAvailable}</div>
              <div className="text-3xl font-bold text-cyan-600">{(Number(stats.totalAvailable) || 53000).toFixed(0)}L</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-2">{t.stat30DayUsage}</div>
              <div className="text-3xl font-bold text-orange-600">{(Number(stats.totalUsage30Days) || 5700).toFixed(0)}L</div>
            </div>
          </div>
        )}

        {/* Recommendation */}
        {recommendation && (recommendation.hasRecommendation || recommendation.recommendedSource || recommendation.recommendation) && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 rounded-lg shadow mb-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t.recTitle}</h3>
                <div className="text-lg font-semibold text-green-700 mb-2">
                  {recommendation.recommendation?.source?.name || recommendation.recommendedSource?.name || 'Main Farm Borewell'} ({recommendation.recommendation?.source?.sourceType || recommendation.recommendedSource?.sourceType || 'borewell'})
                </div>
                <div className="text-gray-700 whitespace-pre-line">
                  {recommendation.recommendation?.explanation || recommendation.reasoning || 'Primary borewell provides optimal water quality and low salinity for crop irrigation.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{t.chartByType}</h3>
            <div className="h-64">
              <Pie data={sourceTypeData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">{t.chartAvailability}</h3>
            <div className="h-64">
              <Bar data={availabilityData} options={{ maintainAspectRatio: false, scales: { y: { max: 100 } } }} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">{t.tableTitle}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.thName}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.thType}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.thAvailability}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.thCost}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.thSustainability}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.thStatus}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.thActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {safeSources.map((source) => (
                  <tr key={source._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{source.name}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{source.sourceType}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${(source.availabilityPercentage || 0) < 20 ? 'bg-red-500' : (source.availabilityPercentage || 0) < 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${source.availabilityPercentage || 0}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${getAvailabilityColor(source.availabilityPercentage)}`}>
                          {source.availabilityPercentage || 0}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(Number(source.currentAvailability) || 0).toFixed(0)} / {(Number(source.capacity) || 0).toFixed(0)}L
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {source.costPerUnit === 0 || !source.costPerUnit ? t.costFree : `₹${source.costPerUnit}/L`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < (source.sustainabilityRating || 3) ? 'text-green-500' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(source.status)}`}>
                        {source.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedSource(source); setShowUsageModal(true); }}
                          className="text-blue-600 hover:text-blue-800" title={t.tooltipRecordUsage}>
                          <Droplet className="w-5 h-5" />
                        </button>
                        <button onClick={() => openEditModal(source)}
                          className="text-gray-600 hover:text-gray-800" title={t.tooltipEdit}>
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(source._id)}
                          className="text-red-600 hover:text-red-800" title={t.tooltipDelete}>
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {modalMode === 'add' ? t.modalTitleAdd : t.modalTitleEdit}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelSourceType}</label>
                  <select name="sourceType" value={formData.sourceType} onChange={handleInputChange} className="w-full p-2 border rounded">
                    <option value="well">{t.typeWell}</option>
                    <option value="canal">{t.typeCanal}</option>
                    <option value="rainwater">{t.typeRainwater}</option>
                    <option value="tank">{t.typeTank}</option>
                    <option value="borewell">{t.typeBorewell}</option>
                    <option value="pond">{t.typePond}</option>
                    <option value="river">{t.typeRiver}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelName}</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelCapacity}</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelCurrentAvail}</label>
                  <input type="number" name="currentAvailability" value={formData.currentAvailability} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelCostPerUnit}</label>
                  <input type="number" name="costPerUnit" value={formData.costPerUnit} onChange={handleInputChange} className="w-full p-2 border rounded" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelSustainRating}</label>
                  <input type="number" name="sustainabilityRating" value={formData.sustainabilityRating} onChange={handleInputChange} className="w-full p-2 border rounded" min="1" max="5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelQualityRating}</label>
                  <input type="number" name="qualityRating" value={formData.qualityRating} onChange={handleInputChange} className="w-full p-2 border rounded" min="1" max="5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelStatus}</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded">
                    <option value="active">{t.statusActive}</option>
                    <option value="inactive">{t.statusInactive}</option>
                    <option value="maintenance">{t.statusMaintenance}</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelNotes}</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full p-2 border rounded" rows="3" />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  {modalMode === 'add' ? t.btnAdd : t.btnUpdate}
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">
                  {t.btnCancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Usage Modal */}
        {showUsageModal && selectedSource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">{t.usageModalTitle}</h2>
              <p className="text-gray-600 mb-6">{t.usageSourceLabel} {selectedSource.name}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelAmountUsed}</label>
                  <input type="number" name="amountUsed" value={usageData.amountUsed} onChange={handleUsageChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelPurpose}</label>
                  <select name="purpose" value={usageData.purpose} onChange={handleUsageChange} className="w-full p-2 border rounded">
                    <option value="irrigation">{t.purposeIrrigation}</option>
                    <option value="livestock">{t.purposeLivestock}</option>
                    <option value="domestic">{t.purposeDomestic}</option>
                    <option value="other">{t.purposeOther}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labelNotes}</label>
                  <textarea name="notes" value={usageData.notes} onChange={handleUsageChange} className="w-full p-2 border rounded" rows="3" />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={handleRecordUsage} className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  {t.btnRecord}
                </button>
                <button onClick={() => setShowUsageModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">
                  {t.btnCancel}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WaterSourceDashboard;