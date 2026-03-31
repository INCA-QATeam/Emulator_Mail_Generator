/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Pretendard', 'sans-serif'],
      },
      colors: {
        bg: '#0d0f14',
        surface: '#13161e',
        surface2: '#1a1e2a',
        'border-dark': '#252a38',
        'border-bright': '#2e3547',
        accent: '#4f8ef7',
        accent2: '#7c5cfc',
        'green-emu': '#34d399',
        'red-emu': '#f87171',
        'yellow-emu': '#fbbf24',
        'text-dim': '#94a3b8',
        'text-muted': '#64748b',
      },
    },
  },
  plugins: [],
}


