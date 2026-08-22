import React from 'react';

const ModeSwitcher = ({ mode, setMode }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Choose Your Prediction Method
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simple Mode */}
        <button
          onClick={() => setMode('simple')}
          className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
            mode === 'simple'
              ? 'border-green-500 bg-green-50 shadow-lg scale-105'
              : 'border-gray-200 hover:border-green-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              mode === 'simple' ? 'bg-green-500' : 'bg-gray-200'
            }`}>
              <span className="text-3xl">🌾</span>
            </div>
            
            <h4 className={`text-xl font-bold mb-2 ${
              mode === 'simple' ? 'text-green-700' : 'text-gray-700'
            }`}>
              Easy Estimator
            </h4>
            
            <p className="text-sm text-gray-600 mb-4">
              No lab tests or sensors needed. Answer simple questions about your crop.
            </p>
            
            <div className="space-y-2 text-left w-full">
              <div className="flex items-start text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Based on your observations</span>
              </div>
              <div className="flex items-start text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Quick and practical</span>
              </div>
              <div className="flex items-start text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Actionable recommendations</span>
              </div>
            </div>

            <div className="mt-4 w-full">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 font-medium">
                  ⭐ Recommended for most farmers
                </p>
              </div>
            </div>
          </div>
          
          {mode === 'simple' && (
            <div className="absolute top-3 right-3">
              <div className="bg-green-500 text-white rounded-full p-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </button>

        {/* Advanced Mode */}
        <button
          onClick={() => setMode('advanced')}
          className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
            mode === 'advanced'
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              mode === 'advanced' ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
              <span className="text-3xl">🔬</span>
            </div>
            
            <h4 className={`text-xl font-bold mb-2 ${
              mode === 'advanced' ? 'text-blue-700' : 'text-gray-700'
            }`}>
              AI Prediction
            </h4>
            
            <p className="text-sm text-gray-600 mb-4">
              Advanced ML model using soil test data, weather, and scientific parameters.
            </p>
            
            <div className="space-y-2 text-left w-full">
              <div className="flex items-start text-sm">
                <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Requires soil test data (NPK, pH)</span>
              </div>
              <div className="flex items-start text-sm">
                <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">AI-powered prediction</span>
              </div>
              <div className="flex items-start text-sm">
                <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">More precise results</span>
              </div>
            </div>

            <div className="mt-4 w-full">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-800 font-medium">
                  🔬 For users with lab test reports
                </p>
              </div>
            </div>
          </div>
          
          {mode === 'advanced' && (
            <div className="absolute top-3 right-3">
              <div className="bg-blue-500 text-white rounded-full p-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-800 mb-1">Not sure which to choose?</p>
            <p>
              If you don't have soil test reports or scientific data, use the <strong>Easy Estimator</strong>. 
              It's designed for practical farming decisions based on what you can see in your field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSwitcher;