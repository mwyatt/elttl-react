const withMT = require('@material-tailwind/react/utils/withMT')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          500: '#4399db'
        },
        secondary: {
          500: '#716156'
        },
        tertiary: {
          500: '#828387'
        }

        //   blue
        //   #6297bf
        // table
        // #567884
        // table leg
        // #828387
        // table side
        // #142534
        // floor
        // #716156

      }
    }
  },
  plugins: []
}
