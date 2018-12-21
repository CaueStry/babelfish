const socket = io();

let myProfile;
let openChatId;
let openChatEl;

/* eslint eqeqeq: 0 */
function showChat(id) {
  axios.get(`/api/chat/${id}`)
    .then(({ data }) => {
      let messages = '';
      data.forEach((message) => {
        if (message.message_sender_id == myProfile.user_id) {
          messages += '<div class="message" from="me">';
        } else {
          messages += '<div class="message" from="user">';
        }
        messages += `<span class="message-txt">${message.message_content}</span>
          <span class="time-msg">${message.message_time}</span>
          </div>`;
      });
      $('#messages').html(messages);
      $('#messages').scrollTop($('#messages').height());
    })
    .catch((err) => {
      throw err;
    });
}

function getMyProfile() {
  return new Promise((resolve, reject) => {
    axios.get('/api/profile')
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getMyChats() {
  axios.get('/api/chat/all')
    .then(({ data }) => {
      data.forEach((chat, index) => {
        const chatElement = document.createElement('div');
        chatElement.classList.add('chat');
        const partnerid = chat.user1_id == myProfile.user_id
          ? chat.user2_id : chat.user1_id;
        axios.get(`/api/profile/basic/${partnerid}`)
          .then((response) => {
            const partner = response.data;
            if (!partner.picture_url) {
              partner.picture_url = '/public/img/nopicture.png';
            }
            chatElement.innerHTML = `<img src="${partner.picture_url}">
                    <div class="name">${partner.first_name}</div>`;
            chatElement.addEventListener('click', () => {
              if (openChatEl) {
                openChatEl.classList.remove('selected');
              }
              chatElement.classList.add('selected');
              openChatId = chat.chat_id;
              openChatEl = chatElement;
              socket.emit('room', openChatId);
              showChat(chat.chat_id);
              $('#message-input').focus();
            });
            $('#all-chats').append(chatElement);
            if (index === data.length - 1) {
              $('.chat').last().click();
              $('#all-chats').scrollTop(0);
            }
          })
          .catch((err) => {
            throw err;
          });
      });
    })
    .catch((err) => {
      throw err;
    });
}

function setupSendMessage() {
  const messageInput = $('#message-input');
  const sendMessage = $('#send-message');
  sendMessage.click(() => {
    if (!openChatId || !messageInput.val().replace(/\s/g, '').length) return;
    axios.post(`/api/chat/${openChatId}`, {
      message: messageInput.val(),
    })
      .then(() => {
        messageInput.val('');
        showChat(openChatId);
        socket.emit('message');
      })
      .catch((err) => {
        throw err;
      });
  });
  messageInput.keydown((e) => {
    if (e.which === 13) {
      sendMessage.click();
    }
  });
}

function setProfilePicture(picture) {
  if (!picture) return;
  $('#profile-img').attr('src', picture);
}

function setupMobile() {
  $('#open-chats').on('click', () => {
    $('#all-chats').toggleClass('show');
    $('#open-chats').toggleClass('show');
  });
}

$(window).on('load', () => {
  getMyProfile()
    .then((profile) => {
      myProfile = profile.data;
      setProfilePicture(myProfile.picture_url);
      getMyChats();
      setupSendMessage();
      setupMobile();
    })
    .catch((err) => {
      throw err;
    });
});

socket.on('message', () => {
  showChat(openChatId);
});
