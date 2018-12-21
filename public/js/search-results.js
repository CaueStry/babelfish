let myProfile;
const params = {
  language: window.location.pathname.split('/').filter(param => param.length > 0)[1],
  page: parseInt(window.location.pathname.split('/').filter(param => param.length > 0)[2], 10),
};

/* eslint func-names: 0 */
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

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

function setProfilePicture(picture) {
  if (!picture || picture === undefined) {
    $('#profile-img').attr('src', '/public/img/nopicture.png');
    return;
  }
  $('#profile-img').attr('src', picture);
}

function getProfiles() {
  return new Promise((resolve, reject) => {
    axios.get(`/api/search/${params.language}/${params.page}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function setupButtons(num) {
  const numButtons = Math.ceil(num / 10);
  let buttonContainer = '';
  buttonContainer += '<div class="buttons-container">';
  for (let i = 0; i < numButtons; i += 1) {
    if (i === params.page) {
      buttonContainer += `<a class="page-button selected" href="/search/${params.language}/${i}">${i}</a>`;
    } else {
      buttonContainer += `<a class="page-button" href="/search/${params.language}/${i}">${i}</a>`;
    }
  }
  buttonContainer += '</div>';
  $('#results').append(buttonContainer);
}

function setupProfiles() {
  $('#title-language').html(params.language);
  getProfiles()
    .then((result) => {
      result.profiles.forEach((profile) => {
        $('#results').append(
          `<a href="/profile/${profile.username}" class="result">
          <img src="${profile.picture_url || '/public/img/nopicture.png'}" alt="${profile.username} Profile Image">
          <div>
            <span class="name">${profile.first_name.capitalize()} ${profile.last_name.capitalize()}</span>
            <span class="username">${profile.username}</span>
          </div>
        </a>`,
        );
      });
      setupButtons(result.total);
    })
    .catch((err) => {
      throw err;
    });
}

$(window).on('load', () => {
  getMyProfile()
    .then((profile) => {
      myProfile = profile;
      setProfilePicture(myProfile.picture_url);
    })
    .catch((err) => {
      throw err;
    });

  setupProfiles();
});
