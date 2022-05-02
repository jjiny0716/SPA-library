import Component from "../core/Component.js";
import { store } from "../store/store.js";
import { setA } from "../store/ab/ab.action.js";

export default class InputA extends Component {
  template() {
    const { a } = store.getState().ab;
    return `
    <input class="input-a" type="text" value="${a}" />
    `;
  }

  setEvents() {
    this.addEventListener("input", ".input-a", (e) => {
      store.dispatch(setA(Number(e.target.value)));
    });
  }
}
