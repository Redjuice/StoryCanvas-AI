/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: '#5847D2',
        'on-primary': '#FFFFFF',
        'primary-container': '#E3DFFF',
        'on-primary-container': '#140068',
        'primary-fixed': '#5847D2',
        'primary-fixed-dim': '#7C6CE5',
        
        // Secondary
        secondary: '#625B71',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#E8DEF8',
        'on-secondary-container': '#1D192B',
        
        // Tertiary
        tertiary: '#7D5260',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#FFD8E4',
        'on-tertiary-container': '#31111D',
        
        // Surface
        surface: '#FFFBFE',
        'on-surface': '#1C1B1F',
        'on-surface-variant': '#49454F',
        'surface-variant': '#E7E0EC',
        'surface-container': '#F3EDF7',
        'surface-container-low': '#F7F2FA',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-high': '#ECE6F0',
        'surface-container-highest': '#E6E0E9',
        
        // Background
        background: '#FFFBFE',
        'on-background': '#1C1B1F',
        
        // Outline
        outline: '#79747E',
        'outline-variant': '#CAC4D0',
        
        // Error
        error: '#B3261E',
        'on-error': '#FFFFFF',
        'error-container': '#F9DEDC',
        'on-error-container': '#410E0B',
        
        // Inverse
        'inverse-surface': '#313033',
        'inverse-on-surface': '#F4EFF4',
        'inverse-primary': '#C4BFFF',
      },
    },
  },
  plugins: [],
}
