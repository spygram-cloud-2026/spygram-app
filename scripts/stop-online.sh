#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "=== Finalizando SpyGram Online ==="

if [ -f "logs/.pids" ]; then
  while read -r pid; do
    if [ -n "$pid" ]; then
      echo "Finalizando PID $pid..."
      kill "$pid" 2>/dev/null || true
    fi
  done < logs/.pids
  rm -f logs/.pids
fi

fuser -k 3000/tcp 2>/dev/null || true
pkill -f "cloudflared tunnel --url http://localhost:3000" 2>/dev/null || true

echo "✓ Todos os serviços foram desligados."
