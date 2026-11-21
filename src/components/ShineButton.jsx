import React from 'react';

export default function ShineButton({
  children,
  onClick,
  className = '',
  shineColorClasses = 'bg-purple-600',
  disabled = false,
  type = 'button'
}) {
  return (
    <div className={`relative w-full overflow-hidden group rounded-full ${className}`}>
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-1000 rounded-full ${shineColorClasses} blur-xl`}
      />
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`relative z-10 flex items-center justify-center rounded-full px-6 py-3 text-lg font-bold text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-black active:scale-[0.98] w-full ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <div
            className="absolute top-0 left-0 w-1/2 h-full bg-white/30 opacity-50 animate-shine-sweep"
            style={{ filter: 'blur(5px)' }}
          />
        </div>
        <span className="relative z-20 flex items-center justify-center gap-2">{children}</span>
      </button>
    </div>
  );
}

