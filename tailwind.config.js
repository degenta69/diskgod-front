module.exports = {
  mode:'jit',
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'MAX2xl': {'max': '1535px'},
        // => @media (max-width: 1535px) { ... }
  
        'MAXxl': {'max': '1279px'},
        // => @media (max-width: 1279px) { ... }
  
        'MAXlg': {'max': '900px'},
        // => @media (max-width: 900px) { ... }
  
        'MAXmd': {'max': '767px'},
        // => @media (max-width: 767px) { ... }
  
        'MAXsm': {'max': '639px'},
        // => @media (max-width: 639px) { ... }
      },
      colors: {
        sidebarBG: "#202225",
        serverBG: "#2F3037",
        mainBG: "#37393E",
        sidebarContentBG: "#37393E",
        badgeBG:"rgb(236,66,68)",
        textNormal:"#dcddde",
      },
    },
  },
  variants: {
    extend: {
      
      animation: ['motion-reduce'],
      transitionProperty: [
        'hover',
        'focus',
        'responsive',
        'motion-safe',
        'motion-reduce'
      ]
    },
  },
  plugins: [],
};
