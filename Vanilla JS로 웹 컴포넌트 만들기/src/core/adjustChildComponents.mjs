export function adjustChildComponents(parent, childComponentData) {
  const { childComponents } = parent; 
  for (let key of Object.keys(childComponents)) {
    if (childComponentData[key]) {
      delete childComponentData[key];
    }
    else {
      childComponents[key].destroyComponent();
      delete childComponents[key]
    }
  }
  for (let [key, componentName] of Object.entries(childComponentData)) {
    childComponents[key] = parent.generateChildComponent(componentName, key);
  }
}