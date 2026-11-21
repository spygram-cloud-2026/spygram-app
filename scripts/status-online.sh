#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "=== Status SpyGram Online ==="

if [ -f "logs/public_url.txt" ]; then
  URL=$(cat logs/public_url.txt)
  echo "🌐 URL Atual: $URL"
else
  echo "⚠️ Nenhuma URL pública registrada no momento."
fi

echo ""
echo "Processos:"
if [ -f "logs/.pids" ]; then
  while read -r pid; do
    if ps -p "$pid" > /dev/null 2>&1; then
      echo "  - PID $pid está ATIVO"
    else
      echo "  - PID $pid NÃO está ativo"
    fi
  done < logs/.pids
else
  echo "  Nenhum arquivo de PIDs encontrado."
fi

echo ""
echo "Teste HTTP Local (porta 3000):"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ || echo "000")
echo "  HTTP Code: $HTTP_CODE"
