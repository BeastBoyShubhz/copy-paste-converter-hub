import React from 'react';

export const Logo = () => {
    return (
        <div className="flex items-center gap-2 group cursor-pointer select-none">
            <div className="relative w-8 h-8 transition-transform duration-500 ease-in-out group-hover:rotate-180" style={{ width: '32px', height: '32px' }}>
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-lg"
                >
                    <defs>
                        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
                            <stop offset="50%" stopColor="#8b5cf6" /> {/* Violet */}
                            <stop offset="100%" stopColor="#d946ef" /> {/* Fuchsia */}
                        </linearGradient>
                    </defs>

                    {/* Outer Ring / Arrows */}
                    <path
                        d="M50 15 A35 35 0 0 1 85 50 L75 50 A25 25 0 0 0 50 25 Z"
                        fill="url(#logo-gradient)"
                        className="opacity-90"
                    />
                    <path
                        d="M50 85 A35 35 0 0 1 15 50 L25 50 A25 25 0 0 0 50 75 Z"
                        fill="url(#logo-gradient)"
                        className="opacity-90"
                    />

                    {/* Arrow Heads */}
                    <path d="M85 50 L95 50 L90 60 Z" fill="#d946ef" />
                    <path d="M15 50 L5 50 L10 40 Z" fill="#6366f1" />

                    {/* Central Dot */}
                    <circle cx="50" cy="50" r="12" fill="url(#logo-gradient)" />
                </svg>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            </div>

            <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-black dark:text-white tracking-tight">
                    Converter
                </span>
                <span className="text-sm font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-fuchsia-500 uppercase tracking-widest">
                    Hub
                </span>
            </div>
        </div>
    );
};
