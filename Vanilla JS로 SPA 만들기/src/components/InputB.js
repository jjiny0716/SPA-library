import Component from "../core/Component.js";
import { store } from '../store/store.js';
import { setB } from '../store/ab/ab.action.js';

export default class InputB extends Component {
  template() {
    const { b } = store.getState().ab;
    return `
    <input class="input-b" type="text" value="${b}" />
    `;
  }

  setEvents() {
    this.addEventListener("input", ".input-b", (e) => {
      store.dispatch(setB(Number(e.target.value)));
    });
  }
}
