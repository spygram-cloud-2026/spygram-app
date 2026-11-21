import React, { useState } from 'react';
import { EyeOff, Eye, Lock, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import VipLockModal from './VipLockModal';

export default function SensitiveMedia({ imageUrl, caption = "Mídia Confidencial" }) {
  const { isPaid } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    if (!isPaid) {
      setShowModal(true);
    } else {
      setRevealed(!revealed);
    }
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className="relative overflow-hidden rounded-xl border border-[#363636] cursor-pointer group bg-[#181818] aspect-[4/5] max-w-[260px]"
      >
        {/* Background Image (blurred if not revealed or not paid) */}
        <img
          src={imageUrl}
          alt="Mídia privada"
          className={`w-full h-full object-cover transition-all duration-500 ${
            isPaid && revealed ? 'filter-none scale-100' : 'filter blur-xl scale-110 opacity-70'
          }`}
        />

        {/* Sensitive Content Overlay */}
        {(!isPaid || !revealed) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[#ed4956]/20 border border-[#ed4956]/40 flex items-center justify-center text-[#ed4956] mb-2 shadow-lg group-hover:scale-110 transition-transform">
              {isPaid ? <EyeOff size={18} /> : <Lock size={18} />}
            </div>
            
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              {isPaid ? 'Mídia Oculta' : 'Conteúdo Bloqueado'}
            </span>
            
            <p className="text-[11px] text-[#a8a8a8] mt-1 line-clamp-2">
              {caption}
            </p>

            <span className="mt-3 text-[11px] bg-[#262626] border border-[#363636] text-[#0095f6] font-semibold px-2.5 py-1 rounded-full group-hover:bg-[#363636] transition-colors">
              {isPaid ? 'Toque para revelar' : '🔒 Desbloquear mídia'}
            </span>
          </div>
        )}
      </div>

      <VipLockModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Mídia Privada Interceptada" 
      />
    </>
  );
}
