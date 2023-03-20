export const getLocalStorage = (key) => {
  if (key) {
    const result = localStorage.getItem(key);
    if (result) {
      return JSON.parse(result);
    }
    return null;
  }
  return null;
};

export const setLocalStorage = (key, data = '') => {
  if (key) {
    const result = localStorage.setItem(key, JSON.stringify(data));
    return !!result;
  }
  return null;
};

export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // remove error
    console.log('asyncstorage error', e);
  }
};
