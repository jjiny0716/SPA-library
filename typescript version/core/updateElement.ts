import { ComponentKeyNameMap } from './coreTypes';

export function updateElement (parent: Element, newNode: Element, oldNode: Element): ComponentKeyNameMap | undefined {
  if (!newNode && oldNode) {
    oldNode.remove();
    return;
  }
  if (newNode && !oldNode) {
    parent.appendChild(newNode);
    return convertNodeToComponentData(newNode);
  }
  if (newNode instanceof Text && oldNode instanceof Text) {
    if (oldNode.nodeValue === newNode.nodeValue) return;
    oldNode.nodeValue = newNode.nodeValue
    return;
  }
  if (newNode.nodeName !== oldNode.nodeName) {
    parent.insertBefore(newNode, oldNode);
    oldNode.remove();
    return convertNodeToComponentData(newNode);
  }
  updateAttributes(oldNode, newNode);
  if (oldNode.hasAttribute("data-component")) return convertNodeToComponentData(oldNode);
  
  let childComponentData: ComponentKeyNameMap = {};
  const newChildren = [ ...newNode.childNodes ] as Element[];
  const oldChildren = [ ...oldNode.childNodes ] as Element[];
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    childComponentData = { ...childComponentData, ...updateElement(oldNode, newChildren[i], oldChildren[i]) };
  }

  return childComponentData;
}

function convertNodeToComponentData(node: Element): ComponentKeyNameMap {
  if (!node || node instanceof Text) return {}

  if (node.hasAttribute("data-component")) {
    const componentName = node.getAttribute("data-component")!;
    const key = node.getAttribute("data-key") || componentName;
    return { [key]: componentName };
  }

  let childComponentData: ComponentKeyNameMap = {};
  for (let child of node.childNodes) {
    childComponentData = { ...childComponentData, ...convertNodeToComponentData(child as Element)};
  }

  return childComponentData;
}

function updateAttributes(oldNode: Element, newNode: Element): void {
  for (const {name, value} of [ ...newNode.attributes ]) {
    if (value === oldNode.getAttribute(name)) continue;
    oldNode.setAttribute(name, value);
  }
  for (const {name} of [ ...oldNode.attributes ]) {
    if (newNode.hasAttribute(name)) continue;
    oldNode.removeAttribute(name);
  }
}

