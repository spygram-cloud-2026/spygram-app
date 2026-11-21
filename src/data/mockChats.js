export const getMockChats = (visitorCity = 'São Paulo') => [
  {
    id: 'chat-1',
    name: 'Pedro Henrique',
    username: 'pedro.hque_',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    unreadCount: 3,
    lastSeen: 'Online agora',
    snippet: `Tô em ${visitorCity} já, me encontra no...`,
    time: 'Há 4 min',
    hasSensitiveMedia: true,
    hasAudio: true,
    messages: [
      {
        id: 'm1',
        sender: 'them',
        type: 'text',
        content: 'Oi amor... conseguiu sair sem ninguém desconfiar?',
        time: '18:14'
      },
      {
        id: 'm2',
        sender: 'me',
        type: 'text',
        content: 'Consegui sim, falei que ia resolver umas coisas rapidinho rs',
        time: '18:16'
      },
      {
        id: 'm3',
        sender: 'them',
        type: 'text',
        content: 'Perai que tem gente aqui perto, não me responde agora que depois te ligo.',
        time: '18:18'
      },
      {
        id: 'm4',
        sender: 'them',
        type: 'audio',
        duration: 18,
        time: '18:19'
      },
      {
        id: 'm5',
        sender: 'them',
        type: 'sensitive_image',
        caption: 'Foto de visualização única (Aberta no Direct)',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
        time: '18:21'
      },
      {
        id: 'm6',
        sender: 'them',
        type: 'text',
        content: `Tô em ${visitorCity} já, só pra avisar mesmo. Me encontra no lugar de sempre às 21h?`,
        time: '18:22'
      }
    ]
  },
  {
    id: 'chat-2',
    name: 'Lucas Silveira',
    username: 'lucas_silveira',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    unreadCount: 2,
    lastSeen: 'Visto há 12 min',
    snippet: 'Apagou as fotos que te mandei ontem à noite?',
    time: 'Há 18 min',
    hasSensitiveMedia: true,
    hasAudio: false,
    messages: [
      {
        id: 'l1',
        sender: 'them',
        type: 'text',
        content: 'Você não vai acreditar no que aconteceu hoje cedo...',
        time: '17:30'
      },
      {
        id: 'l2',
        sender: 'them',
        type: 'text',
        content: 'Apagou as fotos que te mandei ontem à noite? Não quero problema pra nenhum de nós dois.',
        time: '17:35'
      },
      {
        id: 'l3',
        sender: 'me',
        type: 'text',
        content: 'Já apaguei tudo do rolo de câmera, fica tranquilo bb.',
        time: '17:42'
      },
      {
        id: 'l4',
        sender: 'them',
        type: 'sensitive_image',
        caption: 'Mídia temporária recuperada da Meta CDN',
        imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
        time: '17:44'
      }
    ]
  },
  {
    id: 'chat-3',
    name: 'Matheus Rocha',
    username: 'math_rocha',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    unreadCount: 1,
    lastSeen: 'Visto há 45 min',
    snippet: 'Te vejo mais tarde então bb 🔥',
    time: 'Há 1h',
    hasSensitiveMedia: false,
    hasAudio: false,
    messages: [
      {
        id: 'mr1',
        sender: 'them',
        type: 'text',
        content: 'Vai rolar aquele encontro hoje ou vai dar desculpa de novo?',
        time: '16:50'
      },
      {
        id: 'mr2',
        sender: 'them',
        type: 'text',
        content: 'Te vejo mais tarde então bb 🔥',
        time: '17:02'
      }
    ]
  },
  {
    id: 'chat-4',
    name: 'Bruno Costa',
    username: 'bruno_c0sta',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastSeen: 'Ontem às 23:14',
    snippet: 'O áudio que você me mandou ontem...',
    time: 'Ontem',
    hasSensitiveMedia: false,
    hasAudio: true,
    messages: [
      {
        id: 'b1',
        sender: 'them',
        type: 'text',
        content: 'O áudio que você me mandou ontem me deixou louco... queria estar aí com você agora.',
        time: '23:10'
      },
      {
        id: 'b2',
        sender: 'them',
        type: 'audio',
        duration: 22,
        time: '23:12'
      }
    ]
  },
  {
    id: 'chat-5',
    name: 'Gabriel Mendes',
    username: 'gabriel_mendes',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastSeen: 'Ontem às 20:30',
    snippet: 'Deu tudo certo com o pix que te fiz?',
    time: 'Ontem',
    hasSensitiveMedia: false,
    hasAudio: false,
    messages: [
      {
        id: 'g1',
        sender: 'them',
        type: 'text',
        content: 'Deu tudo certo com o pix que te fiz? Chegou certinho aí?',
        time: '20:25'
      },
      {
        id: 'g2',
        sender: 'me',
        type: 'text',
        content: 'Chegou sim anjo, valeu de verdade! Te compenso depois ❤️',
        time: '20:28'
      }
    ]
  },
  {
    id: 'chat-6',
    name: 'Contato Oculto',
    username: 'privado_backup',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    unreadCount: 1,
    lastSeen: 'Há 2h',
    snippet: '🔒 Mensagem confidencial com autodestruição',
    time: 'Há 2h',
    hasSensitiveMedia: true,
    hasAudio: false,
    messages: [
      {
        id: 'co1',
        sender: 'them',
        type: 'text',
        content: 'Apaga esse chat logo. Se alguém pegar seu celular estamos lascados.',
        time: '15:20'
      },
      {
        id: 'co2',
        sender: 'them',
        type: 'sensitive_image',
        caption: 'Foto temporária de visualização única',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
        time: '15:22'
      }
    ]
  },
  {
    id: 'chat-7',
    name: 'Camila R.',
    username: 'camilinha_r',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastSeen: 'Há 3h',
    snippet: 'Amiga, você teve coragem mesmo de ir lá?',
    time: 'Há 3h',
    hasSensitiveMedia: false,
    hasAudio: false,
    messages: [
      {
        id: 'cr1',
        sender: 'them',
        type: 'text',
        content: 'Não acredito que você teve coragem mesmo de ir lá ontem! Me conta tudo...',
        time: '14:15'
      },
      {
        id: 'cr2',
        sender: 'me',
        type: 'text',
        content: 'Depois te ligo por outro número pra contar, por aqui é perigoso.',
        time: '14:22'
      }
    ]
  },
  {
    id: 'chat-8',
    name: 'Dr. Marcelo',
    username: 'marcelo_adv',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastSeen: 'Ontem',
    snippet: 'Consegui segurar as mensagens como combinamos...',
    time: 'Ontem',
    hasSensitiveMedia: false,
    hasAudio: false,
    messages: [
      {
        id: 'dm1',
        sender: 'them',
        type: 'text',
        content: 'Consegui segurar tudo como combinamos, mas você precisa de total discrição nas redes.',
        time: '11:40'
      }
    ]
  },
  {
    id: 'chat-9',
    name: 'Número Não Salvo',
    username: 'contato_119842',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    unreadCount: 1,
    lastSeen: 'Há 5h',
    snippet: '📷 Foto de visualização única interceptada',
    time: 'Há 5h',
    hasSensitiveMedia: true,
    hasAudio: false,
    messages: [
      {
        id: 'ns1',
        sender: 'them',
        type: 'sensitive_image',
        caption: 'Mídia no modo View Once salva no cache de transmissão',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
        time: '12:05'
      }
    ]
  },
  {
    id: 'chat-10',
    name: 'Rodrigo Martins',
    username: 'rodrigo_m20',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastSeen: 'Ontem',
    snippet: '🎙️ Áudio de voz (0:42) • Escuta a sós...',
    time: 'Ontem',
    hasSensitiveMedia: false,
    hasAudio: true,
    messages: [
      {
        id: 'rm1',
        sender: 'them',
        type: 'text',
        content: 'Escuta quando você estiver a sós...',
        time: '09:15'
      },
      {
        id: 'rm2',
        sender: 'them',
        type: 'audio',
        duration: 42,
        time: '09:16'
      }
    ]
  },
  {
    id: 'chat-11',
    name: 'Lívia Ferreira',
    username: 'livia.fe',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastSeen: 'Há 1 dia',
    snippet: 'Vi você disfarçando haha... quem era aquele?',
    time: '1 d',
    hasSensitiveMedia: false,
    hasAudio: false,
    messages: [
      {
        id: 'lf1',
        sender: 'them',
        type: 'text',
        content: 'Vi você disfarçando haha... quem era aquele no carro com você?',
        time: '19:40'
      }
    ]
  },
  {
    id: 'chat-12',
    name: 'Felipe Becker',
    username: 'felipe_becker_',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastSeen: 'Há 2 dias',
    snippet: 'Não posta nada do nosso almoço no story tá?',
    time: '2 d',
    hasSensitiveMedia: false,
    hasAudio: false,
    messages: [
      {
        id: 'fb1',
        sender: 'them',
        type: 'text',
        content: 'Não posta nada do nosso almoço no story tá? Segredo nosso.',
        time: '13:30'
      }
    ]
  },
  {
    id: 'chat-13',
    name: 'Suítes & Reservas',
    username: 'reservas_vip',
    avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastSeen: 'Há 3 dias',
    snippet: 'Reserva confirmada para 2 pessoas.',
    time: '3 d',
    hasSensitiveMedia: false,
    hasAudio: false,
    messages: [
      {
        id: 'rh1',
        sender: 'them',
        type: 'text',
        content: 'Confirmação de reserva de suíte para 2 pessoas concluída com sucesso.',
        time: '10:00'
      }
    ]
  },
  {
    id: 'chat-14',
    name: 'Arquivo Meta Direct',
    username: 'meta_archive_session',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastSeen: 'Há 4 dias',
    snippet: 'Backup de 6 mídias temporárias interceptado.',
    time: '4 d',
    hasSensitiveMedia: true,
    hasAudio: false,
    messages: [
      {
        id: 'ma1',
        sender: 'them',
        type: 'text',
        content: 'Sessão criptografada restrita. 6 arquivos temporários recuperados do cache da Meta CDN.',
        time: '08:00'
      }
    ]
  }
];
