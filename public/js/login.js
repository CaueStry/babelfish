function addInvalid(field) {
  $(`#${field}`).addClass('invalid');
}

function show() {
  $('.left').addClass('show');
  $('.right').addClass('show');
}

function login() {
  const data = {
    username: $('#username').val(),
    password: $('#password').val(),
  };
  axios.post('/api/login', data)
    .then(() => {
      window.location.href = '/dashboard';
    })
    .catch(() => {
      addInvalid('password');
    });
}

$(window).on('load', () => {
  const loginBtn = $('#login-btn');
  const usernameEl = $('#username');
  const passwordEl = $('#password');
  loginBtn.click(login);
  usernameEl.keydown((e) => {
    if (e.which === 13) {
      loginBtn.click();
    }
  });
  passwordEl.keydown((e) => {
    if (e.which === 13) {
      loginBtn.click();
    }
  });
  setTimeout(show, 100);
});
