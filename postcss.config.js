module.exports = {
  plugins: [
    require("tailwindcss"),
    require("@tailwindcss/postcss"), // Pastikan ini *setelah* tailwindcss
    require("autoprefixer"),
  ],
};
