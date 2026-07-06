(function () {
  'use strict';

  /* ========================
     HEADER SCROLL EFFECT
  ======================== */
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ========================
     HAMBURGER / OFFCANVAS
  ======================== */
  const hamburger = document.getElementById('hamburger');
  const offcanvas = document.getElementById('offcanvas');
  const overlay = document.getElementById('offcanvasOverlay');
  const closeBtn = document.getElementById('offcanvasClose');

  function openOffcanvas() {
    hamburger.classList.add('active');
    offcanvas.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeOffcanvas() {
    hamburger.classList.remove('active');
    offcanvas.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', openOffcanvas);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeOffcanvas);
  }
  if (overlay) {
    overlay.addEventListener('click', closeOffcanvas);
  }

  // Close offcanvas on nav link click
  const offcanvasLinks = offcanvas ? offcanvas.querySelectorAll('a') : [];
  offcanvasLinks.forEach(function (link) {
    link.addEventListener('click', closeOffcanvas);
  });

  /* ========================
     INTERSECTION OBSERVER
  ======================== */
  const animationClasses = ['.fade-up', '.fade-left', '.fade-right', '.scale-in', '.blur-in', '.stagger-children'];

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  document.querySelectorAll(animationClasses.join(',')).forEach(function (el) {
    observer.observe(el);
  });

  /* SAFETY FALLBACK: ensure all animated content visible after 2s */
  setTimeout(function () {
    document.querySelectorAll(animationClasses.join(',')).forEach(function (el) {
      el.classList.add('visible');
    });
  }, 2000);

  /* ========================
     COUNTER ANIMATION
  ======================== */
  const counters = document.querySelectorAll('.impact-number, .stat-number');

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var duration = 2000;
    var startTime = null;
    var hasDecimal = (target % 1 !== 0);

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;
      el.textContent = hasDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = hasDecimal ? target.toFixed(1) : Math.floor(target).toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ========================
     MAGNETIC BUTTONS
  ======================== */
  var magneticBtns = document.querySelectorAll('.magnetic');

  magneticBtns.forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      var strength = 8;
      btn.style.transform = 'translate(' + (x / rect.width) * strength + 'px, ' + (y / rect.height) * strength + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  /* ========================
     3D TILT CARDS
  ======================== */
  var tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotX = ((y - centerY) / centerY) * -8;
      var rotY = ((x - centerX) / centerX) * 8;
      card.style.setProperty('--rot-x', rotX + 'deg');
      card.style.setProperty('--rot-y', rotY + 'deg');
    });

    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--rot-x', '0deg');
      card.style.setProperty('--rot-y', '0deg');
    });
  });

  /* ========================
     TESTIMONIAL CAROUSEL
  ======================== */
  var carousel = document.getElementById('testimonialCarousel');
  if (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dotsContainer = carousel.querySelector('.carousel-dots');
    var slideCount = slides.length;
    var currentIndex = 0;
    var autoPlayInterval;
    var isPaused = false;
    var totalSlides = slideCount;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      if (isPaused) return;
      goToSlide((currentIndex + 1) % totalSlides);
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    carousel.addEventListener('mouseenter', function () { isPaused = true; });
    carousel.addEventListener('mouseleave', function () { isPaused = false; });

    startAutoPlay();
  }

  /* ========================
     TIMELINE LINE PROGRESS
  ======================== */
  var timelineLine = document.querySelector('.timeline-line-progress');
  if (timelineLine) {
    var timelineObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            timelineLine.style.width = '100%';
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    timelineObserver.observe(timelineLine);
  }

  /* ========================
     IMPACT BAR ANIMATION
  ======================== */
  var impactBars = document.querySelectorAll('.impact-bar-fill');
  var impactObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var index = Array.prototype.indexOf.call(impactBars, bar);
          var widths = ['95%', '98%', '85%', '90%'];
          setTimeout(function () {
            bar.style.width = widths[index];
          }, 300 * index);
          impactObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );
  impactBars.forEach(function (bar) {
    impactObserver.observe(bar);
  });

  /* ========================
     ACTIVE NAV LINK
  ======================== */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.header-nav a, .offcanvas-nav a');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ========================
     SMOOTH SCROLL FOR ANCHORS
  ======================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ========================
     NEWSLETTER SUBSCRIBE
  ======================== */
  window.handleNewsletter = function (e, form) {
    e.preventDefault();
    var parent = form.parentNode;
    var existing = parent.querySelector('.footer-newsletter-success');
    if (existing) existing.remove();
    var msg = document.createElement('div');
    msg.className = 'footer-newsletter-success';
    msg.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Subscribed!';
    parent.insertBefore(msg, form);
    form.style.display = 'none';
    setTimeout(function () {
      form.style.display = '';
      if (msg.parentNode) msg.remove();
    }, 3000);
  };
})();
