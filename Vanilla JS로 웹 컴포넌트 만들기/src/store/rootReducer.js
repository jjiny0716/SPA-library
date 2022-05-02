import { combineReducers } from "../core/combineReducers.js";

import { abReducer } from "./ab/ab.reducer.js";
import { itemReducer } from "./item/item.reducer.js";

export const rootReducer = combineReducers({
  ab: abReducer,
  item: itemReducer,
});
