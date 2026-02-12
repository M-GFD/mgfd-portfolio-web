const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

if (form && feedback) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 3) {
      feedback.textContent = 'El nombre debe tener al menos 3 caracteres.';
      return;
    }

    if (!validEmail.test(email)) {
      feedback.textContent = 'Ingresá un email válido.';
      return;
    }

    if (message.length < 10) {
      feedback.textContent = 'El mensaje debe tener al menos 10 caracteres.';
      return;
    }

    feedback.textContent = '¡Gracias! Tu consulta fue validada correctamente.';
    form.reset();
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
