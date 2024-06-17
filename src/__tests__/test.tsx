import cx from 'clsx';
import { createRoot } from 'react-dom/client';

import React from 'react';

// @typescript-eslint/await-thenable
void (await 'value');

const App = () => {
  // @stylistic/semi
  const [foo] = React.useState(0)

  if (true) {
    // react-hooks/rule-of-hooks
    React.useState(1);
  }

  // prettier/prettier
    React.useEffect(() => {
    foo;
    // react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('good bad')}>
      <div className="good bad">
        <div className="m-1 m-2">
          Test
          {/* react/void-dom-elements-no-children */}
          <br>hello</br>
        </div>
      </div>
    </div>
  );
};

const root = document.getElementById('root') as HTMLDivElement;

createRoot(root).render(<App />);
