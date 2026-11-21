#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

mkdir -p logs

echo "=== Iniciando SpyGram Online ==="

# Finalizar processos anteriores se existirem
if [ -f "logs/.pids" ]; then
  echo "Finalizando processos anteriores..."
  while read -r pid; do
    kill -9 "$pid" 2>/dev/null || true
  done < logs/.pids
  rm -f logs/.pids
fi

# Garantir que porta 3000 está liberada
fuser -k 3000/tcp 2>/dev/null || true
pkill -f "cloudflared tunnel --url http://localhost:3000" 2>/dev/null || true

sleep 1

# 1. Iniciar Vite Server
echo "1. Iniciando servidor Vite na porta 3000..."
setsid npm run dev </dev/null > logs/vite.log 2>&1 &
sleep 1
VITE_PID=$(pgrep -f "node.*vite" | head -n 1 || pgrep -f "npm.*run.*dev" | head -n 1)
echo "$VITE_PID" >> logs/.pids

# Aguardar Vite responder
READY=0
for i in {1..20}; do
  if curl -s "http://localhost:3000" > /dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 1
done

if [ $READY -ne 1 ]; then
  echo "ERRO: O servidor Vite não iniciou a tempo. Verifique logs/vite.log"
  exit 1
fi
echo "✓ Servidor Vite ativo (PID: $VITE_PID)"

# 2. Iniciar Cloudflare Tunnel
echo "2. Conectando Cloudflare Tunnel (HTTPS público)..."
setsid cloudflared tunnel --protocol http2 --url http://localhost:3000 </dev/null > logs/tunnel.log 2>&1 &
sleep 1
TUNNEL_PID=$(pgrep -f "cloudflared.*tunnel" | head -n 1)
echo "$TUNNEL_PID" >> logs/.pids

# Aguardar URL do tunnel e registro da conexão
PUBLIC_URL=""
for i in {1..30}; do
  FOUND=$(grep -o 'https://[-a-zA-Z0-9\.]*\.trycloudflare\.com' logs/tunnel.log | head -n 1 || true)
  REG=$(grep -o "Registered tunnel connection" logs/tunnel.log || true)
  if [ -n "$FOUND" ] && [ -n "$REG" ]; then
    PUBLIC_URL="$FOUND"
    break
  fi
  sleep 1
done

if [ -z "$PUBLIC_URL" ]; then
  echo "ERRO: Não foi possível obter a URL pública do Cloudflare. Verifique logs/tunnel.log"
  exit 1
fi

echo "$PUBLIC_URL" > logs/public_url.txt

echo ""
echo "=========================================================="
echo "🚀 PROJETO ONLINE COM SUCESSO!"
echo "=========================================================="
echo "🌐 URL Pública Oficial (Acesso Externo / Mobile / Testes):"
echo "   $PUBLIC_URL"
echo ""
echo "📱 Painel Administrativo:"
echo "   $PUBLIC_URL/admin  (Senha: admin123)"
echo ""
echo "📊 Logs:"
echo "   App:    tail -f logs/vite.log"
echo "   Tunnel: tail -f logs/tunnel.log"
echo "=========================================================="
