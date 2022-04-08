import Component from '../core/Component.mjs';
import { abStore } from '../ABstore.mjs';

export default class InputA extends Component {
  template() {

  return `
  <input class="input-a" type="text" value="${abStore.state.a}" />
  `
  }

  setEvents() {
    this.addEventListener("input", ".input-a", (e) => {
      abStore.commit("setA", Number(e.target.value));
    });
  }
}