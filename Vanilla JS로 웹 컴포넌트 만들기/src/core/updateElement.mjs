import Component from './Component.mjs';

function updateAttributes(oldNode, newNode) {
  for (const {name, value} of [ ...newNode.attributes ]) {
    if (value === oldNode.getAttribute(name)) continue;
    oldNode.setAttribute(name, value);
  }
  for (const {name} of [ ...oldNode.attributes ]) {
    if (newNode.getAttribute(name) !== undefined) continue;
    oldNode.removeAttribute(name);
  }
}

function convertNodeToComponentData(node) {
  if (!node || node instanceof Text) return {}

  if (node.hasAttribute("data-key")) {
    return { [node.getAttribute("data-key")]: node.getAttribute("data-component-name") };
  }

  let childComponentData = {};
  for (let child of node.childNodes) {
    childComponentData = { ...childComponentData, ...convertNodeToComponentData(child)};
  }

  return childComponentData;
}

export function updateElement (parent, newNode, oldNode) {
  if (!newNode && oldNode) return oldNode.remove();
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
    const index = [ ...parent.childNodes ].indexOf(oldNode);
    oldNode.remove();
    parent.appendChild(newNode, index);
    return;
  }
  updateAttributes(oldNode, newNode);
  if (oldNode.getAttribute("data-component-name") !== null) return convertNodeToComponentData(oldNode);
  

  let childComponentData = {};
  const newChildren = [ ...newNode.childNodes ];
  const oldChildren = [ ...oldNode.childNodes ];
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    childComponentData = { ...childComponentData, ...updateElement(oldNode, newChildren[i], oldChildren[i]) };
  }

  return childComponentData;
}