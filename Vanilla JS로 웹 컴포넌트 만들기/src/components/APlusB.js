import Component from '../core/Component.js';
import { store } from '../store/store.js';

export default class APlusB extends Component {
  template() {
  const { a, b } = store.getState().ab;
  return `
  <p>a + b = ${a + b}</p>
  `
  }
}