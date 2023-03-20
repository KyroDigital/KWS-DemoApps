export const isExist = (e) => e !== undefined && e !== null && e !== '';
export const ifExist = (e) => (isExist(e) ? e : null); // if exists then return value
export const isObject = (e) =>
  isExist(e) && typeof e === 'object' && Object.keys(e).length >= 1;
export const isArray = (e) => Array.isArray(e) && e.length >= 1;
export const isBoolean = (e) => isExist(e) && e == 1;
export const isString = (value) => typeof value === 'string';
export const isNumber = (value) => typeof value === 'number';

export const isApiSuccess = (res) =>
  isExist(res) && isExist(res.status) && res.status === 'success';

export const convertPropertiesAttributes = (properties) => {
  let attributes = isExist(properties) ? JSON.parse(properties) : [];
  attributes = attributes.map((item) => {
    const data = Object.keys(item);
    return {
      trait_type: data[0],
      value: item[data[0]],
    };
  });

  return attributes;
};

export const toCurrencyFormat = (value) => {
  if (isExist(value)) {
    const newAmount = isString(value) ? parseFloat(value) : value;
    const result = isNumber(newAmount) ? newAmount.toFixed(2) : newAmount;
    const newResult = result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$${newResult}`;
  }
  return '$0.00';
};

export const mergeRecords = (newList, oldList) => {
  let existing = [...oldList];
  if (isArray(newList)) {
    const mergeData = existing.concat(newList);
    const idPositions = mergeData.map((el) => el.id);
    existing = mergeData.filter(
      (item, pos) => idPositions.indexOf(item.id) === pos,
    );
  }
  return existing;
};

export const createOptions = (item) => {
  const newOptions = item.map(({ name, id }) => {
    return {
      label: name,
      value: id,
    };
  });
  return [...newOptions];
};

export const getInitials = (text) => {
  if (isExist(text)) {
    const arr = text.split(' ');
    const letter1 = isExist(arr[0]) ? arr[0].substring(0, 1).toUpperCase() : '';
    const letter2 = isExist(arr[1]) ? arr[1].substring(0, 1).toUpperCase() : '';
    return `${letter1}${letter2}`;
  }
  return '';
};

export const convertHtmlToString = (value) => {
  // Create a new div element
  let tempDivElement = document.createElement('div');

  // Set the HTML content with the given value
  tempDivElement.innerHTML = value;

  // Retrieve the text property of the element
  return tempDivElement.textContent || tempDivElement.innerText;
};
