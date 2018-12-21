const db = require('../../db');

module.exports.getProfilesByLanguage = (req, res) => {
  db.query(`CALL Get_Total_Profiles_By_Language("${req.params.language}")`)
    .then((total) => {
      if (total[0][0].count > 0) {
        db.query(`CALL Get_Profiles_By_Language("${req.params.language}", ${req.params.page * 10})`)
          .then((result) => {
            const data = {
              profiles: result[0],
              total: total[0][0].count,
            };
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      } else {
        res.send({
          profiles: [],
          total: 0,
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
};
