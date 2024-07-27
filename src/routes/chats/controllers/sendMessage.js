/* 
  This controller is responsible for sending a message to a chat.
  It uses the actualSendMessage function to send the message using
  socket_wrapper to be able to use the io object without circular
  dependency.
*/

const { socket_wrapper } = require("../../../config/sockets");
const actualSendMessage = require("../../../utils/actualSendMessage");

const sendMessage = async (req, res) => {
  socket_wrapper(actualSendMessage, req, res);
};

module.exports = sendMessage;
