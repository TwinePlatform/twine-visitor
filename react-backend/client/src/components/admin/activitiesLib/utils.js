export const partial = (fn, ...args) => fn.bind(null, ...args);
const pipeTwo = (a, b) => arg => b(a(arg));
export const pipe = (...ops) => ops.reduce(pipeTwo);
