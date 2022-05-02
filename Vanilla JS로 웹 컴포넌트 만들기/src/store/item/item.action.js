import { ITEM_ACTION_TYPES } from "./item.types.js";
import { createAction } from "../../core/utils/createAction.js";
import { generateUniqueID } from "../../utils/generateUniqueID.js";

export function setFilter(boolean) {
  return createAction(ITEM_ACTION_TYPES.SET_FILTER, boolean);
}

export function addItem(items, itemContentToAdd) {
  return createAction(ITEM_ACTION_TYPES.SET_ITEMS, addItemHelper(items, itemContentToAdd));
}

export function deleteItem(items, itemIdToDelete) {
  return createAction(ITEM_ACTION_TYPES.SET_ITEMS, deleteItemHelper(items, itemIdToDelete));
}

export function toggleItemFilter(items, itemIdToToggle) {
  return createAction(ITEM_ACTION_TYPES.SET_ITEMS, toggleItemFilterHelper(items, itemIdToToggle));
}

function addItemHelper(items, itemContentToAdd) {
  return [
    ...items,
    {
      id: generateUniqueID(),
      content: itemContentToAdd,
      isFiltered: false,
    },
  ];
}

function deleteItemHelper(items, itemIdToDelete) {
  items.splice(
    items.findIndex((item) => item.id === itemIdToDelete),
    1
  );

  return [...items];
}

function toggleItemFilterHelper(items, itemIdToToggle) {
  const item = items.find((item) => item.id === itemIdToToggle);
  item.isFiltered = !item.isFiltered;

  return [...items];
}
