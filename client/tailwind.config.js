/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        earth: {
          50: '#FBF9F5',
          100: '#F5EFEB',
          200: '#EAE0D5',
          300: '#D5C3B0',
          400: '#B89F84',
          500: '#8E6F52',
          600: '#6F543C',
          700: '#543F2D',
          800: '#3D2D20',
          900: '#2A1E15',
        },
        forest: {
          50: '#F0F7F4',
          100: '#DDEFE7',
          200: '#BCDED0',
          300: '#90C7B2',
          400: '#5EAA8F',
          500: '#398C70',
          600: '#2B7059',
          700: '#235A48',
          800: '#1C4537',
          900: '#153329',
          950: '#0C1F19',
        },
        harvest: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#E09F3E',
          600: '#C77D22',
          700: '#A15E17',
          800: '#854D16',
          900: '#713F12',
        }
      }
    },
  },
  plugins: [],
}
