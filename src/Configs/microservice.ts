import pluginMicroservice from '../Plugins/microservice';
import { createCustomConfig } from '../utils';

// export const microserviceConfig = createCustomConfig<typeof rules>({
//   name: 'microservice',
//   plugins: {
//     microservice: pluginMicroservice
//   },
//   rules: {
//     'avoid-class-method-throws': ['']
//     'avoid-class-method': ['error'],
//     'enforce-class-inheritance': ['warn', [{ folder: 'src', superclass: 'BaseClass' }]],
//   }
// });
export const microserviceConfig = createCustomConfig({
  name: 'microservice',
  plugins: ['@microservice'],
  rules: {
    '@microservice/enforce-class-inheritance': ['error', {}]
  '@microservice/enforce-class-inheritance':['error',   ] 
  }
  configs: {
    recommended: {
      plugins: ['@microservice'],
      rules: {
        '@microservice/avoid-class': [
          'error',
          {
            /* options */
          }
        ]
        // Other rules...
      }
    }
  }
});
