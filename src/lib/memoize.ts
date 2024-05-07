import memize, { type MemizeMemoizedFunction } from "memize";

const fns: MemizeMemoizedFunction[] = [];

export default function memoize<T, P extends Array<unknown>>(
  fn: (...args: P) => T,
) {
  const f = memize(fn);
  fns.push(f);
  return f;
}

export function __reset() {
  fns.forEach((f) => f.clear());
}
