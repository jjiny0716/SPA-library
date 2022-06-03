const observerStack: Function[] = [];
let currentObserver: Function | undefined;

export function observe(fn: Function) {
  observerStack.push(fn);
  currentObserver = observerStack.at(-1);
  fn();
  observerStack.pop();
  currentObserver = observerStack.at(-1);
}

export function observable<T extends object, K extends keyof T & string>(obj: T): T {
  const observerMap: Record<string, Set<Function>> = {};
  return new Proxy(obj, {
    get(target: T, name: K) {
      // Object.prototype의 메서드(hasOwnProperty) 참조시 바로 리턴
      if (typeof target[name] === "function") return target[name];
      
      if (!observerMap[name]) observerMap[name] = new Set();

      // 부모 함수와 자식 함수에서 둘다 observe를 했을 때 둘다 같은 필드를 get 했을 때, 부모함수만 등록되게 함
      if (currentObserver !== undefined && observerStack.every((observer) => !observerMap[name].has(observer))) {
        observerMap[name].add(currentObserver);
      }

      return target[name];
    },
    set(target: T, name: K, value: any) {
      if (Object.is(target[name], value)) return true;

      target[name] = value;
      if (observerMap[name]) observerMap[name].forEach((fn) => fn());

      return true;
    },
  });
}
