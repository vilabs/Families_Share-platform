import axios from "axios";

function login(email, password, origin, deviceToken) {
  const language = localStorage.getItem("language");
  const data = {
    email,
    password,
    deviceToken,
    language,
    origin
  };
  if (origin === "native") {
    data.version = localStorage.getItem("version");
  }
  return axios({
    url: "/api/users/authenticate/email",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(data)
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
  const properResponse = {};
  if (origin === "web") {
    properResponse.user = {
      givenName: googleResponse.profileObj.givenName,
      familyName: googleResponse.profileObj.familyName,
      photo: googleResponse.profileObj.imageUrl,
      email: googleResponse.profileObj.email
    };
    properResponse.idToken = googleResponse.tokenObj.id_token;
    properResponse.original = googleResponse;
  } else {
    properResponse.user = {
      original: googleResponse,
      givenName: googleResponse.firstName,
      familyName: googleResponse.lastName,
      photo: googleResponse.photoUrl,
      email: googleResponse.email
    };
    properResponse.idToken = googleResponse.auth.idToken;
    properResponse.original = googleResponse;
  }
  const data = {
    response: properResponse,
    origin,
    deviceToken,
    language
  };
  if (origin === "native") {
    data.version = localStorage.getItem("version");
  }
  return axios({
    url: "/api/users/authenticate/google",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(data)
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
