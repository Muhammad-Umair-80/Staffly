const tokens = require('../design_assets/tokens.json');

/**
 * Minimal Tailwind config that imports design tokens from design_assets/tokens.json
 * and makes them available as theme extensions.
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    '../design_assets/stitched_components/**/*.{js,jsx,ts,tsx,css,html}'
  ],
  theme: {
    extend: {
      colors: tokens.colors || {},
      spacing: Object.fromEntries(
        Object.entries(tokens.spacing || {}).map(([k, v]) => [k, v])
      ),
      borderRadius: tokens.borderRadius || {},
      fontFamily: {
        sans: tokens.fontFamily?.base ? [tokens.fontFamily.base] : ['Inter', 'sans-serif'],
        label: tokens.fontFamily || {}
      },
      fontSize: Object.fromEntries(
        Object.entries(tokens.fontSize || {}).map(([key, val]) => {
          // val: { size: '14px', lineHeight: '20px', ... }
          if (typeof val === 'object') {
            const size = val.size || val[0] || '14px';
            const lineHeight = val.lineHeight || '1';
            // Tailwind accepts [size, { lineHeight }]
            return [key, [size, { lineHeight: val.lineHeight || 'normal', letterSpacing: val.letterSpacing }]];
          }
          return [key, val];
        })
      )
    }
  },
  plugins: []
};
