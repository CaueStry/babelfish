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
  if (!picture) return;
  $('#profile-img').attr('src', picture);
}

$(window).on('load', () => {
  getMyProfile()
    .then((myProfile) => {
      setProfilePicture(myProfile.picture_url);
    })
    .catch((err) => {
      throw err;
    });
});
