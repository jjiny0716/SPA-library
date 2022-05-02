import Component from "./core/Component.js";
import ItemAppender from "./components/ItemAppender.js";
import Items from "./components/Items.js";
import ItemFilter from "./components/ItemFilter.js";
import InputA from "./components/InputA.js";
import InputB from "./components/InputB.js";
import APlusB from "./components/APlusB.js";

export default class App extends Component {
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
      return new ItemAppender(target);
    }
    if (name === "Items") {
      return new Items(target);
    }
    if (name === "ItemFilter") {
      return new ItemFilter(target);
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
}
