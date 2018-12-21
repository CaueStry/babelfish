let myProfile;

function getMyProfile() {
  return new Promise((resolve, reject) => {
    axios.get('/api/profile')
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getProfile(username) {
  return new Promise((resolve, reject) => {
    axios.get(`/api/profile/${username}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function setProfilePicture(picture) {
  if (!picture || picture === undefined) {
    $('#profile-img').attr('src', '/public/img/nopicture.png');
    return;
  }
  $('#profile-img').attr('src', picture);
}

function setProfile(profile) {
  $('#name').html(`${profile.first_name} ${profile.last_name}`);
  $('#username').html(profile.username);
  $('#biography').html(profile.biography || '<span class="empty">No Biography...</span>');
  if (profile.picture_url) {
    $('#openprofile-img').attr('src', profile.picture_url);
  } else {
    $('#openprofile-img').attr('src', '/public/img/nopicture.png');
  }
  profile.spokenLanguages.forEach((language) => {
    $('#spoken-languages').append(`<li>${language}</li>`);
  });
  if (profile.spokenLanguages.length === 0) {
    $('#spoken-languages').append('<span class="empty">No Languages...</span>');
  }
}

function sendMessage(profile) {
  axios.post('/api/chat/new', {
    user: profile.username,
  })
    .then(() => {
      window.location.href = '/chats';
    })
    .catch((err) => {
      throw err;
    });
}

$(window).on('load', () => {
  const params = window.location.pathname.split('/').filter(param => param.length > 0);

  getMyProfile()
    .then((profile) => {
      myProfile = profile;
      setProfilePicture(myProfile.picture_url);
      if (params.length === 1) {
        setProfile(myProfile);
        $('#edit').removeClass('hidden');
      } else if (params.length === 2) {
        getProfile(params[1])
          .then((uProfile) => {
            setProfile(uProfile);
            if (uProfile.username !== myProfile.username) {
              $('#message').removeClass('hidden');
              $('#message').click(() => {
                sendMessage(uProfile);
              });
            } else {
              $('#edit').removeClass('hidden');
            }
          })
          .catch(() => {
            $('#main').html('<h1>Profile not found...</h1>');
          });
      }
    })
    .catch((err) => {
      throw err;
    });
});
