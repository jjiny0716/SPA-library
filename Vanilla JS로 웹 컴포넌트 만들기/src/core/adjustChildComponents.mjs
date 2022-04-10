import { ComponentError } from './ComponentError.mjs';

export function adjustChildComponents(parent, childComponentData) {
  const { childComponents } = parent; 
  for (let key of Object.keys(childComponents)) {
    if (childComponentData[key]) {
      childComponents[key].update();
      delete childComponentData[key];
    }
    else {
      childComponents[key].destroyComponent();
      delete childComponents[key]
    }
  }
  for (let [key, componentName] of Object.entries(childComponentData)) {
    const selector = key === componentName ? `[data-component="${componentName}"]` : `[data-key="${key}"]`;
    const target = parent.target.querySelector(selector);
    childComponents[key] = parent.generateChildComponent(target, componentName, key);
    if (!childComponents[key]) throw new ComponentError(`Cannot generate component with name '${key}' at '${parent.target.dataset.componentName ?? "App"}'`);
  }
}