import Store from './core/Store.mjs';

export const abStore = new Store({
  state: {
    a: 5,
    b: 5,
  },
  mutations: {
    setA(state, payload) {
      state.a = payload;
    },
    setB(state, payload) {
      state.b = payload;
    }
  }
});