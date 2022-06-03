import { Action, Reducer } from "./coreTypes.js";

import { ReducersMapObject } from './coreTypes.js';

export function combineReducers<S extends Record<string, any>, A extends Action>(reducersMap: ReducersMapObject<S, A>): Reducer<S, A> {
  return (state?: S, action?: A) => {
    const newState: S = {} as S;
    (Object.entries(reducersMap) as Array<[keyof S, Reducer<S[keyof S], A>]>).forEach(([name, reducer]) => {
      newState[name] = reducer(state && state[name], action);
      return newState;
    })

    return { ...state, ...newState };
  };
}
