import { ITEM_ACTION_TYPES } from './item.types.js';

const ITEM_INITIAL_STATE = {
  filter: false,
  items: [
    {
      id: 0,
      content: "some item!",
      isFiltered: false,
    },
  ],
}

export function itemReducer(state = ITEM_INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch(type) {
    case ITEM_ACTION_TYPES.SET_FILTER:
      return {
        ...state,
        filter: payload,
      }
    case ITEM_ACTION_TYPES.SET_ITEMS:

      return {
        ...state,
        items: payload,
      }
    default:
      return state;
  }
}