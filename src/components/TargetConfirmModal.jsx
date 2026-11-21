import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BadgeCheck, Lock, CheckCircle, RotateCcw } from 'lucide-react';

function formatCount(num) {
  if (num === undefined || num === null) return '0';
  if (typeof num === 'string' && (num.includes('k') || num.includes('M'))) return num;
  const n = typeof num === 'string' ? parseInt(num, 10) || 0 : num;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function TargetConfirmModal({ profileData, onConfirm, onCorrect }) {
  if (!profileData) return null;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full max-w-sm mx-auto p-6 bg-black/80 backdrop-blur-md border border-purple-500 rounded-2xl shadow-2xl shadow-purple-500/20 text-white"
    >
      <div className="text-center mb-6">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-2xl font-extrabold uppercase">Confirmar Alvo</h2>
        <p className="text-gray-400 text-sm mt-1">
          Você realmente deseja invadir o perfil abaixo?
        </p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={profileData.profilePicUrl || profileData.avatar || '/perfil.jpg'}
            alt={profileData.username}
            className="w-20 h-20 rounded-full object-cover border-2 border-pink-500"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold truncate">@{profileData.username}</p>
              {(profileData.isVerified || profileData.verified) && (
                <BadgeCheck className="w-5 h-5 text-blue-400 shrink-0" />
              )}
            </div>
            <p className="text-gray-300 text-sm truncate">{profileData.fullName}</p>
          </div>
        </div>

        <div className="flex justify-around text-center text-sm border-t border-b border-gray-700 py-3">
          <div>
            <p className="font-bold text-lg">
              {formatCount(profileData.postsCount || profileData.posts || 0)}
            </p>
            <p className="text-gray-400 text-xs">Publicações</p>
          </div>
          <div>
            <p className="font-bold text-lg">
              {formatCount(profileData.followers || profileData.followersRaw || 0)}
            </p>
            <p className="text-gray-400 text-xs">Seguidores</p>
          </div>
          <div>
            <p className="font-bold text-lg">
              {formatCount(profileData.following || profileData.followingRaw || 0)}
            </p>
            <p className="text-gray-400 text-xs">Seguindo</p>
          </div>
        </div>

        {profileData.biography && (
          <div className="text-sm text-gray-300 text-left">
            <p className="whitespace-pre-wrap">{profileData.biography}</p>
          </div>
        )}

        {(profileData.isPrivate !== false) && (
          <div className="flex items-center justify-center gap-2 text-xs text-red-400 bg-red-900/50 border border-red-700 rounded-full px-3 py-1 w-fit mx-auto">
            <Lock className="w-3 h-3" />
            <span>Este perfil é privado</span>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-base font-bold text-white rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black active:scale-95 cursor-pointer shadow-lg shadow-indigo-500/25"
        >
          <CheckCircle className="w-5 h-5" />
          CONFIRMAR INVASÃO
        </button>

        <button
          type="button"
          onClick={onCorrect}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-base font-bold text-red-300 bg-red-900/40 border border-red-700 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          Corrigir Nome de Usuário
        </button>
      </div>
    </motion.div>
  );
}

