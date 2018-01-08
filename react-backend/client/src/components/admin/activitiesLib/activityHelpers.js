export const addActivity = (list, item) => [...list, item];

export const generateId = () => Math.floor(Math.random() * 100000);

export const removeActivity = (list, id) => {
  const removeIndex = list.findIndex(item => item.id === id);
  return [...list.slice(0, removeIndex), ...list.slice(removeIndex + 1)];
};

export const findById = (id, list) => list.find(item => item.id === id);

export const updateActivity = (list, updated) => {
  const updatedIndex = list.findIndex(item => item.id === updated.id);
  return [...list.slice(0, updatedIndex), updated, ...list.slice(updatedIndex + 1)];
};
