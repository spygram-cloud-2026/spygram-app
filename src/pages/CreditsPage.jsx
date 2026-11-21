import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Coins, 
  Zap, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Crown,
  CreditCard
} from 'lucide-react';

export default function CreditsPage() {
  const { credits, setCredits } = useApp();
  const [successMessage, setSuccessMessage] = useState('');

  const packages = [
    {
      id: 'lite',
      name: 'Protocolo Lite',
      price: 49.50,
      credits: 150,
      description: 'Ideal para investigações rápidas de até 3 perfis diferentes.',
      features: [
        '150 Créditos de Consulta',
        'Extração de Directs Apagados',
        'Download de Áudios',
        'Suporte por Ticket'
      ],
      badge: 'Básico'
    },
    {
      id: 'elite',
      name: 'Protocolo Elite',
      price: 79.50,
      credits: 450,
      popular: true,
      description: 'O pacote mais escolhido. Monitoramento completo e contínuo.',
      features: [
        '450 Créditos de Consulta',
        'Acesso Imediato a Stories Ocultos',
        'Rastreamento de IP e Antena',
        'Alertas em Tempo Real de Novos Chats',
        'Prioridade nos Clusters de Proxy'
      ],
      badge: 'Mais Vendido'
    },
    {
      id: 'full',
      name: 'Dominação Total',
      price: 149.00,
      credits: 1200,
      description: 'Poder forense ilimitado com acesso total em múltiplos dispositivos.',
      features: [
        '1.200 Créditos Forenses',
        'Contas Ilimitadas no Painel',
        'Recuperação Histórica de 1 Ano',
        'Espião Simultâneo de WhatsApp',
        'Linha Direta de Suporte Prioritário'
      ],
      badge: 'Máximo Poder'
    }
  ];

  const handleBuy = (pkg) => {
    setCredits(prev => prev + pkg.credits);
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
    setSuccessMessage(`Recarga do ${pkg.name} efetuada com sucesso! +${pkg.credits} créditos adicionados.`);
    setTimeout(() => setSuccessMessage(''), 4500);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 px-4 pt-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Coins size={14} />
            LOJA DE PROTOCOLOS E RECARGAS
          </div>
          <h1 className="text-3xl font-black text-white">Adquira Créditos de Consulta</h1>
          <p className="text-xs text-[#a8a8a8] mt-1.5 leading-relaxed">
            Utilize créditos para realizar novas varreduras forenses, restaurar conversas deletadas há mais de 30 dias e ativar rastreamento por antena.
          </p>

          {/* Current balance card */}
          <div className="mt-5 inline-flex items-center gap-3 bg-[#121212] border border-[#262626] px-5 py-2.5 rounded-2xl shadow-sm">
            <span className="text-xs text-[#737373]">Saldo Atual:</span>
            <span className="text-lg font-mono font-bold text-[#f59e0b] flex items-center gap-1.5">
              <Coins size={18} />
              {credits} Créditos
            </span>
          </div>
        </div>

        {successMessage && (
          <div className="bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] p-3.5 rounded-xl text-xs font-bold text-center max-w-md mx-auto flex items-center justify-center gap-2">
            <Check size={16} />
            {successMessage}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                pkg.popular
                  ? 'bg-gradient-to-b from-[#1c1c1c] to-[#121212] border-2 border-[#0095f6] shadow-2xl shadow-[#0095f6]/10 transform md:-translate-y-2'
                  : 'bg-[#121212] border border-[#262626] hover:border-[#363636]'
              }`}
            >
              {pkg.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  pkg.popular ? 'bg-[#0095f6] text-white shadow-md' : 'bg-[#262626] text-[#a8a8a8] border border-[#363636]'
                }`}>
                  {pkg.badge}
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mt-4">{pkg.name}</h3>
                <p className="text-xs text-[#737373] mt-1 mb-4">{pkg.description}</p>

                <div className="mb-6 pb-6 border-b border-[#262626]">
                  <span className="text-xs text-[#a8a8a8]">Por apenas</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-black font-mono text-white">
                      R$ {pkg.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <span className="text-xs text-[#10b981] font-mono font-bold mt-1 block">
                    +{pkg.credits} Créditos inclusos
                  </span>
                </div>

                <div className="space-y-2.5 mb-6">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#a8a8a8]">
                      <Check size={14} className="text-[#10b981] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleBuy(pkg)}
                className={`w-full py-3.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                  pkg.popular
                    ? 'btn-gradient btn-shine text-white'
                    : 'bg-[#262626] hover:bg-[#363636] text-white'
                }`}
              >
                <Zap size={14} />
                <span>RECARREGAR PACOTE</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
