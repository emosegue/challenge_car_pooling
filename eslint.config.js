module.exports = [
    {
        root: true,
        parser: "@typescript-eslint/parser",
        plugins: ["@typescript-eslint"],
        extends: [
            "eslint:recommended",
            "plugin:@typescript-eslint/eslint-recommended",
            "plugin:@typescript-eslint/recommended",
        ],
        rules: {
            "semi": ["error", "always"],
            "indent": ["error", 2, { "SwitchCase": 1 }],
            "max-len": ["error", { "code": 80 }],
            "space-infix-ops": "error",
            "quotes": ["error", "single"],
            "no-multiple-empty-lines": ["error", { "max": 1 }],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],
            "comma-spacing": ["error", { "before": false, "after": true }],
            "no-trailing-spaces": "error",
            "eol-last": ["error", "always"],
            "keyword-spacing": ["error", { "before": true, "after": true }],
        },
    },
];