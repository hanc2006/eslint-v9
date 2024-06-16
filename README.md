# ESLint v9

The `tslint.configs.recommendedTypeChecked` looks to be broken on `.tsx` files due to parser configuration "somewhere".  

To reproduce, run:
```sh
pnpm i
pnpm eslint src/__tests__/test.tsx
```
