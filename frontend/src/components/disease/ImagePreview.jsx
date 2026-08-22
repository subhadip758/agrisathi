import React from 'react';
import { X, ZoomIn, Image } from 'lucide-react';

const ImagePreview = ({ imageUrl, fileName, fileSize, onRemove, className = '' }) => {
  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!imageUrl) {
    return (
      <div className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 h-48 ${className}`}>
        <div className="text-center">
          <Image className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No image selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 ${className}`}>
      {/* Image */}
      <div className="relative aspect-video flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt="Leaf preview"
          className="w-full h-full object-contain"
          style={{ maxHeight: '260px' }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => window.open(imageUrl, '_blank')}
            className="p-2 bg-white rounded-full shadow-md mr-2 hover:bg-gray-100 transition-colors"
            title="View full image"
          >
            <ZoomIn className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* File info bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2 min-w-0">
          <Image className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate max-w-[180px]">
              {fileName || 'Leaf image'}
            </p>
            {fileSize && (
              <p className="text-xs text-gray-400">{formatSize(fileSize)}</p>
            )}
          </div>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;