const express = require('express');

const router = express.Router();
const path = require('path');

const view = require('./view-helpers');

router.use('/public', express.static(path.join(__dirname, '../../public')));

router.use(view.checkSession);

router.get('/', view.getLogin);
router.get('/register', view.getRegister);
router.get('/dashboard', view.getDashboard);
router.get('/logout', view.logout);
router.get('/profile', view.getProfile);
router.get('/profile/edit', view.getEditProfile);
router.get('/profile/:username', view.getProfile);

router.get('/search', view.getSearch);
router.get('/search/:language/:page', view.getSearchResults);
router.get('/chats', view.getChatBoard);

module.exports = router;
