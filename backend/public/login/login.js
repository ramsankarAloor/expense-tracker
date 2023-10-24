const apiBaseUrl = `http://13.48.1.93`;

let form = document.getElementById("login-form");
form.addEventListener("submit", postLogin);

// let signInLink = document.getElementById("sign-in-link");
// signInLink.addEventListener("click", redirection);

// function redirection(event){

// }

async function postLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginError = document.getElementById("loginError");

  const obj = {
    email: email,
    password: password,
  };

  try {
    const { data } = await axios.post(`${apiBaseUrl}:3000/login`, obj);
    //setting date at login
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(today.getDate()).padStart(2, "0"); // Add leading zero if needed
    const formattedDate = `${year}-${month}-${day}`;
    localStorage.setItem("lastEnteredDate", formattedDate);

    localStorage.setItem("token", data.accessToken);
    window.location.href = "../expense/expense.html";
  } catch (error) {
    if (error.response.status === 404) {
      loginError.textContent = "Error ! User not found..";
    } else if (error.response.status === 401) {
      loginError.textContent = "Error ! User not authorized..";
    }
  }

  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}
