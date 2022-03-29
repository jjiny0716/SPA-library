import Component from "../core/Component.mjs";

export default class ItemFilter extends Component {
  template() {
    return `
    <button class="viewAllBtn">전체 보기</button>
    <button class="filterBtn">필터링</button>
    `;
  }

  setEvents() {
    const { filterItems } = this.props;
    this.addEventListener("click", "button", (e) => {
      if (e.target.classList.contains("filterBtn")) filterItems(true);
      if (e.target.classList.contains("viewAllBtn")) filterItems(false);
    });
  }
}
