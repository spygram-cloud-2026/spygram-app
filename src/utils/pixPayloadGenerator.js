/**
 * Utilitário de Geração de QR Code Estático e Pix Copia e Cola
 * em estrita conformidade com os Padrões para Iniciação do Pix do Banco Central do Brasil (BACEN)
 * e especificação EMV® QRCPS Merchant-Presented Mode.
 */

// Chave padrão de demonstração caso o administrador ainda não tenha configurado a sua própria chave
export const DEFAULT_PIX_CONFIG = {
  key: 'contato@spygram.vip',
  keyType: 'email',
  name: 'SPYGRAM TECNOLOGIA',
  city: 'SAO PAULO',
  txid: '***',
  isConfigured: false
};

/**
 * Remove acentos, caracteres especiais e formata strings para compatibilidade ASCII BACEN
 */
export function sanitizeText(str, maxLength) {
  if (!str) return '';
  const normalized = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9 ]/g, '') // mantém apenas letras, números e espaços
    .trim()
    .toUpperCase();
  return maxLength ? normalized.substring(0, maxLength) : normalized;
}

/**
 * Normaliza a chave Pix conforme a especificação do Banco Central:
 * - CPF: 11 dígitos numéricos
 * - CNPJ: 14 dígitos numéricos
 * - Telefone: formato internacional com +55 (ex: +5511999998888)
 * - Email: minúsculo sem espaços
 * - Aleatória (EVP): UUID minúsculo
 */
export function normalizePixKey(rawKey, type = 'auto') {
  if (!rawKey) return '';
  const trimmed = rawKey.trim();

  // Detecção automática se tipo for auto
  let detectedType = type;
  if (detectedType === 'auto') {
    if (trimmed.includes('@')) {
      detectedType = 'email';
    } else if (/^[0-9a-fA-F-]{32,36}$/.test(trimmed)) {
      detectedType = 'evp';
    } else {
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length === 11) {
        // Pode ser CPF ou telefone sem +55. Se começar com 9 ou DDD comum e tiver 11 dígitos com 9 no terceiro dígito:
        // Se usuário digitou telefone sem +55
        detectedType = 'cpf';
      } else if (digits.length === 14) {
        detectedType = 'cnpj';
      } else if (digits.length >= 10 && digits.length <= 13) {
        detectedType = 'phone';
      } else {
        detectedType = 'email';
      }
    }
  }

  switch (detectedType) {
    case 'cpf':
      return trimmed.replace(/\D/g, '').substring(0, 11);
    case 'cnpj':
      return trimmed.replace(/\D/g, '').substring(0, 14);
    case 'phone': {
      const digits = trimmed.replace(/\D/g, '');
      if (digits.startsWith('55') && digits.length >= 12) {
        return `+${digits}`;
      } else if (digits.length >= 10 && digits.length <= 11) {
        return `+55${digits}`;
      }
      return trimmed.startsWith('+') ? trimmed : `+${digits}`;
    }
    case 'email':
      return trimmed.toLowerCase();
    case 'evp':
    default:
      return trimmed.toLowerCase();
  }
}

/**
 * Validador de Chave Pix
 */
export function validatePixKey(key, type = 'auto') {
  if (!key || !key.trim()) {
    return { isValid: false, message: 'A chave Pix não pode estar vazia.' };
  }

  const normalized = normalizePixKey(key, type);

  if (type === 'cpf') {
    if (normalized.length !== 11) {
      return { isValid: false, message: 'CPF deve conter exatamente 11 dígitos numéricos.' };
    }
  } else if (type === 'cnpj') {
    if (normalized.length !== 14) {
      return { isValid: false, message: 'CNPJ deve conter exatamente 14 dígitos numéricos.' };
    }
  } else if (type === 'phone') {
    if (!normalized.startsWith('+55') || normalized.length < 13 || normalized.length > 14) {
      return { isValid: false, message: 'Telefone deve incluir DDD e 9 dígitos (ex: +5511999998888).' };
    }
  } else if (type === 'email') {
    if (!normalized.includes('@') || !normalized.includes('.')) {
      return { isValid: false, message: 'Insira um e-mail válido (ex: seuemail@dominio.com).' };
    }
  } else if (type === 'evp') {
    if (normalized.length < 32) {
      return { isValid: false, message: 'Chave aleatória inválida (formato UUID esperado).' };
    }
  }

  return { isValid: true, normalizedKey: normalized };
}

/**
 * Formata um campo no padrão EMVCo TLV (Tag - Length - Value)
 */
export function formatEMVField(id, value) {
  if (value === undefined || value === null) return '';
  const stringValue = String(value);
  const length = String(stringValue.length).padStart(2, '0');
  return `${id}${length}${stringValue}`;
}

/**
 * Cálculo do Checksum CRC16-CCITT (Polinômio 0x1021, Init 0xFFFF)
 * Exigido rigorosamente pelo Banco Central do Brasil para o ID 63 do BR Code
 */
export function calculateCRC16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera o payload oficial do Pix Estático (BR Code / Copia e Cola)
 * 
 * @param {Object} params
 * @param {string} params.pixKey - Chave Pix do recebedor
 * @param {string} [params.keyType] - Tipo da chave (cpf, cnpj, phone, email, evp)
 * @param {string} [params.merchantName] - Nome do titular da conta recebedora (máx 25 chars)
 * @param {string} [params.merchantCity] - Cidade do titular (máx 15 chars)
 * @param {number|string} [params.amount] - Valor da transação em reais (ex: 27.90)
 * @param {string} [params.txid] - Identificador da transação (padrão '***' para estático)
 * @param {string} [params.description] - Descrição opcional (campo 02 dentro do 26)
 * @returns {string} Código Pix Copia e Cola pronto para leitura em qualquer banco
 */
export function generatePixPayload({
  pixKey,
  keyType = 'auto',
  merchantName = 'SPYGRAM TECNOLOGIA',
  merchantCity = 'SAO PAULO',
  amount = null,
  txid = '***',
  description = ''
}) {
  const cleanKey = normalizePixKey(pixKey || DEFAULT_PIX_CONFIG.key, keyType);
  const cleanName = sanitizeText(merchantName || DEFAULT_PIX_CONFIG.name, 25) || 'SPYGRAM TECNOLOGIA';
  const cleanCity = sanitizeText(merchantCity || DEFAULT_PIX_CONFIG.city, 15) || 'SAO PAULO';
  
  // TxID no BACEN estático: alfanumérico sem espaços, máx 25 caracteres, ou '***'
  let cleanTxid = (txid || '***').replace(/[^a-zA-Z0-9]/g, '').substring(0, 25);
  if (!cleanTxid) cleanTxid = '***';

  const cleanDescription = description ? sanitizeText(description, 25) : '';

  // 1. Merchant Account Information (Tag 26)
  // Subcampo 00: GUI (br.gov.bcb.pix)
  // Subcampo 01: Chave Pix
  // Subcampo 02: Descrição da cobrança (opcional)
  let merchantAccountInfo = formatEMVField('00', 'br.gov.bcb.pix');
  merchantAccountInfo += formatEMVField('01', cleanKey);
  if (cleanDescription) {
    merchantAccountInfo += formatEMVField('02', cleanDescription);
  }

  // 2. Montagem sequencial dos campos do Payload EMV
  let payload = '';

  // ID 00: Payload Format Indicator (Fixo: "01")
  payload += formatEMVField('00', '01');

  // ID 26: Merchant Account Information
  payload += formatEMVField('26', merchantAccountInfo);

  // ID 52: Merchant Category Code (Fixo: "0000" para genérico/não categorizado)
  payload += formatEMVField('52', '0000');

  // ID 53: Transaction Currency (Fixo: "986" para BRL - Real Brasileiro)
  payload += formatEMVField('53', '986');

  // ID 54: Transaction Amount (Opcional no estático, mas obrigatório quando há valor fixo no checkout)
  if (amount !== undefined && amount !== null && Number(amount) > 0) {
    const formattedAmount = Number(amount).toFixed(2);
    payload += formatEMVField('54', formattedAmount);
  }

  // ID 58: Country Code (Fixo: "BR")
  payload += formatEMVField('58', 'BR');

  // ID 59: Merchant Name (Nome do recebedor, máx 25 chars)
  payload += formatEMVField('59', cleanName);

  // ID 60: Merchant City (Cidade do recebedor, máx 15 chars)
  payload += formatEMVField('60', cleanCity);

  // ID 62: Additional Data Field Template
  // Subcampo 05: Reference Label / TxID
  const additionalDataField = formatEMVField('05', cleanTxid);
  payload += formatEMVField('62', additionalDataField);

  // ID 63: CRC16 Checksum
  // Deve conter '6304' + o checksum hexadecimal em maiúsculas calculado sobre toda a string anterior
  payload += '6304';
  const checksum = calculateCRC16(payload);

  return payload + checksum;
}

/**
 * Lê as configurações de Pix salvas pelo administrador
 */
export function getPixConfig() {
  const saved = localStorage.getItem('spygram_pix_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_PIX_CONFIG,
        ...parsed,
        isConfigured: Boolean(parsed.key && parsed.key.trim() && parsed.name && parsed.name.trim())
      };
    } catch (e) {
      console.warn('Erro ao ler spygram_pix_config:', e);
    }
  }

  // Fallback para variáveis de ambiente Vite caso existam
  const envKey = import.meta.env?.VITE_PIX_KEY;
  const envName = import.meta.env?.VITE_PIX_NAME;
  const envCity = import.meta.env?.VITE_PIX_CITY;
  const envType = import.meta.env?.VITE_PIX_KEY_TYPE;

  if (envKey) {
    return {
      key: envKey,
      keyType: envType || 'auto',
      name: envName || 'SPYGRAM TECNOLOGIA',
      city: envCity || 'SAO PAULO',
      txid: '***',
      isConfigured: true
    };
  }

  return { ...DEFAULT_PIX_CONFIG };
}

/**
 * Salva as configurações de Pix no navegador
 */
export function savePixConfig(config) {
  const toSave = {
    key: (config.key || '').trim(),
    keyType: config.keyType || 'auto',
    name: sanitizeText(config.name || 'SPYGRAM TECNOLOGIA', 25),
    city: sanitizeText(config.city || 'SAO PAULO', 15),
    txid: (config.txid || '***').replace(/[^a-zA-Z0-9]/g, '').substring(0, 25) || '***',
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem('spygram_pix_config', JSON.stringify(toSave));
  return toSave;
}

/**
 * Analisa e decodifica um payload Pix BR Code para validação
 */
export function parsePixPayload(payload) {
  if (!payload || typeof payload !== 'string') return null;

  try {
    const fields = {};
    let index = 0;

    while (index < payload.length) {
      const id = payload.substring(index, index + 2);
      const length = parseInt(payload.substring(index + 2, index + 4), 10);
      if (isNaN(length)) break;
      const value = payload.substring(index + 4, index + 4 + length);
      fields[id] = value;
      index += 4 + length;
    }

    // Validar CRC
    const payloadWithoutCrc = payload.substring(0, payload.length - 4);
    const providedCrc = payload.substring(payload.length - 4).toUpperCase();
    const calculatedCrc = calculateCRC16(payloadWithoutCrc);
    const isCrcValid = providedCrc === calculatedCrc;

    return {
      fields,
      merchantAccount: fields['26'] || '',
      currency: fields['53'] || '',
      amount: fields['54'] || '',
      country: fields['58'] || '',
      name: fields['59'] || '',
      city: fields['60'] || '',
      additionalData: fields['62'] || '',
      crc: providedCrc,
      isCrcValid
    };
  } catch (err) {
    return null;
  }
}

