const matchPlayers = require("../cronjobs/matchPlayers");
const removeIdleGames = require("../cronjobs/removeIdleGames");

const start_cronjobs = async (io) => {
  setInterval(() => matchPlayers(io), 30000);
  setInterval(() => removeIdleGames(), 86400000);
};

module.exports = start_cronjobs;
