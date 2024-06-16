# ESLint v9

How to:
```sh
pnpm i
pnpm test
```

The `tslint.configs.recommendedTypeChecked` looks to be broken on `.tsx` files due to parser configuration "somewhere".   
To try, uncomment the `tslint.configs.recommendedTypeChecked` in `tslint.configs.ts` and run:
```sh
pnpm eslint src/__tests__/test.tsx
```
