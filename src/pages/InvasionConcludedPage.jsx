import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  BadgeCheck,
  Lock,
  Flame,
  Heart,
  Car,
  MapPin,
  Trash2,
  Image as ImageIcon,
  MessageSquare,
  Clock,
  Zap,
  Users,
  ChevronDown,
  HelpCircle,
  CheckCircle2,
  Check,
  Radio,
  Sparkles,
  ArrowRight,
  Headphones
} from 'lucide-react';
import ShineButton from '../components/ShineButton';

const RECOVERED_IMAGES = [
  '/recovered/img_1.jpg',
  '/recovered/img_2.png',
  '/recovered/img_3.jpg',
  '/recovered/img_4.jpg',
  '/recovered/img_5.jpg',
  '/recovered/img_6.jpeg',
  '/recovered/img_7.jpg',
  '/recovered/img_8.jpg',
  '/recovered/img_9.jpg',
  '/recovered/img_10.jpg',
  '/recovered/img_11.jpg',
  '/recovered/img_12.jpg',
  '/recovered/img_13.jpg'
];

const FAQ_ITEMS = [
  {
    question: 'O pagamento é único ou é uma assinatura?',
    answer:
      'O pagamento é único e vitalício. Você paga apenas uma vez e tem acesso permanente ao perfil invadido.'
  },
  {
    question: 'A pessoa que eu invadir vai saber que foi eu?',
    answer:
      'Não. O processo é 100% anônimo e indetectável. Sua identidade é totalmente protegida.'
  },
  {
    question: 'Funciona em qualquer celular?',
    answer:
      'Sim. Nosso sistema é baseado na web e funciona perfeitamente em qualquer dispositivo (celular, tablet ou computador) com acesso à internet.'
  },
  {
    question: 'O que acontece se não funcionar pra mim?',
    answer:
      'Oferecemos uma Garantia de 7 Dias. Se o acesso falhar ou você não estiver satisfeito, garantimos o reembolso total.'
  },
  {
    question: 'Preciso instalar algum aplicativo?',
    answer:
      'Não. Todo o processo é feito online, diretamente pelo seu navegador. Não é necessário baixar ou instalar nada.'
  }
];

const PROOF_CHATS = [
  { sender: 'user', username: 'user921', message: 'O acesso é realmente vitalício?', time: '14:30' },
  { sender: 'admin', message: 'Sim! Pagamento único. Sem mensalidades escondidas.', time: '14:31' },
  { sender: 'user', username: 'user333', message: 'Aceita PIX?', time: '14:32' },
  { sender: 'admin', message: 'Com certeza. Liberação imediata após o pagamento.', time: '14:33' },
  { sender: 'user', username: 'user403', message: 'Consigo ver as mensagens apagadas mesmo?', time: '14:34' },
  { sender: 'admin', message: 'Sim! O módulo recupera mensagens, fotos e áudios excluídos dos últimos 90 dias.', time: '14:35' }
];

const CONTACT_NAMES = [
  'Ana', 'Gabriela', 'Pedro', 'Gabriel', 'Mariana', 'Lucas', 'Juliana',
  'Matheus', 'Beatriz', 'Guilherme', 'Larissa', 'Rafael', 'Camila', 'Felipe'
];

function formatNumber(num) {
  if (!num) return '0';
  return new Intl.NumberFormat('pt-BR').format(num);
}

function maskUsername(name) {
  if (!name) return '*****';
  return name.length <= 4 ? name : `${name.substring(0, 4)}****`;
}

export default function InvasionConcludedPage() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [userCity, setUserCity] = useState('Sua Localização');
  const [contacts, setContacts] = useState([]);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Offer timer state (5 minutes = 300s)
  const [timerSeconds, setTimerSeconds] = useState(300);

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  // Live support chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const chatScrollRef = useRef(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('invasionData') || localStorage.getItem('spygram_active_invasion');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setProfileData(data.profileData);
        setUserCity(data.userCity || 'Sua Localização');
        localStorage.setItem('spygram_trial_expired', 'true');

        if (data.suggestedProfiles && data.suggestedProfiles.length > 0) {
          setContacts(data.suggestedProfiles);
        } else {
          const generated = CONTACT_NAMES.slice(0, 10).map((n) => ({
            username: n.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 100),
            fullName: n,
            profile_pic_url: '/perfil.jpg'
          }));
          setContacts(generated);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Handle scroll detection for floating hint
  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const nearBottom = scrollHeight - (scrollTop + clientHeight) < 150;
    setShowScrollHint(!nearBottom);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Flash offer timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  // Proof chat streaming
  useEffect(() => {
    let idx = 0;
    let timer = null;

    const stream = () => {
      if (idx < PROOF_CHATS.length) {
        const item = PROOF_CHATS[idx];
        setIsTyping(true);
        timer = setTimeout(() => {
          setIsTyping(false);
          setChatMessages((prev) => [...prev, item]);
          idx++;
          const delay = Math.random() * 2000 + 1000;
          timer = setTimeout(stream, delay);
        }, item.sender === 'admin' ? 1400 : 500);
      }
    };

    timer = setTimeout(stream, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'current_user', message: userInput, time };
    setChatMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'admin',
          message:
            'Estamos com uma alta demanda no momento, mas sua dúvida foi registrada. O acesso é liberado instantaneamente após a confirmação do pagamento no e-mail cadastrado!',
          time
        }
      ]);
    }, 2000);
  };

  const handleUnlockClick = () => {
    navigate('/checkout');
  };

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-transparent text-gray-200 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Glow Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-purple-900/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-pink-900/15 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-[480px] mx-auto px-4 pt-12 pb-24">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-8 bg-green-500/10 border border-green-500/30 py-2 px-4 rounded-full w-fit mx-auto backdrop-blur-md"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs font-black uppercase tracking-widest">
            Invasão 100% Concluída
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-black mb-2 text-white leading-tight uppercase">
            ALVO <span className="text-purple-500">DOMINADO.</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Todos os dados foram extraídos com sucesso.
          </p>
        </motion.div>

        {/* Target Profile Card */}
        <section className="mb-12 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden group">
          <div className="relative p-8">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
                <img
                  src={profileData.profilePicUrl || '/perfil.jpg'}
                  alt={profileData.username}
                  className="relative w-28 h-28 rounded-full object-cover border-4 border-black"
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    @{profileData.username}
                  </h2>
                  {profileData.isVerified && (
                    <BadgeCheck className="w-6 h-6 text-blue-400 fill-blue-400/10" />
                  )}
                </div>
                <p className="text-gray-400 font-medium">{profileData.fullName}</p>
              </div>

              <div className="grid grid-cols-3 w-full gap-3 mb-8">
                <div className="bg-white/5 rounded-2xl py-3 border border-white/5">
                  <p className="text-lg font-black text-white">
                    {formatNumber(profileData.postsCount || 84)}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                    Posts
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl py-3 border border-white/5">
                  <p className="text-lg font-black text-white">
                    {formatNumber(profileData.followers || 14800)}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                    Seguidores
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl py-3 border border-white/5">
                  <p className="text-lg font-black text-white">
                    {formatNumber(profileData.following || 612)}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                    Seguindo
                  </p>
                </div>
              </div>

              {profileData.biography && (
                <div className="w-full text-left bg-black/40 rounded-2xl p-4 border border-white/5 flex gap-3">
                  <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400 font-medium leading-relaxed whitespace-pre-wrap">
                    {profileData.biography}
                  </p>
                </div>
              )}

              {profileData.isPrivate !== false && (
                <div className="mt-6 flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                  <Lock className="w-3.5 h-3.5" />
                  Criptografia de Conta Privada Quebrada
                </div>
              )}
            </div>
          </div>

          {/* Círculo Íntimo */}
          <div className="px-8 pb-8">
            <div className="w-full h-px bg-white/10 mb-8" />
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Círculo Íntimo
              </h2>
            </div>
            <p className="text-sm text-gray-400 mb-6 text-left">
              Identificamos os perfis que possuem as interações mais frequentes com o alvo.
            </p>

            <div className="w-full overflow-hidden py-4">
              <div className="flex space-x-5 overflow-x-auto scrollbar-hide">
                {contacts.map((contact, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center flex-shrink-0 w-24 text-center group"
                  >
                    <div className="relative w-20 h-24 mb-2">
                      <div className="absolute inset-0 rounded-2xl border-2 border-red-500/30" />
                      <div className="absolute inset-1.5 rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
                        <img
                          src={contact.profile_pic_url || '/perfil.jpg'}
                          alt={contact.username}
                          className="w-full h-full object-cover blur-[5px] opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                          <Lock className="w-6 h-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter truncate w-full px-1">
                      @{maskUsername(contact.username)}
                    </p>
                    <div className="mt-1 px-2 py-0.5 rounded-full border bg-red-500/10 border-red-500/20 text-red-400">
                      <span className="text-[8px] font-bold uppercase tracking-widest">
                        Bloqueado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-12" />

        {/* Section: Location Tracking */}
        <section className="mb-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 mb-12 p-0 text-center w-full mx-auto"
          >
            <h2 className="text-3xl font-extrabold text-white mb-4">
              <span className="bg-gradient-to-r from-red-500 to-pink-600 text-transparent bg-clip-text">
                RASTREAMENTO DE LOCALIZAÇÃO EM TEMPO REAL
              </span>
            </h2>
            <p className="text-gray-300 mb-4 max-w-md mx-auto text-lg font-medium">
              <strong className="text-white">PROVA IRREFUTÁVEL!</strong> Nosso sistema de rastreamento de IP de última geração capturou a localização exata do alvo.
              <span className="block mt-2 text-yellow-400 font-bold">
                Desbloqueie agora e veja onde ele está neste exato momento!
              </span>
            </p>

            <p className="text-sm text-gray-400 font-semibold mb-8">
              Perfil encontrado perto de <span className="text-white font-bold">{userCity}</span>
            </p>

            <div className="relative w-full max-w-xs mx-auto aspect-square bg-[#1a1a1a] rounded-2xl overflow-hidden mb-6 border border-red-700/50 shadow-2xl">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-3/4 h-3/4 border-4 border-red-500 rounded-full opacity-50" />
              </motion.div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border-4 border-red-500 overflow-hidden shadow-2xl">
                    <img
                      src={profileData.profilePicUrl || '/perfil.jpg'}
                      alt={profileData.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-1 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                    ALVO
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[80%]">
                <button
                  type="button"
                  onClick={handleUnlockClick}
                  className="w-full py-2 px-3 text-xs font-black text-black rounded-lg bg-white transition-all duration-300 focus:outline-none hover:bg-gray-200 active:scale-95 shadow-lg"
                >
                  DESCOBRIR LOCALIZAÇÃO EXATA
                </button>
              </div>
            </div>

            <p className="text-sm text-red-400 font-semibold mb-8">
              Atenção: A localização é atualizada a cada 5 minutos. Não perca essa chance!
            </p>

            <ShineButton
              onClick={handleUnlockClick}
              className="w-full bg-red-600 focus:ring-red-500 active:scale-95 py-3.5"
              shineColorClasses="bg-red-500"
            >
              VER LOCALIZAÇÃO AGORA
            </ShineButton>
          </motion.div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-12" />

        {/* Section: Dating / Tinder Discovery */}
        <section className="mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 mb-12 p-6 text-center w-full mx-auto relative overflow-hidden"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Flame className="w-10 h-10 text-red-400 animate-pulse" />
              <h2 className="text-3xl font-extrabold text-white">
                <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-red-500 text-transparent bg-clip-text">
                  O SEGREDO MAIS QUENTE
                </span>
              </h2>
              <Heart className="w-10 h-10 text-pink-400 animate-pulse" />
            </div>

            <p className="text-gray-200 mb-6 max-w-md mx-auto text-lg font-medium">
              <strong className="text-white">DESMASCARADO!</strong> Descubra agora se o seu alvo está ativo no{' '}
              <strong className="text-pink-400">Tinder, Badoo, Happn</strong> ou qualquer outro aplicativo de relacionamento.
            </p>

            <div className="relative w-full max-w-[280px] mx-auto mb-8">
              <div className="relative w-full rounded-[2rem] overflow-hidden border border-gray-800 shadow-xl blur-[3px] select-none pointer-events-none bg-white">
                <img
                  src="/tinder.png"
                  alt="Tinder UI"
                  className="w-full h-auto block relative z-10"
                />
                <div
                  className="absolute z-20 rounded-[12px] overflow-hidden bg-gray-900"
                  style={{
                    top: '7.5%',
                    bottom: '26.5%',
                    left: '4%',
                    right: '4%'
                  }}
                >
                  <img
                    src={profileData.profilePicUrl || '/perfil.jpg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white flex items-end gap-2 z-30">
                    <span className="text-3xl font-bold tracking-tight drop-shadow-md">
                      {profileData.fullName ? profileData.fullName.split(' ')[0] : profileData.username}
                    </span>
                    <span className="text-2xl font-normal mb-0.5 drop-shadow-md">24</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md border border-pink-500/50 p-4 rounded-2xl shadow-2xl text-center pointer-events-auto">
                  <Lock className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-xs font-black uppercase text-pink-400 tracking-wider">
                    Perfil Ativo Detectado
                  </p>
                </div>
              </div>
            </div>

            <ShineButton
              onClick={handleUnlockClick}
              className="w-full bg-gradient-to-r from-pink-600 to-red-600 focus:ring-pink-500 active:scale-95 py-3.5"
              shineColorClasses="bg-pink-500"
            >
              VER CONTA NO TINDER
            </ShineButton>
          </motion.div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-12" />

        {/* Section: Vehicle / Satellite Tracking */}
        <section className="mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-12 mb-12 p-6 text-center w-full mx-auto relative overflow-hidden"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Car className="w-10 h-10 text-blue-400 animate-pulse" />
              <h2 className="text-3xl font-extrabold text-white">
                <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-transparent bg-clip-text">
                  RASTREAMENTO VEICULAR
                </span>
              </h2>
              <MapPin className="w-10 h-10 text-purple-400 animate-pulse" />
            </div>

            <div className="mb-8 p-4 bg-red-600/20 border-2 border-red-500 rounded-xl inline-flex flex-col items-center gap-2 animate-pulse">
              <div className="flex items-center gap-2 text-red-500 font-black text-lg">
                <ShieldAlert className="w-6 h-6" />
                <span>ALERTA DE MOVIMENTAÇÃO</span>
              </div>
              <p className="text-white font-bold text-xl leading-tight">
                Perfil encontrado recentemente em um{' '}
                <span className="text-yellow-400 underline italic">Motel</span> perto de{' '}
                <span className="uppercase">{userCity}</span>
              </p>
            </div>

            <p className="text-gray-200 mb-6 max-w-md mx-auto text-lg font-medium">
              <strong className="text-white">NOVIDADE!</strong> Descubra a localização exata do veículo do seu alvo, apenas com a placa. Rastreamento em tempo real via satélite.
            </p>

            <div className="relative w-full max-w-md mx-auto mb-8">
              <img
                src="/tracking-satellite.png"
                alt="Rastreamento Veicular por Satélite"
                className="w-full h-auto object-contain drop-shadow-2xl select-none pointer-events-none rounded-2xl border border-white/10"
              />
            </div>

            <p className="text-xl text-yellow-300 font-bold mb-6">
              Não deixe rastros. Saiba onde o carro está agora!
            </p>

            <ShineButton
              onClick={handleUnlockClick}
              className="w-full bg-blue-600 focus:ring-blue-500 active:scale-95 py-3.5"
              shineColorClasses="bg-blue-600"
            >
              RASTREAR PLACA AGORA
            </ShineButton>
          </motion.div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-12" />

        {/* Section: Deleted Messages & Files */}
        <section className="mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-12 mb-12 p-0 text-center w-full max-w-md mx-auto relative overflow-hidden"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trash2 className="w-10 h-10 text-red-500" />
              <h2 className="text-3xl font-extrabold text-white">
                <span className="bg-gradient-to-r from-pink-400 via-red-500 to-yellow-400 text-transparent bg-clip-text">
                  DADOS APAGADOS RECUPERADOS
                </span>
              </h2>
            </div>

            <p className="text-gray-200 mb-8 max-w-sm mx-auto text-lg font-medium">
              <strong className="text-white">IMPERDÍVEL!</strong> Nosso sistema encontrou arquivos que o alvo pensou ter deletado.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-[360px] mx-auto">
              <div className="p-4 bg-black/50 border border-yellow-700 rounded-2xl flex flex-col items-center">
                <ImageIcon className="w-8 h-8 text-yellow-400 mb-2 animate-pulse-slow" />
                <p className="text-5xl font-extrabold text-yellow-300 tabular-nums">28</p>
                <p className="text-xs uppercase font-black text-gray-400 mt-1 tracking-widest">
                  Fotos
                </p>
              </div>

              <div className="p-4 bg-black/50 border border-pink-700 rounded-2xl flex flex-col items-center">
                <MessageSquare className="w-8 h-8 text-pink-400 mb-2 animate-pulse-slow" />
                <p className="text-5xl font-extrabold text-pink-300 tabular-nums">9</p>
                <p className="text-xs uppercase font-black text-gray-400 mt-1 tracking-widest">
                  Conversas
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 mb-10 bg-black/60 p-6 rounded-2xl border border-red-700/50 w-full max-w-[320px] mx-auto shadow-2xl shadow-red-500/10">
              <div className="flex -space-x-6 ml-4">
                {RECOVERED_IMAGES.slice(0, 3).map((img, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-red-500 shadow-xl"
                  >
                    <img src={img} alt="Recuperado" className="w-full h-full object-cover blur-[6px]" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-red-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-red-300 font-bold uppercase tracking-wider">
                Mídias Confidenciais Prontas Para Download
              </p>
            </div>

            <ShineButton
              onClick={handleUnlockClick}
              className="w-full bg-gradient-to-r from-red-600 via-pink-600 to-yellow-500 focus:ring-red-500 active:scale-95 py-3.5"
              shineColorClasses="bg-yellow-400"
            >
              RECUPERAR ARQUIVOS DELETADOS
            </ShineButton>
          </motion.div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-12" />

        {/* Section: Testimonials */}
        <section className="mb-12">
          <div className="mt-16 w-full">
            <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center px-4">
              <div className="flex items-center gap-3">
                <Users className="w-7 h-7 text-purple-400" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  O QUE DIZEM NOSSOS CLIENTES
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">
                  Depoimentos Reais
                </span>
              </div>
            </div>

            <div className="flex overflow-x-auto gap-4 px-4 pb-10 scrollbar-hide snap-x snap-mandatory">
              {[
                { src: '/testimonials/mariana.png', name: 'Mariana' },
                { src: '/testimonials/rafael.png', name: 'Rafael' },
                { src: '/testimonials/juliana.png', name: 'Juliana' }
              ].map((t, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-[280px] snap-center group relative"
                >
                  <div className="relative rounded-[1.8rem] overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                    <img
                      src={t.src}
                      alt={`Depoimento de ${t.name}`}
                      className="w-full h-auto block object-contain"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full shadow-lg">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="mt-3 text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
                    Cliente: {t.name} ✅
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-4 p-6 bg-white/5 border border-dashed border-white/10 rounded-3xl text-center">
              <p className="text-gray-400 text-[11px] font-bold leading-relaxed italic uppercase tracking-tighter">
                "Milhares de usuários já descobriram a verdade. Não seja o último a saber."
              </p>
            </div>
          </div>
        </section>

        {/* Section: Flash Offer Pricing */}
        <section className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white mb-4 uppercase">
              PRONTO PARA A VERDADE?
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Junte-se a mais de 12.000 usuários satisfeitos que usam o SpyGram diariamente.
            </p>
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 p-6 bg-red-900/30 border-2 border-red-600 rounded-2xl shadow-2xl shadow-red-500/20 text-center relative overflow-hidden max-w-[360px] mx-auto"
          >
            <div className="absolute inset-0 bg-red-900 opacity-50 animate-pulse-slow" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-yellow-400 animate-spin-slow" />
                <h2 className="text-lg font-extrabold text-white uppercase tracking-tight">
                  OFERTA RELÂMPAGO
                </h2>
                <Zap className="w-5 h-5 text-yellow-400 animate-spin-slow" />
              </div>

              <p className="text-sm text-gray-300 mb-1 font-medium">Preço Normal:</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-xl font-bold text-gray-400 line-through">
                  R$ 97,90
                </span>
                <span className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 to-red-500 text-transparent bg-clip-text">
                  R$ 27,90
                </span>
              </div>

              <div className="bg-black/50 border border-red-700 rounded-lg p-2 inline-flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-lg font-mono font-bold text-red-300">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[10px] text-red-400 font-bold">RESTANTE</span>
              </div>

              <p className="text-[11px] text-yellow-300 mb-4 font-semibold px-2">
                Esta oferta expira em breve. Garanta seu acesso completo agora!
              </p>

              <ShineButton
                onClick={handleUnlockClick}
                className="w-full bg-red-600 focus:ring-red-500 active:scale-95 py-3.5"
                shineColorClasses="bg-red-600"
              >
                LIBERAR ACESSO COMPLETO AGORA
              </ShineButton>
            </div>
          </motion.div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-12" />

        {/* Section: Live Support Chat Proof */}
        <section className="mt-16 w-full">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Atendimento
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              <Radio className="w-3 h-3 text-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">
                Ao Vivo
              </span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden flex flex-col h-[400px] shadow-2xl">
            <div
              ref={chatScrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3"
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'current_user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {msg.sender !== 'current_user' && (
                    <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-green-400">
                      {msg.sender === 'admin' ? '🛡️ SUPORTE SPYGRAM' : msg.username}
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'current_user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : msg.sender === 'admin'
                        ? 'bg-white/10 text-white border border-white/10 rounded-tl-none'
                        : 'bg-gray-800 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 uppercase font-bold px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="text-xs text-gray-400 italic flex items-center gap-2">
                  <span className="animate-pulse">Digitando resposta...</span>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSendChat}
              className="p-3 border-t border-white/10 bg-black/40 flex gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tire sua dúvida com o atendente..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </section>

        {/* Section: 7 Days Total Guarantee */}
        <section className="mt-16 p-4 text-center w-full max-w-md mx-auto relative">
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <ShieldCheck className="w-12 h-12 text-green-500" />
              <h2 className="text-4xl font-extrabold text-white uppercase">
                GARANTIA TOTAL
              </h2>
            </div>
            <p className="text-xl text-gray-200 mb-4 font-medium">
              Se você não gostar do que encontrar, ou se o acesso falhar:
            </p>
            <div className="inline-block p-6 border-4 border-green-600 rounded-xl bg-black/50 shadow-lg shadow-green-500/20">
              <span className="text-6xl font-extrabold text-green-400 block leading-none">
                7 DIAS
              </span>
              <span className="text-xl text-green-300 block mt-2 font-semibold">
                DE REEMBOLSO GARANTIDO
              </span>
            </div>
            <p className="text-lg text-yellow-300 mt-6 font-semibold mb-8">
              Sua satisfação é nossa prioridade. Compre com total tranquilidade.
            </p>

            <ShineButton
              onClick={handleUnlockClick}
              className="w-full bg-green-600 h-16 rounded-2xl active:scale-95"
              shineColorClasses="bg-white/30"
            >
              <span className="text-xl font-black uppercase tracking-tighter">
                LIBERAR ACESSO VITALÍCIO
              </span>
            </ShineButton>
          </div>
        </section>

        {/* Section: FAQ */}
        <section className="mt-16 w-full max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-white uppercase">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border-b border-gray-700 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex items-center justify-between w-full py-4 text-left transition-colors hover:bg-gray-800/50 rounded-md px-2"
                  >
                    <h3 className="flex items-start gap-2 text-base font-semibold text-white">
                      <Zap className="w-4 h-4 text-pink-500 flex-shrink-0 mt-1" />
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-300 ml-6 pb-4 text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center pb-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
              Ambiente 100% Criptografado
            </span>
          </div>
          <p className="text-gray-600 text-[10px] font-medium uppercase tracking-widest">
            © 2024 SpyGram System - Intelligence Division
          </p>
        </footer>
      </main>

      {/* Floating Bottom Scroll Hint */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-black/80 backdrop-blur-lg border-t border-white/5"
          >
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">
                Role para ver mais detalhes
              </p>
              <ChevronDown className="w-5 h-5 text-purple-500 mx-auto animate-bounce-slow" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
