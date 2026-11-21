import React from 'react';

export default function TopProgressBar({ progress, isVisible }) {
  return (
    <div
      className={`fixed top-0 left-0 h-1.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 z-[9999] transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ width: `${progress}%` }}
    />
  );
}

