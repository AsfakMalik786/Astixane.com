// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to nav
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 14, 39, 0.95)';
    } else {
        nav.style.background = 'rgba(10, 14, 39, 0.8)';
    }
});

// Form submission handler (guarded)
const form = document.getElementById('contactForm');
if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        formData.append("access_key", "c278a9cd-ebec-4344-b448-557cbda6a306");

        const originalText = submitBtn ? submitBtn.textContent : '';

        if (submitBtn) {
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
        }

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Success! Your message has been sent.");
                form.reset();
            } else {
                alert("Error: " + data.message);
            }

        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}

// Mobile navigation toggle
const nav = document.querySelector('nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
    });
}

// Close mobile nav when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('nav-open')) {
            nav.classList.remove('nav-open');
        }
    });
});

/* Lightweight FAQ chatbot (client-side, free) - initialize after DOM loaded */
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatPanel = document.getElementById('chat-panel');
    const chatClose = document.getElementById('chat-close');
    const chatLog = document.getElementById('chat-log');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    const faqs = [
        { keywords: ['hello','hi','hey','good morning','good evening','greetings'], answer: 'Hi! 👋 We can help with services, pricing, or a free consultation — ask me or use the contact form.' },
        { keywords: ['services','service','what do you do'], answer: 'We offer Web Development, App Development, AI/ML Integration, Data Engineering, Cloud Solutions, UI/UX Design, Security & Analysis, Web Scraping, and Data Analytics.' },
        { keywords: ['contact','phone','email'], answer: 'Email: astixanetechnologies@gmail.com, Phone: +91 9265107470 / +91 8160976630.' },
        { keywords: ['pricing','price','cost'], answer: 'Pricing depends on scope. Please share project details via the contact form or chat and we can provide an estimate.' },
        { keywords: ['hire','project','work with you'], answer: 'You can hire us by contacting through the contact form or calling the phone numbers listed in Contact.' },
        { keywords: ['location','where','located','address'], answer: 'We are located near Sanand Circle, Ahmedabad, Gujarat - 382210. Would you like me to open the contact form so you can message us directly?', action: 'openContact' },
        { keywords: ['fill form','please fill form','open form','open contact','open contact form'], answer: 'Opening the contact form now — please fill in your details and message.', action: 'openContact' }
    ];

    function appendMessage(text, who) {
        const div = document.createElement('div');
        div.className = `msg ${who}`;
        div.textContent = text;
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function getAnswer(text) {
        const t = text.toLowerCase();
        for (const item of faqs) {
            if (item.keywords.some(k => t.includes(k))) return item;
        }
        return null;
    }

    if (chatToggle && chatPanel) {
        chatToggle.addEventListener('click', () => {
            const open = chatPanel.getAttribute('aria-hidden') === 'false';
            chatPanel.setAttribute('aria-hidden', open ? 'true' : 'false');
        });
    }

    if (chatClose) chatClose.addEventListener('click', () => chatPanel.setAttribute('aria-hidden','true'));

    function sendChat() {
        const val = chatInput.value.trim();
        if (!val) return;
        appendMessage(val, 'user');
        chatInput.value = '';
        setTimeout(() => {
            const item = getAnswer(val);
            if (item) {
                appendMessage(item.answer, 'bot');
                if (item.action === 'openContact') {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        const firstInput = contactSection.querySelector('input, textarea, select');
                        if (firstInput) firstInput.focus();
                    }
                }
            } else {
                appendMessage("Sorry, I don't know that yet. Please use the contact form or ask about services, contact, or pricing.", 'bot');
            }
        }, 400);
    }

    if (chatSend) chatSend.addEventListener('click', sendChat);
    if (chatInput) chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
});