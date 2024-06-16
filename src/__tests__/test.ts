// @typescript-eslint/no-unused-vars
const foo = 123;

const fn = async (): Promise<string> => 123;

fn.then(console.log);

// @typescript-eslint/await-thenable
await 'some promise';

// eqeqeq
if (Math.random() == 2) {
  // unicorn/error-message
  throw Error();
}
