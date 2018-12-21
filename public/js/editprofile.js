let myProfile;
const allLanguages = ['Akan', 'Amharic', 'Arabic', 'Assamese', 'Awadhi', 'Azerbaijani', 'Balochi', 'Belarusian', 'Bengali', 'Bhojpuri', 'Burmese', 'Cebuano', 'Chewa', 'Chhattisgarhi', 'Chittagonian', 'Creole', 'Czech', 'Deccan', 'Dhundhari', 'Dutch', 'English', 'French', 'Fula', 'German', 'Greek', 'Gujarati', 'Hakka', 'Haryanvi', 'Hausa', 'Hindi', 'Hmong', 'Hungarian', 'Igbo', 'Ilocano', 'Italian', 'Japanese', 'Javanese', 'Jin', 'Kannada', 'Kazakh', 'Khmer', 'Kinyarwanda', 'Kirundi', 'Konkani', 'Korean', 'Kurdish', 'Madurese', 'Magahi', 'Maithili', 'Malagasy', 'Malay', 'Malayalam', 'Mandarin', 'Marathi', 'Marwari', 'Min', 'Mossi', 'Nepali', 'Odia', 'Oromo', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Quechua', 'Romanian', 'Russian', 'Saraiki', 'SerboCroatian', 'Shanghainese', 'Shona', 'Sindhi', 'Sinhalese', 'Somali', 'Spanish', 'Sundanese', 'Swedish', 'Sylheti', 'Tagalog', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Turkmen', 'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek', 'Vietnamese', 'Visayan', 'Xhosa', 'Xiang', 'Yoruba', 'Yue', 'Zhuang', 'Zulu'];

function removeLanguage(language) {
  const index = myProfile.spokenLanguages.indexOf(language);
  if (index > -1) {
    myProfile.spokenLanguages.splice(index, 1);
  }
}

function addSpokenLanguages(languages) {
  languages.forEach((language) => {
    const langElement = document.createElement('div');
    const spanElement = document.createElement('span');
    const buttonElement = document.createElement('button');
    spanElement.innerHTML = language;
    buttonElement.innerHTML = '-';
    buttonElement.addEventListener('click', () => {
      removeLanguage(language);
      updateLanguages();
    });
    langElement.appendChild(spanElement);
    langElement.appendChild(buttonElement);
    $('#spoken-languages').append(langElement);
  });
}

/* eslint no-use-before-define: 0 */
function updateLanguages() {
  $('#spoken-languages').empty();
  addSpokenLanguages(myProfile.spokenLanguages);
}

function addNewLanguage(language) {
  myProfile.spokenLanguages.push(language);
  updateLanguages();
}

function addDropdownLanguages() {
  allLanguages.forEach((language) => {
    $('#add-language').append(`<option value="${language}">${language}</option>`);
  });
}

function updatePlaceholders(profile) {
  $('#firstName').attr('placeholder',
    profile.first_name.charAt(0).toUpperCase() + profile.first_name.slice(1));
  $('#lastName').attr('placeholder',
    profile.last_name.charAt(0).toUpperCase() + profile.last_name.slice(1));
  $('#biography').val(profile.biography);
  $('#email').attr('placeholder', profile.email);
}

function setProfilePicture(picture) {
  if (!picture) return;
  $('#profile-img').attr('src', picture);
}

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

function saveChanges() {
  const fName = $('#firstName').val();
  const lName = $('#lastName').val();
  const pBiography = $('#biography').val();
  const pUrl = $('#picture-url').val();
  const pEmail = $('#email').val();

  const profile = {
    username: myProfile.username,
    firstName: fName || myProfile.first_name,
    lastName: lName || myProfile.last_name,
    biography: pBiography,
    pictureUrl: pUrl || myProfile.picture_url,
    email: pEmail || myProfile.email,
    spokenLanguages: myProfile.spokenLanguages,
  };

  axios.put('/api/profile', profile)
    .then(() => {
      window.location = '/profile';
    })
    .catch((err) => {
      throw err;
    });
}

$(window).on('load', () => {
  getMyProfile()
    .then((profile) => {
      myProfile = profile;
      setProfilePicture(profile.picture_url);
      addSpokenLanguages(profile.spokenLanguages);
      updatePlaceholders(profile);
      addDropdownLanguages();
      $('#saveChanges').click(saveChanges);
      $('#add-language').on('change', (e) => {
        addNewLanguage($(e.target).val());
      });
    });
});
