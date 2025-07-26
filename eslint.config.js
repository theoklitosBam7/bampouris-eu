import eslintPluginAstro from "eslint-plugin-astro";
import perfectionist from "eslint-plugin-perfectionist";

export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-array-includes": "error",
      "perfectionist/sort-classes": "error",
      "perfectionist/sort-decorators": "error",
      "perfectionist/sort-enums": "error",
      "perfectionist/sort-exports": "error",
      "perfectionist/sort-heritage-clauses": "error",
      "perfectionist/sort-imports": "error",
      "perfectionist/sort-interfaces": "error",
      "perfectionist/sort-intersection-types": "error",
      "perfectionist/sort-jsx-props": "error",
      "perfectionist/sort-maps": "error",
      "perfectionist/sort-modules": "error",
      "perfectionist/sort-named-exports": "error",
      "perfectionist/sort-named-imports": "error",
      "perfectionist/sort-object-types": "error",
      "perfectionist/sort-objects": "error",
      "perfectionist/sort-sets": "error",
      "perfectionist/sort-switch-case": "error",
      "perfectionist/sort-union-types": "error",
      "perfectionist/sort-variable-declarations": "error",
    },
  },
];
