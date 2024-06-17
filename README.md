# ESLint v9

The `tslint.configs.recommended` and `tslint.configs.recommendedTypeChecked` looks to be broken on `.tsx` files due to `tsconfig.json` not picking up them for some reason.  

To reproduce, run:
```sh
pnpm i
pnpm eslint src/__tests__/*
```
