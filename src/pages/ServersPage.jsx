import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Server, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Wifi, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';

export default function ServersPage() {
  const { servers, isPaid } = useApp();

  return (
    <div className="min-h-screen bg-black text-white pb-24 px-4 pt-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20 px-3 py-1 rounded-full text-xs font-mono mb-2">
              <Activity size={13} className="animate-pulse" />
              INFRAESTRUTURA DISTRIBUÍDA
            </div>
            <h1 className="text-2xl font-black text-white">Status dos Servidores e Nós de Proxy</h1>
            <p className="text-xs text-[#a8a8a8] mt-1">
              Monitoramento em tempo real dos clusters de descriptografia e túneis de interceptação.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
            <span className="text-xs font-mono font-bold text-[#10b981]">TODOS OS NÓS ATIVOS (100%)</span>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#121212] border border-[#262626] p-4 rounded-xl text-center">
            <Cpu size={20} className="mx-auto text-[#0095f6] mb-1.5" />
            <span className="text-lg font-black font-mono text-white block">32 Cores</span>
            <span className="text-[11px] text-[#737373]">Capacidade Dedicada</span>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-4 rounded-xl text-center">
            <Globe size={20} className="mx-auto text-[#10b981] mb-1.5" />
            <span className="text-lg font-black font-mono text-white block">4 Regiões</span>
            <span className="text-[11px] text-[#737373]">Rotas Globais</span>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-4 rounded-xl text-center">
            <Wifi size={20} className="mx-auto text-[#00f2fe] mb-1.5" />
            <span className="text-lg font-black font-mono text-[#00f2fe] block">24ms</span>
            <span className="text-[11px] text-[#737373]">Latência Média</span>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-4 rounded-xl text-center">
            <ShieldCheck size={20} className="mx-auto text-[#f59e0b] mb-1.5" />
            <span className="text-lg font-black font-mono text-[#10b981] block">99.9%</span>
            <span className="text-[11px] text-[#737373]">Uptime 30d</span>
          </div>
        </div>

        {/* Server Nodes Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {servers.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#121212] border border-[#262626] hover:border-[#363636] transition-all p-5 rounded-2xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#262626] flex items-center justify-center text-white">
                    <Server size={20} className="text-[#0095f6]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{srv.name}</h3>
                    <span className="text-[11px] text-[#737373]">{srv.region}</span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {srv.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#262626] text-xs font-mono">
                <div>
                  <span className="text-[#737373] text-[10px] block">PING / LATÊNCIA</span>
                  <span className="font-bold text-[#00f2fe] text-sm">{srv.latency} ms</span>
                </div>
                <div>
                  <span className="text-[#737373] text-[10px] block">USO DE CPU</span>
                  <span className="font-bold text-white text-sm">{srv.load}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Encryption Protocol Statement */}
        <div className="glass-card p-5 border border-[#262626] space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#10b981]" />
            Garantia de Anonimato em Nível de Rede
          </h3>
          <p className="text-xs text-[#a8a8a8] leading-relaxed">
            As consultas são distribuídas em camadas randômicas de proxy reverso e nós de saída protegidos por rotas criptografadas. O endereço IP original do usuário pesquisador nunca é exposto para os servidores da Meta ou do alvo.
          </p>
        </div>
      </div>
    </div>
  );
}
