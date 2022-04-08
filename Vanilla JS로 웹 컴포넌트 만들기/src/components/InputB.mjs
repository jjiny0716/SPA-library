import Component from '../core/Component.mjs';
import { abStore } from '../ABstore.mjs';

export default class InputB extends Component {
  template() {
  return `
  <input class="input-b" type="text" value="${abStore.state.b}" />
  `
  }

  setEvents() {
    this.addEventListener("input", ".input-b", (e) => {
      abStore.commit("setB", Number(e.target.value));
    });
  }
}