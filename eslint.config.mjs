import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {ignores:['src/components/visualizationTools/**/*', './src/components/visualizationTools/HiGlass/**/*','src/components/tempTypes/**/*', "/**/_test_*"]},
  {
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "no-unused-vars": "off",
        "no-undef": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-object-type":"off"
    }
}
];