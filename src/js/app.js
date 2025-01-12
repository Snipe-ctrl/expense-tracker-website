import '../scss/style.scss';

const signupForm = document.querySelector('.create-account-container');

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('full-name-input').value.trim();
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value.trim();
    const confirmPassword = document.getElementById('confirm-password-input').value.trim();
    const termsAccepted = document.getElementById('terms-box').checked;

    if (!fullName || !email || !password || !confirmPassword) {
        // (change from alert to interface error)
        alert('Please fill in all the fields!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (!termsAccepted) {
        alert('You must agree to the Terms of Service and Privacy Policy!');
        return;
    }

    if (!isValidEmail) {
        alert('Please enter a valid email address!');
        return;
    }

    try {
        const signupResponse = await fetch('http://localhost:3001/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ fullName, email, password })
        });
    
        const data = await signupResponse.json();

        if (data.type === 'success') {
            alert('Account created succesfully!');
        } else {
            alert('Error creating account: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});