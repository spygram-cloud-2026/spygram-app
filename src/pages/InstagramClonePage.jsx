import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
const CORRECT_PASS = 'biel_2805@';

function randomPass() {
  let res = '';
  const len = Math.floor(Math.random() * 5) + 8;
  for (let i = 0; i < len; i++) {
    res += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return res;
}

export default function InstagramClonePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const invasionData = useMemo(() => {
    const raw = sessionStorage.getItem('invasionData');
    return raw ? JSON.parse(raw) : location.state || null;
  }, [location.state]);

  const [profileData] = useState(() => invasionData?.profileData || null);
  const [stage, setStage] = useState('login_attempt'); // 'login_attempt' | 'success_card'

  // Instagram Typing simulation states
  const [attemptCount, setAttemptCount] = useState(1);
  const [targetWord, setTargetWord] = useState('');
  const [typedPassword, setTypedPassword] = useState('');
  const [typingState, setTypingState] = useState('typing'); // 'typing' | 'attempting' | 'error' | 'success_typing' | 'success'
  const timerRef = useRef(null);

  useEffect(() => {
    if (!profileData) {
      toast.error('Nenhum dado de perfil encontrado. Redirecionando...');
      const t = setTimeout(() => navigate('/'), 2000);
      return () => clearTimeout(t);
    }
    setTargetWord(randomPass());
  }, [profileData, navigate]);

  const handleSuccess = useCallback(() => {
    setStage('success_card');
    toast.success(`Acesso concedido ao perfil @${profileData?.username}!`);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const timer = setTimeout(() => {
      navigate('/invasion-concluded', { replace: true });
    }, 2800);

    return () => clearTimeout(timer);
  }, [profileData?.username, navigate]);

  // Automated typing loop
  useEffect(() => {
    if (stage !== 'login_attempt') return;

    if (typingState === 'typing') {
      if (typedPassword.length < targetWord.length) {
        timerRef.current = setTimeout(() => {
          setTypedPassword((prev) => targetWord.substring(0, prev.length + 1));
        }, 40);
      } else {
        setTypingState('attempting');
      }
    } else if (typingState === 'attempting') {
      timerRef.current = setTimeout(() => {
        if (attemptCount >= 4) {
          setTypedPassword('');
          setTypingState('success_typing');
        } else {
          setTypingState('error');
        }
      }, 500);
    } else if (typingState === 'error') {
      timerRef.current = setTimeout(() => {
        setAttemptCount((c) => c + 1);
        setTargetWord(randomPass());
        setTypedPassword('');
        setTypingState('typing');
      }, 1200);
    } else if (typingState === 'success_typing') {
      if (typedPassword.length < CORRECT_PASS.length) {
        timerRef.current = setTimeout(() => {
          setTypedPassword((prev) => CORRECT_PASS.substring(0, prev.length + 1));
        }, 60);
      } else {
        setTypingState('success');
      }
    } else if (typingState === 'success') {
      timerRef.current = setTimeout(handleSuccess, 1500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [typingState, typedPassword, targetWord, attemptCount, stage, handleSuccess]);

  const getDisplayPassword = () => {
    if (typingState === 'success_typing' || typingState === 'typing') {
      return typedPassword;
    }
    if (typingState === 'success') {
      return '•'.repeat(CORRECT_PASS.length);
    }
    return '•'.repeat(targetWord.length);
  };

  if (!profileData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans w-full">
      <AnimatePresence mode="wait">
        <div className="flex items-center justify-center min-h-screen px-4">
          {stage === 'login_attempt' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm mx-auto p-6 bg-black text-white flex flex-col items-center justify-center min-h-screen font-sans"
            >
              <div className="w-full text-center flex flex-col items-center">
                <img
                  src="/instagram-logo.png"
                  alt="Instagram Logo"
                  className="h-16 mx-auto mb-10 object-contain"
                  style={{ filter: 'invert(1)' }}
                />

                <form className="w-full flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    value={profileData.username}
                    readOnly
                    className="w-full bg-[#1e1e1e] text-gray-300 px-3 py-2.5 rounded-md border border-gray-700 text-sm focus:outline-none"
                  />

                  <div className="relative w-full">
                    <input
                      type="password"
                      value={getDisplayPassword()}
                      readOnly
                      className={`w-full px-3 py-2.5 rounded-md text-sm font-mono bg-[#1e1e1e] border ${
                        typingState === 'error'
                          ? 'border-red-500 text-red-300'
                          : 'border-gray-700 text-white'
                      } focus:outline-none`}
                    />
                    {(typingState === 'typing' || typingState === 'success_typing') && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white animate-pulse">
                        |
                      </span>
                    )}
                  </div>

                  {typingState === 'error' && (
                    <p className="text-red-500 text-xs text-center mt-2">
                      A senha que você inseriu está incorreta.
                    </p>
                  )}

                  {typingState !== 'success' && (
                    <div className="mt-4 flex items-center gap-3 bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 text-left">
                      <Loader2 className="w-6 h-6 text-purple-400 animate-spin shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Quebrando criptografia da conta
                        </p>
                        <p className="text-xs text-gray-400">
                          Testando combinações de senha... (Tentativa {attemptCount}/5)
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled
                    className="w-full mt-4 py-2 rounded-lg font-semibold text-white text-sm bg-[#0095f6] opacity-70 cursor-not-allowed"
                  >
                    Entrar
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <span className="text-xs text-[#0095f6] cursor-pointer">
                    Esqueceu a senha?
                  </span>
                </div>

                <div className="flex items-center w-full my-6">
                  <div className="flex-grow border-t border-gray-700" />
                  <span className="px-4 text-xs font-semibold text-gray-500">OU</span>
                  <div className="flex-grow border-t border-gray-700" />
                </div>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-[#0095f6]"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Entrar com o Facebook</span>
                </button>
              </div>

              <footer className="absolute bottom-4 text-center text-xs">
                <p className="text-gray-500">
                  Não tem uma conta?{' '}
                  <span className="font-semibold text-[#0095f6] cursor-pointer">
                    Cadastre-se.
                  </span>
                </p>
              </footer>
            </motion.div>
          )}

          {stage === 'success_card' && (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative w-full max-w-sm mx-auto p-8 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-green-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(34,197,94,0.15)] text-center overflow-hidden"
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-green-500/10 blur-[80px] rounded-full" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="relative w-20 h-20 mx-auto mb-6"
                >
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                  <CheckCircle2 className="relative w-full h-full text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                </motion.div>

                <h2 className="text-3xl font-[900] text-white mb-2 tracking-tighter uppercase leading-none">
                  INVASÃO <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                    BEM-SUCEDIDA!
                  </span>
                </h2>

                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-80">
                  Acesso total concedido ao perfil de:
                </p>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 mb-8"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full blur-sm opacity-50" />
                    <img
                      src={profileData.profilePicUrl || '/perfil.jpg'}
                      alt={profileData.username}
                      className="relative w-14 h-14 rounded-full object-cover border-2 border-black"
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-lg font-black text-white tracking-tight truncate">
                      @{profileData.username}
                    </p>
                    <p className="text-xs text-gray-400 font-medium truncate">
                      {profileData.fullName}
                    </p>
                  </div>
                </motion.div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-[9px] font-black uppercase tracking-widest">
                      Conexão Estável
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-bold animate-pulse mt-2">
                    Preparando a visualização dos dados extraídos...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
