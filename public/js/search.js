let myProfile;
const allLanguages = ['Akan', 'Amharic', 'Arabic', 'Assamese', 'Awadhi', 'Azerbaijani', 'Balochi', 'Belarusian', 'Bengali', 'Bhojpuri', 'Burmese', 'Cebuano', 'Chewa', 'Chhattisgarhi', 'Chittagonian', 'Creole', 'Czech', 'Deccan', 'Dhundhari', 'Dutch', 'English', 'French', 'Fula', 'German', 'Greek', 'Gujarati', 'Hakka', 'Haryanvi', 'Hausa', 'Hindi', 'Hmong', 'Hungarian', 'Igbo', 'Ilocano', 'Italian', 'Japanese', 'Javanese', 'Jin', 'Kannada', 'Kazakh', 'Khmer', 'Kinyarwanda', 'Kirundi', 'Konkani', 'Korean', 'Kurdish', 'Madurese', 'Magahi', 'Maithili', 'Malagasy', 'Malay', 'Malayalam', 'Mandarin', 'Marathi', 'Marwari', 'Min', 'Mossi', 'Nepali', 'Odia', 'Oromo', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Quechua', 'Romanian', 'Russian', 'Saraiki', 'SerboCroatian', 'Shanghainese', 'Shona', 'Sindhi', 'Sinhalese', 'Somali', 'Spanish', 'Sundanese', 'Swedish', 'Sylheti', 'Tagalog', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Turkmen', 'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek', 'Vietnamese', 'Visayan', 'Xhosa', 'Xiang', 'Yoruba', 'Yue', 'Zhuang', 'Zulu'];

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

function addDropdownLanguages() {
  allLanguages.forEach((language) => {
    $('#language-dropdown').append(`<option value="${language}">${language}</option>`);
  });
}

function setProfilePicture(picture) {
  if (!picture || picture === undefined) {
    $('#profile-img').attr('src', '/public/img/nopicture.png');
    return;
  }
  $('#profile-img').attr('src', picture);
}

function setupListeners() {
  $('#search').click(() => {
    const language = $('#language-dropdown').val();
    if (language) {
      window.location.href = `/search/${language}/0`;
    }
  });
}

$(window).on('load', () => {
  addDropdownLanguages();
  setupListeners();

  getMyProfile()
    .then((profile) => {
      myProfile = profile;
      setProfilePicture(myProfile.picture_url);
    })
    .catch((err) => {
      throw err;
    });
});
