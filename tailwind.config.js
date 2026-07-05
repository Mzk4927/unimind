/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05070c',
        panel: 'rgba(12, 20, 32, 0.55)',
        neon: {
          DEFAULT: '#3fd0ff',
          soft: '#8fe8ff',
          deep: '#0a8fd1',
          amber: '#ffb02e',
          green: '#3dffb0',
          red: '#ff4d5e'
        }
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Rajdhani"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        neon: '0 0 20px rgba(63,208,255,0.35), 0 0 60px rgba(63,208,255,0.12)',
        'neon-strong': '0 0 30px rgba(63,208,255,0.6), 0 0 90px rgba(63,208,255,0.25)'
      },
      backdropBlur: {
        xs: '2px'
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 }
        }
      },
      animation: {
        scanline: 'scanline 3s linear infinite',
        pulseGlow: 'pulseGlow 2.2s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
