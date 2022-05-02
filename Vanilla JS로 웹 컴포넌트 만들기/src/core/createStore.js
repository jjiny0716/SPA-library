import { observable } from './observer.js';

export const createStore = (reducer) => {
  const state = observable(reducer());
  
  const frozenState = {};
  Object.keys(state).forEach(key => {
    Object.defineProperty(frozenState, key, {
      get: () => state[key], 
    })
  });
  
  function dispatch(action) {
    const a = state.item;
    const newState = reducer(state, action);

    for (const [key, value] of Object.entries(newState)) {
      if (!state[key]) continue;
      state[key] = value;
    }
  }

  function getState() {
    return frozenState;
  }
  
  return { getState, dispatch };
}