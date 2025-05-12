import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-white bg-opacity-60">
      <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay;
