import { observable } from './observer.js';

type PathValue = {
  value: string;
}

export default class Router {
  private currentRoute: PathValue;
  constructor(private baseURL = '/', private routes: Record<string, string>) {
    this.currentRoute = observable({ value: '/' });
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

  push(path: string) {
    window.history.pushState({}, path, `${this.baseURL}${path}`);
    this.updateRouter();
  }
}