import Component from '../core/Component.mjs';
import { abStore } from '../ABstore.mjs';

export default class APlusB extends Component {
  template() {
  const { a, b } = abStore.state;
  return `
  <p>a + b = ${abStore.state.a + abStore.state.b}</p>
  `
  }
}