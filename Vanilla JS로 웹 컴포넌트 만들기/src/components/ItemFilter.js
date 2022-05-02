import Component from "../core/Component.js";

import { store } from '../store/store.js';
import { setFilter } from '../store/item/item.action.js';

export default class ItemFilter extends Component {
  template() {
    return `
    <button class="viewAllBtn">전체 보기</button>
    <button class="filterBtn">필터링</button>
    `;
  }

  setEvents() {
    this.addEventListener("click", "button", (e) => {
      if (e.target.classList.contains("filterBtn")) store.dispatch(setFilter(true));
      if (e.target.classList.contains("viewAllBtn")) store.dispatch(setFilter(false));
    });
  }
}
