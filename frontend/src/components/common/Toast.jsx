// src/components/common/Toast.jsx
import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  return (
    <div 
      className={`
        ${getColors()}
        text-white px-6 py-4 rounded-lg shadow-2xl border-l-4
        flex items-center gap-3 min-w-[300px] max-w-md
        animate-slide-up
      `}
    >
      <span className="text-2xl">{getIcon()}</span>
      <p className="font-semibold flex-1">{message}</p>
      <button 
        onClick={onClose}
        className="text-white/80 hover:text-white font-bold text-xl"
      >
        ×
      </button>
    </div>
  );
}
