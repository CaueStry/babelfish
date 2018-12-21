const moment = require('moment');
const db = require('../../db');

module.exports.getMyChats = (req, res) => {
  db.query(`CALL Get_My_Chats("${req.session.username}")`)
    .then((response) => {
      res.send(response[0]);
    })
    .catch(() => {
      res.status(500).end();
    });
};

module.exports.getChat = (req, res) => {
  db.query(`CALL Get_Chat_Messages("${req.session.username}",
   "${req.params.chatid}")`)
    .then((response) => {
      res.send(response[0]);
    })
    .catch(() => {
      res.status(500).end();
    });
};

module.exports.newChat = (req, res) => {
  db.query(`CALL Create_Chat("${req.session.username}",
   "${req.body.user}")`)
    .then((response) => {
      res.send(response[0]);
    })
    .catch(() => {
      res.status(500).end();
    });
};

module.exports.sendMessage = (req, res) => {
  db.query(`CALL Send_Message("${req.params.chatid}", 
  "${req.session.username}", 
  "${req.body.message}", "${moment().format('HH:mm:ss')}")`)
    .then(() => {
      res.end();
    })
    .catch(() => {
      res.status(500).end();
    });
};
