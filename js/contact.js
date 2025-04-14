document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = this;
    const submitButton = form.querySelector('button[type="submit"]');
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            form.reset();
            const formMessage = document.getElementById('formMessage');
            formMessage.classList.add('show');
            
            setTimeout(() => {
                if (formMessage.classList.contains('show')) {
                    formMessage.classList.remove('show');
                }
            }, 5000);
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
});

function closeMessage() {
    document.getElementById('formMessage').classList.remove('show');
}