import Component from "../core/Component.mjs";

export default class Items extends Component {
  template() {
    const { items } = this.props;
    return `
    <ul class="itemList">
      ${items.map(({ index, content, isFiltered }) => `
      <li class="item" data-index="${index}">
        ${content}
        <button class="filterBtn">${isFiltered ? "필터 해제" : "필터링"}</button>
        <button class="deleteBtn">삭제</button>
      </li>
      `).join("")}
    </ul>
    `;
  }

  setEvents() {
    const { toggleItemFilter, deleteItem } = this.props;
    this.addEventListener("click", "button", (e) => {
      if (e.target.classList.contains("filterBtn")) toggleItemFilter(Number(e.target.closest("[data-index]").dataset.index));
      else if (e.target.classList.contains("deleteBtn")) deleteItem(Number(e.target.closest("[data-index]").dataset.index));
    })
  }
}
