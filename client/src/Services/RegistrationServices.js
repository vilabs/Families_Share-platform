import axios from "axios";

function signup(
  given_name,
  family_name,
  number,
  email,
  password,
  visible,
  deviceToken
) {
  const language = localStorage.getItem("language");
  return axios({
    url: "/api/users",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      given_name,
      family_name,
      number,
      email,
      password,
      visible,
      language,
      deviceToken
    })
  })
    .then(response => {
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    })
    .catch(error => Promise.reject(error));
}

const registrationServices = {
  signup
};

export default registrationServices;
