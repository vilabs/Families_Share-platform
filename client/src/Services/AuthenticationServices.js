import axios from 'axios';

const authenticationServices = {
  login,
  logout,
  googleLogin,
};

function login(email, password, deviceToken) {
  const language = localStorage.getItem('language');
  return axios({
    url: '/users/authenticate/email',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      email, password, deviceToken, language,
    }),
  })
    .then((response) => {
      const user = response.data;
      if (user.token) {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
    })
    .catch(error => Promise.reject(error));
}

function googleLogin(response, origin, deviceToken) {
  const language = localStorage.getItem('language');
  return axios({
    url: '/users/authenticate/google',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      response,
      origin,
      deviceToken,
      language,
    }),
  })
    .then((response) => {
      const user = response.data;
      if (user.token) {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
    })
    .catch(error => Promise.reject(error));
}

function logout() {
  localStorage.removeItem('user');
}

export default authenticationServices;
