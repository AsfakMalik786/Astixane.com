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
        let isDragging = false;
        // click toggles only when not dragging
        chatToggle.addEventListener('click', (ev) => {
            if (isDragging) return;
            const open = chatPanel.getAttribute('aria-hidden') === 'false';
            chatPanel.setAttribute('aria-hidden', open ? 'true' : 'false');
        });

        // draggable behavior (pointer events) with smooth transform animation
        const chatWidget = document.querySelector('.chat-widget');
        let pointerId = null;
        let startX = 0, startY = 0, startLeft = 0, startTop = 0;
        let targetLeft = 0, targetTop = 0, currentLeft = 0, currentTop = 0;
        let baseLeft = 0, baseTop = 0;
        let rafId = null;

        // apply saved position (left/top absolute)
        const saved = localStorage.getItem('chatWidgetPos');
        if (saved && chatWidget) {
            try {
                const pos = JSON.parse(saved);
                if (typeof pos.left === 'number' && typeof pos.top === 'number') {
                    chatWidget.style.left = pos.left + 'px';
                    chatWidget.style.top = pos.top + 'px';
                    chatWidget.style.right = 'auto';
                    chatWidget.style.bottom = 'auto';
                }
            } catch (e) {}
        }

        function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }

        function animate() {
            // lerp current towards target
            currentLeft += (targetLeft - currentLeft) * 0.22;
            currentTop += (targetTop - currentTop) * 0.22;
            const tx = Math.round(currentLeft - baseLeft);
            const ty = Math.round(currentTop - baseTop);
            chatWidget.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            rafId = requestAnimationFrame(animate);
        }

        chatToggle.addEventListener('pointerdown', (e) => {
            // only primary button
            if (e.button && e.button !== 0) return;
            pointerId = e.pointerId;
            startX = e.clientX;
            startY = e.clientY;
            const rect = chatWidget.getBoundingClientRect();
            // anchor widget to absolute left/top to use transform offsets
            baseLeft = rect.left;
            baseTop = rect.top;
            // freeze absolute position
            chatWidget.style.left = baseLeft + 'px';
            chatWidget.style.top = baseTop + 'px';
            chatWidget.style.right = 'auto';
            chatWidget.style.bottom = 'auto';
            // initial targets
            startLeft = baseLeft;
            startTop = baseTop;
            targetLeft = startLeft;
            targetTop = startTop;
            currentLeft = startLeft;
            currentTop = startTop;
            chatWidget.classList.add('dragging');
            chatToggle.setPointerCapture(pointerId);
            isDragging = false;
            if (!rafId) animate();
        });

        window.addEventListener('pointermove', (e) => {
            if (pointerId === null || e.pointerId !== pointerId) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) isDragging = true;
            const widgetW = chatWidget.offsetWidth;
            const widgetH = chatWidget.offsetHeight;
            targetLeft = clamp(startLeft + dx, 8, window.innerWidth - widgetW - 8);
            targetTop = clamp(startTop + dy, 8, window.innerHeight - widgetH - 8);
        });

        window.addEventListener('pointerup', (e) => {
            if (pointerId === null || e.pointerId !== pointerId) return;
            try { chatToggle.releasePointerCapture(pointerId); } catch (err) {}
            pointerId = null;
            chatWidget.classList.remove('dragging');
            // stop animation
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            // apply final placement
            // snap current towards target for final position
            currentLeft = targetLeft;
            currentTop = targetTop;
            chatWidget.style.transform = 'none';
            chatWidget.style.left = Math.round(currentLeft) + 'px';
            chatWidget.style.top = Math.round(currentTop) + 'px';
            // save position
            localStorage.setItem('chatWidgetPos', JSON.stringify({ left: Math.round(currentLeft), top: Math.round(currentTop) }));
            // small delay so click isn't suppressed too long
            setTimeout(() => { isDragging = false; }, 50);
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