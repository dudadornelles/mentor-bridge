/* ============================================
   Duda Dornelles — Main Script
   ============================================ */

'use strict';

/* ============================================
   🔧 CONFIGURATION — Update these before deploying
   ============================================ */
const CONFIG = {
  // Formspree form ID — sign up free at https://formspree.io
  // Leave empty to use the mailto fallback directly.
  formspreeId: 'YOUR_FORM_ID',

  // Your email address (used in the mailto fallback)
  email: 'dudassdornelles@gmail.com',

  // Form submission success message
  successMessage: 'Thanks for reaching out! I’ll review your message and get back to you within 24 hours.'
};
/* ============================================ */

// --- Mobile Nav Toggle ---
const navToggle = document.querySelector('.nav__toggle');
const navList  = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('nav__list--open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('nav__list--open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
      navList.classList.remove('nav__list--open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// --- Scroll: Add shadow to nav on scroll ---
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 20) {
    nav.style.borderBottomColor = 'rgba(34, 34, 38, 1)';
  } else {
    nav.style.borderBottomColor = 'rgba(34, 34, 38, 0.5)';
  }
  lastScroll = currentScroll;
}, { passive: true });

// --- Contact Form ---
const form        = document.getElementById('contactForm');
const successEl  = document.getElementById('contactSuccess');
const submitBtn  = document.getElementById('submitBtn');
const nameInput  = document.getElementById('name');
const emailInput = document.getElementById('email');
const msgInput   = document.getElementById('message');

function showFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('form-input--error');
  if (error) error.classList.add('form-error--visible');
}

function clearFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.remove('form-input--error');
  if (error) error.classList.remove('form-error--visible');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  let isValid = true;

  // Name
  if (!nameInput.value.trim()) {
    showFieldError('name', 'nameError');
    isValid = false;
  } else {
    clearFieldError('name', 'nameError');
  }

  // Email
  if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
    showFieldError('email', 'emailError');
    isValid = false;
  } else {
    clearFieldError('email', 'emailError');
  }

  // Message
  if (!msgInput.value.trim()) {
    showFieldError('message', 'messageError');
    isValid = false;
  } else {
    clearFieldError('message', 'messageError');
  }

  return isValid;
}

// Clear errors on input
[nameInput, emailInput, msgInput].forEach(input => {
  if (!input) return;
  input.addEventListener('input', () => {
    const errorId = input.id + 'Error';
    input.classList.remove('form-input--error');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.classList.remove('form-error--visible');
  });
});

if (form && successEl && submitBtn) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Collect form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      organization: formData.get('organization'),
      message: formData.get('message')
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      if (CONFIG.formspreeId && CONFIG.formspreeId !== 'YOUR_FORM_ID') {
        const response = await fetch(`https://formspree.io/f/${CONFIG.formspreeId}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Form submission failed');
        }

        form.style.display = 'none';
        successEl.hidden = false;
        successEl.innerHTML = `
          <div class="contact__success-icon">✅</div>
          <h3>Message Sent!</h3>
          <p>${CONFIG.successMessage}</p>
        `;
      } else {
        throw new Error('Formspree not configured — using fallback');
      }
    } catch (err) {
      // Fallback: mailto link
      const subject = encodeURIComponent(`Consulting Inquiry from ${data.name}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Organization: ${data.organization || 'N/A'}\n\n` +
        `${data.message}`
      );
      form.style.display = 'none';
      successEl.hidden = false;
      successEl.innerHTML = `
        <div class="contact__success-icon">✉️</div>
        <h3>Thanks for reaching out!</h3>
        <p>
          I couldn&rsquo;t submit the form automatically, but you can
          <a href="mailto:${CONFIG.email}?subject=${subject}&body=${body}"
             style="color: var(--color-accent); text-decoration: none; font-weight: 600;">
            email me directly
          </a>
          and I&rsquo;ll get back to you within 24 hours.
        </p>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
