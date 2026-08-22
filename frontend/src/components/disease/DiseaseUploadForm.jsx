import React, { useState, useRef, useCallback } from 'react';
import { Upload, Loader, AlertCircle, Layers, TestTube, Sliders } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LABELS = {
  en: {
    uploadLabel: "Plant / Crop Image *",
    dropText: "Drag & drop or click to upload plant image",
    dropActiveText: "Drop image here",
    dropHint: "JPG, PNG, WEBP up to 5MB (Leaves, Ear/Spike, Stem, Fruit, Root)",
    cropTypeLabel: "Crop Type *",
    cropTypePh: "e.g. Wheat, Tomato, Rice...",
    organLabel: "Affected Plant Organ *",
    stageLabel: "Crop Growth Stage",
    varietyLabel: "Variety",
    optional: "(optional)",
    varietyPh: "e.g. Basmati, HD-2967...",
    advancedToggleHide: "Hide Optional Soil, Water & Irrigation Sensor Data",
    advancedToggleShow: "+ Add Optional Soil, Water & Irrigation Sensor Data (Increases Diagnosis Confidence)",
    advancedHint: "Real sensor readings help AgriSathi distinguish diseases from nutrient deficiencies or salinity stress.",
    soilPH: "Soil pH",
    soilMoisture: "Soil Moisture %",
    waterEC: "Water EC (dS/m)",
    irrigationPractice: "Irrigation Practice",
    irrigationOptions: {
      sprinkler: "Overhead Sprinkler (High foliage wetness)",
      drip: "Drip Irrigation (Soil root zone)",
      flood: "Surface Furrow / Flood Irrigation"
    },
    errSelectImage: "Please upload a plant image.",
    errCropType: "Please enter the crop type.",
    errOrgan: "Please select the affected area.",
    errFileType: "Only JPG, PNG, WEBP, or GIF images are allowed.",
    errFileSize: "Image must be less than 5MB.",
    submittingBtn: "Running Multimodal Evidence Fusion...",
    submitBtn: "Generate Evidence-Based Multimodal Diagnosis",
    submittingSub: "Cross-validating computer vision with 7-14 day weather, soil, and irrigation data..."
  },
  hi: {
    uploadLabel: "पौधे / फसल की छवि *",
    dropText: "पौधे की छवि अपलोड करने के लिए खींचें और छोड़ें या क्लिक करें",
    dropActiveText: "छवि यहाँ छोड़ें",
    dropHint: "JPG, PNG, WEBP अधिकतम 5MB तक (पत्तियां, बाली, तना, फल, जड़)",
    cropTypeLabel: "फसल का प्रकार *",
    cropTypePh: "जैसे गेहूँ, टमाटर, धान...",
    organLabel: "प्रभावित पौधा अंग *",
    stageLabel: "फसल विकास चरण",
    varietyLabel: "किस्म",
    optional: "(वैकल्पिक)",
    varietyPh: "जैसे बासमती, HD-2967...",
    advancedToggleHide: "वैकल्पिक मिट्टी, जल और सिंचाई सेंसर डेटा छुपाएं",
    advancedToggleShow: "+ वैकल्पिक मिट्टी, जल और सिंचाई सेंसर डेटा जोड़ें (निदान सटीकता बढ़ाता है)",
    advancedHint: "वास्तविक सेंसर डेटा एग्रीसाथी को पोषक तत्वों की कमी से बीमारियों को अलग करने में मदद करता है।",
    soilPH: "मिट्टी का pH",
    soilMoisture: "मिट्टी की नमी %",
    waterEC: "जल EC (dS/m)",
    irrigationPractice: "सिंचाई प्रणाली",
    irrigationOptions: {
      sprinkler: "ओवरहेड स्प्रिंकलर (पत्तियों पर उच्च नमी)",
      drip: "ड्रिप सिंचाई (जड़ क्षेत्र)",
      flood: "सतही नाली / बाढ़ सिंचाई"
    },
    errSelectImage: "कृपया पौधे की तस्वीर अपलोड करें।",
    errCropType: "कृपया फसल का प्रकार दर्ज करें।",
    errOrgan: "कृपया प्रभावित अंग चुनें।",
    errFileType: "केवल JPG, PNG, WEBP या GIF छवियों की अनुमति है।",
    errFileSize: "छवि 5MB से कम होनी चाहिए।",
    submittingBtn: "बहुविध साक्ष्य विश्लेषण चल रहा है...",
    submitBtn: "साक्ष्य-आधारित बहुविध निदान उत्पन्न करें",
    submittingSub: "मौसम, मिट्टी और सिंचाई डेटा के साथ कंप्यूटर विज़न का क्रॉस-सत्यापन जारी है..."
  },
  bn: {
    uploadLabel: "গাছ / ফসলের ছবি *",
    dropText: "গাছের ছবি আপলোড করতে ড্র্যাগ ও ড্রপ করুন বা ক্লিক করুন",
    dropActiveText: "এখানে ছবি ছেড়ে দিন",
    dropHint: "JPG, PNG, WEBP সর্বোচ্চ 5MB পর্যন্ত (পাতা, ছড়া/শীষ, কাণ্ড, ফল, মূল)",
    cropTypeLabel: "ফসলের ধরন *",
    cropTypePh: "যেমন: গম, টমেটো, ধান...",
    organLabel: "আক্রান্ত গাছের অঙ্গ *",
    stageLabel: "ফসলের বৃদ্ধির পর্যায়",
    varietyLabel: "জাত",
    optional: "(ঐচ্ছিক)",
    varietyPh: "যেমন: বাসমতি, HD-2967...",
    advancedToggleHide: "ঐচ্ছিক মাটি, পানি ও সেচ সেন্সর ডেটা লুকান",
    advancedToggleShow: "+ ঐচ্ছিক মাটি, পানি ও সেচ সেন্সর ডেটা যোগ করুন (রোগ নির্ণয়ের সঠিকতা বৃদ্ধি করে)",
    advancedHint: "প্রকৃত সেন্সর রিডিং এগ্রিসাথীকে পুষ্টির ঘাটতি বা লবণাক্ততার সমস্যা থেকে রোগ পৃথক করতে সাহায্য করে।",
    soilPH: "মাটির pH",
    soilMoisture: "মাটির আর্দ্রতা %",
    waterEC: "পানির EC (dS/m)",
    irrigationPractice: "সেচ ব্যবস্থা",
    irrigationOptions: {
      sprinkler: "ওভারহেড স্প্রিঙ্কলার সেচ (পাতায় উচ্চ আর্দ্রতা)",
      drip: "ড্রিপ সেচ (শিকড় অঞ্চল)",
      flood: "প্লাবন সেচ / ড্রেন সেচ"
    },
    errSelectImage: "অনুগ্রহ করে একটি গাছের ছবি আপলোড করুন।",
    errCropType: "অনুগ্রহ করে ফসলের ধরন লিখুন।",
    errOrgan: "অনুগ্রহ করে আক্রান্ত অঙ্গ বেছে নিন।",
    errFileType: "কেবল JPG, PNG, WEBP বা GIF ছবির অনুমতি রয়েছে।",
    errFileSize: "ছবি অবশ্যই 5MB এর কম হতে হবে।",
    submittingBtn: "মাল্টিমোডাল প্রমাণ বিশ্লেষণ চলছে...",
    submitBtn: "প্রমাণ-ভিত্তিক মাল্টিমোডাল রোগ নির্ণয় করুন",
    submittingSub: "আবহাওয়া, মাটি এবং সেচ ডেটার সাথে ছবি বিশ্লেষণ মিলিয়ে দেখা হচ্ছে..."
  }
};

const AFFECTED_AREAS = [
  { value: 'leaf', en: 'Leaf', hi: 'पत्ती', bn: 'পাতা' },
  { value: 'spike', en: 'Spike / Ear / Head', hi: 'बाली / बालियाँ', bn: 'শীষ / ছড়া' },
  { value: 'stem', en: 'Stem / Stalk', hi: 'तनाव / शाखा', bn: 'কাণ্ড / ডাল' },
  { value: 'sheath', en: 'Sheath', hi: 'খোল (शीथ)', bn: 'খোল' },
  { value: 'grain', en: 'Grain / Kernel', hi: 'अनाज / बीज', bn: 'দানা / বীজ' },
  { value: 'fruit', en: 'Fruit / Pod', hi: 'फल', bn: 'ফল' },
  { value: 'root', en: 'Roots', hi: 'जड़', bn: 'মূল / শিকড়' },
  { value: 'whole-plant', en: 'Whole Plant', hi: 'पूरा पौधा', bn: 'সম্পূর্ণ গাছ' }
];

const GROWTH_STAGES = [
  { value: 'seedling', en: 'Seedling', hi: 'अंकुरण अवस्था', bn: 'চারা পর্যায়' },
  { value: 'vegetative', en: 'Vegetative', hi: 'वानस्पतिक वृद्धि अवस्था', bn: 'বানস্পতিক বৃদ্ধি পর্যায়' },
  { value: 'flowering', en: 'Flowering / Anthesis', hi: 'फूल आने की अवस्था', bn: 'ফুল ফোটার পর্যায়' },
  { value: 'fruiting', en: 'Fruiting / Tuberization', hi: 'फल लगने की अवस्था', bn: 'ফল ধরার পর্যায়' },
  { value: 'maturation', en: 'Maturation', hi: 'परिपक्वता', bn: 'পরিপক্কতা পর্যায়' }
];

const DiseaseUploadForm = ({ onSubmit, loading }) => {
  const { language } = useLanguage();
  const l = LABELS[language] || LABELS.en;

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [formError, setFormError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [cropDetails, setCropDetails] = useState({
    cropType: '',
    variety: '',
    plantAge: '',
    growthStage: 'vegetative',
    affectedArea: 'leaf',
    soilpH: '',
    soilEC: '',
    soilMoisture: '',
    waterpH: '',
    waterEC: '',
    irrigationMethod: 'Overhead Sprinkler',
    geminiApiKey: ''
  });

  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setFormError(l.errFileType);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError(l.errFileSize);
      return;
    }
    setFormError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, [l]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCropDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!imageFile) { setFormError(l.errSelectImage); return; }
    if (!cropDetails.cropType.trim()) { setFormError(l.errCropType); return; }
    if (!cropDetails.affectedArea) { setFormError(l.errOrgan); return; }
    onSubmit(imageFile, cropDetails);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Drop zone */}
      <div>
        <label className={labelClass}>{l.uploadLabel}</label>
        {!imagePreview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${dragOver
                ? 'border-green-500 bg-green-50 scale-[1.01]'
                : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-full mb-3 ${dragOver ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Upload className={`w-7 h-7 ${dragOver ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {dragOver ? l.dropActiveText : l.dropText}
              </p>
              <p className="text-xs text-gray-400 mt-1">{l.dropHint}</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 flex justify-center items-center p-2">
            <img src={imagePreview} alt="Uploaded plant" className="max-h-64 object-contain rounded-lg" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Crop & Organ Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Crop Type */}
        <div>
          <label className={labelClass} htmlFor="cropType">{l.cropTypeLabel}</label>
          <input
            id="cropType"
            name="cropType"
            value={cropDetails.cropType}
            onChange={handleChange}
            placeholder={l.cropTypePh}
            className={inputClass}
            autoComplete="off"
          />
        </div>

        {/* Affected Organ / Part */}
        <div>
          <label className={labelClass} htmlFor="affectedArea">{l.organLabel}</label>
          <select
            id="affectedArea"
            name="affectedArea"
            value={cropDetails.affectedArea}
            onChange={handleChange}
            className={inputClass}
          >
            {AFFECTED_AREAS.map(a => (
              <option key={a.value} value={a.value}>{a[language] || a.en}</option>
            ))}
          </select>
        </div>

        {/* Growth Stage */}
        <div>
          <label className={labelClass} htmlFor="growthStage">{l.stageLabel}</label>
          <select
            id="growthStage"
            name="growthStage"
            value={cropDetails.growthStage}
            onChange={handleChange}
            className={inputClass}
          >
            {GROWTH_STAGES.map(s => (
              <option key={s.value} value={s.value}>{s[language] || s.en}</option>
            ))}
          </select>
        </div>

        {/* Variety */}
        <div>
          <label className={labelClass} htmlFor="variety">{l.varietyLabel} <span className="text-gray-400 font-normal">{l.optional}</span></label>
          <input
            id="variety"
            name="variety"
            value={cropDetails.variety}
            onChange={handleChange}
            placeholder={l.varietyPh}
            className={inputClass}
          />
        </div>
      </div>

      {/* Advanced Soil, Water & Sensor Panel Toggle */}
      <div className="border-t border-gray-200 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          className="flex items-center space-x-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
        >
          <Sliders className="w-4 h-4" />
          <span>{showAdvanced ? l.advancedToggleHide : l.advancedToggleShow}</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-4">
            <p className="text-xs text-emerald-800 flex items-center space-x-1 font-medium">
              <TestTube className="w-3.5 h-3.5" />
              <span>{l.advancedHint}</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{l.soilPH}</label>
                <input
                  name="soilpH"
                  type="number"
                  step="0.1"
                  value={cropDetails.soilpH}
                  onChange={handleChange}
                  placeholder="e.g. 6.5"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{l.soilMoisture}</label>
                <input
                  name="soilMoisture"
                  type="number"
                  value={cropDetails.soilMoisture}
                  onChange={handleChange}
                  placeholder="e.g. 55"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{l.waterEC}</label>
                <input
                  name="waterEC"
                  type="number"
                  step="0.1"
                  value={cropDetails.waterEC}
                  onChange={handleChange}
                  placeholder="e.g. 1.2"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
                />
              </div>
              <div className="col-span-2 sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{l.irrigationPractice}</label>
                <select
                  name="irrigationMethod"
                  value={cropDetails.irrigationMethod}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
                >
                  <option value="Overhead Sprinkler">{l.irrigationOptions.sprinkler}</option>
                  <option value="Drip Irrigation">{l.irrigationOptions.drip}</option>
                  <option value="Surface Furrow">{l.irrigationOptions.flood}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {formError && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{formError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !imageFile}
        className={`
          w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200
          ${loading || !imageFile
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md active:scale-[0.99]'
          }
        `}
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>{l.submittingBtn}</span>
          </>
        ) : (
          <>
            <Layers className="w-4 h-4" />
            <span>{l.submitBtn}</span>
          </>
        )}
      </button>

      {loading && (
        <p className="text-xs text-center text-gray-500">
          {l.submittingSub}
        </p>
      )}
    </form>
  );
};

export default DiseaseUploadForm;