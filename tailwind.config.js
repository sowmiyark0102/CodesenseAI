/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        ink:     '#07080c',
        base:    '#0d0f18',
        raised:  '#131720',
        overlay: '#181e2d',
        line:    '#1f2840',
        muted:   '#2a3555',
        dim:     '#5a6a90',
        soft:    '#8899bb',
        text:    '#dde4f0',
        bright:  '#f0f4ff',
        cyan:    '#00d4ff',
        'cyan-d':'#005f80',
        lime:    '#a3e635',
        'lime-d':'#3a5010',
        amber:   '#fbbf24',
        'amber-d':'#6b4f0a',
        rose:    '#fb7185',
        'rose-d':'#6b0f24',
        violet:  '#a78bfa',
        'violet-d':'#3b1f80',
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'slide-in': 'slideIn 0.4s ease forwards',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-cyan': 'pulseCyan 2s ease-in-out infinite',
        'type': 'type 0.5s steps(20) forwards',
        'shimmer': 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseCyan: {
          '0%,100%': { boxShadow: '0 0 8px #00d4ff44' },
          '50%': { boxShadow: '0 0 24px #00d4ff99, 0 0 48px #00d4ff33' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid': "linear-gradient(#1f284015 1px, transparent 1px), linear-gradient(90deg, #1f284015 1px, transparent 1px)",
        'scan-gradient': 'linear-gradient(180deg, transparent 0%, #00d4ff08 50%, transparent 100%)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
    },
  },
  plugins: [],
}
