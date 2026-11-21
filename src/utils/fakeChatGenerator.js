/**
 * Gerador Dinâmico e Contextual de Conversas de Traição e Conteúdo Íntimo
 * Cria 14 conversas interceptadas convincentes e personalizadas
 * baseadas no perfil do alvo e na localização do visitante.
 */

// Banco de fotos de perfis realistas masculinos e femininos (estilo selfie / Instagram real)
const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80'
];

const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80'
];

// Imagens para fotos borradas provocantes (View Once / Fotos confidenciais)
const PROVOCATIVE_MEDIA = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
];

/**
 * Heurística simples para detectar se o nome do alvo soa feminino ou masculino
 */
function isFemaleTarget(name = '', username = '') {
  const clean = (name + ' ' + username).toLowerCase();
  const femaleEndings = ['a', 'ah', 'ia', 'elly', 'any', 'elle', 'ane', 'e', 'is'];
  const femaleKeywords = ['anita', 'anitta', 'mariana', 'gabriela', 'carol', 'julia', 'camila', 'leticia', 'beatriz', 'fernanda', 'amanda', 'bruna', 'aline', 'larissa', 'luana'];
  
  if (femaleKeywords.some(k => clean.includes(k))) return true;
  const firstName = name.split(' ')[0].toLowerCase();
  return firstName.endsWith('a') || firstName.endsWith('e') || firstName.endsWith('y');
}

/**
 * Gera a lista de 14 conversas forjadas altamente persuasivas
 */
export function generateInterceptedChats(targetUser = {}, visitorCity = 'sua cidade') {
  const targetName = targetUser.fullName || targetUser.username || 'o alvo';
  const targetFirstName = targetName.split(' ')[0];
  const targetIsFemale = isFemaleTarget(targetUser.fullName, targetUser.username);

  // Amantes e contatos suspeitos (invertendo gênero para gerar traição hétero/bi plausível)
  const suspects = targetIsFemale ? [
    { name: 'Rodrigo Personal 🔥', username: 'rodrigo_m20', avatar: MALE_AVATARS[0] },
    { name: 'Lucas Silveira', username: 'lucas_silveira', avatar: MALE_AVATARS[1] },
    { name: 'Matheus Rocha', username: 'math_rocha', avatar: MALE_AVATARS[2] },
    { name: 'Dr. Marcelo (Sigilo)', username: 'marcelo_adv', avatar: MALE_AVATARS[6] },
    { name: 'Bruno Costa', username: 'bruno_c0sta', avatar: MALE_AVATARS[3] },
    { name: 'Gabriel Mendes', username: 'gabriel_mendes', avatar: MALE_AVATARS[4] },
    { name: 'Felipe Becker', username: 'felipe_becker_', avatar: MALE_AVATARS[5] },
    { name: 'Contato Privado 🔒', username: 'privado_backup', avatar: FEMALE_AVATARS[0] },
    { name: 'Camilinha R. (Confidente)', username: 'camilinha_r', avatar: FEMALE_AVATARS[2] },
    { name: 'Suítes & Reservas VIP', username: 'reservas_vip', avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80' },
    { name: 'Número Não Salvo (11)', username: 'contato_119842', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' },
    { name: 'Lívia F.', username: 'livia.fe', avatar: FEMALE_AVATARS[4] },
    { name: 'Guilherme Show', username: 'gui_eventos', avatar: MALE_AVATARS[7] },
    { name: 'Arquivo Meta Direct (Backup)', username: 'meta_archive_session', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' }
  ] : [
    { name: 'Mariana Costa 🔥', username: 'mari_costa99', avatar: FEMALE_AVATARS[0] },
    { name: 'Bia Almeida (Segredo)', username: 'bia_almeida_', avatar: FEMALE_AVATARS[1] },
    { name: 'Camila Rocha', username: 'camilarocha_sp', avatar: FEMALE_AVATARS[2] },
    { name: 'Dra. Fernanda', username: 'dra_fernanda', avatar: FEMALE_AVATARS[3] },
    { name: 'Lívia Secret', username: 'livia_fe', avatar: FEMALE_AVATARS[4] },
    { name: 'Bruna Novas', username: 'bruna_novas', avatar: FEMALE_AVATARS[5] },
    { name: 'Contato Privado 🔒', username: 'privado_backup', avatar: MALE_AVATARS[0] },
    { name: 'Renato Amigo (Álibi)', username: 'renato_alibi', avatar: MALE_AVATARS[1] },
    { name: 'Loira da Festa', username: 'contato_festa_vip', avatar: FEMALE_AVATARS[6] },
    { name: 'Suítes & Reservas VIP', username: 'reservas_vip', avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80' },
    { name: 'Número Não Salvo (11)', username: 'contato_119842', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' },
    { name: 'Patrícia M.', username: 'patricia_m', avatar: FEMALE_AVATARS[7] },
    { name: 'Felipe Becker', username: 'felipe_becker_', avatar: MALE_AVATARS[5] },
    { name: 'Arquivo Meta Direct (Backup)', username: 'meta_archive_session', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' }
  ];

  return [
    {
      id: 'chat-1',
      name: suspects[0].name,
      username: suspects[0].username,
      avatar: suspects[0].avatar,
      unreadCount: 3,
      lastSeen: 'Online agora',
      time: 'Há 4 min',
      snippet: `Tô em ${visitorCity} já... me encontra no quarto 402?`,
      blurredSnippet: 'Tô em ' + visitorCity + ' já... me encontra no quarto 402?',
      hasSensitiveMedia: true,
      hasAudio: true,
      messages: [
        {
          id: 'm1',
          sender: 'them',
          type: 'text',
          content: `Oi amor... conseguiu sair de casa sem ninguém desconfiar?`,
          time: '18:14'
        },
        {
          id: 'm2',
          sender: 'me',
          type: 'text',
          content: 'Consegui sim, falei que ia resolver umas coisas rapidinho na rua rs',
          time: '18:16'
        },
        {
          id: 'm3',
          sender: 'them',
          type: 'text',
          content: 'Perai que tem gente aqui por perto, não responde agora que depois te ligo.',
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
          imageUrl: PROVOCATIVE_MEDIA[0],
          time: '18:21'
        },
        {
          id: 'm6',
          sender: 'them',
          type: 'text',
          content: `Já fiz o check-in aqui em ${visitorCity}... me encontra no quarto 402 às 21h? Não traz o celular desbloqueado tá?`,
          time: '18:22'
        }
      ]
    },
    {
      id: 'chat-2',
      name: suspects[1].name,
      username: suspects[1].username,
      avatar: suspects[1].avatar,
      unreadCount: 2,
      lastSeen: 'Visto há 12 min',
      time: 'Há 18 min',
      snippet: 'Apagou as fotos que te mandei da cama ontem?',
      blurredSnippet: 'Apagou as fotos que te mandei da cama ontem à noite?',
      hasSensitiveMedia: true,
      hasAudio: false,
      messages: [
        {
          id: 'l1',
          sender: 'them',
          type: 'text',
          content: 'Você não tem noção do que quase aconteceu hoje cedo...',
          time: '17:30'
        },
        {
          id: 'l2',
          sender: 'them',
          type: 'text',
          content: 'Apagou as fotos que te mandei da cama ontem à noite? Se alguém pegar seu aparelho estamos ferrados.',
          time: '17:35'
        },
        {
          id: 'l3',
          sender: 'me',
          type: 'text',
          content: 'Já deletei tudo do rolo de câmera e da lixeira, fica tranquilo(a) bb.',
          time: '17:42'
        },
        {
          id: 'l4',
          sender: 'them',
          type: 'sensitive_image',
          caption: 'Mídia íntima recuperada do cache da Meta',
          imageUrl: PROVOCATIVE_MEDIA[1],
          time: '17:44'
        }
      ]
    },
    {
      id: 'chat-3',
      name: suspects[2].name,
      username: suspects[2].username,
      avatar: suspects[2].avatar,
      unreadCount: 1,
      lastSeen: 'Visto há 45 min',
      time: 'Há 1h',
      snippet: 'Te vejo mais tarde no mesmo lugar de sempre 🔥',
      blurredSnippet: 'Te vejo mais tarde no mesmo lugar de sempre 🔥',
      hasSensitiveMedia: false,
      hasAudio: false,
      messages: [
        {
          id: 'mr1',
          sender: 'them',
          type: 'text',
          content: 'Vai rolar aquele encontro hoje ou você vai dar desculpa em cima da hora de novo?',
          time: '16:50'
        },
        {
          id: 'mr2',
          sender: 'me',
          type: 'text',
          content: 'Hoje consigo sim, só vou esperar todo mundo sair.',
          time: '16:55'
        },
        {
          id: 'mr3',
          sender: 'them',
          type: 'text',
          content: 'Te vejo mais tarde então bb... vem com aquela roupa 🔥',
          time: '17:02'
        }
      ]
    },
    {
      id: 'chat-4',
      name: suspects[3].name,
      username: suspects[3].username,
      avatar: suspects[3].avatar,
      unreadCount: 0,
      lastSeen: 'Ontem às 23:14',
      time: 'Ontem',
      snippet: '🎙️ O áudio que você me mandou me deixou sem ar...',
      blurredSnippet: 'O áudio que você me mandou ontem me deixou sem ar...',
      hasSensitiveMedia: false,
      hasAudio: true,
      messages: [
        {
          id: 'b1',
          sender: 'them',
          type: 'text',
          content: 'O áudio que você me mandou ontem me deixou louco(a)... queria estar aí com você agora.',
          time: '23:10'
        },
        {
          id: 'b2',
          sender: 'them',
          type: 'audio',
          duration: 32,
          time: '23:12'
        }
      ]
    },
    {
      id: 'chat-5',
      name: suspects[4].name,
      username: suspects[4].username,
      avatar: suspects[4].avatar,
      unreadCount: 0,
      lastSeen: 'Ontem às 20:30',
      time: 'Ontem',
      snippet: 'Deu tudo certo com o pix que te fiz no sigilo?',
      blurredSnippet: 'Deu tudo certo com o pix que te fiz no sigilo?',
      hasSensitiveMedia: false,
      hasAudio: false,
      messages: [
        {
          id: 'g1',
          sender: 'them',
          type: 'text',
          content: 'Deu tudo certo com o pix que te fiz no sigilo? Chegou certinho aí?',
          time: '20:25'
        },
        {
          id: 'g2',
          sender: 'me',
          type: 'text',
          content: 'Chegou sim anjo, valeu de verdade! Te compenso depois no nosso quarto ❤️',
          time: '20:28'
        }
      ]
    },
    {
      id: 'chat-6',
      name: suspects[7].name,
      username: suspects[7].username,
      avatar: suspects[7].avatar,
      unreadCount: 1,
      lastSeen: 'Há 2h',
      time: 'Há 2h',
      snippet: '🔒 Foto de visualização única interceptada',
      blurredSnippet: 'Apaga esse chat logo. Se alguém pegar seu celular estamos lascados.',
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
          caption: 'Foto temporária de visualização única recuperada',
          imageUrl: PROVOCATIVE_MEDIA[2],
          time: '15:22'
        }
      ]
    },
    {
      id: 'chat-7',
      name: suspects[8].name,
      username: suspects[8].username,
      avatar: suspects[8].avatar,
      unreadCount: 0,
      lastSeen: 'Há 3h',
      time: 'Há 3h',
      snippet: 'Não acredito que você teve coragem de ir lá com ele(a)...',
      blurredSnippet: 'Não acredito que você teve coragem mesmo de ir lá...',
      hasSensitiveMedia: false,
      hasAudio: false,
      messages: [
        {
          id: 'cr1',
          sender: 'them',
          type: 'text',
          content: 'Não acredito que você teve coragem mesmo de ir lá com aquela pessoa ontem! Me conta tudo...',
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
      name: suspects[9].name,
      username: suspects[9].username,
      avatar: suspects[9].avatar,
      unreadCount: 0,
      lastSeen: 'Há 3 dias',
      time: '3 d',
      snippet: 'Reserva confirmada: Suíte Luxo para 2 pessoas.',
      blurredSnippet: 'Reserva confirmada: Suíte Luxo para 2 pessoas.',
      hasSensitiveMedia: false,
      hasAudio: false,
      messages: [
        {
          id: 'rh1',
          sender: 'them',
          type: 'text',
          content: `Confirmação de reserva de suíte para 2 pessoas concluída com sucesso para a data solicitada em ${visitorCity}.`,
          time: '10:00'
        }
      ]
    },
    {
      id: 'chat-9',
      name: suspects[10].name,
      username: suspects[10].username,
      avatar: suspects[10].avatar,
      unreadCount: 1,
      lastSeen: 'Há 5h',
      time: 'Há 5h',
      snippet: '📷 Foto temporária interceptada do Direct',
      blurredSnippet: 'Mídia no modo View Once salva no cache de transmissão',
      hasSensitiveMedia: true,
      hasAudio: false,
      messages: [
        {
          id: 'ns1',
          sender: 'them',
          type: 'sensitive_image',
          caption: 'Mídia no modo View Once salva no cache de transmissão',
          imageUrl: PROVOCATIVE_MEDIA[3],
          time: '12:05'
        }
      ]
    },
    {
      id: 'chat-10',
      name: suspects[5].name,
      username: suspects[5].username,
      avatar: suspects[5].avatar,
      unreadCount: 0,
      lastSeen: 'Ontem',
      time: 'Ontem',
      snippet: '🎙️ Áudio de voz (0:42) • Escuta quando estiver a sós...',
      blurredSnippet: 'Escuta quando você estiver a sós... não deixa ninguém ouvir.',
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
      name: suspects[11].name,
      username: suspects[11].username,
      avatar: suspects[11].avatar,
      unreadCount: 0,
      lastSeen: 'Há 1 dia',
      time: '1 d',
      snippet: 'Vi você disfarçando haha... quem era aquele no carro?',
      blurredSnippet: 'Vi você disfarçando haha... quem era aquele(a) no carro?',
      hasSensitiveMedia: false,
      hasAudio: false,
      messages: [
        {
          id: 'lf1',
          sender: 'them',
          type: 'text',
          content: 'Vi você disfarçando haha... quem era no carro com você hoje cedo?',
          time: '19:40'
        }
      ]
    },
    {
      id: 'chat-12',
      name: suspects[6].name,
      username: suspects[6].username,
      avatar: suspects[6].avatar,
      unreadCount: 0,
      lastSeen: 'Há 2 dias',
      time: '2 d',
      snippet: 'Não posta nada do nosso almoço no story tá?',
      blurredSnippet: 'Não posta nada do nosso almoço no story tá? Segredo nosso.',
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
      name: suspects[12].name,
      username: suspects[12].username,
      avatar: suspects[12].avatar,
      unreadCount: 0,
      lastSeen: 'Há 2 dias',
      time: '2 d',
      snippet: 'Foi muito bom ontem... quando a gente repete?',
      blurredSnippet: 'Foi muito bom ontem... quando a gente repete?',
      hasSensitiveMedia: false,
      hasAudio: false,
      messages: [
        {
          id: 'se1',
          sender: 'them',
          type: 'text',
          content: 'Nossa, foi incrível demais ontem à noite... quando a gente repete sem ninguém desconfiar?',
          time: '01:15'
        }
      ]
    },
    {
      id: 'chat-14',
      name: suspects[13].name,
      username: suspects[13].username,
      avatar: suspects[13].avatar,
      unreadCount: 0,
      lastSeen: 'Há 4 dias',
      time: '4 d',
      snippet: '🔒 Backup de 6 mídias temporárias interceptadas do Meta CDN',
      blurredSnippet: 'Sessão criptografada restrita. 6 arquivos temporários recuperados.',
      hasSensitiveMedia: true,
      hasAudio: false,
      messages: [
        {
          id: 'ma1',
          sender: 'them',
          type: 'text',
          content: 'Sessão criptografada restrita. 6 arquivos temporários recuperados do cache da Meta CDN.',
          time: '08:00'
        },
        {
          id: 'ma2',
          sender: 'them',
          type: 'sensitive_image',
          caption: 'Foto confidencial arquivada recuperada',
          imageUrl: PROVOCATIVE_MEDIA[4],
          time: '08:01'
        }
      ]
    }
  ];
}
