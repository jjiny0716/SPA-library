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
    parent.insertBefore(newNode, oldNode);
    oldNode.remove();
    return convertNodeToComponentData(newNode);
  }
  updateAttributes(oldNode, newNode);
  if (oldNode.hasAttribute("data-component")) return convertNodeToComponentData(oldNode);
  

  let childComponentData = {};
  const newChildren = [ ...newNode.childNodes ];
  const oldChildren = [ ...oldNode.childNodes ];
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    childComponentData = { ...childComponentData, ...updateElement(oldNode, newChildren[i], oldChildren[i]) };
  }

  return childComponentData;
}

function convertNodeToComponentData(node) {
  if (!node || node instanceof Text) return {}

  if (node.hasAttribute("data-component")) {
    const componentName = node.getAttribute("data-component")
    const key = node.getAttribute("data-key") || componentName;
    return { [key]: node.getAttribute("data-component") };
  }

  let childComponentData = {};
  for (let child of node.childNodes) {
    childComponentData = { ...childComponentData, ...convertNodeToComponentData(child)};
  }

  return childComponentData;
}

function updateAttributes(oldNode, newNode) {
  for (const {name, value} of [ ...newNode.attributes ]) {
    if (value === oldNode.getAttribute(name)) continue;
    oldNode.setAttribute(name, value);
  }
  for (const {name} of [ ...oldNode.attributes ]) {
    if (newNode.hasAttribute(name)) continue;
    oldNode.removeAttribute(name);
  }
}
