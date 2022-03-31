import { updateElement } from "./updateElement.mjs";
import { adjustChildComponents } from "./adjustChildComponents.mjs";

export default class Component {
  target;
  props;
  state;
  childComponents;
  attacthedEventListeners;
  constructor(target, propsGenerator) {
    this.target = target;
    this.propsGenerator = propsGenerator;
    this.childComponents = {};
    this.attacthedEventListeners = [];
    this.updateProps();
    this.setup();
    this.render();
    this.setEvents();
    this.afterMount();
  }

  updateProps() {
    this.props = this.propsGenerator ? this.propsGenerator() : null;
  }

  setup() {}
  template() { return ""; }
  render() {
    const { target } = this;
    const newNode = target.cloneNode(true);
    newNode.innerHTML = this.template();

    let childComponentData = {};
    const oldChildNodes = [...target.childNodes];
    const newChildNodes = [...newNode.childNodes];
    const max = Math.max(oldChildNodes.length, newChildNodes.length);
    for (let i = 0; i < max; i++) {
      childComponentData = { ...childComponentData, ...updateElement(target, newChildNodes[i], oldChildNodes[i]) };
    }
    adjustChildComponents(this, childComponentData);

    for (let childComponent of Object.values(this.childComponents)) {
      childComponent.updateProps();
      childComponent.render();
    }
  }

  generateChildComponent() {}
  afterMount() {}
  beforeUpdate() {}
  afterUpdate() {}
  beforeUnmount() {}
  destroyComponent() {
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
    this.beforeUpdate();
    this.render();
    this.afterUpdate();
  }
}
