const path = require('path');
const php = require('../../php')('php');

module.exports.getLogin = (req, res) => {
  php.parse(path.join(__dirname, '../../public/views/login.php'))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getRegister = (req, res) => {
  php.parse(path.join(__dirname, '../../public/views/register.php'))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getChatBoard = (req, res) => {
  php.parse(path.join(__dirname, '../../public/views/chatboard.php'))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getDashboard = (req, res) => {
  php.parse(path.join(__dirname, '../../public/views/dashboard.php'))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getProfile = (req, res) => {
  php.parse(path.join(__dirname, '../../public/views/profile.php'))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getEditProfile = (req, res) => {
  php.parse(path.join(__dirname, '../../public/views/editprofile.php'))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getSearch = (req, res) => {
  php.parse(path.join(__dirname, '../../public/views/search.php'))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getSearchResults = (req, res) => {
  php.parse(path.join(__dirname, '../../public/views/search-results.php'))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.checkSession = (req, res, next) => {
  if (req.path === '/' || req.path.indexOf('/register') >= 0) {
    if (req.session.username) {
      return res.redirect('/dashboard');
    }
    return next();
  }
  if (req.session.username) {
    return next();
  }
  return res.redirect('/');
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
