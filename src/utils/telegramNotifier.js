export function getTelegramConfig() {
  const token =
    localStorage.getItem('spygram_telegram_token') ||
    import.meta.env.VITE_TELEGRAM_BOT_TOKEN ||
    '';
  const chatId =
    localStorage.getItem('spygram_telegram_chat_id') ||
    import.meta.env.VITE_TELEGRAM_CHAT_ID ||
    '';

  return {
    token: token.trim(),
    chatId: chatId.trim(),
    isConfigured: Boolean(token && chatId)
  };
}

export function saveTelegramConfig(token, chatId) {
  if (token !== undefined) {
    localStorage.setItem('spygram_telegram_token', token.trim());
  }
  if (chatId !== undefined) {
    localStorage.setItem('spygram_telegram_chat_id', chatId.trim());
  }
}

export async function sendTelegramMessage(text) {
  const { token, chatId, isConfigured } = getTelegramConfig();
  if (!isConfigured) return false;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    return Boolean(data && data.ok);
  } catch (err) {
    console.warn('Telegram notification failed:', err);
    return false;
  }
}

export async function notifyNewVisit(location) {
  const text =
    `👁️ <b>[SpyGram] Novo Acesso ao Site</b>\n\n` +
    `📍 <b>Localização:</b> ${location?.city || 'Brasil'} - ${location?.state || 'BR'}\n` +
    `🌐 <b>IP:</b> <code>${location?.ip || 'Anônimo'}</code>\n` +
    `⏱️ <b>Data:</b> ${new Date().toLocaleString('pt-BR')}`;
  return sendTelegramMessage(text);
}

export async function notifyTargetSearched({ target, city, state }) {
  const text =
    `🎯 <b>[SpyGram] Alvo Pesquisado no Painel!</b>\n\n` +
    `👤 <b>Alvo:</b> @${target}\n` +
    `📍 <b>Origem:</b> ${city || 'Brasil'} - ${state || 'BR'}\n` +
    `⏱️ <b>Data:</b> ${new Date().toLocaleString('pt-BR')}`;
  return sendTelegramMessage(text);
}

export async function notifyPixGenerated({ username, amount, email, bumps, city }) {
  const bumpsList = Array.isArray(bumps) && bumps.length > 0 ? bumps.join(', ') : 'Nenhum';
  const text =
    `🚨 <b>NOVO PIX GERADO! [R$ ${Number(amount).toFixed(2).replace('.', ',')}]</b>\n\n` +
    `👤 <b>Alvo:</b> @${username || 'Não informado'}\n` +
    `📧 <b>E-mail:</b> ${email || 'Anônimo'}\n` +
    `💰 <b>Valor Total:</b> R$ ${Number(amount).toFixed(2).replace('.', ',')}\n` +
    `📍 <b>Localização:</b> ${city || 'Brasil'}\n` +
    `⚡ <b>Bumps:</b> ${bumpsList}\n` +
    `⏱️ <b>Horário:</b> ${new Date().toLocaleString('pt-BR')}\n\n` +
    `<i>Aguardando confirmação bancária...</i>`;
  return sendTelegramMessage(text);
}

export async function testTelegramNotification() {
  const text =
    `✅ <b>[SpyGram] Teste de Notificação com Sucesso!</b>\n\n` +
    `Seu bot do Telegram está 100% conectado!\n` +
    `Você receberá notificações em tempo real sempre que alguém acessar ou gerar um PIX no SpyGram.`;
  return sendTelegramMessage(text);
}

