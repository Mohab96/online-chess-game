const removeElementFromString = (string, idx) => {
  let newStr = "";
  for (let i = 0; i < string.length; i++) {
    if (i != idx) {
      newStr += string[i];
    }
  }

  return newStr;
};

const removeElementFromList = (list, idx) => {
  let newList = [];
  for (let i = 0; i < list.length; i++) {
    if (i != idx) {
      newList.push(list[i]);
    }
  }

  return newList;
};

module.exports = { removeElementFromString, removeElementFromList };
