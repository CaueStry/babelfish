const router = require('express').Router();
const session = require('express-session');
const viewRouter = require('./view');
const apiRouter = require('./api');

router.use(session({
  secret: 'cpsc2030',
  saveUninitialized: true,
  resave: true,
}));

router.use('/api', apiRouter);
router.use('/', viewRouter);

module.exports = router;
