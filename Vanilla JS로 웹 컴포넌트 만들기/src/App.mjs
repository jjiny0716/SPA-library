import Component from "./core/Component.mjs";

export default class App extends Component {
  setup() {
    this.state = { items: ["item1"] };
  }

  markup() {
    const { items } = this.state;
    return `
    <ul>
      ${items.map((item, idx) => `
      <li>
        ${item}
        <button class="deleteBtn" data-index=${idx}>삭제</button>
      </li>
      `).join('')}
    </ul>
    <button class="addBtn">추가</button>
    `;
  }

  setEvents() {
    this.addEventListener("click", ".addBtn", () => {
      this.setState({ items: [...this.state.items, `item${this.state.items.length + 1}`] });
    });
    this.addEventListener("click", ".deleteBtn", (e) => {
      const { items } = this.state;
      items.splice(e.target.dataset.index, 1);
      this.setState({ items });
    })
  }
}
