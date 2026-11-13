/* ==========================================================================
   A LETTER TO VICKY — INTERACTIVE BEHAVIOUR & NAVIGATION
   Vanilla JavaScript (zero external dependencies)
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ------------------------------------------------------------------------
     1. OPENING ENVELOPE SEQUENCE
     ------------------------------------------------------------------------ */
  const body = document.body;
  const envelopeStage = document.getElementById('envelope-stage');
  const envelopeSeal = document.getElementById('envelope-seal');
  const envelopePrompt = document.getElementById('envelope-prompt');
  const continueBtn = document.getElementById('continue-btn');
  const siteHeader = document.getElementById('site-header');

  let hasStartedOpening = false;

  function openEnvelope() {
    if (!envelopeStage || hasStartedOpening) return;
    hasStartedOpening = true;

    if (prefersReducedMotion) {
      envelopeStage.classList.add(
        'is-opening',
        'is-flapped',
        'is-emerging',
        'is-revealed'
      );
      if (continueBtn) {
        continueBtn.removeAttribute('tabindex');
        continueBtn.focus({ preventScroll: true });
      }
      return;
    }

    // Step 1: Release seal & fold top flap backward in 3D
    envelopeStage.classList.add('is-opening');

    // Step 2: Drop open flap behind the letter layer midway through rotation
    window.setTimeout(function () {
      envelopeStage.classList.add('is-flapped');
    }, 340);

    // Step 3: Lift letter smoothly out of the Prussian blue pocket
    window.setTimeout(function () {
      envelopeStage.classList.add('is-emerging');
    }, 560);

    // Step 4: Expand letter into center stage displaying 1 Thessalonians 5:18
    window.setTimeout(function () {
      envelopeStage.classList.add('is-revealed');
      if (continueBtn) {
        continueBtn.removeAttribute('tabindex');
        continueBtn.focus({ preventScroll: true });
      }
    }, 1180);
  }

  function enterMainExperience() {
    if (!envelopeStage) return;

    envelopeStage.classList.add('is-dismissed');
    body.classList.remove('is-locked');

    if (siteHeader) {
      siteHeader.classList.add('is-visible');
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    window.setTimeout(function () {
      envelopeStage.setAttribute('aria-hidden', 'true');
      observeReveals();
    }, prefersReducedMotion ? 10 : 720);
  }

  if (envelopeSeal) {
    envelopeSeal.addEventListener('click', openEnvelope);
  }

  if (envelopePrompt) {
    envelopePrompt.addEventListener('click', openEnvelope);
  }

  if (continueBtn) {
    continueBtn.addEventListener('click', enterMainExperience);
  }

  /* ------------------------------------------------------------------------
     2. MOBILE NAVIGATION MENU & SMOOTH SCROLLING
     ------------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function setMobileMenuOpen(isOpen) {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
    if (isOpen) {
      mobileNav.removeAttribute('hidden');
    } else {
      mobileNav.setAttribute('hidden', '');
    }
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      const currentlyOpen =
        menuToggle.getAttribute('aria-expanded') === 'true';
      setMobileMenuOpen(!currentlyOpen);
    });
  }

  // Smooth scroll for all internal anchor links (nav links + hero/return CTAs)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      setMobileMenuOpen(false);

      targetEl.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });

  /* ------------------------------------------------------------------------
     3. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
     ------------------------------------------------------------------------ */
  const trackedSections = document.querySelectorAll('main section[id]');

  function updateActiveNav(sectionId) {
    allNavLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + sectionId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            updateActiveNav(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-38% 0px -50% 0px',
        threshold: 0,
      }
    );

    trackedSections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------------
     4. SUBTLE SCROLL REVEAL ANIMATIONS
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  function observeReveals() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-in-view');
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     5. GRACEFUL LOCAL PHOTOGRAPH FALLBACKS
     ------------------------------------------------------------------------ */
  const photoSlots = document.querySelectorAll('[data-photo-slot]');

  photoSlots.forEach(function (slot) {
    const img = slot.querySelector('img');
    if (!img) return;

    function markMissing() {
      slot.classList.add('is-missing');
    }

    function markLoaded() {
      slot.classList.remove('is-missing');
    }

    img.addEventListener('error', markMissing);
    img.addEventListener('load', markLoaded);

    if (img.complete) {
      if (img.naturalWidth === 0) {
        markMissing();
      } else {
        markLoaded();
      }
    }
  });

  /* ------------------------------------------------------------------------
     6. MEMORIES LIGHTBOX VIEWER
     ------------------------------------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let lastFocusedTrigger = null;

  function openLightbox(src, alt, caption, triggerEl) {
    if (!lightbox || !lightboxImg) return;
    lastFocusedTrigger = triggerEl || null;
    lightboxImg.src = src;
    lightboxImg.alt = alt || caption || 'Photograph of Vicky';
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || '';
    }
    lightbox.removeAttribute('hidden');
    body.classList.add('is-locked');
    if (lightboxClose) {
      lightboxClose.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hasAttribute('hidden')) return;
    lightbox.setAttribute('hidden', '');
    if (lightboxImg) {
      lightboxImg.src = '';
    }
    if (
      envelopeStage &&
      envelopeStage.classList.contains('is-dismissed')
    ) {
      body.classList.remove('is-locked');
    }
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  }

  document.querySelectorAll('.memory-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const slot = trigger.querySelector('[data-photo-slot]');
      if (slot && slot.classList.contains('is-missing')) {
        return;
      }
      const img = trigger.querySelector('img');
      const src = trigger.getAttribute('data-lightbox-src');
      const caption = trigger.getAttribute('data-lightbox-caption');
      if (src) {
        openLightbox(src, img ? img.alt : '', caption, trigger);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeLightbox();
      setMobileMenuOpen(false);
    }
  });
})();
