module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "ecmaFeatures": {
    "classes": true,
    "jsx": true,
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  },
};
