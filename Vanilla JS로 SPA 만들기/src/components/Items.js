import Component from "../core/Component.js";

import { store } from '../store/store.js';
import { deleteItem, toggleItemFilter } from '../store/item/item.action.js';
import { selectFilteredItems } from '../store/item/item.selector.js';

export default class Items extends Component {
  template() {
    const { filter, items } = store.getState().item;
    const filteredItems = filter ? selectFilteredItems() : items;

    return `
    <ul class="itemList">
      ${filteredItems.map(({ id, content, isFiltered }) => `
      <li class="item" data-id="${id}">
        ${content}
        <button class="filterBtn">${isFiltered ? "필터 해제" : "필터링"}</button>
        <button class="deleteBtn">삭제</button>
      </li>
      `).join("")}
    </ul>
    `;
  }

  setEvents() {
    this.addEventListener("click", "button", (e) => {
      const { items } = store.getState().item;
      const id = Number(e.target.closest(".item").dataset.id);

      if (e.target.classList.contains("filterBtn")) store.dispatch(toggleItemFilter(items, id));
      else if (e.target.classList.contains("deleteBtn")) store.dispatch(deleteItem(items, id));
    })
  }
}
