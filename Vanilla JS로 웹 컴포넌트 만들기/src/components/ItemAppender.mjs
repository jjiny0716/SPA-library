import Component from '../core/Component.mjs';

export default class ItemAppender extends Component {
  template() {
    return `
    <input type="text" class="itemAppendInput">
    `
  }

  afterMount() {
    this.target.querySelector(".itemAppendInput").focus();
  }

  setEvents() {
    const { addItem } = this.props;
    this.addEventListener("keydown", ".itemAppendInput", (e) => {
      if (e.key === "Enter") addItem(e.target.value); 
    });
  }
}