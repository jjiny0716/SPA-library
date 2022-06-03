import Component from './Component.js';
import { ComponentError } from './ComponentError.js';
import { ComponentKeyNameMap } from './coreTypes.js';


export function adjustChildComponents(parent: Component, childComponentData: ComponentKeyNameMap) {
  const { childComponents } = parent; 
  for (let key of Object.keys(childComponents)) {
    if (childComponentData[key]) {
      const target = findComponentNode(parent.target, key, childComponentData[key])
      childComponents[key].update(target);
      delete childComponentData[key];
    }
    else {
      childComponents[key].destroyComponent();
      delete childComponents[key]
    }
  }

  for (let [key, componentName] of Object.entries(childComponentData)) {
    const target = findComponentNode(parent.target, key, componentName);
    const childComponent = parent.generateChildComponent(target, componentName, key);
    if (!childComponent) throw new ComponentError(`Cannot generate component with name '${key}' at '${parent.target.dataset.componentName ?? "App"}'`);
    childComponents[key] = childComponent;
  }
}

function findComponentNode(targetNode: HTMLElement, key: string, componentName: string): HTMLElement {
  const selector = key === componentName ? `[data-component="${componentName}"]` : `[data-key="${key}"]`;
  return targetNode.querySelector(selector)!;
}
