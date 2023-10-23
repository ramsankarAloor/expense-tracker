const form = document.getElementById('forgot-password-form');
form.addEventListener("submit", sendEmail);

async function sendEmail(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    let obj = {email};
    try {
        const response = await axios.post('http://localhost:3000/password/forgotpassword', obj);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
    
    
}