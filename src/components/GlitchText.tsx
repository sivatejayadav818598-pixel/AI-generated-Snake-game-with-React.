import React from 'react';

export function GlitchText({ text, className = "" }: { text: string, className?: string }) {
  return (
    <span className={`glitch-text font-bold ${className}`} data-text={text}>
      {text}
    </span>
  );
}
