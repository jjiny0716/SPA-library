let currentObserver = null;

export function observe(fn) {
  currentObserver = fn;
  fn();
  currentObserver = null;
}

export function observable(obj) {
  const observerMap = {};

  return new Proxy(obj, {
    get(target, name) {
      if (!observerMap[name]) observerMap[name] = new Set();
      if (currentObserver !== null) observerMap[name].add(currentObserver); 
      return target[name];
    },
    set(target, name, value) {
      if (target[name] === value) return true;
      if (JSON.stringify(target[name]) === JSON.stringify(value)) return true;
      target[name] = value;
      observerMap[name].forEach((fn) => fn());
      return true;
    },
  });
}
