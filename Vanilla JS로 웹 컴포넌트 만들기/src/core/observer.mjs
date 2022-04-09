const observerStack = [];
let currentObserver = null;

export function observe(fn) {
  observerStack.push(fn);
  currentObserver = observerStack.at(-1);
  fn();
  observerStack.pop();
  currentObserver = observerStack.at(-1) || null;
}

export function observable(obj) {
  const observerMap = {};
  return new Proxy(obj, {
    get(target, name) {
      if (!observerMap[name]) observerMap[name] = new Set();
      if (currentObserver !== null && observerStack.every(observer => !observerMap[name].has(observer))) {
        observerMap[name].add(currentObserver); 
      }
      return target[name];
    },
    set(target, name, value) {
      if (JSON.stringify(target[name]) === JSON.stringify(value)) return true;
      target[name] = value;
      observerMap[name].forEach((fn) => fn());
      return true;
    },
  });
}
