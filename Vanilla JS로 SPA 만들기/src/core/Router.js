import { observable } from './observer.js';

export default class Router {
  constructor(baseURL = '/', routes) {
    this.baseURL = baseURL;
    this.currentRoute = observable({ value: '/' });
    this.routes = routes;
    this.setup();
  }

  get route() {
    const { value: path } = this.currentRoute;
    if (this.routes[path]) return this.routes[path];
    
    // 와일드카드 매칭
    for (let i = path.length - 1 ; i >= 0 ; i--) {
      const resultRoute = this.routes[`${path.slice(0, i)}*`];
      if (resultRoute) return resultRoute;
    }

    return "Not found";
  }

  setup() {
    window.addEventListener("popstate", this.updateRouter.bind(this));
  }
  
  updateRouter() {
    this.currentRoute.value = location.pathname.replace(this.baseURL, "");
  }

  push(path) {
    window.history.pushState({}, path, `${this.baseURL}${path}`);
    this.updateRouter();
  }
}