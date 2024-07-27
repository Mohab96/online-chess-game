const shuffle = (list) => {
  for (let i = 0; i < list.length - 1; i++) {
    const j = Math.floor(Math.random() * (i + 1));

    [list[i], list[j]] = [list[j], list[i]];
  }

  return list;
};

module.exports = shuffle;
