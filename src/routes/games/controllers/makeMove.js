/* 
  This controller is responsible for making a move in the game.
  It uses the actualMakeMove function to make the move using
  socket_wrapper to be able to use the io object without circular
  dependency.
*/

const { socket_wrapper } = require("../../../config/sockets");
const actualMakeMove = require("../../../utils/actualMakeMove");

const makeMove = async (req, res) => {
  socket_wrapper(actualMakeMove, req, res);
};

module.exports = makeMove;
