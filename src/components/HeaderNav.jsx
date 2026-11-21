import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  MessageCircle, 
  Server, 
  Coins, 
  Lock, 
  CheckCircle2, 
  Menu, 
  X, 
  Terminal,
  Camera
} from 'lucide-react';

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function HeaderNav() {
  const location = useLocation();
  const { isPaid, credits, targetUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Scanner Forense', icon: Terminal },
    { to: '/servers', label: 'Status da Rede', icon: Server },
    { to: '/credits', label: 'Protocolos & Créditos', icon: Coins }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass border-b border-[#262626] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-white no-underline group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-md group-hover:scale-105 transition-transform">
            <InstagramIcon size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-lg text-white">Spy<span className="text-[#0095f6]">Gram</span></span>
              <span className="text-[10px] bg-[#262626] text-[#00f2fe] font-mono px-1.5 py-0.5 rounded border border-[#00f2fe]/30 font-semibold">v4.8</span>
            </div>
            <span className="text-[10px] text-[#737373] tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] inline-block animate-pulse"></span>
              Servidores Online
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 no-underline ${
                  active
                    ? 'bg-[#262626] text-white shadow-sm border border-[#363636]'
                    : 'text-[#a8a8a8] hover:text-white hover:bg-[#181818]'
                }`}
              >
                <Icon size={14} className={active ? 'text-[#0095f6]' : 'text-[#737373]'} />
                {item.label}
                {item.badge && (
                  <span className="bg-[#ed4956] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Status Badge */}
        <div className="flex items-center gap-3">
          {isPaid ? (
            <div className="hidden sm:flex items-center gap-2 bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-xs px-3 py-1.5 rounded-full font-bold">
              <CheckCircle2 size={14} />
              <span>Acesso VIP Ativo</span>
            </div>
          ) : (
            <Link
              to="/checkout"
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#ed4956] to-[#dc2743] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md hover:brightness-110 no-underline btn-shine"
            >
              <Lock size={12} />
              <span>Desbloquear Acesso</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#181818] border border-[#262626] text-[#a8a8a8] hover:text-white"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[#262626] grid grid-cols-2 gap-2 pb-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between no-underline ${
                  active
                    ? 'bg-[#262626] text-white border border-[#363636]'
                    : 'text-[#a8a8a8] hover:text-white hover:bg-[#181818]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={15} className={active ? 'text-[#0095f6]' : 'text-[#737373]'} />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-[#ed4956] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
