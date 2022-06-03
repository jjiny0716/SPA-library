import Component from './Component.js';

export type ComponentState = Record<string | number | symbol, any>;
export type ComponentMap = Record<string, Component>;
export type ComponentKeyNameMap = Record<string, string>;

export type RegisteredEventListener = {
  type: string;
  listener: (e: Event) => void;
};

export type Action = {
  type: any;
  payload: any;
};

export type Reducer<S = {}, A extends Action = Action> = (
  state: S | undefined, 
  action: A | undefined,
) => S;

export type ReducersMapObject<S = {}, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>
}

export type PersistConfig = {
  key: string;
  whitelist: string[];
};
