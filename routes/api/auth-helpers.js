const crypto = require('crypto');
const db = require('../../db');

function generateSalt() {
  return crypto.randomBytes(64).toString('hex');
}

function hashPassword(password, salt) {
  return crypto.createHmac('sha512', salt)
    .update(password)
    .digest('hex');
}

function sanitizeUser(user) {
  return new Promise(((resolve, reject) => {
    const sanitizedUser = { ...user, salt: generateSalt() };
    sanitizedUser.username = sanitizedUser.username.toLowerCase();
    sanitizedUser.firstName = sanitizedUser.firstName.toLowerCase();
    sanitizedUser.lastName = sanitizedUser.lastName.toLowerCase();
    sanitizedUser.email = sanitizedUser.email.toLowerCase();
    const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    const usernameRegex = /^[a-z0-9_-]{5,20}$/i;
    const firstNameRegex = /^[a-z-]{2,30}$/i;
    const lastNameRegex = /^[a-z-]{2,30}$/i;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i;
    let err;
    const fields = [];
    if (!usernameRegex.test(sanitizedUser.username)) {
      err = new Error('Invalid Username');
      fields.push('username');
    }
    if (!firstNameRegex.test(sanitizedUser.firstName)) {
      err = new Error('Invalid First Name');
      fields.push('firstname');
    }
    if (!lastNameRegex.test(sanitizedUser.lastName)) {
      err = new Error('Invalid Last Name');
      fields.push('lastname');
    }
    if (!emailRegex.test(sanitizedUser.email)) {
      err = new Error('Invalid Email');
      fields.push('email');
    }
    if (!passwordRegex.test(sanitizedUser.password)) {
      err = new Error('Invalid Password');
      fields.push('password');
    }
    if (err) {
      err.fields = fields;
      reject(err);
    }
    sanitizedUser.password = hashPassword(sanitizedUser.password, sanitizedUser.salt);
    resolve(sanitizedUser);
  }));
}

function validateUser(usr) {
  const user = Object.assign({}, usr);
  return new Promise(((resolve, reject) => {
    user.username = user.username.toLowerCase();
    db.query(`CALL Get_Salt('${user.username}')`)
      .then((resp) => {
        if (!resp[0][0]) {
          const err = new Error("User Doesn't Exist");
          err.code = 401;
          reject(err);
        }
        const { salt } = resp[0][0];
        return hashPassword(user.password, salt);
      }).then((hashedPassword) => {
        db.query(`CALL Get_Password('${user.username}')`)
          .then((resp) => {
            if (resp[0][0].password === hashedPassword) {
              resolve(user);
            } else {
              const err = new Error('Invalid Password');
              err.code = 401;
              reject(err);
            }
          });
      })
      .catch((err) => {
        reject(err);
      });
  }));
}

module.exports.login = (req, res) => {
  validateUser(req.body)
    .then((user) => {
      req.session.username = user.username;
      res.send('Success!');
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
};

module.exports.getSalt = (req, res) => {
  const { username } = req.body;
  db.query(`CALL Get_Salt('${username}')`)
    .then((resp) => {
      res.send(resp[0][0].salt);
    });
};

module.exports.register = (req, res) => {
  sanitizeUser(req.body)
    .then((user) => {
      db.query(`CALL Register_User(
            '${user.username}',
            '${user.password}',
            '${user.salt}',
            '${user.firstName}',
            '${user.lastName}',
            '${user.email}')`)
        .then(() => {
          req.session.username = user.username;
          res.send('Registered');
        })
        .catch(() => {
          const err = new Error('Username is taken');
          err.code = 409;
          res.status(err.code)
            .send(`Error ${err.code}: ${err.message}`);
        });
    })
    .catch((err) => {
      res.status(401).send(err);
    });
};

module.exports.checkSession = (req, res, next) => {
  if (!req.session.username && req.path.indexOf('/login') < 0 && req.path.indexOf('/register') < 0) {
    return res.status(401).send('Unauthorized');
  }
  return next();
};
