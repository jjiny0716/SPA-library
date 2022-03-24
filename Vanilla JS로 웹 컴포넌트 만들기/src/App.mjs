import Component from "./core/Component.mjs";
import ItemAppender from "./components/ItemAppender.mjs";
import Items from './components/Items.mjs';

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
    const { items } = this.state;
    console.log(items);
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
      items: this.state.items,
      deleteItem: this.deleteItem.bind(this),
    })
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
}
