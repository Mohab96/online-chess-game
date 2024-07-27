/* 
  These functions are used in cases when I retrieve some 
  delimeter-separated data from redis and I want to remove
  the first element if it is '|' and then split the string.
*/

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
