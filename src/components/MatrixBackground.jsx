import React, { useMemo } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-[]{}|;:,.<>?/~`';
const WORD = 'SPYGRAM';
const COLUMNS_COUNT = 40;
const FONT_SIZE = 20;
const CHARS_PER_COLUMN = 100;

function generateColumnContent(colIndex) {
  const elements = [];
  let wordCharIndex = 0;
  const isSpecialColumn = colIndex % 7 === 0;

  for (let i = 0; i < CHARS_PER_COLUMN; i++) {
    let char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    let colorClass = 'text-gray-950';

    if (isSpecialColumn && wordCharIndex < WORD.length && i % 10 === 0) {
      char = WORD[wordCharIndex];
      colorClass = 'text-purple-500 font-bold';
      wordCharIndex++;
    } else if (Math.random() < 0.02) {
      colorClass = Math.random() > 0.5 ? 'text-purple-700' : 'text-pink-700';
    }

    elements.push(
      <span key={i} className={colorClass}>
        {char}
      </span>
    );
  }

  return elements;
}

export default function MatrixBackground() {
  const columns = useMemo(() => {
    return Array(COLUMNS_COUNT)
      .fill(0)
      .map((_, idx) => ({
        content: generateColumnContent(idx),
        duration: Math.random() * 15 + 10,
        delay: Math.random() * -10
      }));
  }, []);

  return (
    <>
      <style>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); } 
          100% { transform: translateY(100vh); }
        }
        .matrix-column {
          position: absolute;
          top: 0; 
          font-size: ${FONT_SIZE}px;
          line-height: ${FONT_SIZE}px;
          white-space: pre;
          animation-name: matrix-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0.8; 
          display: flex;
          flex-direction: column;
          filter: blur(3px);
        }
      `}</style>
      <div className="fixed inset-0 overflow-hidden z-0 bg-black pointer-events-none select-none">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className="matrix-column"
            style={{
              left: `${(idx / COLUMNS_COUNT) * 100}%`,
              animationDuration: `${col.duration}s`,
              animationDelay: `${col.delay}s`
            }}
          >
            {col.content}
          </div>
        ))}
      </div>
    </>
  );
}

