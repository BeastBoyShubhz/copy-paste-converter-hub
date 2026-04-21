import React from 'react';

/**
 * Typographic logotype.
 * Fraunces serif wordmark with a mono-caps kicker, rule mark on the left.
 */
export const Logo = () => {
  return (
    <div className="group flex items-baseline gap-3 select-none">
      <span
        aria-hidden
        className="hidden sm:inline-block w-6 h-px bg-ink translate-y-[-0.35rem] transition-all duration-300 group-hover:w-10 group-hover:bg-accent"
      />
      <span className="font-display text-2xl md:text-[1.7rem] font-medium tracking-tight-display text-ink leading-none">
        Converter<span className="text-accent">·</span>Hub
      </span>
      <span className="hidden md:inline-block font-mono uppercase tracking-caps text-[0.58rem] text-ink-muted translate-y-[-0.1rem]">
        a field manual
      </span>
    </div>
  );
};
