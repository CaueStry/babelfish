const router = require('express').Router();
const auth = require('./auth-helpers');
const profile = require('./profile-helpers');
const chat = require('./chat-helpers');
const search = require('./search-helpers');

router.use(auth.checkSession);

router.post('/login', auth.login);
router.post('/register', auth.register);

router.route('/profile')
  .get(profile.getMyProfile)
  .put(profile.editProfile);
router.get('/profile/basic/:userid', profile.getBasicProfile);
router.get('/profile/:username', profile.getProfile);
router.get('/search/:language/:page', search.getProfilesByLanguage);

router.get('/chat/all', chat.getMyChats);
router.post('/chat/new', chat.newChat);
router.route('/chat/:chatid')
  .get(chat.getChat)
  .post(chat.sendMessage);

module.exports = router;
