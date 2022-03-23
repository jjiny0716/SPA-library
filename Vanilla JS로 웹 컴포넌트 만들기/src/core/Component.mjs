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
  }

  setup() {}
  markup() { return ''; }
  render() {
    this.target.innerHTML = this.markup();
    this.afterMount();
  }

  afterMount() {}
  setEvents() {}
  addEventListener(eventType, selector, callback) {
    // 고민좀 해보자.
    this.target.addEventListener(eventType, e => {
      if (e.target.closest(selector)) callback(e);
    })
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}