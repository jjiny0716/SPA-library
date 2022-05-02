import { observe } from "./observer.js";
import { updateElement } from "./updateElement.js";
import { adjustChildComponents } from "./adjustChildComponents.js";
import { ComponentError } from "./ComponentError.js";

export default class Component {
  target;
  props;
  state;
  childComponents;
  attacthedEventListeners;
  isMountFinished;
  updateID;
  constructor(target, propsGenerator) {
    if (!target) throw new ComponentError(`Target of component is ${target} in '${this.constructor.name}'`);
    this.target = target;
    this.propsGenerator = propsGenerator;
    this.childComponents = {};
    this.attacthedEventListeners = [];
    this.updateProps();
    this.setup();
    observe(this.update.bind(this));
  }

  updateProps() {
    this.props = this.propsGenerator ? this.propsGenerator() : null;
  }

  setup() {}
  template() {return "";}
  render() {
    const { target } = this;
    const newNode = target.cloneNode(true);
    newNode.innerHTML = this.template();

    let childComponentData = {};
    const oldChildNodes = [...target.childNodes];
    const newChildNodes = [...newNode.childNodes];
    const maxLength = Math.max(oldChildNodes.length, newChildNodes.length);
    for (let i = 0; i < maxLength; i++) {
      childComponentData = { ...childComponentData, ...updateElement(target, newChildNodes[i], oldChildNodes[i]) };
    }

    adjustChildComponents(this, childComponentData);
  }

  generateChildComponent(target, name, key) {}
  afterMount() {}
  beforeUpdate() {}
  update(newTarget) {
    if (newTarget && newTarget !== this.target) {
      this.target = newTarget;
      this.setEvents();
    }

    if (!this.isMountFinished) {
      // observer 등록
      observe(this.lifeCycle.bind(this));
    }
    else {
      // debounce
      cancelAnimationFrame(this.updateID);
      this.updateID = requestAnimationFrame(this.lifeCycle.bind(this));
    }

  }

  lifeCycle() {
    if (this.isMountFinished) this.beforeUpdate();
    if (this.isMountFinished) this.updateProps();
    this.render();
    if (this.isMountFinished) this.afterUpdate();
    
    if (!this.isMountFinished) {
      this.setEvents();
      this.afterMount();
      this.isMountFinished = true;
    }
  }

  afterUpdate() {}
  beforeUnmount() {}
  destroyComponent() {
    const childComponents = Object.values(this.childComponents);
    for (let childComponent of childComponents) {
      childComponent.destroyComponent();
    }
    this.beforeUnmount();
    this.removeAllEventListener();
  }

  setEvents() {}
  addEventListener(eventType, selector, callback) {
    const listener = (e) => {
      if (e.target.closest(selector)) callback(e);
    };
    this.target.addEventListener(eventType, listener);
    this.attacthedEventListeners.push({ eventType, listener });
  }

  removeAllEventListener() {
    for (let { eventType, listener } of this.attacthedEventListeners) {
      this.target.removeEventListener(eventType, listener);
    }
    this.attacthedEventListeners = [];
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.update();
  }
}
