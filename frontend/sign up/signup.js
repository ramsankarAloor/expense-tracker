let form = document.getElementById("signup-form");

form.addEventListener("submit", postSignup);

async function postSignup(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const emailError = document.getElementById('emailError');

  const obj = {
    name: name,
    email: email,
    password: password,
  };
  try {
    await axios.post("http://localhost:3000/signup", obj);
    const { data : loginUser } = await axios.post("http://localhost:3000/login", {email:email, password:password});
    localStorage.setItem('token', loginUser.accessToken);
    window.location.href = '../expense/expense.html';
  } catch (error) {
    if(error.response.status === 403){
      emailError.textContent = '*This email is already registered';
    }
  }
  
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}
