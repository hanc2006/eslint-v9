import { createConfig } from '../utils.js';
import pluginPromise from 'eslint-plugin-promise';

export const promiseConfig = createConfig({
  name: 'promise',
  plugins: {
    promise: pluginPromise
  },
  rules: {
    'promise/always-return': ['error'],
    'promise/no-return-wrap': ['error'],
    'promise/param-names': ['error'],
    'promise/catch-or-return': ['error'],
    'promise/no-native': ['off'],
    'promise/no-nesting': ['warn'],
    'promise/no-promise-in-callback': ['warn'],
    'promise/no-callback-in-promise': ['warn'],
    'promise/avoid-new': ['warn'],
    'promise/no-new-statics': ['error'],
    'promise/no-return-in-finally': ['warn'],
    'promise/valid-params': ['warn'],
    'promise/no-multiple-resolved': ['error']
  }
});
