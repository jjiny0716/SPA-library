import Component from "./core/Component.mjs";
import ItemAppender from "./components/ItemAppender.mjs";
import Items from './components/Items.mjs';
import ItemFilter from './components/ItemFilter.mjs';

export default class App extends Component {
  setup() {
    this.state = {
      filter: false,
      items: [
        {
          index: 0,
          content: "some item!",
          isFiltered: false,
        },
      ],
    };
  }

  markup() {
    return `
    <div class="itemAppender"></div>
    <div class="items"></div>
    <div class="itemFilter"></div>
    `;
  }

  afterMount() {
    new ItemAppender(this.target.querySelector(".itemAppender"), {
      addItem: this.addItem.bind(this),
    });
    new Items(this.target.querySelector(".items"), {
      items: this.getFilteredItems(),
      deleteItem: this.deleteItem.bind(this),
      toggleItemFilter: this.toggleItemFilter.bind(this),
    });
    new ItemFilter(this.target.querySelector(".itemFilter"), {
      filterItems: this.filterItems.bind(this),
    });
  }

  getFilteredItems() {
    const { filter, items } = this.state;
    if (filter) return items.filter(item => item.isFiltered === false);
    return items;
  }

  addItem(content) {
    let { items } = this.state;
    const index = items.length;
    const isFiltered = false;
    items = [...items, { index, content, isFiltered }];
    this.setState({ items });
  }

  deleteItem(index) {
    const items = [...this.state.items];
    items.splice(items.findIndex(item => item.index === index), 1);
    this.setState({ items });
  }

  filterItems(filter) {
    this.setState({ filter });
  }

  toggleItemFilter(index) {
    const items = [...this.state.items];
    const item = items.find(item => item.index === index);
    item.isFiltered = !item.isFiltered;
    this.setState({ items });
  }
}
