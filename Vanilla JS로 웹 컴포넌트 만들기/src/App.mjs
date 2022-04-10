import Component from "./core/Component.mjs";
import ItemAppender from "./components/ItemAppender.mjs";
import Items from "./components/Items.mjs";
import ItemFilter from "./components/ItemFilter.mjs";
import InputA from "./components/InputA.mjs";
import InputB from "./components/InputB.mjs";
import APlusB from "./components/APlusB.mjs";

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
    <div class="itemAppender" data-component="ItemAppender"></div>
    <div class="items" data-component="Items"></div>
    <div class="itemFilter" data-component="ItemFilter"></div>
    <div data-component="InputA"></div>
    <div data-component="InputB"></div>
    <div data-component="APlusB"></div>
    `;
  }

  generateChildComponent(target, name) {
    if (name === "ItemAppender") {
      return new ItemAppender(target, () => {
        return {
          addItem: this.addItem.bind(this),
        };
      });
    }
    if (name === "Items") {
      return new Items(target, () => {
        return {
          items: this.getFilteredItems(),
          deleteItem: this.deleteItem.bind(this),
          toggleItemFilter: this.toggleItemFilter.bind(this),
        };
      });
    }
    if (name === "ItemFilter") {
      return new ItemFilter(target, () => {
        return {
          filterItems: this.filterItems.bind(this),
        };
      });
    }
    if (name === "InputA") {
      return new InputA(target);
    }
    if (name === "InputB") {
      return new InputB(target);
    }
    if (name === "APlusB") {
      return new APlusB(target);
    }
  }

  getFilteredItems() {
    const { filter, items } = this.state;
    if (filter) return items.filter((item) => item.isFiltered === false);
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
    items.splice(
      items.findIndex((item) => item.index === index),
      1
    );
    this.setState({ items });
  }

  filterItems(filter) {
    this.setState({ filter });
  }

  toggleItemFilter(index) {
    const { items } = this.state;
    const item = [...items].find((item) => item.index === index);
    item.isFiltered = !item.isFiltered;
    this.setState({ items });
  }
}
