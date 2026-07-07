(function () {
  'use strict';

  var userName = localStorage.getItem('authName') || 'Alex Chen';
  var userEmail = localStorage.getItem('authEmail') || 'alex@stackly.ai';

  var sectionTitles = {
    overview: 'Overview',
    projects: 'My Projects',
    analytics: 'Analytics',
    resources: 'Resource Hub',
    notifications: 'Notifications',
    settings: 'Settings'
  };

  function animateCounters(root) {
    var els = (root || document).querySelectorAll('.dash-count');
    els.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target'));
      if (isNaN(target) || el.dataset.animated) return;
      el.dataset.animated = '1';
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var duration = 1200;
      var start = performance.now();
      function tick(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target * eased;
        el.textContent = prefix + (target % 1 === 0 ? Math.round(val).toLocaleString() : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function animateRings(root) {
    var rings = (root || document).querySelectorAll('.dash-ring-fill');
    rings.forEach(function (el) {
      var pct = parseFloat(el.getAttribute('data-pct'));
      if (isNaN(pct)) return;
      var circumference = 188.5;
      var offset = circumference - (circumference * pct) / 100;
      el.style.strokeDashoffset = offset;
    });
  }

  function animateBars(root) {
    var bars = (root || document).querySelectorAll('.dash-chart-bar');
    bars.forEach(function (el) {
      var h = el.getAttribute('data-height');
      if (h) {
        el.style.height = '4px';
        void el.offsetHeight;
        el.style.height = h + '%';
      }
    });
  }

  function updateTimestamp() {
    var els = document.querySelectorAll('.dash-live-ts');
    var now = new Date();
    var str = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    els.forEach(function (el) { el.textContent = str; });
  }

  function switchSection(id) {
    var navItems = document.querySelectorAll('.dash-nav-item');
    navItems.forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-section') === id);
    });
    var sections = document.querySelectorAll('.dash-section');
    var activeSection = null;
    sections.forEach(function (el) {
      var match = el.getAttribute('data-section') === id;
      el.classList.toggle('active', match);
      if (match) activeSection = el;
    });
    var sidebar = document.getElementById('dashSidebar');
    if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
    var titleEl = document.getElementById('dashSectionTitle');
    if (titleEl && sectionTitles[id]) {
      titleEl.textContent = sectionTitles[id];
    }
    if (activeSection) {
      animateCounters(activeSection);
      animateRings(activeSection);
      animateBars(activeSection);
      var ts = activeSection.querySelector('.dash-live-ts');
      if (ts) updateTimestamp();
    }
  }

  function initHamburger() {
    var btn = document.getElementById('dashHamburger');
    var sidebar = document.getElementById('dashSidebar');
    if (btn) {
      btn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
    }
    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024 &&
          !sidebar.contains(e.target) &&
          !btn.contains(e.target) &&
          sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  }

  function initLogout() {
    var btn = document.getElementById('dashLogout');
    if (btn) {
      btn.addEventListener('click', function () {
        localStorage.removeItem('authRole');
        localStorage.removeItem('authName');
        localStorage.removeItem('authEmail');
        window.location.href = 'login.html';
      });
    }
  }

  function setUserInfo() {
    var avatarEl = document.getElementById('dashAvatar');
    var nameEl = document.getElementById('dashName');
    var roleEl = document.getElementById('dashRole');
    var emailEl = document.getElementById('dashEmail');
    if (avatarEl) avatarEl.textContent = userName.charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = userName;
    if (roleEl) roleEl.textContent = 'User';
    if (emailEl) emailEl.textContent = userEmail;
    var settingsName = document.getElementById('settingsName');
    var settingsEmail = document.getElementById('settingsEmail');
    var settingsRole = document.getElementById('settingsRole');
    if (settingsName) settingsName.textContent = userName;
    if (settingsEmail) settingsEmail.textContent = userEmail;
    if (settingsRole) settingsRole.textContent = 'User';
  }

  window.switchSection = switchSection;

  function init() {
    if (!localStorage.getItem('authRole')) {
      window.location.href = 'login.html';
      return;
    }
    setUserInfo();
    initHamburger();
    initLogout();
    updateTimestamp();
    setInterval(updateTimestamp, 60000);
    var firstNav = document.querySelector('.dash-nav-item');
    if (firstNav) {
      switchSection(firstNav.getAttribute('data-section'));
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
