/* ═══════════════════════════════════════════════════════════════════
   THE WAVE AFRICA — PAGES.JS
   Combined page-specific JS for:
     • impact.html    → counter animation
     • partner.html   → (no extra JS needed beyond main.js)
     • donate.html    → donation toggle, amount selection, custom input
     • contact.html   → form validation & submission feedback
   Runs after main.js. Each block is guarded by a page-class check
   so functions don't fire on wrong pages.
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const body = document.body;

  /* ════════════════════════════════════════════════════════════
     1. OUR IMPACT — Animated number counter
  ════════════════════════════════════════════════════════════ */
  if (body.classList.contains('page-impact')) {

    const counters = document.querySelectorAll('[data-count]');

    if (counters.length && 'IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const dur    = 2000; // ms
          const step   = 30;  // ms per frame
          const inc    = target / (dur / step);
          let current  = 0;

          const tick = setInterval(() => {
            current += inc;
            if (current >= target) {
              current = target;
              clearInterval(tick);
            }
            el.textContent = Math.floor(current).toLocaleString();
          }, step);

          counterObserver.unobserve(el);
        });
      }, { threshold: 0.5 });

      counters.forEach(el => counterObserver.observe(el));
    }
  }
  const hamburger = document.getElementById("navHamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("nav-open");
});
  if (body.classList.contains('page-impact')) {

  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  const map = L.map('map', {
    zoomControl: false
  }).setView([-4.0435, 39.6682], 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap & CARTO'
  }).addTo(map);

  const goldIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pin"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20]
  });

  L.marker([-4.0435, 39.6682], { icon: goldIcon })
    .addTo(map)
    .bindPopup('<b>Changamwe</b><br>Mombasa')
    .openPopup();

  setTimeout(() => {
    map.invalidateSize();
  }, 200);
}

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CARTO'
}).addTo(map);

const goldIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div class="marker-pin"></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 20]
});

L.marker([-4.0435, 39.6682], { icon: goldIcon })
  .addTo(map)
  .bindPopup('<b>Changamwe</b><br>Mombasa')
  .openPopup();
  setTimeout(() => {
  map.invalidateSize();
}, 100);

  /* ════════════════════════════════════════════════════════════
     2. DONATE PAGE — Toggle, amount selection, custom input
  ════════════════════════════════════════════════════════════ */
  if (body.classList.contains('page-donate')) {

    /* Frequency toggle: One-time / Monthly */
    const btnOneTime   = document.getElementById('btnOneTime');
    const btnMonthly   = document.getElementById('btnMonthly');
    const donateNowBtn = document.getElementById('donateNowBtn');

    let frequency = 'once';

    function setFrequency(val, activeBtn, inactiveBtn) {
      frequency = val;
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-pressed', 'true');
      inactiveBtn.classList.remove('active');
      inactiveBtn.setAttribute('aria-pressed', 'false');
      updateDonateLink();
    }

    if (btnOneTime && btnMonthly) {
      btnOneTime.addEventListener('click', () => setFrequency('once',    btnOneTime, btnMonthly));
      btnMonthly.addEventListener('click', () => setFrequency('monthly', btnMonthly, btnOneTime));
    }

    /* Amount buttons */
    const amountBtns     = document.querySelectorAll('.donate-amount__btn:not(.donate-amount__btn--custom)');
    const btnCustom      = document.getElementById('btnCustom');
    const customWrap     = document.getElementById('customAmountWrap');
    const customInput    = document.getElementById('customAmount');

    let selectedAmount = 2500; // default matches .active in HTML

    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        if (btnCustom) btnCustom.classList.remove('active');
        btn.classList.add('active');
        selectedAmount = parseInt(btn.dataset.amount, 10);
        if (customWrap) customWrap.hidden = true;
        updateDonateLink();
      });
    });

    /* Custom amount */
    if (btnCustom && customWrap && customInput) {
      btnCustom.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btnCustom.classList.add('active');
        customWrap.hidden = false;
        customInput.focus();
      });

      customInput.addEventListener('input', () => {
        const val = parseInt(customInput.value, 10);
        selectedAmount = isNaN(val) ? 0 : val;
        updateDonateLink();
      });
    }

    function updateDonateLink() {
      if (!donateNowBtn) return;
      // In production: point to payment gateway with query params
      donateNowBtn.href =
        `mailto:africathewave@gmail.com?subject=Donation%20Inquiry&body=I%20would%20like%20to%20make%20a%20${frequency === 'monthly' ? 'monthly' : 'one-time'}%20donation%20of%20KES%20${selectedAmount}.`;
    }

    updateDonateLink();
  }

  /* ════════════════════════════════════════════════════════════
     3. CONTACT PAGE — Form validation & feedback
  ════════════════════════════════════════════════════════════ */
  if (body.classList.contains('page-contact')) {

    const form     = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (form && feedback) {

      /* Real-time field validation styling */
      form.querySelectorAll('.contact-form__input').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) validateField(input);
        });
      });

      function validateField(input) {
        const ok = input.value.trim().length > 0 &&
                   (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
        input.classList.toggle('error', !ok);
        return ok;
      }

      form.addEventListener('submit', e => {
        e.preventDefault();

        const inputs = [...form.querySelectorAll('.contact-form__input')];
        const allValid = inputs.every(input => validateField(input));

        if (!allValid) {
          showFeedback('Please fill in all fields correctly.', 'error');
          return;
        }

        /* Simulate async send — replace with real fetch/FormData to backend */
        const submitBtn = form.querySelector('.contact-form__submit');
        submitBtn.textContent = 'SENDING…';
        submitBtn.disabled = true;

        setTimeout(() => {
          showFeedback(
            '✓ Message sent! We\'ll get back to you as soon as possible.',
            'success'
          );
          form.reset();
          submitBtn.textContent = 'SEND MESSAGE';
          submitBtn.disabled = false;
        }, 1400);
      });

      function showFeedback(msg, type) {
        feedback.textContent = msg;
        feedback.className   = `contact-form__feedback ${type}`;
        feedback.hidden      = false;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (type === 'success') {
          setTimeout(() => { feedback.hidden = true; }, 6000);
        }
      }
    }
  }

})();
