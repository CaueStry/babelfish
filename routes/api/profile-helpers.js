const escape = require('sql-escape');
const db = require('../../db');

function sanitizeProfile(rawProfile) {
  return new Promise(((resolve, reject) => {
    const profile = { ...rawProfile };

    profile.firstName = escape(profile.firstName.toLowerCase());
    profile.lastName = escape(profile.lastName.toLowerCase());
    profile.email = escape(profile.email.toLowerCase());
    profile.biography = escape(profile.biography);
    profile.pictureUrl = escape(profile.pictureUrl);

    const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    const pictureUrlRegex = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\..+(\/[a-zA-Z0-9#]+\/?)*$/i;

    const err = new Error('Invalid Fields');
    err.fields = [];

    if (!/^[a-z-]{2,30}$/i.test(profile.firstName)) {
      err.fields.push('firstname');
    }
    if (!/^[a-z-]{2,30}$/i.test(profile.lastName)) {
      err.fields.push('lastname');
    }
    if (!emailRegex.test(profile.email)) {
      err.fields.push('email');
    }
    if (!/^.{0,500}$/.test(profile.biography)) {
      err.fields.push('biography');
    }

    if (/^\s*$/.test(profile.biography)) {
      profile.biography = '';
    }
    if (!pictureUrlRegex.test(profile.pictureUrl)) {
      profile.pictureUrl = '';
    }

    if (err.fields.length > 0) {
      err.code = 401;
      reject(err);
    }
    resolve(profile);
  }));
}

module.exports.getProfile = (req, res) => {
  db.query(`CALL Get_Spoken_Languages('${req.params.username}')`)
    .then((langs) => {
      const languages = langs[0].map(i => i.language_name);
      db.query(`CALL Get_User_Profile('${req.params.username}')`)
        .then((prof) => {
          const profile = prof[0][0];
          profile.spokenLanguages = languages;
          res.send(profile);
        })
        .catch(() => {
          res.status(500).end();
        });
    });
};

module.exports.editProfile = (req, res) => {
  sanitizeProfile(req.body)
    .then((fields) => {
      db.query(`CALL Update_Profile('${req.session.username}', '${fields.firstName}', '${fields.lastName}', '${fields.email}', '${fields.biography}', '${fields.pictureUrl}')`)
        .then(() => {
          res.status(200).send('Updated');
        });
      db.query(`CALL Delete_Spoken_Languages('${req.session.username}')`)
        .then(() => {
          fields.spokenLanguages.forEach((lang) => {
            db.query(`CALL Add_Language('${req.session.username}', '${lang}')`);
          });
        });
    })
    .catch(() => {
      res.status(500).end();
    });
};

module.exports.getMyProfile = (req, res) => {
  db.query(`CALL Get_Spoken_Languages('${req.session.username}')`)
    .then((langs) => {
      const languages = langs[0].map(i => i.language_name);
      db.query(`CALL Get_User_Profile('${req.session.username}')`)
        .then((prof) => {
          const profile = prof[0][0];
          profile.spokenLanguages = languages;
          res.send(profile);
        });
    })
    .catch(() => {
      res.status(500).end();
    });
};

module.exports.getBasicProfile = (req, res) => {
  db.query(`CALL Get_Basic_Info("${req.params.userid}")`)
    .then((response) => {
      res.send(response[0][0]);
    })
    .catch(() => {
      res.status(500).end();
    });
};
