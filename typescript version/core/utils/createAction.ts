import { Action } from '../coreTypes.js'

export function createAction(type: string, payload: any): Action {
  return {
    type,
    payload,
  }
}