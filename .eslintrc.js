module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    "operator-linebreak": 0,
    "no-restricted-globals": 0,
    "max-len": ["error", { "code": 160 }],
    "arrow-parens": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/destructuring-assignment": 0,
    "jsx-a11y/tabindex-no-positive": 0,
    "jsx-a11y/no-noninteractive-tabindex": 0,
    "react/jsx-wrap-multilines": 0,
  },
};
