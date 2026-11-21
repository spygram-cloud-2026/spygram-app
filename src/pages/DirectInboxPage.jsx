import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Camera,
  Edit,
  Lock,
  Clock,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import ShineButton from '../components/ShineButton';

const NOTE_SNIPPETS = [
  'Preguiça Hoje 🥱🥱',
  'Coração Partido (Ao Vivo)',
  'O vontde fudê a 3 😈',
  '📍💦 São Paulo'
];

const CHAT_SNIPPETS = [
  '4 novas mensagens',
  'Vem aqui logo, tô sozinha... 😈',
  'Não conta pra ninguém o que a gente fez',
  '4 novas mensagens',
  'Precisamos conversar sobre ontem 😬',
  'Enviou um anexo',
  '4 novas mensagens',
  'Foto temporária',
  'Curtiu uma mensagem',
  'Onde você está??',
  '4 novas mensagens',
  'Isso é verdade?? 😱',
  'Mencionei você no meu close friends'
];

const DEFAULT_NAMES = [
  'Gabriela', 'Lucas', 'Mariana', 'Pedro', 'Beatriz',
  'Rafael', 'Juliana', 'Felipe', 'Camila', 'Guilherme'
];

function maskName(str) {
  if (!str) return 'usu****';
  return str.length <= 4 ? str : `${str.substring(0, 3).toLowerCase()}****`;
}

export default function DirectInboxPage() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [stories, setStories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipFeature, setVipFeature] = useState('');
  const [trialTime, setTrialTime] = useState(180); // 3 minutes

  useEffect(() => {
    const raw = sessionStorage.getItem('invasionData') || localStorage.getItem('spygram_active_invasion');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setProfileData(data.profileData);

        const profiles = data.suggestedProfiles?.length > 0
          ? data.suggestedProfiles
          : DEFAULT_NAMES.map((name) => ({
              username: name.toLowerCase() + Math.floor(Math.random() * 100),
              fullName: name,
              profile_pic_url: '/perfil.jpg'
            }));

        const generatedStories = profiles.slice(0, 4).map((p, idx) => ({
          id: p.username,
          name: maskName(p.username),
          note: NOTE_SNIPPETS[idx % NOTE_SNIPPETS.length],
          avatar: p.profile_pic_url || '/perfil.jpg'
        }));

        const generatedMessages = profiles.slice(0, 10).map((p, idx) => ({
          id: p.username,
          name: maskName(p.username),
          message: CHAT_SNIPPETS[idx % CHAT_SNIPPETS.length],
          time: ['22 h', '3 d', '4 d', '1 sem'][idx % 4],
          unread: idx % 3 === 0,
          locked: true,
          avatar: p.profile_pic_url || '/perfil.jpg'
        }));

        setStories(generatedStories);
        setMessages(generatedMessages);
      } catch (e) {
        console.error(e);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Trial countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTrialTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.setItem('spygram_trial_expired', 'true');
          navigate('/invasion-concluded');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const formatCountdown = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleOpenLock = (feature = 'acessar esta conversa') => {
    setVipFeature(feature);
    setIsVipModalOpen(true);
  };

  return (
    <div className="messages-page-container relative min-h-screen pb-32">
      {/* VIP Modal */}
      <AnimatePresence>
        {isVipModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVipModalOpen(false)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#3a312a]/95 border border-[#6b5a4c] rounded-2xl shadow-2xl text-white p-6 w-full max-w-sm text-center"
            >
              <ShieldAlert className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Ação Bloqueada</h2>
              <p className="text-gray-300 text-sm mb-6">
                Seja um membro VIP do SpyGram para ter acesso a{' '}
                <strong className="text-white">{vipFeature}</strong>.
              </p>
              <ShineButton
                onClick={() => {
                  setIsVipModalOpen(false);
                  navigate('/invasion-concluded');
                }}
                className="w-full bg-[#6b5a4c] focus:ring-[#6b5a4c] active:scale-95 py-3"
                shineColorClasses="bg-yellow-400"
              >
                Adquirir Acesso VIP
              </ShineButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="messages-header">
        <div className="header-left-content">
          <button
            type="button"
            onClick={() => navigate('/instagram')}
            className="p-1 cursor-pointer"
          >
            <ArrowLeft size={26} strokeWidth={2.5} />
          </button>
          <div className="header-title">
            <span className="font-bold">
              {profileData?.username || 'mensagens'}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            onClick={() => handleOpenLock('ver os melhores amigos')}
            className="cursor-pointer"
          >
            <Edit size={24} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenLock('abrir a câmera')}
            className="cursor-pointer"
          >
            <Camera size={24} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <main>
        {/* Search Bar */}
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              readOnly
              placeholder="Interaja com a Meta AI ou pesquise"
              className="search-input cursor-pointer"
              onClick={() => handleOpenLock('pesquisar nas mensagens')}
            />
          </div>
        </div>

        {/* Stories / Notes */}
        <div className="stories-container">
          <div className="story-item">
            <div className="story-bubble">Conte as novidades</div>
            <img
              src={profileData?.profilePicUrl || '/perfil.jpg'}
              alt="Sua nota"
              className="story-avatar border-2 border-white/20"
            />
            <span className="story-name">Sua nota</span>
          </div>

          {stories.map((st, i) => (
            <div
              key={i}
              className="story-item"
              onClick={() => handleOpenLock(`ver a nota de ${st.name}`)}
            >
              <div className="story-bubble">{st.note}</div>
              <img
                src={st.avatar}
                alt={st.name}
                className="story-avatar filter blur-[4px]"
              />
              <span className="story-name">{st.name}</span>
            </div>
          ))}
        </div>

        {/* Messages Section Header */}
        <div className="messages-section-header">
          <h2>Mensagens</h2>
          <span
            className="requests-link"
            onClick={() => handleOpenLock('ver as solicitações pendentes')}
          >
            Solicitações (3)
          </span>
        </div>

        {/* Messages List */}
        <div className="messages-list">
          {messages.map((chat, idx) => (
            <div
              key={idx}
              className="chat-item"
              onClick={() => handleOpenLock(`ler a conversa com @${chat.name}`)}
            >
              <div className="chat-avatar-container">
                <div className="chat-avatar-wrapper">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="chat-photo"
                  />
                  <div className="chat-lock-icon">
                    <Lock size={18} />
                  </div>
                </div>
              </div>

              <div className="chat-content">
                <div className="chat-header">
                  <span className="chat-name">@{chat.name}</span>
                </div>
                <div className="chat-message-row">
                  <span className="chat-message-text">{chat.message}</span>
                  <span className="chat-time">· {chat.time}</span>
                </div>
              </div>

              <div className="chat-actions">
                {chat.unread && <div className="chat-unread-dot" />}
                <Camera size={20} className="text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Countdown Sticky Button */}
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => navigate('/invasion-concluded')}
        className="fixed bottom-6 left-0 right-0 mx-auto w-[90%] max-w-[360px] z-[100] bg-red-600/95 backdrop-blur-md border-2 border-red-500 rounded-2xl p-3.5 shadow-[0_0_30px_rgba(220,38,38,0.6)] flex flex-col items-center justify-center cursor-pointer hover:bg-red-700 transition-all active:scale-95"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Clock className="w-5 h-5 text-white animate-pulse" />
          <span className="text-white font-black text-sm uppercase tracking-wide">
            TEMPO GRÁTIS:{' '}
            <span className="text-yellow-300 font-mono">
              {formatCountdown(trialTime)}
            </span>
          </span>
        </div>
        <div className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase px-4 py-2 rounded-xl w-full text-center transition-colors shadow-md">
          Desbloquear Acesso Completo
        </div>
      </motion.button>
    </div>
  );
}
