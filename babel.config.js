module.exports = {
  presets: ["@babel/preset-typescript"],
  plugins: [
    ["@babel/plugin-transform-modules-commonjs"],
    ["@babel/plugin-transform-react-jsx", { pragma: "h" }],
  ],
};
