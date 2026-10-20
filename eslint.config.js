// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: ["dist/*", "server/*", ".expo/*"],
  },
  {
    rules: {
      "import/namespace": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-named-as-default": "off",
      "import/no-unresolved": "off",
      "import/no-duplicates": "off",
      "import/named": "off",
      "import/export": "off",
    },
  },
]);
