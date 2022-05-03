import { AB_ACTION_TYPES } from "./ab.types.js";

const AB_INITIAL_STATE = {
  a: 10,
  b: 10,
};

export function abReducer(state = AB_INITIAL_STATE, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case AB_ACTION_TYPES.SET_A:
      return {
        ...state,
        a: payload,
      };
    case AB_ACTION_TYPES.SET_B:
      return {
        ...state,
        b: payload,
      };
    default:
      return state;
  }
};
