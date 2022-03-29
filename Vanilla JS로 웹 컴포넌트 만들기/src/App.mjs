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

  template() {
    return `
    <div class="itemAppender" component></div>
    <div class="items" component></div>
    <div class="itemFilter" component></div>
    `;
  }

  afterMount() {
    this.childComponents = {
      itemAppender: new ItemAppender(this.target.querySelector(".itemAppender"), () => { return {
        addItem: this.addItem.bind(this),
      }}),
      items: new Items(this.target.querySelector(".items"), () => { return {
        items: this.getFilteredItems(),
        deleteItem: this.deleteItem.bind(this),
        toggleItemFilter: this.toggleItemFilter.bind(this),
      }}),
      itemFilter: new ItemFilter(this.target.querySelector(".itemFilter"), () => { return {
        filterItems: this.filterItems.bind(this),
      }}),
    }
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
