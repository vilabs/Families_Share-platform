import axios from "axios";

function login(email, password, deviceToken) {
  const language = localStorage.getItem("language");
  return axios({
    url: "/api/users/authenticate/email",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      email,
      password,
      deviceToken,
      language
    })
  })
    .then(response => {
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    })
    .catch(error => Promise.reject(error));
}

function googleLogin(googleResponse, origin, deviceToken) {
  const language = localStorage.getItem("language");
  return axios({
    url: "/api/users/authenticate/google",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      response: googleResponse,
      origin,
      deviceToken,
      language
    })
  })
    .then(response => {
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    })
    .catch(error => Promise.reject(error));
}

function logout() {
  localStorage.removeItem("user");
}

const authenticationServices = {
  login,
  logout,
  googleLogin
};

export default authenticationServices;
