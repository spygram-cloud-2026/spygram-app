import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { simulatedAudio } from '../utils/audioHelper';
import { useApp } from '../context/AppContext';
import VipLockModal from './VipLockModal';

export default function AudioPlayer({ duration = 18 }) {
  const { isPaid, targetUser } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    return () => {
      simulatedAudio.stop();
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      simulatedAudio.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      simulatedAudio.play(
        (sec) => {
          setCurrentSec(Math.floor(sec));
          // If user hasn't paid, allow a 1.5-second teaser then trigger VIP lock modal
          if (!isPaid && sec >= 1.5) {
            simulatedAudio.stop();
            setIsPlaying(false);
            setShowModal(true);
          }
        },
        () => {
          setIsPlaying(false);
          setCurrentSec(0);
        }
      );
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // 24 waveform bar heights
  const barHeights = [4, 8, 14, 18, 10, 16, 22, 12, 6, 18, 20, 14, 8, 16, 20, 12, 10, 18, 14, 8, 12, 6, 4, 8];

  return (
    <>
      <div className="flex items-center gap-3 bg-[#262626] hover:bg-[#2c2c2c] transition-colors px-3 py-2.5 rounded-2xl max-w-xs border border-[#363636]">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-[#0095f6] hover:bg-[#1877f2] flex items-center justify-center text-white transition-transform active:scale-95 flex-shrink-0 shadow-sm cursor-pointer"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        {/* Waveform Visualization */}
        <div className={`waveform-bars flex-1 ${isPlaying ? 'waveform-playing' : ''}`}>
          {barHeights.map((h, i) => {
            const isPassed = (i / barHeights.length) <= (currentSec / duration);
            return (
              <div
                key={i}
                className="waveform-bar"
                style={{
                  height: `${h}px`,
                  backgroundColor: isPassed ? '#0095f6' : '#737373'
                }}
              />
            );
          })}
        </div>

        {/* Timestamp */}
        <span className="text-[11px] font-mono text-[#a8a8a8] flex-shrink-0">
          {isPlaying ? formatTime(currentSec) : `0:${duration}`}
        </span>
      </div>

      <VipLockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Áudio de Voz Confidencial"
      />
    </>
  );
}
