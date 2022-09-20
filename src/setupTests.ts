// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// missing from test env
import crypto from 'crypto';
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID(),
  },
});

// missing from test env; may be fixed in Jest 28.x
Object.defineProperty(global, 'structuredClone', {
  value: (original: unknown) => JSON.parse(JSON.stringify(original)),
});
