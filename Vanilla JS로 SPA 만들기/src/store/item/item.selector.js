import { store } from '../store.js';

export function selectFilteredItems() {
  return store.getState().item.items.filter((item) => !item.isFiltered);
}