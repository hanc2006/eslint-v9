## ESLint configuration for Microservice Projects

<br>

- Extend the ESLint configuration.
- Use [Prettier](https://prettier.io/) for code formatting.
- Provides additional custom linting rules.

<br>

## Installation

Install the package and it's peer dependencies

```bash
npm install -D @yol-digital/eslint-config-nodejs eslint prettier
```

<br>

## Extends Eslint config

Now add `@yol-digital/eslint-config-nodejs` to your `eslint.config.js`

```javascript
{
  "extends": "@yol-digital/eslint-config-nodejs"
}
```

or `.eslintrc.js`

```js
import eslintCommonConfig from "@yol-digital/eslint-config-nodejs";

export const config = {
    ...eslintCommonConfig,
};
```

<br>

## Prettier config

This is how you can use or extend the `@yol-digital/eslint-config-nodejs` prettier config. Add this content to your `prettier.config.js`

```js
module.exports = require('@yol-digital/eslint-config-nodejs/prettier.config');
```
