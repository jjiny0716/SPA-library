import { createStore } from '../core/createStore.js';

import { rootReducer } from './rootReducer.js';

export const store = createStore(rootReducer);
