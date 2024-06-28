/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",

      // HSL (220, 30, x)
      "navy": {
        950: "#07090d",
        900: "#121721",
        800: "#1d2535",
        700: "#2f3c56",
        600: "#3d4e70",
        500: "#536a98",
        400: "#8c9dc0",
        300: "#cad2e2",
        200: "#dee3ed",
        100: "#f2f4f8",
        50: "#f8f9fb",
      },

      "logo": "#2d2d4c",

      // HSL (30, 90, x)
      "orange": {
        950: "#130a01",
        900: "#301a03",
        800: "#4e2904",
        700: "#7e4307",
        600: "#a55709",
        500: "#df760c",
        400: "#f6a655",
        300: "#fbd6b1",
        200: "#fce6cf",
        100: "#fef5ec",
        50: "#fefaf5",
      },

      // HSL (310, 100, x)
      "blue": {
        950: "#000a14",
        900: "#001a33",
        800: "#002952",
        700: "#004385",
        600: "#0057ad",
        500: "#0076eb",
        400: "#4da6ff",
        300: "#add6ff",
        200: "#cce6ff",
        100: "#ebf5ff",
        50: "#f5faff",
      },

      // HSL (270, 70, x)
      "purple": {
        950: "#0a060e",
        900: "#1a0f24",
        800: "#291939",
        700: "#43285d",
        600: "#573479",
        500: "#7647a4",
        400: "#a682c9",
        300: "#d6c6e6",
        200: "#e6dbf0",
        100: "#f5f1f9",
        50: "#faf8fc",
      },

      // HSL (0, 60, x)
      "red": {
        950: "#100404",
        900: "#290a0a",
        800: "#411010",
        700: "#6a1b1b",
        600: "#8b2323",
        500: "#bb2f2f",
        400: "#db7070",
        300: "#efbebe",
        200: "#f5d6d6",
        100: "#fbefef",
        50: "#fdf7f7",
      },

      // HSL (0, 100, x)
      "deep-red": {
        950: "#140000",
        900: "#330000",
        800: "#520000",
        700: "#850000",
        600: "#ad0000",
        500: "#eb0000",
        400: "#ff4d4d",
        300: "#ffadad",
        200: "#ffcccc",
        100: "#ffebeb",
        50: "#fff5f5",
      },

      // HSL (350, 30, x)
      "oxblood": {
        950: "#0d0708",
        900: "#211215",
        800: "#351d21",
        700: "#552f35",
        600: "#703e46",
        500: "#97545e",
        400: "#bf8c94",
        300: "#e2cace",
        200: "#eddee1",
        100: "#f8f2f3",
        50: "#fbf8f9",
      },

      // HSL (120, 60, x)
      "green": {
        600: "#347934",
      },

      // Lighting steps:
      // 950  900  800  700  600  500  400  300  200  100   50
      //   4 - 10 - 16 - 26 - 34 - 46 - 65 - 84 - 90 - 96 - 98 (950-50)
    },
    extend: {
      animation: {
        "favorite-heart-pulse": "ping 1s cubic-bezier(0, 0, 0.2, 1)"
      },
    },
  },
  plugins: [],
}