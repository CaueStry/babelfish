function addInvalid(field) {
  $(`#${field}`).addClass('invalid');
}

function show() {
  $('.left').addClass('show');
  $('.right').addClass('show');
}

function addUsed(field) {
  $(`#used-${field}`).addClass('used');
}

function removeAllInvalids() {
  $('#used-username').removeClass('used');
  $('#username').removeClass('invalid');
  $('#password').removeClass('invalid');
  $('#firstname').removeClass('invalid');
  $('#lastname').removeClass('invalid');
  $('#email').removeClass('invalid');
  $('#password-confirmation').removeClass('invalid');
}

function register() {
  removeAllInvalids();
  if ($('#password').val() !== $('#password-confirmation').val()) {
    addInvalid('password-confirmation');
    return;
  }
  const data = {
    username: $('#username').val(),
    password: $('#password').val(),
    firstName: $('#firstname').val(),
    lastName: $('#lastname').val(),
    email: $('#email').val(),
  };
  axios.post('/api/register', data)
    .then(() => {
      window.location.href = '/dashboard';
    })
    .catch((err) => {
      if (err.response.status === 401) {
        err.response.data.fields.map(field => addInvalid(field));
      } else if (err.response.status === 409) {
        addUsed('username');
      }
    });
}

$(window).on('load', () => {
  $('#register-btn').click(register);
  setTimeout(show, 100);
});
