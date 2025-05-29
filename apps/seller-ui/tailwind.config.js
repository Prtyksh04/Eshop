/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '../seller-ui/src/**/*.{js,ts,tsx,jsx}',
    '../../packages/components/**/*.{js,ts,tsx,jsx}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
