import { createStore } from '../core/createStore.js';

import { rootReducer } from './rootReducer.js';

const persistConfig = {
  key: "root",
  whitelist: ["item", "ab"],
}

export const store = createStore(rootReducer, persistConfig);
