/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {backgroundImage:{
      'menu-pattern' : "url('https://wallpapercave.com/wp/wp10260057.jpg')",
    }},
    fontFamily:{
      body: ['Vibur'],
      Exo:['Exo 2'],
      Fancy:['Great Vibes,cursive'],
    }
  },
  plugins: [],
}

