// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU TOGGLE ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- 2. SMOOTH SCROLLING FOR NAV LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close menu on click

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header height (80px)
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 3. DYNAMIC FORM HANDLING (Frontend Simulation) ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop page reload

            // Get values
            const name = document.getElementById('name').value;
            const service = document.getElementById('service').value;

            // Simple validation simulation
            if(name && service) {
                // Simulate sending data to backend
                const btn = this.querySelector('button');
                const originalText = btn.innerText;
                
                btn.innerText = 'Sending...';
                btn.style.opacity = '0.7';

                setTimeout(() => {
                    alert(`Thank you, ${name}! We have received your request for ${service}. We will contact you shortly.`);
                    contactForm.reset(); // Clear form
                    btn.innerText = originalText;
                    btn.style.opacity = '1';
                }, 1500); // Fake delay of 1.5 seconds
            }
        });
    }

    // --- 4. STICKY NAVBAR SHADOW ON SCROLL ---
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        }
    });
});