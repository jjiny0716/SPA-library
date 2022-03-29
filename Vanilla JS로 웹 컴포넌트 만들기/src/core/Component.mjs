import { updateElement } from './updateElement.mjs';

export default class Component {
  target;
  props;
  state;
  constructor(target, props) {
    this.target = target;
    this.props = props;
    this.setup();
    this.setEvents();
    this.render();
    // this.afterMount(); 
  }

  setup() {}
  template() { return ''; }
  render() {
    const { target } = this;
    
    // 기존 Node를 복제한 후에 새로운 템플릿을 채워넣는다.
    const newNode = target.cloneNode(true);
    newNode.innerHTML = this.template();

    // DIFF알고리즘을 적용한다.
    const oldChildNodes = [ ...target.childNodes ];
    const newChildNodes = [ ...newNode.childNodes ];
    const max = Math.max(oldChildNodes.length, newChildNodes.length);
    for (let i = 0; i < max; i++) {
      updateElement(target, newChildNodes[i], oldChildNodes[i]);
    }
    this.afterMount();
  }

  afterMount() {}
  beforeUpdate() {}
  afterUpdate() {}
  beforeUnMount() {}
  setEvents() {}
  addEventListener(eventType, selector, callback) {
    this.target.addEventListener(eventType, e => {
      if (e.target.closest(selector)) callback(e);
    })
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}