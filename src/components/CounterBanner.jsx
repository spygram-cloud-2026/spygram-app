import React, { useState, useEffect, useMemo } from 'react';
import { Users } from 'lucide-react';

export default function CounterBanner() {
  const targetCount = useMemo(() => 63200 + Math.floor(Math.random() * 200), []);
  const [count, setCount] = useState(62410);

  const dayOfWeek = useMemo(() => {
    const days = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado'
    ];
    return days[new Date().getDay()];
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const ease = 1 - Math.pow(1 - progress, 2);
        const current = Math.floor(62410 + ease * (targetCount - 62410));
        setCount(current);
        requestAnimationFrame(animate);
      } else {
        setCount(targetCount);
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [targetCount]);

  return (
    <div className="mt-6 text-center text-sm text-gray-300 flex items-center justify-center gap-2 animate-fade-in pointer-events-none select-none">
      <Users className="w-4 h-4 text-green-500" />
      <span>
        Mais de{' '}
        <span className="font-bold text-white tabular-nums">
          {count.toLocaleString('pt-BR')}
        </span>{' '}
        perfis invadidos nesta {dayOfWeek}.
      </span>
    </div>
  );
}

