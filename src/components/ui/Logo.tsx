import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 select-none">
      <span
        aria-hidden
        className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[color:var(--accent)] text-white font-bold text-sm"
      >
        ⇄
      </span>
      <span className="font-semibold text-[1.05rem] text-[color:var(--text)] tracking-tight">
        ConverterHub
      </span>
    </div>
  );
};
