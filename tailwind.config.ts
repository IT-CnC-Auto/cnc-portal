import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cnc: {
          red: '#ED1B24',
          'red-dark': '#C41019',
          'red-light': '#F54349',
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'cnc-sm': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'cnc-md': '0 4px 12px rgba(0,0,0,0.08)',
        'cnc-red': '0 4px 14px rgba(237,27,36,0.25)',
      },
    },
  },
  plugins: [],
}

export default config
