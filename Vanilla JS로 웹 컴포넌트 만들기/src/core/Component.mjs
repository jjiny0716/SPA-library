import { updateElement } from "./updateElement.mjs";
import { adjustChildComponents } from './adjustChildComponents.mjs';

export default class Component {
  target;
  props;
  state;
  childComponents;
  constructor(target, propsGenerator) {
    this.target = target;
    this.propsGenerator = propsGenerator;
    this.childComponents = {};
    this.updateProps();
    this.setup();
    this.setEvents();
    this.render();
    this.afterMount();
  }

  updateProps() {
    this.props = this.propsGenerator ? this.propsGenerator() : null;
  }

  setup() {}
  template() {return "";}
  render() {
    // 기존 Node를 복제한 후에 새로운 템플릿을 채워넣는다.
    const { target } = this;
    const newNode = target.cloneNode(true);
    newNode.innerHTML = this.template();

    // DIFF알고리즘을 적용한다.
    let childComponentData = {};
    const oldChildNodes = [...target.childNodes];
    const newChildNodes = [...newNode.childNodes];
    const max = Math.max(oldChildNodes.length, newChildNodes.length);
    for (let i = 0; i < max; i++) {
      childComponentData = { ...childComponentData, ...updateElement(target, newChildNodes[i], oldChildNodes[i]) };
    }

    // updateElement의 전이는 component에서 막힌다. 자식 component들을 업데이트해야함.
    adjustChildComponents(this, childComponentData);
    // if (Object.keys(this.childComponents).length === 0) return;
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
  setEvents() {}
  addEventListener(eventType, selector, callback) {
    this.target.addEventListener(eventType, (e) => {
      if (e.target.closest(selector)) callback(e);
    });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.beforeUpdate();
    this.render();
    this.afterUpdate();
  }
}
