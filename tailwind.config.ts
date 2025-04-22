// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff4db8',
        surface: '#111114',
        card: '#1b1c1f',
        text: '#e5e5e5',
        subtext: '#9fa0a6',
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
      },
      fontSize: {
        base: ['14px', '20px'],
        lg: ['16px', '24px'],
        xl: ['20px', '28px'],
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
}

export default config
