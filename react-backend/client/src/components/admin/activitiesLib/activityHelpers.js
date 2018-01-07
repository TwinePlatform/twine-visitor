export const addActivity = (list, item) => [...list, item];

export const generateId = () => Math.floor(Math.random() * 100000);

export const removeActivity = (list, id) => {
  const removeIndex = list.findIndex(item => item.id === id);
  return [...list.slice(0, removeIndex), ...list.slice(removeIndex + 1)];
};

