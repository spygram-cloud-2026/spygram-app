import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, Sparkles, X, Check, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VipLockModal({ 
  isOpen, 
  onClose, 
  title = "Acesso Restrito: Conteúdo Privado",
  subtitle = null
}) {
  const navigate = useNavigate();
  const { targetUser } = useApp();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content relative overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #181818 0%, #121212 100%)',
          border: '1px solid rgba(237, 73, 86, 0.4)',
          boxShadow: '0 0 30px rgba(237, 73, 86, 0.25)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737373] hover:text-white p-1 rounded-full bg-[#262626]/80 hover:bg-[#363636] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ed4956] to-[#dc2743] flex items-center justify-center text-white mb-3 shadow-lg shadow-[#ed4956]/30 animate-pulse">
            <Lock size={26} />
          </div>
          <span className="badge-danger mb-2">
            <ShieldAlert size={12} />
            Proteção Criptografada Ativa
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-[#a8a8a8] mt-1 max-w-sm">
            {subtitle || (
              <>
                Os dados confidenciais do perfil de <strong className="text-white">@{targetUser.username}</strong> foram interceptados com sucesso, mas estão protegidos sob chave de criptografia militar.
              </>
            )}
          </p>
        </div>

        {/* Intercepted Data Highlights */}
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-3.5 mb-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a8a8a8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ed4956]"></span>
              Conversas Confidenciais
            </span>
            <span className="font-bold text-white font-mono bg-[#262626] px-2 py-0.5 rounded">14 detectadas</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a8a8a8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
              Fotos Temporárias Salvas
            </span>
            <span className="font-bold text-white font-mono bg-[#262626] px-2 py-0.5 rounded">6 recuperadas</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a8a8a8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe]"></span>
              Áudios de Voz Íntimos
            </span>
            <span className="font-bold text-white font-mono bg-[#262626] px-2 py-0.5 rounded">4 interceptados</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a8a8a8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              Localização em Tempo Real
            </span>
            <span className="font-bold text-[#10b981] font-mono bg-[#262626] px-2 py-0.5 rounded">Mapeada</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              navigate('/checkout');
            }}
            className="w-full btn-gradient btn-shine py-3.5 text-sm font-bold tracking-wide flex items-center justify-center gap-2 rounded-xl"
            style={{
              background: 'linear-gradient(90deg, #ed4956 0%, #dc2743 50%, #bc1888 100%)'
            }}
          >
            <Flame size={18} className="text-yellow-300 animate-bounce" />
            DESBLOQUEAR ACESSO COMPLETO AGORA
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-[#737373] hover:text-[#a8a8a8] transition-colors font-medium text-center"
          >
            Continuar com visualização restrita
          </button>
        </div>
      </div>
    </div>
  );
}
