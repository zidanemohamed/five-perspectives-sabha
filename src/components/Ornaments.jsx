import React from 'react';

/* Small lotus used in rules and dividers (inherits colour from CSS `color`) */
export function Lotus() {
  return (
    <svg viewBox="0 0 40 24" fill="currentColor" aria-hidden="true">
      <path d="M20 1 C25.5 7 25.5 16 20 22 C14.5 16 14.5 7 20 1Z" />
      <path d="M18.6 22 C11 21 6 15.5 4.5 8 C12 9 17 14 18.6 22Z" opacity="0.85" />
      <path d="M21.4 22 C29 21 34 15.5 35.5 8 C28 9 23 14 21.4 22Z" opacity="0.85" />
      <path d="M17.5 23 C9 24 2.5 20.5 0 15 C7 14.5 14 17 17.5 23Z" opacity="0.6" />
      <path d="M22.5 23 C31 24 37.5 20.5 40 15 C33 14.5 26 17 22.5 23Z" opacity="0.6" />
    </svg>
  );
}

/* The Devi eyes + bell + bindi from the top of the Shakti Mahotsav poster */
export function CrownEmblem() {
  return (
    <svg viewBox="0 0 220 92" aria-hidden="true">
      <defs>
        <linearGradient id="crownGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0cf7d" />
          <stop offset="0.55" stopColor="#c9953a" />
          <stop offset="1" stopColor="#8a5d1a" />
        </linearGradient>
        <g id="crownEye">
          <path d="M8 36 C40 4 84 8 102 32" fill="none" stroke="url(#crownGold)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M6 50 C38 18 82 22 102 48 C78 62 34 64 6 50Z" fill="#fff8e4" stroke="url(#crownGold)" strokeWidth="2.6" strokeLinejoin="round" />
          <circle cx="64" cy="44" r="10.5" fill="#8b1d1d" stroke="url(#crownGold)" strokeWidth="1.4" />
          <circle cx="64" cy="44" r="4.2" fill="#2a0709" />
          <circle cx="60.5" cy="40.5" r="1.6" fill="#fff8e4" />
          <path d="M6 50 C-2 52 -6 56 -8 60" fill="none" stroke="url(#crownGold)" strokeWidth="2" strokeLinecap="round" />
        </g>
      </defs>

      <use href="#crownEye" transform="translate(8 0)" />
      <use href="#crownEye" transform="translate(212 0) scale(-1 1)" />

      {/* bindi + bell */}
      <circle cx="110" cy="13" r="5.2" fill="#a3262a" stroke="url(#crownGold)" strokeWidth="1" />
      <line x1="110" y1="19" x2="110" y2="36" stroke="url(#crownGold)" strokeWidth="1.6" />
      <path d="M99 70 C99 52 103 40 110 37 C117 40 121 52 121 70 Z" fill="url(#crownGold)" stroke="#8a5d1a" strokeWidth="0.8" />
      <path d="M97 70 H123" stroke="#8a5d1a" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="110" cy="75" r="3.4" fill="url(#crownGold)" />
    </svg>
  );
}
