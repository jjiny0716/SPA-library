import Component from "../core/Component.mjs";

export default class Items extends Component {
  markup() {
    const { items } = this.props;
    return `
    <ul class="itemList">
      ${items.map(({ index, content, isFiltered }) => `
      <li class="item" data-index="${index}">
        ${content}
        <button class="deleteBtn">삭제</button>
      </li>
      `).join("")}
    </ul>
    `;
  }

  setEvents() {
    const { deleteItem } = this.props;
    this.addEventListener("click", ".deleteBtn", (e) => {
      deleteItem(Number(e.target.closest("[data-index]").dataset.index));
    })
  }
}
