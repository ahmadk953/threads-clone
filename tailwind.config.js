/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    fontSize: generateFontSizes(),
    extend: {
      colors: {
        'primary-500': '#877EFF',
        'secondary-500': '#FFB620',
        blue: '#0095F6',
        'logout-btn': '#FF5A5A',
        'navbar-menu': 'rgba(16, 16, 18, 0.6)',
        'dark-1': '#000000',
        'dark-2': '#121417',
        'dark-3': '#101012',
        'dark-4': '#1F1F22',
        'light-1': '#FFFFFF',
        'light-2': '#EFEFEF',
        'light-3': '#7878A3',
        'light-4': '#5C5C7B',
        'gray-1': '#697C89',
        glassmorphism: 'rgba(16, 16, 18, 0.60)',
      },
      boxShadow: {
        'count-badge': '0px 0px 6px 2px rgba(219, 188, 159, 0.30)',
        'groups-sidebar': '-30px 0px 60px 0px rgba(28, 28, 31, 0.50)',
      },
      screens: {
        xs: '400px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

function generateFontSizes() {
  const sizes = {
    heading1: '36px',
    heading2: '30px',
    heading3: '24px',
    heading4: '20px',
    body: '18px',
    base: '16px',
    small: '14px',
    subtle: '12px',
    tiny: '10px',
    'x-small': '7px',
  };

  const fontWeights = {
    bold: '700',
    semibold: '600',
    medium: '500',
    regular: '400',
  };

  const fontSizeConfig = {};

  for (const [sizeKey, sizeValue] of Object.entries(sizes)) {
    for (const [weightKey, weightValue] of Object.entries(fontWeights)) {
      const name = `${sizeKey}-${weightKey}`;
      fontSizeConfig[name] = [
        sizeValue,
        {
          lineHeight: '140%',
          fontWeight: weightValue,
        },
      ];
      // Special case for 'subtle' with different lineHeight
      if (sizeKey === 'subtle') {
        fontSizeConfig[name][1].lineHeight = '16px';
      }
      // Special case for 'x-small' with different lineHeight
      if (sizeKey === 'x-small') {
        fontSizeConfig[name][1].lineHeight = '9.318px';
      }
    }
  }

  return fontSizeConfig;
}
