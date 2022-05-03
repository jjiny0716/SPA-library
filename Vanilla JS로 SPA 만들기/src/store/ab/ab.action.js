import { AB_ACTION_TYPES } from './ab.types.js';
import { createAction } from '../../core/utils/createAction.js';

export function setA(value) {
  return createAction(AB_ACTION_TYPES.SET_A, value);
}

export function setB(value) {
  return createAction(AB_ACTION_TYPES.SET_B, value);
}