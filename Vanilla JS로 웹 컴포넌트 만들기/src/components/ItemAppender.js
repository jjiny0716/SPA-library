import Component from '../core/Component.js';

import { store } from '../store/store.js';
import { addItem } from '../store/item/item.action.js';

export default class ItemAppender extends Component {
  template() {
    return `
    <input type="text" class="itemAppendInput">
    `
  }

  afterMount() {
    this.target.querySelector(".itemAppendInput").focus();
  }

  setEvents() {
    this.addEventListener("keydown", ".itemAppendInput", (e) => {
      if (e.key === "Enter") {
        store.dispatch(addItem(store.getState().item.items, e.target.value));
        e.target.value = "";
      }
    });
  }
}