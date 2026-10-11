(function () {
  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');

  /* Mobile menu */
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = root.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { root.classList.remove('nav-open'); });
    });
  }

  /* Header state on scroll */
  function onScroll() { header && header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Testimonial slider arrows */
  var track = document.querySelector('.slider-track');
  if (track) {
    document.querySelectorAll('[data-slide]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var step = track.querySelector('.review').offsetWidth + 24;
        track.scrollBy({ left: Number(btn.dataset.slide) * step, behavior: 'smooth' });
      });
    });
  }

  /* Animations (GSAP). If it fails to load, content stays visible. */
  if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.remove('js');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* Hero intro */
  var heroLines = document.querySelectorAll('.hero h1 .line > span');
  if (heroLines.length) {
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from(heroLines, { yPercent: 110, duration: 1.1, stagger: 0.15, delay: 0.15 })
      .from('.hero p', { y: 30, opacity: 0, duration: 0.9 }, '-=0.6')
      .from('.hero-cta .btn', { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.6')
      .from('.hero-balloon', { y: 120, opacity: 0, rotate: -8, duration: 1.6, ease: 'power3.out' }, 0.3);

    gsap.to('.hero-balloon', { y: -26, rotate: 3, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.to('.hero-bg', {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-inner', {
      yPercent: -10, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true }
    });
  }

  /* Inner page hero */
  if (document.querySelector('.page-hero')) {
    gsap.from('.page-hero h1, .page-hero p, .page-hero .eyebrow', {
      y: 40, opacity: 0, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 0.1
    });
    gsap.to('.page-hero .bg', {
      yPercent: 15, scale: 1.1, ease: 'none',
      scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* Scroll reveals: single elements and staggered groups */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.fromTo(el, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  gsap.utils.toArray('[data-stagger]').forEach(function (group) {
    var items = group.children;
    gsap.set(items, { opacity: 0, y: 60 });
    ScrollTrigger.create({
      trigger: group, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.to(items, { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out' });
      }
    });
  });

  /* Parallax images */
  gsap.utils.toArray('[data-parallax]').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* Buttons: subtle magnetic hover on pointer devices */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.3 });
      });
      btn.addEventListener('mouseleave', function () { gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }); });
    });
  }
})();
